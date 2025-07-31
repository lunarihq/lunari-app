import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEEFF',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  button: {
    backgroundColor: '#4F5FEB',
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
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  predictionLabel: {
    fontSize: 22,
    fontWeight: '500',
    color: '#000',
  },
  predictionDays: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
  },
}); 

export default globalStyles; 