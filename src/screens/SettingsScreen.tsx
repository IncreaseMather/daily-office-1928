import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, TextInput, Linking, Alert } from 'react-native';
import { ScrollableScreen } from '../components/ScrollableScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { Typography } from '../theme';
import { useSettings, useTheme } from '../context/SettingsContext';
import {
  requestNotificationPermissions,
  scheduleMpReminder,
  cancelMpReminder,
  scheduleEpReminder,
  cancelEpReminder,
  ASYNC_KEY_MP_REMINDER,
  ASYNC_KEY_EP_REMINDER,
  ASYNC_KEY_MP_HOUR,
  ASYNC_KEY_MP_MINUTES,
  ASYNC_KEY_EP_HOUR,
  ASYNC_KEY_EP_MINUTES,
} from '../utils/notifications';
import type { LayAbsolution, PriestAbsolutionForm, CreedChoice, FontSize, BibleTranslation, DeuterocanonTranslation } from '../context/SettingsContext';

// 12-hour → 24-hour conversion
function toHour24AM(h: number): number { return h === 12 ? 0 : h; }
function toHour24PM(h: number): number { return h === 12 ? 12 : h + 12; }

// ── Reusable sub-components ──────────────────────────────────────────────────

function SettingRow({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) {
  const { colors, sizes } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <Text style={{ fontFamily: Typography.serif, fontSize: sizes.body, color: colors.ink, flex: 1 }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.rule, true: colors.inkLight }}
        thumbColor={colors.parchment}
      />
    </View>
  );
}

