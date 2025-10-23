import { StyleSheet } from 'react-native';
import { ColorScheme } from './colors';

// Theme-aware typography function - use this for new components
export const createTypography = (colors: ColorScheme) =>
  StyleSheet.create({
    headingLg: {
      fontSize: 30,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    headingMd: {
      fontSize: 22,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    headingSm: {
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
    bodyBold: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    caption: {
      fontSize: 14,
      lineHeight: 16,
      fontWeight: '400',
      color: colors.textSecondary,
    },
    displayLg: {
      fontSize: 48,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    displayMd: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    displaySm: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    labelLg: {
      fontSize: 22,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    labelMd: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    labelSm: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textPrimary,
    },
  });
