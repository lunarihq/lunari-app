import { useState, useCallback } from 'react';
import { PeriodPredictionService } from '../services/periodPredictions';
import { MarkedDates } from '../app/types/calendarTypes';

interface UseCalendarDatesProps {
  colors: {
    accentBlue: string;
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
                borderColor: colors.accentBlue,
                borderStyle: 'dashed',
              },
              text: {
                color: colors.accentBlue,
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
                color: colors.accentBlue,
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
    [colors.accentBlue, colors.accentPinkLight, colors.accentPink]
  );

  // Generate all marked dates including predictions
  const generateMarkedDates = useCallback(
    (
      periodDates: MarkedDates,
      startDate: string | null,
      allPeriods: string[][]
    ) => {
      // If no data, clear all marked dates
      if (!startDate || Object.keys(periodDates).length === 0) {
        setBaseMarkedDates({});
        return;
      }

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
      const isPredictionPeriodDate =
        updatedMarkedDates[selectedDateParam]?.customStyles?.container
          ?.backgroundColor === colors.accentPinkLight;
      const isOvulationDate =
        updatedMarkedDates[selectedDateParam]?.customStyles?.container
          ?.borderStyle === 'dashed' &&
        updatedMarkedDates[selectedDateParam]?.customStyles?.container
          ?.borderColor === colors.accentBlue;

      if (isPeriodDate) {
        // For period dates, create a layered effect with grey background and pink on top
        updatedMarkedDates[selectedDateParam] = {
          ...updatedMarkedDates[selectedDateParam],
          customContainerStyle: {
            backgroundColor: '#E2E5EF',
            borderRadius: 20,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          },
          customStyles: {
            ...(updatedMarkedDates[selectedDateParam]?.customStyles || {}),
            container: {
              ...(updatedMarkedDates[selectedDateParam]?.customStyles
                ?.container || {}),
              backgroundColor: colors.accentPink,
              borderRadius: 16,
              width: 32,
              height: 32,
            },
            text: { color: colors.white },
          },
        };
      } else if (isPredictionPeriodDate) {
        // For prediction period dates, create a layered effect with grey background and light pink on top
        updatedMarkedDates[selectedDateParam] = {
          ...updatedMarkedDates[selectedDateParam],
          customContainerStyle: {
            backgroundColor: '#E2E5EF',
            borderRadius: 20,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          },
          customStyles: {
            ...(updatedMarkedDates[selectedDateParam]?.customStyles || {}),
            container: {
              ...(updatedMarkedDates[selectedDateParam]?.customStyles
                ?.container || {}),
              backgroundColor: colors.accentPinkLight,
              borderRadius: 16,
              width: 32,
              height: 32,
            },
            text: updatedMarkedDates[selectedDateParam]?.customStyles?.text,
          },
        };
      } else if (isOvulationDate) {
        // For ovulation dates, create a layered effect with grey background and dashed blue border on top
        updatedMarkedDates[selectedDateParam] = {
          ...updatedMarkedDates[selectedDateParam],
          customContainerStyle: {
            backgroundColor: '#E2E5EF',
            borderRadius: 20,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          },
          customStyles: {
            ...(updatedMarkedDates[selectedDateParam]?.customStyles || {}),
            container: {
              ...(updatedMarkedDates[selectedDateParam]?.customStyles
                ?.container || {}),
              borderRadius: 16,
              borderWidth: 1.6,
              borderColor: colors.accentBlue,
              borderStyle: 'dashed',
              width: 32,
              height: 32,
            },
            text: updatedMarkedDates[selectedDateParam]?.customStyles?.text,
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
    [
      baseMarkedDates,
      colors.accentPink,
      colors.accentPinkLight,
      colors.accentBlue,
      colors.white,
    ]
  );

  const getSelectionMarkedDates = useCallback(
    (selectedDate: string) =>
      selectedDate
        ? getMarkedDatesWithSelection(selectedDate)
        : baseMarkedDates,
    [baseMarkedDates, getMarkedDatesWithSelection]
  );

  return {
    baseMarkedDates,
    generateMarkedDates,
    getMarkedDatesWithSelection,
    getSelectionMarkedDates,
  };
}
