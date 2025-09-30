import { StyleSheet } from 'react-native';
import { Colors, ColorScheme } from './colors';

// Legacy static typography - kept for backward compatibility
export const Typography = StyleSheet.create({
  heading1: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  heading2: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  heading3: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.textPrimary,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
});

// Theme-aware typography function - use this for new components
export const createTypography = (colors: ColorScheme) =>
  StyleSheet.create({
    heading1: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    heading2: {
      fontSize: 22,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    heading3: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      color: colors.textPrimary,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.textSecondary,
    },
  });

export default Typography;
