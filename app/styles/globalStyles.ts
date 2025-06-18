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
    backgroundColor: '#4561D2',
    paddingVertical: 12,
    paddingHorizontal: 24,
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
    marginTop: 16,
    marginBottom: 24,
  },
  predictionCircle: {
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#FFEAEE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: '#FFADBD',
  },
  predictionLabel: {
    fontSize: 22,
    fontWeight: '500',
    color: '#000',
  },
  predictionDays: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#000',
  },
}); 

export default globalStyles; 