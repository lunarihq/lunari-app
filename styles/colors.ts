export interface ColorScheme {
  // surfaces
  background: string; // page background
  surface: string; // main cards / panels
  surfaceVariant: string; // variant cards / panels
  surfaceVariant2: string; 
  surfaceVariant3: string; // variant cards / panels
  surfaceTabBar: string; // tab bar background
  panel: string; // subtle panel background
  border: string; // borders / dividers

  icon: string; // icon colorlor

  // primary / main brand colors
  primary: string;
  primaryLight: string;
  accentPink: string;
  accentPinkLight: string;
  accentBlue: string;

  //UI components
  predictionCircleBackground: string;
  cardBorder: string; // card borders

  //Neutrals
  neutral100: string;
  neutral200: string;

  // text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  placeholder: string;

  // semantic status colors
  success: string;
  warning: string;
  error: string;
  info: string;

  white: string;
  black: string;
}

export const lightColors: ColorScheme = {
  // surfaces
  background: '#ECEDFF', // page background
  surface: '#FFFFFF', // main cards / panels
  surfaceVariant: '#F4F6FF', // variant cards / panels
  surfaceVariant2: '#FFFFFF', // variant cards / panels
  surfaceVariant3: '#FFFFFF', // variant cards / panels
  surfaceTabBar: '#F1F0F6', // tabs / sheets / panels
  panel: '#FFFFFF', // subtle panel background
  border: '#EFEFF6', // borders / dividers

  icon: '#1A1A28', // icon color

  // primary / main brand colors
  primary: '#4B61C7', // main action (primary buttons, text buttons, links, active tabs
  primaryLight: '#D6E8FE',
  accentPink: '#FB3192', // Pink for period day highlights
  accentPinkLight: '#FFE8F3', // Lighter pink for backgrounds
  accentBlue: '#4B61C7', // For fertile days indicator

  //UI components
  predictionCircleBackground: '#FFFFFF',
  cardBorder: '#4B61C7', // card borders

  //Neutrals
  neutral100: '#8682A3',
  neutral200: '#5C5B63',

  // text
  textPrimary: '#353345', // main text
  textSecondary: '#585470', // secondary text (subtitle)
  textMuted: '#8A86A9', // muted / hint
  placeholder: '#8D8A99',

  // semantic status colors
  success: '#10B981', // Green for success states
  warning: '#F59E0B', // Orange for warnings
  error: '#EF4444', // Red for errors/destructive actions
  info: '#3B82F6', // Blue for informational states

  white: '#FFFFFF',
  black: '#000000',

};

export const darkColors: ColorScheme = {
  // surfaces
  background: '#0E0D23', // dark page background
  surface: '#1C1B33', // dark cards / panels
  surfaceVariant: '#26253E', // dark variant cards / panels
  surfaceVariant2: '#30304D', // dark variant cards / panels
  surfaceVariant3: '#242341', // dark variant cards / panels
  surfaceTabBar: '#22213F', // dark tab bar background
  panel: '#0E0D23', // dark subtle panel background
  border: '#26253F', // dark borders / dividers

  icon: '#D4D4F6', // dark icon color

  // primary / main brand colors (keep brand consistent but adjust for contrast)
  primary: '#5F7AF4', // slightly lighter for better contrast on dark
  primaryLight: '#393959', // dark version of light accent
  accentPink: '#FF4DA6', // slightly lighter pink for dark mode
  accentPinkLight: '#FFDEEE', // dark version of light pink background
  accentBlue: '#75AAFF', // For fertile days indicator

  //UI components
  predictionCircleBackground: '#1C1B33',
  cardBorder: '#6E6E8F', // dark card borders
  
  //Neutrals
  neutral100: '#5E5D7F',
  neutral200: '#2B2A49',

  // text (inverted for dark mode)
  textPrimary: '#FFFFFF', // white text for dark backgrounds
  textSecondary: '#D7D7E3', // light gray for secondary text
  textMuted: '#A09CC2', // muted gray for hints
  placeholder: '#A5A4C2', // placeholder text

  // semantic status colors (lighter for dark mode contrast)
  success: '#34D399', // Lighter green for dark mode
  warning: '#FBBF24', // Lighter orange for dark mode
  error: '#F87171', // Lighter red for dark mode
  info: '#60A5FA', // Lighter blue for dark mode

  white: '#FFFFFF',
  black: '#000000',  
};

// Legacy export for backward compatibility
// Use useTheme() hook in new components for theme-aware colors
export const Colors = lightColors;

export default Colors;
