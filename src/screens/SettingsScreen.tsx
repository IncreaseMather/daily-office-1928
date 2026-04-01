import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, Linking, Alert } from 'react-native';
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
} from '../utils/notifications';
import type { LayAbsolution, PriestAbsolutionForm, CreedChoice, FontSize, BibleTranslation, DeuterocanonTranslation } from '../context/SettingsContext';

const ASYNC_KEY_MP_REMINDER = '@settings/mpReminder';
const ASYNC_KEY_EP_REMINDER = '@settings/epReminder';

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

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(ASYNC_KEY_MP_REMINDER),
      AsyncStorage.getItem(ASYNC_KEY_EP_REMINDER),
    ]).then(([mp, ep]) => {
      if (mp === 'true') setMpReminder(true);
      if (ep === 'true') setEpReminder(true);
    });
  }, []);

  const handleMpToggle = async () => {
    const next = !mpReminder;
    if (next) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          'Notifications Disabled',
          'To receive Morning Prayer reminders, enable notifications for this app in your device Settings.',
        );
        return;
      }
      await scheduleMpReminder();
    } else {
      await cancelMpReminder();
    }
    setMpReminder(next);
    await AsyncStorage.setItem(ASYNC_KEY_MP_REMINDER, String(next));
  };

  const handleEpToggle = async () => {
    const next = !epReminder;
    if (next) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          'Notifications Disabled',
          'To receive Evening Prayer reminders, enable notifications for this app in your device Settings.',
        );
        return;
      }
      await scheduleEpReminder();
    } else {
      await cancelEpReminder();
    }
    setEpReminder(next);
    await AsyncStorage.setItem(ASYNC_KEY_EP_REMINDER, String(next));
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
        <SettingRow
          label="Morning Prayer — 7:00 AM"
          value={mpReminder}
          onToggle={handleMpToggle}
        />
        <SettingRow
          label="Evening Prayer — 7:00 PM"
          value={epReminder}
          onToggle={handleEpToggle}
        />
        <Text style={{ fontFamily: Typography.serifItalic, fontSize: sizes.rubric, color: colors.inkLight, lineHeight: Math.round(sizes.rubric * 1.55), marginTop: 4 }}>
          Daily notifications will include an opening sentence from the current liturgical season.
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
