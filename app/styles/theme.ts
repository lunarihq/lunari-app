import { Colors } from './colors';
import { Typography } from './typography';
import { globalStyles } from './globalStyles';

// Legacy theme object - use useTheme() hook for theme-aware colors
export const theme = {
  Colors,
  Typography,
  globalStyles,
};

export default theme;

// Re-export theme context for convenience
export { ThemeProvider, useTheme } from '../../contexts/ThemeContext';