function OptionPicker<T extends string>({
  label, hint, options, value, onSelect,
}: {
  label: string;
  hint?: string;
  options: { value: T; label: string; description?: string }[];
  value: T;
  onSelect: (v: T) => void;
}) {
  const { colors, sizes } = useTheme();
  return (
    <View style={{ marginBottom: 4 }}>
      <Text style={{ fontFamily: Typography.serifBold, fontSize: sizes.subheading, color: colors.ink, marginBottom: 8 }}>{label}</Text>
      {hint ? <Text style={{ fontFamily: Typography.serifItalic, fontSize: sizes.rubric, color: colors.inkLight, marginBottom: 12 }}>{hint}</Text> : null}
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={{
            paddingVertical: 12, paddingHorizontal: 16, borderRadius: 6, borderWidth: 1, marginBottom: 8,
            borderColor: value === opt.value ? colors.ink : colors.rule,
            backgroundColor: value === opt.value
              ? (colors.parchment === '#1C1C1E' ? '#2C2C2E' : '#E3DDD1')
              : colors.parchment,
          }}
          onPress={() => onSelect(opt.value)}
        >
          <Text style={{
            fontFamily: value === opt.value ? Typography.serifBold : Typography.serif,
            fontSize: sizes.body,
            color: value === opt.value ? colors.ink : colors.inkLight,
            marginBottom: 2,
          }}>{opt.label}</Text>
          {opt.description ? (
            <Text style={{ fontFamily: Typography.serifItalic, fontSize: sizes.rubric, color: colors.inkLight, lineHeight: 20 }}>
              {opt.description}
            </Text>
          ) : null}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function CompactDropdown<T extends string>({
  label, options, value, onSelect,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onSelect: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const { colors, sizes, isDark } = useTheme();
  const selected = options.find(o => o.value === value);
  const selectedBg = isDark ? '#2C2C2E' : '#E3DDD1';

  return (
    <View style={{ marginBottom: 4 }}>
      <Text style={{ fontFamily: Typography.serifBold, fontSize: sizes.subheading, color: colors.ink, marginBottom: 8 }}>
        {label}
      </Text>
      {/* Selected value row (tap to expand) */}
      <TouchableOpacity
        style={{
          paddingVertical: 10, paddingHorizontal: 14,
          borderRadius: 6, borderWidth: 1,
          borderColor: colors.ink,
          backgroundColor: selectedBg,
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        }}
        onPress={() => setOpen(o => !o)}
        activeOpacity={0.7}
      >
        <Text style={{ fontFamily: Typography.serifBold, fontSize: sizes.body, color: colors.ink }}>
          {selected?.label ?? value}
        </Text>
        <Text style={{ fontFamily: Typography.serif, fontSize: sizes.rubric, color: colors.inkLight }}>
          {open ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      {/* Expanded options */}
      {open && options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={{
            paddingVertical: 10, paddingHorizontal: 14,
            borderRadius: 6, borderWidth: 1, marginTop: 4,
            borderColor: value === opt.value ? colors.ink : colors.rule,
            backgroundColor: value === opt.value ? selectedBg : colors.parchment,
          }}
          onPress={() => { onSelect(opt.value); setOpen(false); }}
          activeOpacity={0.7}
        >
          <Text style={{
            fontFamily: value === opt.value ? Typography.serifBold : Typography.serif,
            fontSize: sizes.body,
            color: value === opt.value ? colors.ink : colors.inkLight,
          }}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

const BTC_ADDRESS = 'bc1q6d7vqadw6n6cm6wpjpt0ae9dglyfuqeutrqh8n';

export function SettingsScreen() {
  const { colors, sizes } = useTheme();
  const [btcCopied, setBtcCopied] = useState(false);
  const [mpReminder, setMpReminder] = useState(false);
  const [epReminder, setEpReminder] = useState(false);
  const [mpHour,    setMpHour]    = useState('7');
  const [mpMinute,  setMpMinute]  = useState('00');
  const [epHour,    setEpHour]    = useState('7');
  const [epMinute,  setEpMinute]  = useState('00');

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(ASYNC_KEY_MP_REMINDER),
      AsyncStorage.getItem(ASYNC_KEY_EP_REMINDER),
      AsyncStorage.getItem(ASYNC_KEY_MP_HOUR),
      AsyncStorage.getItem(ASYNC_KEY_MP_MINUTES),
      AsyncStorage.getItem(ASYNC_KEY_EP_HOUR),
      AsyncStorage.getItem(ASYNC_KEY_EP_MINUTES),
    ]).then(([mp, ep, mph, mpm, eph, epm]) => {
      if (mp  === 'true') setMpReminder(true);
      if (ep  === 'true') setEpReminder(true);
      if (mph) setMpHour(mph);
      if (mpm) setMpMinute(mpm);
      if (eph) setEpHour(eph);
      if (epm) setEpMinute(epm);
    });
  }, []);

  // ── Toggle handlers — state updated immediately to prevent Switch glitch ───

  const handleMpToggle = async () => {
    const next = !mpReminder;
    setMpReminder(next); // optimistic update so Switch doesn't snap back
    if (next) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        setMpReminder(false);
        await AsyncStorage.setItem(ASYNC_KEY_MP_REMINDER, 'false');
        Alert.alert(
          'Notifications Disabled',
          'To receive Morning Prayer reminders, enable notifications for this app in your device Settings.',
        );
        return;
      }
      const h = parseInt(mpHour, 10) || 7;
      const m = parseInt(mpMinute, 10) || 0;
      await scheduleMpReminder(toHour24AM(h), m);
    } else {
      await cancelMpReminder();
    }
    await AsyncStorage.setItem(ASYNC_KEY_MP_REMINDER, String(next));
  };

  const handleEpToggle = async () => {
    const next = !epReminder;
    setEpReminder(next);
    if (next) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        setEpReminder(false);
        await AsyncStorage.setItem(ASYNC_KEY_EP_REMINDER, 'false');
        Alert.alert(
          'Notifications Disabled',
          'To receive Evening Prayer reminders, enable notifications for this app in your device Settings.',
        );
        return;
      }
      const h = parseInt(epHour, 10) || 7;
      const m = parseInt(epMinute, 10) || 0;
      await scheduleEpReminder(toHour24PM(h), m);
    } else {
      await cancelEpReminder();
    }
    await AsyncStorage.setItem(ASYNC_KEY_EP_REMINDER, String(next));
  };

  // ── Time input handlers — changing time auto-disables the toggle ───────────

  const disableMpReminder = () => {
    setMpReminder(false);
    cancelMpReminder();
    AsyncStorage.setItem(ASYNC_KEY_MP_REMINDER, 'false');
  };

  const disableEpReminder = () => {
    setEpReminder(false);
    cancelEpReminder();
    AsyncStorage.setItem(ASYNC_KEY_EP_REMINDER, 'false');
  };

  const handleMpHourChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 2);
    setMpHour(digits);
    if (mpReminder) disableMpReminder();
    AsyncStorage.setItem(ASYNC_KEY_MP_HOUR, digits);
  };

  const handleMpHourBlur = () => {
    const n = parseInt(mpHour, 10);
    const clamped = isNaN(n) || n < 1 ? '1' : n > 12 ? '12' : String(n);
    setMpHour(clamped);
    AsyncStorage.setItem(ASYNC_KEY_MP_HOUR, clamped);
  };

  const handleMpMinuteChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 2);
    setMpMinute(digits);
    if (mpReminder) disableMpReminder();
    AsyncStorage.setItem(ASYNC_KEY_MP_MINUTES, digits);
  };

  const handleMpMinuteBlur = () => {
    const n = parseInt(mpMinute, 10);
    const padded = isNaN(n) || n < 0 ? '00' : n > 59 ? '59' : String(n).padStart(2, '0');
    setMpMinute(padded);
    AsyncStorage.setItem(ASYNC_KEY_MP_MINUTES, padded);
  };

  const handleEpHourChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 2);
    setEpHour(digits);
    if (epReminder) disableEpReminder();
    AsyncStorage.setItem(ASYNC_KEY_EP_HOUR, digits);
  };

  const handleEpHourBlur = () => {
    const n = parseInt(epHour, 10);
    const clamped = isNaN(n) || n < 1 ? '1' : n > 12 ? '12' : String(n);
    setEpHour(clamped);
    AsyncStorage.setItem(ASYNC_KEY_EP_HOUR, clamped);
  };

  const handleEpMinuteChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 2);
    setEpMinute(digits);
    if (epReminder) disableEpReminder();
    AsyncStorage.setItem(ASYNC_KEY_EP_MINUTES, digits);
  };

  const handleEpMinuteBlur = () => {
    const n = parseInt(epMinute, 10);
    const padded = isNaN(n) || n < 0 ? '00' : n > 59 ? '59' : String(n).padStart(2, '0');
    setEpMinute(padded);
    AsyncStorage.setItem(ASYNC_KEY_EP_MINUTES, padded);
  };
  const {
    leadType, setLeadType,
    priestAbsolutionForm, setPriestAbsolutionForm,
    layAbsolution, setLayAbsolution,
    creedChoice, setCreedChoice,
    shorterForm, setShorterForm,
    darkMode, setDarkMode,
    fontSize, setFontSize,
    litanyEnabled, setLitanyEnabled,
    bibleTranslation, setBibleTranslation,
    deuterocanonTranslation, setDeuterocanonTranslation,
  } = useSettings();

  const sectionStyle = {
    marginBottom: 32,
    borderTopWidth: 1,
    borderTopColor: colors.rule,
    paddingTop: 20,
  };

  return (
    <ScrollableScreen
      style={{ flex: 1, backgroundColor: colors.parchment }}
      contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 28, paddingBottom: 80 }}
    >
      <Text style={{
        fontFamily: Typography.serifBold, fontSize: Math.round(28 * (sizes.body / 18)),
        lineHeight: Math.round(36 * (sizes.body / 18)), color: colors.ink,
        textAlign: 'center', marginBottom: 32, letterSpacing: 0.5,
      }}>Settings</Text>

      {/* ── Dark Mode ─────────────────────────────────────────────────────── */}
      <View style={sectionStyle}>
        <SettingRow
          label={darkMode ? 'Dark Mode' : 'Light Mode'}
          value={darkMode}
          onToggle={() => setDarkMode(!darkMode)}
        />
        <Text style={{ fontFamily: Typography.serifItalic, fontSize: sizes.rubric, color: colors.inkLight }}>
          {darkMode ? 'Dark background with off-white text.' : 'Parchment background with dark ink.'}
        </Text>
      </View>

      {/* ── Font Size ─────────────────────────────────────────────────────── */}
      <View style={sectionStyle}>
        <OptionPicker<FontSize>
          label="Text Size"
          options={[
            { value: 'small',  label: 'Small',  description: 'Compact — more text on screen.' },
            { value: 'medium', label: 'Medium', description: 'Default size.' },
            { value: 'large',  label: 'Large',  description: 'Easier to read at a glance.' },
          ]}
          value={fontSize}
          onSelect={setFontSize}
        />
      </View>

      {/* ── Bible Translation ─────────────────────────────────────────────── */}
      <View style={sectionStyle}>
        <CompactDropdown<BibleTranslation>
          label="Bible Translation"
          options={[
            { value: 'kjv',  label: 'King James Version (KJV)' },
            { value: 'rsv',  label: 'Revised Standard Version (RSV)' },
            { value: 'esv',  label: 'English Standard Version (ESV)' },
            { value: 'nasb', label: 'New American Standard Bible (NASB)' },
            { value: 'nkjv', label: 'New King James Version (NKJV)' },
          ]}
          value={bibleTranslation}
          onSelect={setBibleTranslation}
        />
      </View>

      {/* ── Deuterocanon Translation ──────────────────────────────────────── */}
      <View style={sectionStyle}>
        <CompactDropdown<DeuterocanonTranslation>
          label="Deuterocanon Translation"
          options={[
            { value: 'kjv', label: 'King James Version (KJV)' },
            { value: 'rsv', label: 'Revised Standard Version (RSV)' },
          ]}
          value={deuterocanonTranslation}
          onSelect={setDeuterocanonTranslation}
        />
        <Text style={{
          fontFamily: Typography.serifItalic, fontSize: sizes.rubric,
          color: colors.inkLight, lineHeight: Math.round(sizes.rubric * 1.55), marginTop: 10,
        }}>
          Deuterocanonical lessons use this translation regardless of the Bible Translation setting above.
        </Text>
      </View>

      {/* ── Daily Reminders ───────────────────────────────────────────────── */}
      <View style={sectionStyle}>
        <Text style={{ fontFamily: Typography.serifBold, fontSize: sizes.subheading, color: colors.ink, marginBottom: 12 }}>
          Daily Reminders
        </Text>

        {/* Morning Prayer */}
        <SettingRow
          label="Morning Prayer"
          value={mpReminder}
          onToggle={handleMpToggle}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingLeft: 2 }}>
          <TextInput
            value={mpHour}
            onChangeText={handleMpHourChange}
            onBlur={handleMpHourBlur}
            keyboardType="number-pad"
            maxLength={2}
            selectTextOnFocus
            style={{
              fontFamily: Typography.serif,
              fontSize: sizes.body,
              color: colors.ink,
              width: 32,
              textAlign: 'center',
              borderBottomWidth: 1,
              borderBottomColor: colors.rule,
              paddingVertical: 2,
              includeFontPadding: false,
            }}
          />
          <Text style={{ fontFamily: Typography.serif, fontSize: sizes.body, color: colors.inkLight, marginHorizontal: 4 }}>:</Text>
          <TextInput
            value={mpMinute}
            onChangeText={handleMpMinuteChange}
            onBlur={handleMpMinuteBlur}
            keyboardType="number-pad"
            maxLength={2}
            selectTextOnFocus
            style={{
              fontFamily: Typography.serif,
              fontSize: sizes.body,
              color: colors.ink,
              width: 32,
              textAlign: 'center',
              borderBottomWidth: 1,
              borderBottomColor: colors.rule,
              paddingVertical: 2,
              includeFontPadding: false,
            }}
          />
          <Text style={{ fontFamily: Typography.serif, fontSize: sizes.body, color: colors.inkLight, marginLeft: 8 }}>AM</Text>
        </View>

        {/* Evening Prayer */}
        <SettingRow
          label="Evening Prayer"
          value={epReminder}
          onToggle={handleEpToggle}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingLeft: 2 }}>
          <TextInput
            value={epHour}
            onChangeText={handleEpHourChange}
            onBlur={handleEpHourBlur}
            keyboardType="number-pad"
            maxLength={2}
            selectTextOnFocus
            style={{
              fontFamily: Typography.serif,
              fontSize: sizes.body,
              color: colors.ink,
              width: 32,
              textAlign: 'center',
              borderBottomWidth: 1,
              borderBottomColor: colors.rule,
              paddingVertical: 2,
              includeFontPadding: false,
            }}
          />
          <Text style={{ fontFamily: Typography.serif, fontSize: sizes.body, color: colors.inkLight, marginHorizontal: 4 }}>:</Text>
          <TextInput
            value={epMinute}
            onChangeText={handleEpMinuteChange}
            onBlur={handleEpMinuteBlur}
            keyboardType="number-pad"
            maxLength={2}
            selectTextOnFocus
            style={{
              fontFamily: Typography.serif,
              fontSize: sizes.body,
              color: colors.ink,
              width: 32,
              textAlign: 'center',
              borderBottomWidth: 1,
              borderBottomColor: colors.rule,
              paddingVertical: 2,
              includeFontPadding: false,
            }}
          />
          <Text style={{ fontFamily: Typography.serif, fontSize: sizes.body, color: colors.inkLight, marginLeft: 8 }}>PM</Text>
        </View>

        <Text style={{ fontFamily: Typography.serifItalic, fontSize: sizes.rubric, color: colors.inkLight, lineHeight: Math.round(sizes.rubric * 1.55) }}>
          Changing the time turns off the reminder. Re-enable the toggle to schedule it at the new time.
        </Text>
      </View>

      {/* ── Shorter Form ──────────────────────────────────────────────────── */}
      <View style={sectionStyle}>
        <SettingRow
          label={shorterForm ? 'Shorter Form' : 'Full-length'}
          value={shorterForm}
          onToggle={() => setShorterForm(!shorterForm)}
        />
        <Text style={{ fontFamily: Typography.serifItalic, fontSize: sizes.rubric, color: colors.inkLight }}>
          {shorterForm
            ? 'The Family Prayer shorter form will be used in place of the full office.'
            : 'The full office will be said.'}
        </Text>
      </View>

      {/* ── Litany ────────────────────────────────────────────────────────── */}
      <View style={sectionStyle}>
        <SettingRow
          label="Litany"
          value={litanyEnabled}
          onToggle={() => setLitanyEnabled(!litanyEnabled)}
        />
        <Text style={{ fontFamily: Typography.serifItalic, fontSize: sizes.rubric, color: colors.inkLight, lineHeight: Math.round(sizes.rubric * 1.55) }}>
          {litanyEnabled
            ? 'The Litany will be said at Morning Prayer on Sundays, Wednesdays, and Fridays.'
            : 'The Litany is not currently enabled. When enabled, it is said on Sundays, Wednesdays, and Fridays.'}
        </Text>
      </View>

      {/* ── Office Leadership ─────────────────────────────────────────────── */}
      <View style={sectionStyle}>
        <SettingRow
          label={leadType === 'priest' ? 'Priest-led' : 'Lay-led'}
          value={leadType === 'priest'}
          onToggle={() => setLeadType(leadType === 'priest' ? 'lay' : 'priest')}
        />
        <Text style={{ fontFamily: Typography.serifItalic, fontSize: sizes.rubric, color: colors.inkLight }}>
          {leadType === 'priest'
            ? 'The Absolution will be pronounced by the Priest.'
            : 'A lay form will be used in place of the Absolution.'}
        </Text>
      </View>

      {/* ── Absolution ────────────────────────────────────────────────────── */}
      {leadType === 'priest' && (
        <View style={sectionStyle}>
          <OptionPicker<PriestAbsolutionForm>
            label="Absolution"
            hint="Choose which form of the Absolution to pronounce."
            options={[
              { value: 'declaratory', label: 'Declaratory', description: 'He pardoneth and absolveth all those who truly repent… (the traditional form)' },
              { value: 'precatory',   label: 'Precatory',   description: 'Have mercy upon you; pardon and deliver you from all your sins…' },
            ]}
            value={priestAbsolutionForm}
            onSelect={setPriestAbsolutionForm}
          />
        </View>
      )}

      {leadType === 'lay' && (
        <View style={sectionStyle}>
          <OptionPicker<LayAbsolution>
            label="Absolution"
            hint="Choose which form to use in place of the priestly Absolution."
            options={[
              { value: 'kyrie',     label: 'Kyrie',             description: 'Lord, have mercy upon us. Christ, have mercy upon us. Lord, have mercy upon us.' },
              { value: 'trinity21', label: 'Collect for Trinity 21', description: 'Grant, we beseech thee, merciful Lord, to thy faithful people pardon and peace…' },
            ]}
            value={layAbsolution}
            onSelect={setLayAbsolution}
          />
        </View>
      )}

      {/* ── Creed ─────────────────────────────────────────────────────────── */}
      <View style={sectionStyle}>
        <OptionPicker<CreedChoice>
          label="Creed"
          options={[
            { value: 'apostles',   label: "Apostles' Creed" },
            { value: 'nicene',     label: 'Nicene Creed' },
            { value: 'athanasian', label: 'Athanasian Creed *' },
          ]}
          value={creedChoice}
          onSelect={setCreedChoice}
        />
        {creedChoice === 'athanasian' && (
          <Text style={{ fontFamily: Typography.serifItalic, fontSize: sizes.rubric, color: colors.inkLight, lineHeight: Math.round(sizes.rubric * 1.55), marginTop: 8 }}>
            * The Athanasian Creed (Quicunque Vult) does not appear in the 1928 American Book of Common Prayer. It is included here as a historical Anglican creed for optional use.
          </Text>
        )}
      </View>

      {/* ── Support ───────────────────────────────────────────────────────── */}
      <View style={{ ...sectionStyle, alignItems: 'center', paddingBottom: 8 }}>
        <Text style={{
          fontFamily: Typography.serifItalic,
          fontSize: sizes.rubric,
          color: colors.rubric,
          textAlign: 'center',
          marginBottom: 6,
        }}>
          This app is free and always will be.
        </Text>
        <Text style={{
          fontFamily: Typography.serifItalic,
          fontSize: sizes.rubric,
          color: colors.inkLight,
          textAlign: 'center',
          lineHeight: Math.round(sizes.rubric * 1.55),
          marginBottom: 20,
          paddingHorizontal: 8,
        }}>
          If it has been a blessing to your prayer life, a donation helps keep it running.
        </Text>
        <TouchableOpacity
          style={{
            paddingVertical: 11,
            paddingHorizontal: 32,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: colors.rubric,
          }}
          onPress={() => Linking.openURL('https://www.paypal.com/donate/?hosted_button_id=XFMBFJZPJZW52')}
          activeOpacity={0.65}
        >
          <Text style={{
            fontFamily: Typography.serifItalic,
            fontSize: sizes.body,
            color: colors.rubric,
            letterSpacing: 0.3,
          }}>
            Make a Donation
          </Text>
        </TouchableOpacity>

        {/* Bitcoin */}
        <View style={{ marginTop: 24, alignItems: 'center', width: '100%' }}>
          <Text style={{
            fontFamily: Typography.serifBold,
            fontSize: sizes.rubric,
            color: colors.inkLight,
            marginBottom: 8,
            letterSpacing: 0.5,
          }}>
            Bitcoin
          </Text>
          <Text style={{
            fontFamily: Typography.serif,
            fontSize: Math.round(sizes.rubric * 0.88),
            color: colors.ink,
            textAlign: 'center',
            letterSpacing: 0.4,
            paddingHorizontal: 4,
            marginBottom: 12,
          }}
            selectable
          >
            {BTC_ADDRESS}
          </Text>
          <View style={{
            padding: 10,
            backgroundColor: '#FFFFFF',
            borderRadius: 6,
            marginBottom: 14,
          }}>
            <QRCode
              value={`bitcoin:${BTC_ADDRESS}`}
              size={160}
              color="#000000"
              backgroundColor="#FFFFFF"
            />
          </View>
          <TouchableOpacity
            style={{
              paddingVertical: 9,
              paddingHorizontal: 24,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: colors.rule,
            }}
            onPress={async () => {
              await Clipboard.setStringAsync(BTC_ADDRESS);
              setBtcCopied(true);
              setTimeout(() => setBtcCopied(false), 2500);
            }}
            activeOpacity={0.65}
          >
            <Text style={{
              fontFamily: Typography.serifItalic,
              fontSize: sizes.rubric,
              color: btcCopied ? colors.rubric : colors.inkLight,
              letterSpacing: 0.3,
            }}>
              {btcCopied ? 'Address copied!' : 'Copy Address'}
            </Text>
          </TouchableOpacity>
          <Text style={{
            fontFamily: Typography.serifItalic,
            fontSize: Math.round(sizes.rubric * 0.88),
            color: colors.inkLight,
            marginTop: 8,
            opacity: 0.7,
          }}>
            Tap to copy Bitcoin address
          </Text>
        </View>
      </View>

      {/* ── Dedication ────────────────────────────────────────────────────── */}
      <View style={{ paddingHorizontal: 8, paddingTop: 32, alignItems: 'center' }}>
        <Text style={{
          fontFamily: Typography.serifItalic,
          fontSize: sizes.rubric,
          color: colors.inkLight,
          lineHeight: Math.round(sizes.rubric * 1.6),
          textAlign: 'center',
          opacity: 0.85,
        }}>
          Made to the glory of God and for the benefit of Christ's church.{'\n'}
          Especially for St. Francis Anglican Church in Austin, Texas.
        </Text>
      </View>

      {/* ── Legal ─────────────────────────────────────────────────────────── */}
      <View style={{ paddingHorizontal: 8, paddingTop: 24, paddingBottom: 48 }}>
        <Text style={{
          fontFamily: Typography.serifItalic,
          fontSize: Math.round(sizes.rubric * 0.85),
          color: colors.inkLight,
          lineHeight: Math.round(sizes.rubric * 1.5),
          textAlign: 'center',
          opacity: 0.75,
        }}>
          The lessons and readings in this app may be drawn from the following translations: the King James Version (public domain); the Revised Standard Version, copyright © National Council of Churches; the English Standard Version, copyright © Crossway; the New American Standard Bible, copyright © The Lockman Foundation; and the New King James Version, copyright © Thomas Nelson. These translations are used in small quantities for personal, devotional, and non-commercial purposes only. This app is free and will always remain free. No copyright infringement is intended. If you are a rights holder and have concerns, please contact us.
        </Text>
      </View>
    </ScrollableScreen>
  );
}
