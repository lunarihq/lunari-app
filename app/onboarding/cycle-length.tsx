import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { setSetting } from '../../db';
import { onboardingStyles } from '../../styles/onboarding';

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
    <SafeAreaView style={onboardingStyles.container}>
      <View style={onboardingStyles.header}>
        <TouchableOpacity style={onboardingStyles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={onboardingStyles.paginationContainer}>
          <View style={onboardingStyles.paginationDot} />
          <View style={[onboardingStyles.paginationDot, onboardingStyles.paginationDotActive]} />
        </View>
        <View style={onboardingStyles.headerSpacer} />
      </View>

      <View style={onboardingStyles.content}>
        <Text style={onboardingStyles.title}>How many days does your cycle last on average?</Text>
        <Text style={onboardingStyles.message}>
          This is the number of days from the start of one period to the start
          of the next.
        </Text>

        <View
          style={[styles.pickerContainer, dontKnow && styles.pickerDisabled]}
        >
          <TouchableOpacity
            style={[styles.pickerButton, dontKnow && styles.buttonDisabled]}
            onPress={decrementCycleLength}
            disabled={dontKnow}
          >
            <Ionicons
              name="remove"
              size={24}
              color={dontKnow ? '#ccc' : '#4E74B9'}
            />
          </TouchableOpacity>

          <View style={styles.valueContainer}>
            <Text style={[styles.valueText, dontKnow && styles.textDisabled]}>
              {cycleLength}
            </Text>
            <Text style={[styles.labelText, dontKnow && styles.textDisabled]}>
              days
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.pickerButton, dontKnow && styles.buttonDisabled]}
            onPress={incrementCycleLength}
            disabled={dontKnow}
          >
            <Ionicons
              name="add"
              size={24}
              color={dontKnow ? '#ccc' : '#4E74B9'}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.dontKnowContainer}
          onPress={toggleDontKnow}
        >
          <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, dontKnow && styles.checkboxChecked]}>
              {dontKnow && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text style={styles.dontKnowText}>
              Don't know - let the app learn
            </Text>
          </View>
          <Text style={styles.dontKnowSubText}>Uses 28 days as default</Text>
        </TouchableOpacity>

        <Text style={styles.subMessage}>
          Don't worry, we'll learn your actual patterns as you track!
        </Text>
      </View>

      <View style={onboardingStyles.footer}>
        <TouchableOpacity
          style={onboardingStyles.fullWidthButton}
          onPress={handleGetStarted}
        >
          <Text style={onboardingStyles.fullWidthButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    textAlign: 'left',
    color: '#999',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});
