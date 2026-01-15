import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DayData } from '../../utils/customCalendarHelpers';
import { CustomMarking } from '../../types/calendarTypes';
import { useTypography } from '../../hooks/useStyles';

interface DayCellProps {
  day: DayData;
  marking?: CustomMarking;
  onPress: (dateString: string) => void;
  colors: {
    textPrimary: string;
    textSecondary: string;
    primary: string;
    primaryLight: string;
    white: string;
    accentPink: string;
  };
  mode: 'view' | 'selection';
  disableFuture?: boolean;
}

export const DayCell = memo<DayCellProps>(
  ({ day, marking, onPress, colors, mode, disableFuture }) => {
    const { dateString, day: dayNum, isCurrentMonth } = day;
    const typography = useTypography();
    const { t } = useTranslation('calendar');

    // Render empty cell for days not in current month to maintain grid layout
    if (!isCurrentMonth) {
      return <View style={styles.dayContainer} />;
    }

    const isFutureDate = new Date(dateString) > new Date();
    const isDisabled = disableFuture && isFutureDate;
    const isSelected = marking?.selected;
    const hasHealthLogs = marking?.hasHealthLogs;
    const isToday = dateString === new Date().toISOString().split('T')[0];

    const handlePress = () => {
      if (!isDisabled) {
        onPress(dateString);
      }
    };

    const date = new Date(dateString);
    const accessibilityLabel = `${date.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
    })}${hasHealthLogs ? `, ${t('accessibility.hasHealthLogs')}` : ''}${isSelected ? `, ${t('accessibility.selected')}` : ''}`;
    const accessibilityHint = isDisabled ? undefined : t('accessibility.tapToView');

    const containerStyle = [
      styles.container,
      marking?.customStyles?.container,
    ];

    const textStyle = [
      styles.text,
      { color: colors.textPrimary },
      marking?.customStyles?.text,
      isDisabled && { opacity: 0.3 },
    ];

    return (
      <View style={styles.dayContainer}>
        <View style={styles.dayContent}>
          <TouchableOpacity
            style={containerStyle}
            onPress={handlePress}
            disabled={isDisabled}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
            accessibilityState={{
              disabled: isDisabled,
              selected: isSelected,
            }}
          >
            <Text style={textStyle}>{dayNum}</Text>
          </TouchableOpacity>
          
          {hasHealthLogs && (
            <View
              style={[styles.healthLogDot, { backgroundColor: colors.primary }]}
            />
          )}
        </View>

        {isSelected && (
          <View
            style={[styles.selectionIndicator, { borderColor: colors.primary }]}
          />
        )}

        {isToday && (
          <Text style={[typography.labelXs, { marginTop: 1 }]}>
            {t('today')}
          </Text>
        )}
      </View>
    );
  },
  (prev, next) =>
    prev.day.dateString === next.day.dateString &&
    prev.marking === next.marking &&
    prev.colors === next.colors &&
    prev.mode === next.mode &&
    prev.disableFuture === next.disableFuture
);

DayCell.displayName = 'DayCell';

const styles = StyleSheet.create({
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '14.28%',
    height: 64,
  },
  dayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  container: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectionIndicator: {
    position: 'absolute',
    top: -3,
    left: 7,
    width: 40,
    height: 40,
    borderRadius: 40,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  healthLogDot: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
    width: 7,
    height:7,
    borderRadius: 8,
  },
});

