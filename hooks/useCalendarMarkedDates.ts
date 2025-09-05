import { useState, useCallback, useMemo } from 'react';
import { MarkedDates } from '../app/types/calendarTypes';
import { useCalendarPredictions } from './useCalendarPredictions';
import { getCalendarDateStyle, getPeriodDateStyle } from '../utils/calendarStyles';

interface UseCalendarMarkedDatesProps {
  colors: {
    accentBlue: string;
    accentPinkLight: string;
    accentPink: string;
    white: string;
  };
  userCycleLength: number;
  userPeriodLength: number;
}

/**
 * Hook that combines data from predictions and applies styling to create marked dates
 */
export function useCalendarMarkedDates({
  colors,
  userCycleLength,
  userPeriodLength,
}: UseCalendarMarkedDatesProps) {
  const [baseMarkedDates, setBaseMarkedDates] = useState<MarkedDates>({});

  const { predictions, generatePredictions } = useCalendarPredictions({
    userCycleLength,
    userPeriodLength,
  });

  // Generate all marked dates including predictions with styling
  const generateMarkedDates = useCallback(
    (
      periodDates: string[],
      startDate: string | null,
      allPeriods: string[][]
    ) => {
      // If no data, clear all marked dates
      if (!startDate || periodDates.length === 0) {
        setBaseMarkedDates({});
        return;
      }

      // Start with styled period dates
      const allMarkedDates: MarkedDates = {};
      
      // Apply styling to actual period dates
      periodDates.forEach(dateString => {
        allMarkedDates[dateString] = getPeriodDateStyle(colors);
      });

      // Generate predictions
      const { fertilityDates, predictedDates } = generatePredictions(
        periodDates,
        startDate,
        allPeriods
      );

      // Apply styling to fertility dates (past and present cycles)
      Object.entries(fertilityDates).forEach(([dateString, prediction]) => {
        // Only apply fertility style if this is not an actual period date
        if (!allMarkedDates[dateString]?.selected) {
          allMarkedDates[dateString] = getCalendarDateStyle(prediction.type, colors);
        }
      });

      // Apply styling to predicted dates (future cycles only)
      Object.entries(predictedDates).forEach(([dateString, prediction]) => {
        // Only apply prediction style if this is not an actual period date and not already a fertility date
        if (!allMarkedDates[dateString]?.selected) {
          allMarkedDates[dateString] = getCalendarDateStyle(prediction.type, colors);
        }
      });

      // Store base marked dates (without selection highlight)
      setBaseMarkedDates(allMarkedDates);
    },
    [colors, generatePredictions]
  );

  // Generate marked dates with highlighting for a specific selected date
  const getMarkedDatesWithSelection = useCallback(
    (selectedDateParam: string) => {
      // Return base marked dates without any selection styling
      return baseMarkedDates;
    },
    [baseMarkedDates]
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
