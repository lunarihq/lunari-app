import { StyleSheet } from 'react-native';
import { Colors } from './colors';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
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
