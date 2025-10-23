import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, createTypography } from '../styles/theme';
import { formatDateShort } from '../utils/localeUtils';
import { commonStyles } from '@/styles/commonStyles';

interface CycleData {
  startDate: string; // ISO date string (YYYY-MM-DD)
  cycleLength: string | number;
  periodLength: number;
  endDate?: string; // ISO date string (YYYY-MM-DD)
}

interface CycleHistoryProps {
  cycles: CycleData[];
}

// Helper to render the circles representing days
const DayCircles = ({
  totalDays,
  periodDays,
}: {
  totalDays: number;
  periodDays: number;
}) => {
  const { colors } = useTheme();
  const circles = [];

  for (let i = 0; i < totalDays; i++) {
    circles.push(
      <View
        key={i}
        style={[
          styles.circle,
          {
            backgroundColor:
              i < periodDays ? colors.accentPink : colors.neutral100,
          },
        ]}
      />
    );
  }

  return <View style={styles.circleContainer}>{circles}</View>;
};

export function CycleHistory({ cycles }: CycleHistoryProps) {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const { t } = useTranslation(['stats', 'common']);

  if (cycles.length === 0) {
    return null;
  }

  // Helper to calculate how many days have passed since start date
  const getDaysSoFar = (startDate: string): number => {
    const start = new Date(startDate);
    const today = new Date();
    return Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  // Helper to calculate end date from start date and cycle length
  const calculateEndDate = (startDate: string, cycleLength: number): string => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + cycleLength - 1); // -1 because start date is included
    return formatDateShort(end);
  };

  return (
    <View style={[commonStyles.sectionContainer]}>
      <Text
        style={[
          typography.heading2,
          commonStyles.sectionTitleContainer,{marginBottom: 8}
        ]}
      >
        {t('stats:cycleHistory.title')}
      </Text>
      <Text
        style={[
          typography.body,
          { marginBottom: 10, color: colors.textSecondary},
        ]}
      >
        {cycles.length} {t('stats:cycleHistory.loggedCycles')}
      </Text>

      <View>
        {cycles.map((cycle, index) => {
          const isCurrentCycle = index === 0;

          // Determine display values
          let displayCycleLength: string;
          let circleDays: number;

          if (isCurrentCycle) {
            // For current cycle, show days so far
            const daysSoFar = getDaysSoFar(cycle.startDate);
            displayCycleLength = t('stats:cycleHistory.days', { count: daysSoFar });
            circleDays = daysSoFar;
          } else {
            // For past cycles, use stored cycle length
            const numericLength =
              typeof cycle.cycleLength === 'number'
                ? cycle.cycleLength
                : parseInt(cycle.cycleLength, 10);

            if (!isNaN(numericLength)) {
              displayCycleLength = t('stats:cycleHistory.days', { count: numericLength });
              circleDays = numericLength;
            } else {
              // Fallback for "In progress" or other strings
              displayCycleLength = String(cycle.cycleLength);
              circleDays = 28; // Default fallback
            }
          }

          // Format dates for display
          const formattedStartDate = formatDateShort(new Date(cycle.startDate));
          const formattedEndDate = cycle.endDate
            ? formatDateShort(new Date(cycle.endDate))
            : calculateEndDate(cycle.startDate, circleDays);

          // Determine style
          const cycleStyle = [
            styles.cycleContainer,
            { backgroundColor: colors.surface },
            isCurrentCycle
              ? { paddingTop: 8 }
              
              : index % 2 === 1
                ? {
                    borderColor: colors.border,
                    borderTopWidth: 1,
                    borderBottomWidth: 2,
                  }
                : {},
          ];

          return (
            <View key={index} style={cycleStyle}>
              {isCurrentCycle ? (
                // Special layout for current cycle
                <View>
                  <Text
                    style={[
                      typography.body,
                      { fontSize: 18, fontWeight: 'bold', marginBottom: 10},
                    ]}
                  >
                    {t('stats:cycleHistory.currentCycle')}
                  </Text>
                  <View style={styles.cycleInfoRow}>
                    <Text style={[typography.body, { fontWeight: '600' }]}>
                      {formattedStartDate} - {t('common:time.today')}
                    </Text>
                    <Text style={[typography.body, { fontWeight: '600' }]}>
                      {displayCycleLength}
                    </Text>
                  </View>
                </View>
              ) : (
                // Regular layout for past cycles
                <View style={styles.cycleInfoRow}>
                  <Text style={[typography.body, { fontWeight: '600' }]}>
                    {formattedStartDate} - {formattedEndDate}
                  </Text>
                  <Text style={[typography.body, { fontWeight: '600' }]}>
                    {displayCycleLength}
                  </Text>
                </View>
              )}

              <DayCircles
                totalDays={circleDays}
                periodDays={cycle.periodLength}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({


  cycleContainer: {
    paddingVertical: 20,
  },
  cycleInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  circleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
});

export default CycleHistory;
