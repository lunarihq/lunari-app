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
import { setSetting, getSetting, db } from '../../db';
import { periodDates } from '../../db/schema';
import { createOnboardingStyles } from '../../styles/onboarding';
import { useTheme } from '../../contexts/ThemeContext';
import { formatDateString } from '../types/calendarTypes';
import { ColorScheme } from '../../styles/colors';

export default function LastPeriodDateScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const onboardingStyles = createOnboardingStyles(colors);
  const styles = createStyles(colors);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dontKnow, setDontKnow] = useState(false);

  const handleGetStarted = async () => {
    try {
      // Only save last period date if user didn't select "don't know"
      if (!dontKnow && selectedDate) {
        // Save directly to periodDates table instead of settings
        await db.insert(periodDates).values({ date: selectedDate });
        
        // Get period length and add the full period
        const periodLengthSetting = await getSetting('userPeriodLength');
        const periodLength = periodLengthSetting ? parseInt(periodLengthSetting, 10) : 5;
        
        const startDate = new Date(selectedDate);
        for (let i = 1; i < periodLength; i++) {
          const nextDate = new Date(startDate);
          nextDate.setDate(startDate.getDate() + i);
          const nextDateString = nextDate.toISOString().split('T')[0];
          await db.insert(periodDates).values({ date: nextDateString });
        }
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
      selectedColor: colors.primary,
      selectedTextColor: colors.white
    }
  } : {};

  // Get today's date to set as the initial month
  const today = formatDateString(new Date());

  return (
    <SafeAreaView style={onboardingStyles.container}>
      <View style={onboardingStyles.header}>
        <TouchableOpacity style={onboardingStyles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
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
            renderHeader={(date) => {
              const monthYear = new Date(date).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              });
              return (
                <Text style={styles.calendarHeader}>{monthYear}</Text>
              );
            }}
            theme={{
              backgroundColor: colors.surfaceVariant2,
              calendarBackground: colors.surfaceVariant2,
              textSectionTitleColor: colors.textPrimary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: colors.white,
              todayTextColor: colors.primary,
              dayTextColor: colors.textPrimary,
              textDisabledColor: colors.textSecondary,
              arrowColor: colors.primary,
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
            <View style={[styles.checkbox, { borderColor: colors.primary, backgroundColor: dontKnow ? colors.primary : colors.surface }, dontKnow && styles.checkboxChecked]}>
              {dontKnow && <Ionicons name="checkmark" size={16} color={colors.white} />}
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

const createStyles = (colors: ColorScheme) => StyleSheet.create({
  calendarContainer: {
    marginBottom: 30,
    borderRadius: 12,
    overflow: 'hidden',
  },
  calendarDisabled: {
    opacity: 0.5,
  },
  calendar: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  calendarDisabledStyle: {
    backgroundColor: colors.panel,
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
    borderRadius: 3,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {},
  dontKnowText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  dontKnowSubText: {
    fontSize: 14,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  buttonDisabled: {
    backgroundColor: colors.textMuted,
  },
  buttonTextDisabled: {
    color: colors.textSecondary,
  },
  calendarHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginVertical: 10,
  },
});
