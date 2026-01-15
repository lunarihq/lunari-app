import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../styles/theme';
import { useAppStyles } from '../hooks/useStyles';
import { formatDateShort } from '../utils/localeUtils';

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
  const { typography, commonStyles } = useAppStyles();
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
          typography.headingMd,
          commonStyles.sectionTitleContainer,{marginBottom: 8}
        ]}
      >
        {t('stats:cycleHistory.title')}
      </Text>
      <Text
        style={[
          typography.body,
          { marginBottom: 16, color: colors.textSecondary},
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

          return (
            <View key={index} style={styles.cycleContainer}>
              <View style={styles.cycleInfoColumn}>
                <Text style={[typography.headingSm, {marginBottom: 4}]}>
                  {isCurrentCycle 
                    ? `${t('stats:cycleHistory.currentCycle')}: ${displayCycleLength}`
                    : displayCycleLength
                  }
                </Text>
                <Text style={[typography.labelSm, { color: colors.textSecondary}]}>
                  {isCurrentCycle 
                    ? `${formattedStartDate} - ${t('common:time.today')}`
                    : `${formattedStartDate} - ${formattedEndDate}`
                  }
                </Text>
              </View>

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
    paddingVertical: 16,
    backgroundColor: 'yellow',
    borderColor: 'red',
    borderBottomWidth: 1,
  },
  cycleInfoColumn: {
    flexDirection: 'column',
    backgroundColor: 'blue',
    marginBottom: 8,
  },
  circleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: 'green',
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
