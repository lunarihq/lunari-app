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
import { Calendar, DateData } from 'react-native-calendars';
import { setSetting } from '../../db';
import { onboardingStyles } from '../../styles/onboarding';
import { useTheme } from '../../styles/theme';
import { formatDateString } from '../types/calendarTypes';

export default function LastPeriodDateScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dontKnow, setDontKnow] = useState(false);

  const handleGetStarted = async () => {
    try {
      // Only save last period date if user didn't select "don't know"
      if (!dontKnow && selectedDate) {
        await setSetting('lastPeriodStartDate', selectedDate);
      }
      
      // Complete onboarding and navigate to main app
      await setSetting('onboardingCompleted', 'true');
      router.replace('/');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      router.replace('/');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const onDayPress = (day: DateData) => {
    if (!dontKnow) {
      setSelectedDate(day.dateString);
    }
  };

  const toggleDontKnow = () => {
    setDontKnow(!dontKnow);
    if (!dontKnow) {
      setSelectedDate(null);
    }
  };

  // Create marked dates object for the selected date
  const markedDates = selectedDate && !dontKnow ? {
    [selectedDate]: {
      selected: true,
      selectedColor: '#4E74B9',
      selectedTextColor: '#fff'
    }
  } : {};

  // Get today's date to set as the initial month
  const today = formatDateString(new Date());

  return (
    <SafeAreaView style={onboardingStyles.container}>
      <View style={onboardingStyles.header}>
        <TouchableOpacity style={onboardingStyles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={onboardingStyles.paginationContainer}>
          <View style={onboardingStyles.paginationDot} />
          <View style={onboardingStyles.paginationDot} />
          <View style={[onboardingStyles.paginationDot, onboardingStyles.paginationDotActive]} />
        </View>
        <View style={onboardingStyles.headerSpacer} />
      </View>

      <View style={onboardingStyles.content}>
        <Text style={onboardingStyles.title}>When was your last period?</Text>
        <Text style={onboardingStyles.message}>
          Select the start date of your most recent period to help us provide accurate predictions.
        </Text>

        <View style={[styles.calendarContainer, dontKnow && styles.calendarDisabled]}>
          <Calendar
            current={today}
            onDayPress={onDayPress}
            markedDates={markedDates}
            maxDate={today}
            firstDay={1}
            theme={{
              backgroundColor: colors.background,
              calendarBackground: colors.background,
              textSectionTitleColor: colors.textPrimary,
              selectedDayBackgroundColor: '#4E74B9',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#4E74B9',
              dayTextColor: colors.textPrimary,
              textDisabledColor: colors.textSecondary,
              arrowColor: '#4E74B9',
              monthTextColor: colors.textPrimary,
              textDayFontWeight: '400',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            style={[styles.calendar, dontKnow && styles.calendarDisabledStyle]}
          />
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
              Don't know - skip this step
            </Text>
          </View>
          <Text style={styles.dontKnowSubText}>
            We'll help you track from today
          </Text>
        </TouchableOpacity>
      </View>

      <View style={onboardingStyles.footer}>
        <TouchableOpacity
          style={[
            onboardingStyles.fullWidthButton,
            (!selectedDate && !dontKnow) && styles.buttonDisabled
          ]}
          onPress={handleGetStarted}
          disabled={!selectedDate && !dontKnow}
        >
          <Text style={[
            onboardingStyles.fullWidthButtonText,
            (!selectedDate && !dontKnow) && styles.buttonTextDisabled
          ]}>
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    marginBottom: 30,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
  },
  calendarDisabled: {
    opacity: 0.5,
  },
  calendar: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  calendarDisabledStyle: {
    backgroundColor: '#f8f8f8',
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
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonTextDisabled: {
    color: '#999',
  },
});
