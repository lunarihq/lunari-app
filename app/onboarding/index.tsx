import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push({ pathname: '/onboarding/features' });
  };

  const handleSkip = () => {
    router.push({ pathname: '/onboarding/get-started' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="heart-outline" size={100} color="#4E74B9" style={styles.icon} />
        <Text style={styles.title}>Welcome to the App</Text>
        <Text style={styles.message}>Track your health and wellness with our easy-to-use app.</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.paginationContainer}>
          <View style={[styles.paginationDot, styles.paginationDotActive]} />
          <View style={styles.paginationDot} />
          <View style={styles.paginationDot} />
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
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
  skipButton: {
    padding: 10,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666',
  },
  nextButton: {
    backgroundColor: '#4E74B9',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 120,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});