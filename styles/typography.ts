import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const Typography = StyleSheet.create({
  heading1: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  heading2: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.textPrimary,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
});

export default Typography;
