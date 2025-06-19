import React from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  ScrollView, 
} from 'react-native';
import theme from './styles/theme';

export default function Reminders() {
  return (
    <ScrollView style={theme.globalStyles.container}>
      <View style={styles.section}>
        <View style={styles.messageContainer}>
          <Text style={styles.title}>Reminders Unavailable</Text>
          <Text style={styles.message}>
            Push notifications are not supported in Expo Go. To enable reminders, 
            you would need to create a development build of the app.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  messageContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});