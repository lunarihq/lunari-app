import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { DayData } from '../../utils/customCalendarHelpers';
import { CustomMarking } from '../../types/calendarTypes';
import { getEditDayCellStyles } from '../../utils/calendarStyles';

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
    const { t } = useTranslation('calendar');
    const styles = StyleSheet.create(getEditDayCellStyles(colors));

    // Render empty cell for days not in current month to maintain grid layout
    if (!isCurrentMonth) {
      return <View style={styles.dayContainer} />;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayDate = new Date(dateString);
    dayDate.setHours(0, 0, 0, 0);

    const isFuture = dayDate > today;
    const isDisabled = false;
    const isToday = dateString === new Date().toISOString().split('T')[0];

    const isSelected = marking?.selected;

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
              styles.text,
              { color: colors.textPrimary },
              isDisabled && styles.disabledDayText,
              isSelected && { color: colors.accentPink },
            ]}
          >
            {dayNum}
          </Text>

          <View
            style={[
              styles.container,
              { borderColor: colors.neutral100 },
              isSelected && !isFuture && styles.selectedDayIndicator,
              isSelected && isFuture && styles.futureSelectedDayIndicator,
              !isSelected && isFuture && styles.futureDayIndicator,
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

        {isToday && (
          <Text style={[typography.labelXs, styles.todayLabel]}>
            {t('today')}
          </Text>
        )}
      </View>
    );
  }
);

EditDayCell.displayName = 'EditDayCell';

