export interface CycleStatus {
  status: 'normal' | 'irregular';
  reason?: string;
}

/**
 * Determines if a cycle length is normal or irregular
 * Normal cycle: 21-35 days
 * Irregular cycle: <21 days or >35 days
 */
export function getCycleStatus(cycleLength: number): CycleStatus {
  if (cycleLength === 0) {
    return { status: 'irregular', reason: 'No data available' };
  }

  if (cycleLength >= 21 && cycleLength <= 35) {
    return { status: 'normal' };
  }

  if (cycleLength < 21) {
    return { status: 'irregular', reason: 'Too short' };
  }

  return { status: 'irregular', reason: 'Too long' };
}

/**
 * Determines if a period length is normal or irregular
 * Normal period: 2-7 days
 * Irregular period: <2 days or >7 days
 */
export function getPeriodStatus(periodLength: number): CycleStatus {
  if (periodLength === 0) {
    return { status: 'irregular', reason: 'No data available' };
  }

  if (periodLength >= 2 && periodLength <= 7) {
    return { status: 'normal' };
  }

  if (periodLength < 2) {
    return { status: 'irregular', reason: 'Too short' };
  }

  return { status: 'irregular', reason: 'Too long' };
}
