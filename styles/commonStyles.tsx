import { StyleSheet } from 'react-native';
import { ColorScheme } from './colors';

export const createCommonStyles = (colors: ColorScheme) => StyleSheet.create({
  // For non-scrollable screens or wrapper Views
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },

  // For ScrollView component itself - handles flex and horizontal padding
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },

  // For ScrollView's contentContainerStyle - handles vertical padding of scrollable content
  scrollContentContainer: {
    paddingTop: 8,
    paddingBottom: 16,
  },

  // For individual sections within a screen
  sectionContainer: {
    borderRadius: 14,
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },

  // For title row in sections (text on left, actions on right)
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  // Floating action button
  fab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
});
