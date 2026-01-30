import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/Button';
import { Checkbox } from '../../components/Checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { setSetting, getSetting, getDB } from '../../db';
import { periodDates } from '../../db/schema';
import { createOnboardingStyles } from '../../styles/onboarding';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppStyles } from '../../hooks/useStyles';
import { formatDateString } from '../../types/calendarTypes';
import { ColorScheme } from '../../styles/colors';
import { SingleMonthCalendar } from '../../components/calendar/SingleMonthCalendar';

export default function LastPeriodDateScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const onboardingStyles = createOnboardingStyles(colors);
  const { typography } = useAppStyles();
  const { t } = useTranslation('onboarding');
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dontKnow, setDontKnow] = useState(false);

  const handleNext = async () => {
    try {
      const db = getDB();
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

  const onDayPress = (dateString: string) => {
    if (!dontKnow) {
      setSelectedDate(dateString);
    }
  };

  const toggleDontKnow = () => {
    setDontKnow(!dontKnow);
    if (!dontKnow) {
      setSelectedDate(null);
    }
  };

  const today = formatDateString(new Date());
  const sixMonthsAgo = formatDateString(
    new Date(new Date().setMonth(new Date().getMonth() - 6))
  );

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
          style={[typography.headingMd, { marginBottom: 16, textAlign: 'left' }]}
        >
          {t('lastPeriod.title')}
        </Text>
        <Text
          style={[
            typography.body,
            {
              textAlign: 'left',
              marginBottom: 32,
              color: colors.textSecondary,
            },
          ]}
        >
          {t('lastPeriod.subtitle')}
        </Text>

        <View
          style={[
            styles.calendarContainer,
            { backgroundColor: colors.surfaceVariant },
            dontKnow && styles.calendarDisabled,
          ]}
        >
          <SingleMonthCalendar
            selectedDate={!dontKnow ? selectedDate || undefined : undefined}
            onDayPress={onDayPress}
            colors={colors}
            current={today}
            maxDate={today}
            minDate={sixMonthsAgo}
            disableFuture={true}
          />
        </View>

        <Checkbox
          checked={dontKnow}
          onToggle={toggleDontKnow}
          text={t('lastPeriod.checkboxText')}
        />
        {dontKnow && (
          <Text style={[typography.caption, { textAlign: 'center' }]}>
            {t('lastPeriod.checkboxSubtext')}
          </Text>
        )}
      </View>

      <View style={onboardingStyles.footer}>
        <Button
          title={t('continue')}
          onPress={handleNext}
          disabled={!selectedDate && !dontKnow}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    calendarContainer: {
      marginBottom: 30,
      borderRadius: 12,
      overflow: 'hidden',
    },
    calendarDisabled: {
      opacity: 0.38,
    },
  });
