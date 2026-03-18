import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, DarkColors, Typography, FontScales } from '../theme';

export type LeadType = 'priest' | 'lay';
export type PriestAbsolutionForm = 'declaratory' | 'precatory';
export type LayAbsolution = 'kyrie' | 'trinity21';
export type CreedChoice = 'apostles' | 'nicene' | 'athanasian';
export type FontSize = 'small' | 'medium' | 'large';

const K = {
  LEAD_TYPE:         '@s/leadType',
  PRIEST_ABS:        '@s/priestAbs',
  LAY_ABS:           '@s/layAbs',
  CREED:             '@s/creed',
  SHORTER_FORM:      '@s/shorterForm',
  DARK_MODE:         '@s/darkMode',
  FONT_SIZE:         '@s/fontSize',
  MP_ENABLED:        '@s/mpEnabled',
  MP_TIME:           '@s/mpTime',
  EP_ENABLED:        '@s/epEnabled',
  EP_TIME:           '@s/epTime',
  LITANY_ENABLED:    '@s/litanyEnabled',
};

interface SettingsContextValue {
  leadType: LeadType;
  setLeadType: (v: LeadType) => void;
  priestAbsolutionForm: PriestAbsolutionForm;
  setPriestAbsolutionForm: (v: PriestAbsolutionForm) => void;
  layAbsolution: LayAbsolution;
  setLayAbsolution: (v: LayAbsolution) => void;
  creedChoice: CreedChoice;
  setCreedChoice: (v: CreedChoice) => void;
  shorterForm: boolean;
  setShorterForm: (v: boolean) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  fontSize: FontSize;
  setFontSize: (v: FontSize) => void;
  mpReminderEnabled: boolean;
  setMpReminderEnabled: (v: boolean) => void;
  mpReminderTime: string;
  setMpReminderTime: (v: string) => void;
  epReminderEnabled: boolean;
  setEpReminderEnabled: (v: boolean) => void;
  epReminderTime: string;
  setEpReminderTime: (v: string) => void;
  litanyEnabled: boolean;
  setLitanyEnabled: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function persist(key: string, value: string) {
  AsyncStorage.setItem(key, value).catch(() => {});
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [leadType, setLeadTypeS]               = useState<LeadType>('priest');
  const [priestAbsolutionForm, setPriestAbsS]  = useState<PriestAbsolutionForm>('declaratory');
  const [layAbsolution, setLayAbsS]            = useState<LayAbsolution>('kyrie');
  const [creedChoice, setCreedS]               = useState<CreedChoice>('apostles');
  const [shorterForm, setShorterS]             = useState(false);
  const [darkMode, setDarkS]                   = useState(false);
  const [fontSize, setFontS]                   = useState<FontSize>('medium');
  const [mpReminderEnabled, setMpEnabledS]     = useState(false);
  const [mpReminderTime, setMpTimeS]           = useState('07:00');
  const [epReminderEnabled, setEpEnabledS]     = useState(false);
  const [epReminderTime, setEpTimeS]           = useState('18:00');
  const [litanyEnabled, setLitanyS]            = useState(false);

  useEffect(() => {
    AsyncStorage.multiGet(Object.values(K)).then((pairs) => {
      try {
        const m = Object.fromEntries(pairs) as Record<string, string | null>;
        if (m[K.LEAD_TYPE])    setLeadTypeS(m[K.LEAD_TYPE] as LeadType);
        if (m[K.PRIEST_ABS])   setPriestAbsS(m[K.PRIEST_ABS] as PriestAbsolutionForm);
        if (m[K.LAY_ABS])      setLayAbsS(m[K.LAY_ABS] as LayAbsolution);
        if (m[K.CREED])        setCreedS(m[K.CREED] as CreedChoice);
        if (m[K.SHORTER_FORM]) setShorterS(m[K.SHORTER_FORM] === 'true');
        if (m[K.DARK_MODE])    setDarkS(m[K.DARK_MODE] === 'true');
        if (m[K.FONT_SIZE])    setFontS(m[K.FONT_SIZE] as FontSize);
        if (m[K.MP_ENABLED])   setMpEnabledS(m[K.MP_ENABLED] === 'true');
        if (m[K.MP_TIME])      setMpTimeS(m[K.MP_TIME]);
        if (m[K.EP_ENABLED])      setEpEnabledS(m[K.EP_ENABLED] === 'true');
        if (m[K.EP_TIME])         setEpTimeS(m[K.EP_TIME]);
        if (m[K.LITANY_ENABLED])  setLitanyS(m[K.LITANY_ENABLED] === 'true');
      } catch {
        // Corrupt or unexpected storage values — silently fall back to defaults
      }
    }).catch(() => {});
  }, []);

  const setLeadType              = (v: LeadType)              => { setLeadTypeS(v);  persist(K.LEAD_TYPE, v); };
  const setPriestAbsolutionForm  = (v: PriestAbsolutionForm)  => { setPriestAbsS(v); persist(K.PRIEST_ABS, v); };
  const setLayAbsolution         = (v: LayAbsolution)         => { setLayAbsS(v);    persist(K.LAY_ABS, v); };
  const setCreedChoice           = (v: CreedChoice)           => { setCreedS(v);     persist(K.CREED, v); };
  const setShorterForm           = (v: boolean)               => { setShorterS(v);   persist(K.SHORTER_FORM, String(v)); };
  const setDarkMode              = (v: boolean)               => { setDarkS(v);      persist(K.DARK_MODE, String(v)); };
  const setFontSize              = (v: FontSize)              => { setFontS(v);      persist(K.FONT_SIZE, v); };
  const setMpReminderEnabled     = (v: boolean)               => { setMpEnabledS(v); persist(K.MP_ENABLED, String(v)); };
  const setMpReminderTime        = (v: string)                => { setMpTimeS(v);    persist(K.MP_TIME, v); };
  const setEpReminderEnabled     = (v: boolean)               => { setEpEnabledS(v); persist(K.EP_ENABLED, String(v)); };
  const setEpReminderTime        = (v: string)                => { setEpTimeS(v);    persist(K.EP_TIME, v); };
  const setLitanyEnabled         = (v: boolean)               => { setLitanyS(v);   persist(K.LITANY_ENABLED, String(v)); };

  return (
    <SettingsContext.Provider value={{
      leadType, setLeadType,
      priestAbsolutionForm, setPriestAbsolutionForm,
      layAbsolution, setLayAbsolution,
      creedChoice, setCreedChoice,
      shorterForm, setShorterForm,
      darkMode, setDarkMode,
      fontSize, setFontSize,
      mpReminderEnabled, setMpReminderEnabled,
      mpReminderTime, setMpReminderTime,
      epReminderEnabled, setEpReminderEnabled,
      epReminderTime, setEpReminderTime,
      litanyEnabled, setLitanyEnabled,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

/** Returns dynamic colors and scaled font sizes for the current theme settings. */
export function useTheme() {
  const { darkMode, fontSize } = useSettings();
  const scale = FontScales[fontSize];
  const colors = darkMode ? DarkColors : Colors;
  return {
    colors,
    scale,
    isDark: darkMode,
    sizes: {
      heading:    Math.round(Typography.sizes.heading    * scale),
      subheading: Math.round(Typography.sizes.subheading * scale),
      body:       Math.round(Typography.sizes.body       * scale),
      rubric:     Math.round(Typography.sizes.rubric     * scale),
      label:      Math.round(Typography.sizes.label      * scale),
    },
    lineHeights: {
      heading: Math.round(Typography.lineHeights.heading * scale),
      body:    Math.round(Typography.lineHeights.body    * scale),
      rubric:  Math.round(Typography.lineHeights.rubric  * scale),
    },
  };
}
