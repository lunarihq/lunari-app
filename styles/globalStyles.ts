import { StyleSheet } from 'react-native';
import { Colors } from './colors';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  scrollContentContainer: {
    paddingBottom: 16,
    paddingTop: 8,
  },

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

export { globalStyles };
export default globalStyles;
