import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DayData } from '../../utils/customCalendarHelpers';
import { CustomMarking } from '../../types/calendarTypes';

interface EditDayCellProps {
  day: DayData;
  marking?: CustomMarking;
  onPress: (dateString: string) => void;
  colors: any;
  typography: any;
}

export const EditDayCell = memo<EditDayCellProps>(
  ({ day, marking, onPress, colors, typography }) => {
    const { dateString, day: dayNum, isCurrentMonth } = day;

    // Hide days that are not in the current month
    if (!isCurrentMonth) {
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayDate = new Date(dateString);
    dayDate.setHours(0, 0, 0, 0);

    const isFuture = dayDate > today;
    const isDisabled = false;

    const isSelected =
      marking?.selected ||
      marking?.customStyles?.container?.backgroundColor === colors.accentPink;

    const handlePress = () => {
      if (!isDisabled) {
        onPress(dateString);
      }
    };

    const date = new Date(dateString);
    const accessibilityLabel = `${date.toLocaleDateString('default', { 
      month: 'long', 
      day: 'numeric' 
    })}${isSelected ? ', selected' : ''}`;
    const accessibilityHint = isDisabled 
      ? undefined 
      : isSelected 
        ? 'Double tap to deselect' 
        : 'Double tap to select as period day';

    return (
      <View style={styles.dayContainer}>
        <TouchableOpacity
          onPress={handlePress}
          disabled={isDisabled}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityState={{
            disabled: isDisabled,
            selected: isSelected,
          }}
        >
          <Text
            style={[
              typography.body,
              styles.customDayText,
              { color: colors.textPrimary },
              isDisabled && styles.disabledDayText,
              isSelected && { color: colors.accentPink },
            ]}
          >
            {dayNum}
          </Text>

          <View
            style={[
              styles.dayIndicator,
              { borderColor: colors.neutral100 },
              isSelected && [
                styles.selectedDayIndicator,
                {
                  backgroundColor: colors.accentPink,
                  borderColor: colors.accentPink,
                },
              ],
              isFuture && styles.futureDayIndicator,
            ]}
          >
            {isSelected && !isFuture && (
              <Ionicons
                name="checkmark-sharp"
                size={16}
                color={colors.white}
                style={styles.checkmark}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
);

EditDayCell.displayName = 'EditDayCell';

const styles = StyleSheet.create({
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '14.28%',
    height: 64,
  },
  customDayText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 1,
  },
  dayIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDayIndicator: {
    borderWidth: 2,
  },
  disabledDayText: {
    opacity: 0.3,
  },
  checkmark: {
    marginTop: 0,
  },
  futureDayIndicator: {
    borderWidth: 1,
  },
});

