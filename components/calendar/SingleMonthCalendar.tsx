import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MonthView } from './MonthView';
import { MonthData } from '../../utils/customCalendarHelpers';

interface SingleMonthCalendarProps {
  selectedDate?: string;
  onDayPress: (dateString: string) => void;
  colors: any;
  current?: string;
  maxDate?: string;
  disableFuture?: boolean;
}

export function SingleMonthCalendar({
  selectedDate,
  onDayPress,
  colors,
  current,
  maxDate,
  disableFuture = false,
}: SingleMonthCalendarProps) {
  const currentDate = current ? new Date(current) : new Date();
  const [displayMonth, setDisplayMonth] = useState(currentDate.getMonth());
  const [displayYear, setDisplayYear] = useState(currentDate.getFullYear());

  const firstDay = new Date(displayYear, displayMonth, 1).getDay();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
  const totalDays = adjustedFirstDay + daysInMonth;
  const weekCount = totalDays <= 35 ? 5 : 6;

  const monthData: MonthData = {
    month: displayMonth,
    year: displayYear,
    key: `${displayYear}-${displayMonth}`,
    firstDay: adjustedFirstDay,
    daysInMonth,
    weekCount,
  };

  const markedDates = selectedDate
  ? {
      [selectedDate]: {
        selected: true,
        selectedColor: colors.primary,
        customStyles: {
          container: {
            backgroundColor: colors.primary,
          },
          text: {
            color: colors.white,
          },
        },
      },
    }
  : {};

  const maxDateObj = maxDate ? new Date(maxDate) : null;

  const canGoNext = () => {
    if (!maxDateObj) return true;
    const nextMonth = new Date(displayYear, displayMonth + 1, 1);
    return nextMonth <= maxDateObj;
  };

  const handlePrevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (!canGoNext()) return;
    
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const monthName = new Date(displayYear, displayMonth, 1).toLocaleDateString(
    'default',
    {
      month: 'long',
      year: 'numeric',
    }
  );

  return (
    <View style={styles.container}>
      <View
        style={[styles.header, { borderBottomColor: colors.neutral150}]}
      >
        <TouchableOpacity
          onPress={handlePrevMonth}
          style={styles.arrowButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <Text style={[styles.monthText, { color: colors.textPrimary }]}>
          {monthName}
        </Text>
        
        <TouchableOpacity
          onPress={handleNextMonth}
          style={styles.arrowButton}
          disabled={!canGoNext()}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={canGoNext() ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.dayNamesRow}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((name, index) => (
          <View key={index} style={styles.dayNameCell}>
            <Text style={[styles.dayNameText, { color: colors.textPrimary }]}>
              {name}
            </Text>
          </View>
        ))}
      </View>

      <View>
        <MonthView
          monthData={monthData}
          markedDates={markedDates}
          onDayPress={onDayPress}
          colors={colors}
          mode="selection"
          disableFuture={disableFuture}
          showDayNames={false}
          showMonthHeader={false}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1.5,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '500',
  },
  arrowButton: {
    padding: 8,
  },
  dayNamesRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dayNameCell: {
    flex: 1,
    alignItems: 'center',
  },
  dayNameText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

