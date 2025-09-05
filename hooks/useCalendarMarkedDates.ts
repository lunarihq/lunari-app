import { useState, useCallback } from 'react';
import { MarkedDates } from '../app/types/calendarTypes';
import { useCalendarPredictions } from './useCalendarPredictions';
import { useHealthLogDates } from './useHealthLogDates';
import {
  getCalendarDateStyle,
  getPeriodDateStyle,
} from '../utils/calendarStyles';

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

  const { generatePredictions } = useCalendarPredictions({
    userCycleLength,
    userPeriodLength,
  });

  const { loadHealthLogDates } = useHealthLogDates();

  // Generate all marked dates including predictions with styling
  const generateMarkedDates = useCallback(
    async (
      periodDates: string[],
      startDate: string | null,
      allPeriods: string[][]
    ) => {
      // Load health log dates
      const healthLogDates = await loadHealthLogDates();

      // If no period data, still show health log indicators
      const allMarkedDates: MarkedDates = {};

      if (startDate && periodDates.length > 0) {
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
            allMarkedDates[dateString] = getCalendarDateStyle(
              prediction.type,
              colors
            );
          }
        });

        // Apply styling to predicted dates (future cycles only)
        Object.entries(predictedDates).forEach(([dateString, prediction]) => {
          // Only apply prediction style if this is not an actual period date and not already a fertility date
          if (!allMarkedDates[dateString]?.selected) {
            allMarkedDates[dateString] = getCalendarDateStyle(
              prediction.type,
              colors
            );
          }
        });
      }

      // Add health log indicators to all dates that have health logs
      healthLogDates.forEach(dateString => {
        if (allMarkedDates[dateString]) {
          // Add health log indicator to existing marked date
          allMarkedDates[dateString].hasHealthLogs = true;
        } else {
          // Create new marked date for health log only
          allMarkedDates[dateString] = {
            hasHealthLogs: true,
          };
        }
      });

      // Store base marked dates (without selection highlight)
      setBaseMarkedDates(allMarkedDates);
    },
    [colors, generatePredictions, loadHealthLogDates]
  );

  // Generate marked dates with highlighting for a specific selected date
  const getMarkedDatesWithSelection = useCallback(
    (selectedDateParam: string) => {
      // Create a copy of base marked dates and add selection indicator
      const markedDatesWithSelection = { ...baseMarkedDates };

      // Add selection indicator to the selected date
      if (selectedDateParam) {
        markedDatesWithSelection[selectedDateParam] = {
          ...markedDatesWithSelection[selectedDateParam],
          selected: true,
        };
      }

      return markedDatesWithSelection;
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
