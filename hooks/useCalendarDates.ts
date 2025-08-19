import { useState, useCallback, useMemo } from 'react';
import { PeriodPredictionService } from '../services/periodPredictions';
import { MarkedDates } from '../app/types/calendarTypes';

interface UseCalendarDatesProps {
  colors: {
    primary: string;
    accentPinkLight: string;
    accentPink: string;
    white: string;
  };
  userCycleLength: number;
  userPeriodLength: number;
}

export function useCalendarDates({
  colors,
  userCycleLength,
  userPeriodLength,
}: UseCalendarDatesProps) {
  const [baseMarkedDates, setBaseMarkedDates] = useState<MarkedDates>({});

  // Helper function to get custom styles for different prediction types
  const getStylesForPredictionType = useCallback(
    (predictionType: string) => {
      switch (predictionType) {
        case 'ovulation':
          return {
            customStyles: {
              container: {
                borderRadius: 16,
                borderWidth: 1.6,
                borderColor: colors.primary,
                borderStyle: 'dashed',
              },
              text: {
                color: colors.primary,
              },
            },
          };
        case 'fertile':
          return {
            customStyles: {
              container: {
                borderRadius: 16,
              },
              text: {
                color: colors.primary,
              },
            },
          };
        case 'period':
          return {
            customStyles: {
              container: {
                borderRadius: 16,
                backgroundColor: colors.accentPinkLight,
              },
              text: {
                color: colors.accentPink,
              },
            },
          };
        default:
          return {};
      }
    },
    [colors.primary, colors.accentPinkLight, colors.accentPink]
  );

  // Generate all marked dates including predictions
  const generateMarkedDates = useCallback(
    (periodDates: MarkedDates, startDate: string, allPeriods: string[][]) => {
      if (!startDate) return;

      const allMarkedDates = { ...periodDates };
      const cycleLength = PeriodPredictionService.getAverageCycleLength(
        Object.keys(periodDates),
        userCycleLength
      );

      // Get all period start dates (earliest date in each period)
      const periodStartDates = allPeriods.map(
        period => period[period.length - 1]
      );

      // Generate fertile windows and ovulation for all logged periods (past and present)
      const fertilityDates =
        PeriodPredictionService.generateFertilityForLoggedPeriods(
          periodStartDates,
          cycleLength
        );

      // Get predicted dates for future cycles
      const predictedDates = PeriodPredictionService.generatePredictedDates(
        startDate,
        cycleLength,
        userPeriodLength,
        12
      );

      // Apply styling to fertility dates (past and present cycles)
      Object.entries(fertilityDates).forEach(([dateString, prediction]) => {
        // Only apply fertility style if this is not an actual period date
        if (
          !allMarkedDates[dateString] ||
          !allMarkedDates[dateString].selected
        ) {
          const styles = getStylesForPredictionType(prediction.type);
          if (Object.keys(styles).length > 0) {
            allMarkedDates[dateString] = styles;
          }
        }
      });

      // Apply styling to predicted dates (future cycles only)
      Object.entries(predictedDates).forEach(([dateString, prediction]) => {
        // Only apply prediction style if this is not an actual period date and not already a fertility date
        if (
          !allMarkedDates[dateString] ||
          !allMarkedDates[dateString].selected
        ) {
          const styles = getStylesForPredictionType(prediction.type);
          if (Object.keys(styles).length > 0) {
            allMarkedDates[dateString] = styles;
          }
        }
      });

      // Store base marked dates (without selection highlight)
      setBaseMarkedDates(allMarkedDates);
    },
    [userCycleLength, userPeriodLength, getStylesForPredictionType]
  );

  // Generate marked dates with highlighting for a specific selected date
  const getMarkedDatesWithSelection = useCallback(
    (selectedDateParam: string) => {
      const updatedMarkedDates = { ...baseMarkedDates };
      const isPeriodDate =
        updatedMarkedDates[selectedDateParam]?.customStyles?.container
          ?.backgroundColor === colors.accentPink;

      if (isPeriodDate) {
        // For period dates, preserve the pink background but add a grey background behind it
        updatedMarkedDates[selectedDateParam] = {
          ...updatedMarkedDates[selectedDateParam],
          customStyles: {
            ...(updatedMarkedDates[selectedDateParam]?.customStyles || {}),
            container: {
              ...(updatedMarkedDates[selectedDateParam]?.customStyles
                ?.container || {}),
              backgroundColor: colors.primary,
              borderRadius: 16,
              width: 32,
              height: 32,
            },
            text: { color: colors.white },
          },
        };
      } else {
        // For non-period dates, just add the grey background
        updatedMarkedDates[selectedDateParam] = {
          ...updatedMarkedDates[selectedDateParam],
          customStyles: {
            ...(updatedMarkedDates[selectedDateParam]?.customStyles || {}),
            container: {
              ...(updatedMarkedDates[selectedDateParam]?.customStyles
                ?.container || {}),
              backgroundColor: '#E2E5EF',
              borderRadius: 20,
              width: 40,
              height: 40,
            },
            text: updatedMarkedDates[selectedDateParam]?.customStyles?.text,
          },
        };
      }

      return updatedMarkedDates;
    },
    [baseMarkedDates, colors.accentPink, colors.primary, colors.white]
  );

  const getSelectionMarkedDates = useCallback(
    (selectedDate: string) =>
      selectedDate ? getMarkedDatesWithSelection(selectedDate) : baseMarkedDates,
    [baseMarkedDates, getMarkedDatesWithSelection]
  );

  return {
    baseMarkedDates,
    generateMarkedDates,
    getMarkedDatesWithSelection,
    getSelectionMarkedDates,
  };
}
