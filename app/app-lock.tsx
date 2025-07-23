import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import theme from './styles/theme';

export default function AppLockScreen() {
  const {
    isPinSet,
    removePin,
    refreshPinStatus,
  } = useAuth();

  const [pinEnabled, setPinEnabled] = useState(false);

  useEffect(() => {
    setPinEnabled(isPinSet);
  }, [isPinSet]);

  const handlePinToggle = async (value: boolean) => {
    if (value) {
      // Navigate to PIN setup
      router.push('/pin-setup?mode=setup');
    } else {
      // Show confirmation dialog
      Alert.alert(
        'Remove PIN',
        'Are you sure you want to remove your PIN?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              const success = await removePin();
              if (success) {
                setPinEnabled(false);
                await refreshPinStatus();
              } else {
                Alert.alert('Error', 'Failed to remove PIN. Please try again.');
              }
            },
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Set up a PIN</Text>
            </View>
            <Switch
              value={pinEnabled}
              onValueChange={handlePinToggle}
              trackColor={{ false: '#e0e0e0', true: '#4561D2' }}
              thumbColor="#ffffff"
              ios_backgroundColor="#e0e0e0"
            />
          </View>

          {isPinSet && (
            <TouchableOpacity
              style={[styles.settingRow, styles.lastRow]}
              onPress={() => router.push('/pin-setup?mode=change')}
            >
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Change PIN</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>



        {isPinSet && (
          <View style={styles.infoSection}>
            <View style={styles.infoContainer}>
              <Ionicons name="information-circle" size={20} color="#666" style={styles.infoIcon} />
              <Text style={styles.infoText}>
                When app lock is enabled, you'll need to authenticate when the app starts or returns from the background.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEEFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  infoSection: {
    marginVertical: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 