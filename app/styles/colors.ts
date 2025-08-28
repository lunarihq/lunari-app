export interface ColorScheme {
  // surfaces
  background: string; // page background
  surface: string; // main cards / panels
  surfaceVariant: string; // variant cards / panels
  surfaceTabBar: string; // tab bar background
  panel: string; // subtle panel background
  border: string; // borders / dividers

  // primary / main brand colors
  primary: string;
  primaryLight: string;
  accentPink: string;
  accentPinkLight: string;

  //Neutrals
  neutral100: string;
  neutral200: string;

  // text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  placeholder: string;

  white: string;
  black: string;

  // prediction circle background
  predictionCircleBackground: string;
}

export const lightColors: ColorScheme = {
  // surfaces
  background: '#ECEDFF', // page background
  surface: '#FFFFFF', // main cards / panels
  surfaceVariant: '#F7F8FF', // variant cards / panels
  surfaceTabBar: '#F1F0F6', // tabs / sheets / panels
  panel: '#FFFFFF', // subtle panel background
  border: '#EFEFF6', // borders / dividers

  // primary / main brand colors
  primary: '#4B61C7', // main action (primary buttons, text buttons, links, active tabs
  primaryLight: '#D6E8FE',
  accentPink: '#FB3192', // Pink for period day highlights
  accentPinkLight: '#FFE8F3', // Lighter pink for backgrounds

  //Neutrals
  neutral100: '#8682A3',
  neutral200: '#5C5B63',

  // text
  textPrimary: '#353345', // main text
  textSecondary: '#353345', // secondary text (subtitle)
  textMuted: '#A1ADD7', // muted / hint
  placeholder: '#5C5B63',

  white: '#FFFFFF',
  black: '#000000',

  // prediction circle background
  predictionCircleBackground: '#FFFFFF',
};

export const darkColors: ColorScheme = {
  // surfaces
  background: '#161530', // dark page background
  surface: '#22213F', // dark cards / panels
  surfaceVariant: '#282749', // dark variant cards / panels
  surfaceTabBar: '#22213F', // dark tab bar background
  panel: '#161530', // dark subtle panel background
  border: '#3A3A5E', // dark borders / dividers

  // primary / main brand colors (keep brand consistent but adjust for contrast)
  primary: '#5F7AF4', // slightly lighter for better contrast on dark
  primaryLight: '#1A2332', // dark version of light accent
  accentPink: '#FF4DA6', // slightly lighter pink for dark mode
  accentPinkLight: '#FFDEEE', // dark version of light pink background

  //Neutrals
  neutral100: '#5E5D7F',
  neutral200: '#2B2A49',

  // text (inverted for dark mode)
  textPrimary: '#FFFFFF', // white text for dark backgrounds
  textSecondary: '#E0E0E0', // light gray for secondary text
  textMuted: '#8A8A8A', // muted gray for hints
  placeholder: '#6A6A6A', // placeholder text

  white: '#FFFFFF',
  black: '#000000',

  // prediction circle background
  predictionCircleBackground: '#292848',
};

// Legacy export for backward compatibility
// Use useTheme() hook in new components for theme-aware colors
export const Colors = lightColors;

export default Colors;
