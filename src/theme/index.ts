export const Colors = {
  parchment: '#F5F0E8',
  ink: '#1C1C1A',
  inkLight: '#3D3D39',
  rubric: '#6B2D2D',
  rule: '#C8BFA8',
  tabActive: '#1C1C1A',
  tabInactive: '#9B9488',
  tabBar: '#EDE8DE',
  highlight: '#E3DDD1',
};

export const DarkColors = {
  parchment: '#1C1C1E',
  ink: '#F5F0E8',
  inkLight: '#C8C0B0',
  rubric: '#C4504A',
  rule: '#3A3A3C',
  tabActive: '#F5F0E8',
  tabInactive: '#6E6B64',
  tabBar: '#2C2C2E',
  highlight: '#2C2C2E',
};

/** Light fuchsia page, dark plum text, darker rose rubrics. */
export const PinkColors = {
  parchment: '#FF78D2',
  ink: '#3A0828',
  inkLight: '#5C1242',
  rubric: '#8E1248',
  rule: '#C2186A',
  tabActive: '#3A0828',
  tabInactive: '#7A2860',
  tabBar: '#FF4EBE',
  highlight: '#F03AAA',
};

export const Typography = {
  serif: 'EBGaramond_400Regular',
  serifItalic: 'EBGaramond_400Regular_Italic',
  serifBold: 'EBGaramond_700Bold',

  sizes: {
    heading: 24,
    subheading: 19,
    body: 18,
    rubric: 15,
    label: 13,
  },

  lineHeights: {
    heading: 32,
    body: 30,
    rubric: 22,
  },
};

export const FontScales: Record<'small' | 'medium' | 'large', number> = {
  small: 0.85,
  medium: 1.0,
  large: 1.2,
};
