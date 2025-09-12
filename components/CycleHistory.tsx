import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../styles/theme';

interface CycleData {
  startDate: string;
  cycleLength: string | number;
  periodLength: number;
  endDate?: string; // Optional end date
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
            backgroundColor: i < periodDays ? colors.accentPink : colors.border,
          },
        ]}
      />
    );
  }

  return <View style={styles.circleContainer}>{circles}</View>;
};

// Helper to calculate end date from start date and cycle length
const calculateEndDate = (startDate: string, cycleLength: string | number) => {
  try {
    // Get the numeric cycle length
    const cycleDays =
      typeof cycleLength === 'string' ? parseInt(cycleLength, 10) : cycleLength;

    if (isNaN(cycleDays) || cycleDays <= 0) {
      return 'Unknown';
    }

    // Simple date parser for "MMM D" or "MMM DD" format (e.g., "Apr 10" or "Apr 1")
    // This makes minimal assumptions about exact spacing or formatting
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // Try several parsing approaches
    let startDateObj: Date | null = null;

    // 1. Try standard date parsing first
    const standardDate = new Date(startDate);
    if (!isNaN(standardDate.getTime())) {
      startDateObj = standardDate;
    }
    // 2. Try parsing MMM DD format
    else {
      for (let i = 0; i < monthNames.length; i++) {
        const month = monthNames[i];
        if (startDate.includes(month)) {
          // Extract the day part - everything that's not the month name and convert to number
          const dayStr = startDate.replace(month, '').trim().replace(/\D/g, '');
          const day = parseInt(dayStr, 10);

          if (!isNaN(day) && day >= 1 && day <= 31) {
            // Valid day found, create date with current year
            const currentYear = new Date().getFullYear();
            startDateObj = new Date(currentYear, i, day);
            break;
          }
        }
      }
    }

    // If we couldn't parse the date, return unknown
    if (!startDateObj || isNaN(startDateObj.getTime())) {
      return 'Unknown';
    }

    // Calculate end date
    const endDateObj = new Date(startDateObj);
    endDateObj.setDate(startDateObj.getDate() + cycleDays - 1); // -1 because start date is included

    // Format the end date in the same format as the input (MMM DD)
    return endDateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    // Return fallback if any error occurs
    return 'Unknown';
  }
};

export function CycleHistory({ cycles }: CycleHistoryProps) {
  const { colors } = useTheme();

  if (cycles.length === 0) {
    return null;
  }

  // Helper function to format the cycle length for display
  const formatCycleLength = (length: string | number): string => {
    if (typeof length === 'number') {
      return `${length} ${length === 1 ? 'day' : 'days'}`;
    } else if (typeof length === 'string') {
      // Check if it's already formatted with "days"
      if (length.includes('days') || length.includes('day')) {
        return length;
      }

      // Try to parse as number
      const parsedLength = parseInt(length, 10);
      if (!isNaN(parsedLength)) {
        return `${parsedLength} ${parsedLength === 1 ? 'day' : 'days'}`;
      }
    }

    // Return original value if we can't format it
    return String(length);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Cycle history
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {cycles.length} logged cycles
      </Text>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        {cycles.map((cycle, index) => {
          const isCurrentCycle = index === 0; // Assuming first cycle is current

          // Handle cycle length display text and numeric value differently
          let displayCycleLength: string | number = cycle.cycleLength;
          let daysSoFar = 0;

          if (isCurrentCycle) {
            // For current cycle, always calculate days so far
            try {
              // Parse the start date using our flexible approach
              const monthNames = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ];
              let startDateObj: Date | null = null;

              // Try standard date parsing first
              const standardDate = new Date(cycle.startDate);
              if (!isNaN(standardDate.getTime())) {
                startDateObj = standardDate;
              }
              // Try parsing MMM DD format
              else {
                for (let i = 0; i < monthNames.length; i++) {
                  const month = monthNames[i];
                  if (cycle.startDate.includes(month)) {
                    // Extract the day part
                    const dayStr = cycle.startDate
                      .replace(month, '')
                      .trim()
                      .replace(/\D/g, '');
                    const day = parseInt(dayStr, 10);

                    if (!isNaN(day) && day >= 1 && day <= 31) {
                      // Valid day found, create date with current year
                      const currentYear = new Date().getFullYear();
                      startDateObj = new Date(currentYear, i, day);
                      break;
                    }
                  }
                }
              }

              if (startDateObj && !isNaN(startDateObj.getTime())) {
                const today = new Date();
                daysSoFar =
                  Math.floor(
                    (today.getTime() - startDateObj.getTime()) /
                      (1000 * 60 * 60 * 24)
                  ) + 1;
                displayCycleLength = `${daysSoFar} ${daysSoFar === 1 ? 'day' : 'days'}`;
              } else {
                displayCycleLength = 'In progress';
              }
            } catch {
              displayCycleLength = 'In progress';
            }
          } else if (typeof cycle.cycleLength === 'string') {
            // For past cycles with string length, try to parse as number
            const parsedLength = parseInt(cycle.cycleLength, 10);
            if (!isNaN(parsedLength)) {
              displayCycleLength = parsedLength;
            }
          }

          // Format cycle length display
          const formattedCycleLength = formatCycleLength(displayCycleLength);

          // For DayCircles, we need a numeric value
          let circleDays: number;

          if (isCurrentCycle && daysSoFar > 0) {
            // For current cycle, use the actual days so far for circles
            circleDays = daysSoFar;
          } else {
            // For past cycles, use the stored cycle length
            const numericCycleLength =
              typeof displayCycleLength === 'number'
                ? displayCycleLength
                : typeof cycle.cycleLength === 'string'
                  ? parseInt(cycle.cycleLength, 10)
                  : cycle.cycleLength;

            circleDays = !isNaN(numericCycleLength) ? numericCycleLength : 28;
          }

          // Determine background color based on index
          const cycleStyle = [
            styles.cycleContainer,
            { backgroundColor: colors.surface },
            isCurrentCycle
              ? {}
              : index % 2 === 1
                ? {
                    borderColor: colors.border,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
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
                      styles.currentCycleTitle,
                      { color: colors.textPrimary },
                    ]}
                  >
                    Current cycle
                  </Text>
                  <View style={styles.cycleInfoRow}>
                    <Text
                      style={[styles.dateText, { color: colors.textPrimary }]}
                    >
                      {cycle.startDate} - Today
                    </Text>
                    <Text
                      style={[styles.daysText, { color: colors.textPrimary }]}
                    >
                      {formattedCycleLength}
                    </Text>
                  </View>
                </View>
              ) : (
                // Regular layout for past cycles
                <View style={styles.cycleInfoRow}>
                  <Text
                    style={[styles.dateText, { color: colors.textPrimary }]}
                  >
                    {cycle.endDate
                      ? `${cycle.startDate} - ${cycle.endDate}`
                      : `${cycle.startDate} - ${calculateEndDate(cycle.startDate, circleDays)}`}
                  </Text>
                  <Text
                    style={[styles.daysText, { color: colors.textPrimary }]}
                  >
                    {formattedCycleLength}
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
  container: {
    padding: 16,
    borderRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  currentCycleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    borderRadius: 12,
    padding: 0,
  },
  cycleContainer: {
    paddingVertical: 20,
  },
  cycleInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  daysText: {
    fontSize: 16,
    fontWeight: '600',
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
