import { StyleSheet } from 'react-native';
import { ColorScheme } from './colors';

export const createOnboardingStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 8,
    },
    backButton: {
      padding: 8,
    },
    headerSpacer: {
      width: 40,
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    paginationDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.textMuted,
      marginHorizontal: 4,
    },
    paginationDotActive: {
      backgroundColor: colors.primary,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 8,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'left',
      color: colors.textPrimary,
    },
    message: {
      fontSize: 16,
      textAlign: 'left',
      color: colors.textSecondary,
      marginBottom: 40,
      lineHeight: 22,
    },
    footer: {
      padding: 20,
    },
    fullWidthButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 80,
      alignItems: 'center',
      width: '100%',
      marginBottom: 20,
    },
    fullWidthButtonText: {
      fontSize: 16,
      color: colors.white,
      fontWeight: 'bold',
    },
  });
