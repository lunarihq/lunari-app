import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { setSetting } from '../../db';

export default function CycleLengthScreen() {
  const router = useRouter();
  const [cycleLength, setCycleLength] = useState(28);
  const [dontKnow, setDontKnow] = useState(false);

  const handleGetStarted = async () => {
    try {
      // Only save cycle length setting if user didn't select "don't know"
      if (!dontKnow) {
        await setSetting('userCycleLength', cycleLength.toString());
      }
      
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

  const incrementCycleLength = () => {
    setCycleLength(prev => Math.min(prev + 1, 45)); // Max 45 days
  };

  const decrementCycleLength = () => {
    setCycleLength(prev => Math.max(prev - 1, 21)); // Min 21 days
  };

  const toggleDontKnow = () => {
    setDontKnow(!dontKnow);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="calendar-outline" size={100} color="#4E74B9" style={styles.icon} />
        <Text style={styles.title}>What's your typical cycle length?</Text>
        <Text style={styles.message}>This is the number of days from the start of one period to the start of the next.</Text>
        
        <View style={[styles.pickerContainer, dontKnow && styles.pickerDisabled]}>
          <TouchableOpacity 
            style={[styles.pickerButton, dontKnow && styles.buttonDisabled]} 
            onPress={decrementCycleLength}
            disabled={dontKnow}
          >
            <Ionicons name="remove" size={24} color={dontKnow ? "#ccc" : "#4E74B9"} />
          </TouchableOpacity>
          
          <View style={styles.valueContainer}>
            <Text style={[styles.valueText, dontKnow && styles.textDisabled]}>{cycleLength}</Text>
            <Text style={[styles.labelText, dontKnow && styles.textDisabled]}>days</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.pickerButton, dontKnow && styles.buttonDisabled]} 
            onPress={incrementCycleLength}
            disabled={dontKnow}
          >
            <Ionicons name="add" size={24} color={dontKnow ? "#ccc" : "#4E74B9"} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.dontKnowContainer} onPress={toggleDontKnow}>
          <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, dontKnow && styles.checkboxChecked]}>
              {dontKnow && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text style={styles.dontKnowText}>Don't know - let the app learn</Text>
          </View>
          <Text style={styles.dontKnowSubText}>Uses 28 days as default</Text>
        </TouchableOpacity>
        
        <Text style={styles.subMessage}>Don't worry, we'll learn your actual patterns as you track!</Text>
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
    marginBottom: 40,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  pickerDisabled: {
    opacity: 0.5,
  },
  pickerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  buttonDisabled: {
    backgroundColor: '#f8f8f8',
  },
  valueContainer: {
    alignItems: 'center',
    minWidth: 80,
  },
  valueText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4E74B9',
  },
  textDisabled: {
    color: '#ccc',
  },
  labelText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  dontKnowContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#4E74B9',
    borderRadius: 3,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#4E74B9',
  },
  dontKnowText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dontKnowSubText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  subMessage: {
    fontSize: 14,
    textAlign: 'center',
    color: '#999',
    paddingHorizontal: 40,
    fontStyle: 'italic',
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