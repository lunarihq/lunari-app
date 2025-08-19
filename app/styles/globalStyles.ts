import { StyleSheet } from 'react-native';
import { Colors } from './colors';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    fontWeight: '600',
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

  predictionCard: {
    alignItems: 'center',
    gap: 24,
    marginTop: 8,
    marginBottom: 24,
  },
  predictionOuterCircle: {
    width: 345,
    height: 345,
    borderRadius: 200,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  predictionInnerCircle: {
    width: 310,
    height: 310,
    borderRadius: 155,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  predictionLabel: {
    fontSize: 22,
    fontWeight: '500',
    color: Colors.black,
  },
  predictionDays: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 24,
  },
});

export { globalStyles };
export default globalStyles;
