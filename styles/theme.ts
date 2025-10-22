import { Colors } from './colors';
import { createTypography } from './typography';
import { commonStyles } from './commonStyles';

// Legacy theme object - use useTheme() hook for theme-aware colors
export const theme = {
  Colors,
  createTypography,
  commonStyles,
};

export default theme;

// Re-export theme context and typography function for convenience
export { ThemeProvider, useTheme } from '../contexts/ThemeContext';
export { createTypography } from './typography';
