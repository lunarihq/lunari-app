import { Colors } from './colors';
import { createTypography } from './typography';
import { createCommonStyles } from './commonStyles';

// Legacy theme object - use useTheme() hook for theme-aware colors
export const theme = {
  Colors,
  createTypography,
  createCommonStyles,
};

export default theme;

// Re-export theme context and typography function for convenience
export { ThemeProvider, useTheme } from '../contexts/ThemeContext';
export { createTypography } from './typography';
