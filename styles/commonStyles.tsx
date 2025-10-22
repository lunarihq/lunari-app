import { StyleSheet } from 'react-native';

import { Colors } from './colors';

const commonStyles = StyleSheet.create({
  // For non-scrollable screens or wrapper Views
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },

  // For ScrollView component itself - handles flex and horizontal padding
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'green',
  },

  // For ScrollView's contentContainerStyle - handles vertical padding of scrollable content
  scrollContentContainer: {
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: 'blue',
  },

  // For individual sections within a screen
  sectionContainer: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'yellow',
    overflow: 'hidden',
  },

  // For title row in sections (text on left, actions on right)
  sectionTitleContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  // Floating action button
  fab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export { commonStyles };
export default commonStyles;
