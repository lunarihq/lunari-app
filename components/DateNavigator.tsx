import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/theme';
import { useAppStyles } from '../hooks/useStyles';
import { formatTodayOrDate } from '../utils/localeUtils';
import dayjs from 'dayjs';

interface DateNavigatorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  formatDate?: (date: string) => string;
}

export const DateNavigator = ({
  selectedDate,
  onDateChange,
  minDate,
  maxDate,
  formatDate = formatTodayOrDate,
}: DateNavigatorProps) => {
  const { colors } = useTheme();
  const { typography } = useAppStyles();

  const goToPreviousDay = () => {
    const previousDay = dayjs(selectedDate).subtract(1, 'day').format('YYYY-MM-DD');
    if (!minDate || previousDay >= minDate) {
      onDateChange(previousDay);
    }
  };

  const goToNextDay = () => {
    const nextDay = dayjs(selectedDate).add(1, 'day').format('YYYY-MM-DD');
    if (!maxDate || nextDay <= maxDate) {
      onDateChange(nextDay);
    }
  };

  const isPreviousDisabled = () => {
    if (!minDate) return false;
    const previousDay = dayjs(selectedDate).subtract(1, 'day').format('YYYY-MM-DD');
    return previousDay < minDate;
  };

  const isNextDisabled = () => {
    if (!maxDate) return false;
    const nextDay = dayjs(selectedDate).add(1, 'day').format('YYYY-MM-DD');
    return nextDay > maxDate;
  };

  return (
    <View style={styles.dateNavigator}>
      <TouchableOpacity 
        onPress={goToPreviousDay} 
        style={[
          styles.headerButton,
          isPreviousDisabled() && styles.disabledButton,
        ]}
        disabled={isPreviousDisabled()}
      >
        <Ionicons 
          name="chevron-back" 
          size={24} 
          color={colors.textPrimary} 
        />
      </TouchableOpacity>

      <Text style={[typography.body, { fontSize: 18, fontWeight: '600' }]}>
        {formatDate(selectedDate)}
      </Text>

      <TouchableOpacity
        onPress={goToNextDay}
        style={[
          styles.headerButton,
          isNextDisabled() && styles.disabledButton,
        ]}
        disabled={isNextDisabled()}
      >
        <Ionicons
          name="chevron-forward"
          size={24}
          color={colors.textPrimary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dateNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },
  headerButton: {
    padding: 10,
  },
  disabledButton: { 
    opacity: 0.38 
  },
});
