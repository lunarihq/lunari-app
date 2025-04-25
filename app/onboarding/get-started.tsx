import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { setSetting } from '../../db';

export default function GetStartedScreen() {
  const router = useRouter();

  const handleGetStarted = async () => {
    try {
      // Mark onboarding as completed
      await setSetting('onboardingCompleted', 'true');
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      router.replace('/');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="checkmark-circle-outline" size={100} color="#4E74B9" style={styles.icon} />
        <Text style={styles.title}>Get Started</Text>
        <Text style={styles.message}>You're all set! Start your health journey today.</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.paginationContainer}>
          <View style={styles.paginationDot} />
          <View style={styles.paginationDot} />
          <View style={[styles.paginationDot, styles.paginationDotActive]} />
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20,
  },
  footer: {
    padding: 40,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#4E74B9',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
  },
  getStartedButton: {
    backgroundColor: '#4E74B9',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 120,
  },
  getStartedButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
}); 