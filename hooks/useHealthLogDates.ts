import { useState, useCallback } from 'react';
import { db } from '../db';
import { healthLogs } from '../db/schema';
import { sql } from 'drizzle-orm';

export function useHealthLogDates() {
  const [healthLogDates, setHealthLogDates] = useState<string[]>([]);

  const loadHealthLogDates = useCallback(async () => {
    try {
      // Query distinct dates that have health logs
      const result = await db
        .selectDistinct({ date: healthLogs.date })
        .from(healthLogs);
      
      const dates = result.map(row => row.date);
      setHealthLogDates(dates);
      return dates;
    } catch (error) {
      console.error('Error loading health log dates:', error);
      setHealthLogDates([]);
      return [];
    }
  }, []);

  return {
    healthLogDates,
    loadHealthLogDates,
  };
}
