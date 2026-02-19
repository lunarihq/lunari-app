import { useState, useCallback } from 'react';
import { PeriodPredictionService } from '../services/periodPredictions';

interface UseCalendarPredictionsProps {
  userCycleLength: number;
  userPeriodLength: number;
}

export interface PredictionData {
  type: 'ovulation' | 'fertile' | 'period';
}

export interface CalendarPredictions {
  fertilityDates: Record<string, PredictionData>;
  predictedDates: Record<string, PredictionData>;
}

/**
 * Hook that handles calendar prediction data logic (no styling)
 */
export function useCalendarPredictions({
  userCycleLength,
  userPeriodLength,
}: UseCalendarPredictionsProps) {
  const [predictions, setPredictions] = useState<CalendarPredictions>({
    fertilityDates: {},
    predictedDates: {},
  });

  /**
   * Generate predictions for fertility and future periods
   */
  const generatePredictions = useCallback(
    (
      periodDates: string[],
      startDate: string | null,
      allPeriods: string[][]
    ): CalendarPredictions => {
      // If no data, return empty predictions
      if (!startDate || periodDates.length === 0) {
        const emptyPredictions = {
          fertilityDates: {},
          predictedDates: {},
        };
        setPredictions(emptyPredictions);
        return emptyPredictions;
      }

      const cycleLength = PeriodPredictionService.getAverageCycleLength(
        periodDates,
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

      const periodLength = PeriodPredictionService.getAveragePeriodLength(
        allPeriods,
        userPeriodLength
      );

      // Get predicted dates for future cycles
      const predictedDates = PeriodPredictionService.generatePredictedDates(
        startDate,
        cycleLength,
        periodLength,
        12
      );

      const newPredictions = {
        fertilityDates,
        predictedDates,
      };

      setPredictions(newPredictions);
      return newPredictions;
    },
    [userCycleLength, userPeriodLength]
  );

  return {
    predictions,
    generatePredictions,
  };
}
