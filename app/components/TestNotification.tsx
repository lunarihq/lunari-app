import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NotificationService } from '../../services/notificationService';

export function TestNotification() {
  const [notificationStatus, setNotificationStatus] = React.useState<string | null>(null);

  const testNotification = async () => {
    try {
      await NotificationService.scheduleTestNotification();
      setNotificationStatus('Test notification sent successfully! You should see it immediately.');
    } catch (error) {
      console.error('Error sending test notification:', error);
      setNotificationStatus('Failed to send test notification');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Notification Testing</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={testNotification} 
      >
        <Text style={styles.buttonText}>Test Notification</Text>
      </TouchableOpacity>
      
      {notificationStatus && (
        <Text style={styles.status}>{notificationStatus}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginVertical: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FF597B',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  status: {
    marginTop: 10,
    color: '#707070',
  },
}); 

export default TestNotification;