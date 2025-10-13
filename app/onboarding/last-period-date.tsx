import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from '../../components/Button';
import { Checkbox } from '../../components/Checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, DateData } from 'react-native-calendars';
import { setSetting, getSetting, db } from '../../db';
import { periodDates } from '../../db/schema';
import { createOnboardingStyles } from '../../styles/onboarding';
import { createTypography } from '../../styles/typography';
import { useTheme } from '../../contexts/ThemeContext';
import { formatDateString } from '../../types/calendarTypes';
import { ColorScheme } from '../../styles/colors';

export default function LastPeriodDateScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const onboardingStyles = createOnboardingStyles(colors);
  const typography = createTypography(colors);
  const styles = createStyles(colors);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dontKnow, setDontKnow] = useState(false);

  const handleNext = async () => {
    try {
      // Only save last period date if user didn't select "don't know"
      if (!dontKnow && selectedDate) {
        // Save directly to periodDates table instead of settings
        await db.insert(periodDates).values({ date: selectedDate });

        // Get period length and add the full period
        const periodLengthSetting = await getSetting('userPeriodLength');
        const periodLength = periodLengthSetting
          ? parseInt(periodLengthSetting, 10)
          : 5;

        const startDate = new Date(selectedDate);
        for (let i = 1; i < periodLength; i++) {
          const nextDate = new Date(startDate);
          nextDate.setDate(startDate.getDate() + i);
          const nextDateString = nextDate.toISOString().split('T')[0];
          await db.insert(periodDates).values({ date: nextDateString });
        }
      }

      // Complete onboarding and navigate to success screen
      await setSetting('onboardingCompleted', 'true');
      router.push('/onboarding/success');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      router.push('/onboarding/success');
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
  const markedDates =
    selectedDate && !dontKnow
      ? {
          [selectedDate]: {
            selected: true,
            selectedColor: colors.primary,
            selectedTextColor: colors.white,
          },
        }
      : {};

  // Get today's date to set as the initial month
  const today = formatDateString(new Date());

  return (
    <SafeAreaView style={onboardingStyles.container}>
      <View style={onboardingStyles.header}>
        <TouchableOpacity
          style={onboardingStyles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={onboardingStyles.paginationContainer}>
          <View style={onboardingStyles.paginationDot} />
          <View style={onboardingStyles.paginationDot} />
          <View
            style={[
              onboardingStyles.paginationDot,
              onboardingStyles.paginationDotActive,
            ]}
          />
        </View>
        <View style={onboardingStyles.headerSpacer} />
      </View>

      <View style={onboardingStyles.content}>
        <Text
          style={[typography.heading2, { marginBottom: 20, textAlign: 'left' }]}
        >
          When was the start of your last period?
        </Text>
        <Text
          style={[
            typography.body,
            {
              textAlign: 'left',
              marginBottom: 40,
              lineHeight: 22,
              color: colors.textSecondary,
            },
          ]}
        >
          This will help us to predict your next period.
        </Text>

        <View
          style={[
            styles.calendarContainer,
            dontKnow && styles.calendarDisabled,
          ]}
        >
          <Calendar
            current={today}
            onDayPress={onDayPress}
            markedDates={markedDates}
            maxDate={today}
            firstDay={1}
            renderHeader={date => {
              const monthYear = new Date(date).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              });
              return (
                <Text
                  style={[
                    typography.heading2,
                    { textAlign: 'center', marginVertical: 10 },
                  ]}
                >
                  {monthYear}
                </Text>
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

        <Checkbox
          checked={dontKnow}
          onToggle={toggleDontKnow}
          text="I don't remember"
        />
        {dontKnow && (
          <Text style={[typography.caption, { textAlign: 'center'}]}>
            It's okay, you can do it later inside the app.
          </Text>
        )}
      </View>

      <View style={onboardingStyles.footer}>
        <Button
          title="Continue"
          onPress={handleNext}
          disabled={!selectedDate && !dontKnow}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
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
  });
