import { StyleSheet } from 'react-native';
import { ColorScheme } from './colors';

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
      lineHeight: 22,
      fontWeight: '400',
      color: colors.textPrimary,
    },
    caption: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
      color: colors.textSecondary,
    },
  });
