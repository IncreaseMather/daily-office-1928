import React from 'react';
import { ScrollView, View, Text, Switch, TouchableOpacity, Linking } from 'react-native';
import { Typography } from '../theme';
import { useSettings, useTheme } from '../context/SettingsContext';
import type { LayAbsolution, PriestAbsolutionForm, CreedChoice, FontSize } from '../context/SettingsContext';

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

// ── Main screen ───────────────────────────────────────────────────────────────

export function SettingsScreen() {
  const { colors, sizes } = useTheme();
  const {
    leadType, setLeadType,
    priestAbsolutionForm, setPriestAbsolutionForm,
    layAbsolution, setLayAbsolution,
    creedChoice, setCreedChoice,
    shorterForm, setShorterForm,
    darkMode, setDarkMode,
    fontSize, setFontSize,
  } = useSettings();

  const sectionStyle = {
    marginBottom: 32,
    borderTopWidth: 1,
    borderTopColor: colors.rule,
    paddingTop: 20,
  };

  return (
    <ScrollView
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

      {/* ── Daily Reminders (placeholder) ─────────────────────────────────── */}
      <View style={sectionStyle}>
        <Text style={{ fontFamily: Typography.serifBold, fontSize: sizes.subheading, color: colors.ink, marginBottom: 8 }}>
          Daily Reminders
        </Text>
        <Text style={{ fontFamily: Typography.serifItalic, fontSize: sizes.rubric, color: colors.inkLight, lineHeight: Math.round(sizes.rubric * 1.55) }}>
          Daily reminders available in the full app release.
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
            { value: 'apostles', label: "Apostles' Creed" },
            { value: 'nicene',   label: 'Nicene Creed' },
          ]}
          value={creedChoice}
          onSelect={setCreedChoice}
        />
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
      </View>
    </ScrollView>
  );
}
