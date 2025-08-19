import { useState, useEffect, useCallback } from 'react';
import { db, getSetting } from '../db';
import { periodDates } from '../db/schema';
import { PeriodPredictionService } from '../services/periodPredictions';
import { MarkedDates } from '../app/types/calendarTypes';

export function useCalendarData(colors: { accentPink: string; white: string }) {
  const [firstPeriodDate, setFirstPeriodDate] = useState<string | null>(null);
  const [allPeriodDates, setAllPeriodDates] = useState<string[]>([]);
  const [userCycleLength, setUserCycleLength] = useState<number>(28);
  const [userPeriodLength, setUserPeriodLength] = useState<number>(5);
  const [averageCycleLength, setAverageCycleLength] = useState<number>(28);

  // Load user settings
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const cycleLength = await getSetting('userCycleLength');
        if (cycleLength) {
          setUserCycleLength(parseInt(cycleLength, 10));
        }

        const periodLength = await getSetting('userPeriodLength');
        if (periodLength) {
          setUserPeriodLength(parseInt(periodLength, 10));
        }
      } catch (error) {
        console.error('Error loading user settings:', error);
      }
    };
    loadUserSettings();
  }, []);

  // Load period dates from database
  const loadData = useCallback(async () => {
    const saved = await db.select().from(periodDates);

    const dates = saved.reduce((acc: MarkedDates, curr) => {
      acc[curr.date] = {
        selected: true,
        customStyles: {
          container: {
            backgroundColor: colors.accentPink,
            borderRadius: 16,
          },
          text: {
            color: colors.white,
          },
        },
      };
      return acc;
    }, {} as MarkedDates);

    if (saved.length > 0) {
      const sortedDates = saved.map(s => s.date);
      setAllPeriodDates(sortedDates);
      const periods = PeriodPredictionService.groupDateIntoPeriods(sortedDates);

      // Get the start date of the most recent period
      const mostRecentPeriod = periods[0];
      const mostRecentStart = mostRecentPeriod[mostRecentPeriod.length - 1];

      setFirstPeriodDate(mostRecentStart);

      // Calculate average cycle length
      const cycleLength = PeriodPredictionService.getAverageCycleLength(
        Object.keys(dates),
        userCycleLength
      );
      setAverageCycleLength(cycleLength);

      return { dates, mostRecentStart, periods, cycleLength };
    } else {
      setFirstPeriodDate(null);
      setAllPeriodDates([]);
      setAverageCycleLength(28);
      return { dates: {}, mostRecentStart: null, periods: [], cycleLength: 28 };
    }
  }, [colors.accentPink, colors.white, userCycleLength]);

  return {
    firstPeriodDate,
    allPeriodDates,
    userCycleLength,
    userPeriodLength,
    averageCycleLength,
    loadData,
  };
}
