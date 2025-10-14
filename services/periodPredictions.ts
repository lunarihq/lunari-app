interface PredictionResult {
  days: number;
  date: string;
  cycleLength: number;
}

interface FertilityWindow {
  start: string;
  end: string;
  ovulationDay: string;
}

interface CycleInfo {
  phase: string;
  description: string;
  cycleDay: number;
  pregnancyChance: string;
}

export class PeriodPredictionService {
  // Utility function to group consecutive dates into periods
  static groupDateIntoPeriods(dates: string[]): string[][] {
    if (dates.length === 0) return [];

    const sortedDates = dates.sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
    const periods: string[][] = [];
    let currentPeriod: string[] = [sortedDates[0]];

    for (let i = 1; i < sortedDates.length; i++) {
      const dayDiff = Math.abs(
        (new Date(sortedDates[i]).getTime() -
          new Date(sortedDates[i - 1]).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (dayDiff <= 1) {
        currentPeriod.push(sortedDates[i]);
      } else {
        periods.push(currentPeriod);
        currentPeriod = [sortedDates[i]];
      }
    }
    periods.push(currentPeriod);
    return periods;
  }

  static getAverageCycleLength(
    dates: string[],
    userCycleLength?: number
  ): number {
    if (dates.length < 2) return userCycleLength || 28;

    const periods = this.groupDateIntoPeriods(dates);

    // Calculate weighted average
    let weightedTotal = 0;
    let weightSum = 0;
    let cycles = 0;

    for (let i = 1; i < Math.min(periods.length, 6); i++) {
      const currentPeriodStart = new Date(
        periods[i - 1][periods[i - 1].length - 1]
      );
      const prevPeriodStart = new Date(periods[i][periods[i].length - 1]);

      const dayDiff = Math.floor(
        (currentPeriodStart.getTime() - prevPeriodStart.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const weight = Math.max(1 - cycles * 0.2, 0.2);
      weightedTotal += dayDiff * weight;
      weightSum += weight;
      cycles++;
    }

    return cycles > 0
      ? Math.round(weightedTotal / weightSum)
      : userCycleLength || 28;
  }

  // Calculate if today is a period day and which day it is
  static calculatePeriodDay(periodDates: { [date: string]: any }): {
    isPeriodDay: boolean;
    dayNumber: number;
  } {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

    if (!periodDates[todayStr]) {
      return { isPeriodDay: false, dayNumber: 0 };
    }

    // It's a period day, calculate which day it is
    let dayCount = 1;
    const tempDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      12,
      0,
      0
    );

    // Look back day by day to find consecutive period days
    while (true) {
      tempDate.setDate(tempDate.getDate() - 1);
      const prevDateStr = `${tempDate.getFullYear()}-${(tempDate.getMonth() + 1).toString().padStart(2, '0')}-${tempDate.getDate().toString().padStart(2, '0')}`;

      if (periodDates[prevDateStr]) {
        dayCount++;
      } else {
        break;
      }
    }

    return { isPeriodDay: true, dayNumber: dayCount };
  }

  static getPrediction(
    startDate: string,
    allDates: string[],
    userCycleLength?: number
  ): PredictionResult {
    const cycleLength = this.getAverageCycleLength(allDates, userCycleLength);
    const today = new Date();
    const nextPeriod = new Date(startDate);

    nextPeriod.setDate(nextPeriod.getDate() + cycleLength);

    const daysUntil = Math.ceil(
      (nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    const dateStr = `${nextPeriod.getFullYear()}-${(nextPeriod.getMonth() + 1).toString().padStart(2, '0')}-${nextPeriod.getDate().toString().padStart(2, '0')}`;
    return { days: daysUntil, date: dateStr, cycleLength };
  }

  static getCurrentCycleDay(startDate: string, currentDate?: string): number {
    const start = new Date(startDate);
    const current = currentDate ? new Date(currentDate) : new Date();

    const dayDiff = Math.floor(
      (current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    return dayDiff + 1; // Add 1 because the first day of period is day 1
  }

  static getOvulationDay(startDate: string, cycleLength?: number): string {
    const start = new Date(startDate);
    const length = cycleLength || 28;

    // Ovulation typically occurs 14 days before the next period
    const ovulationDayOffset = length - 14;
    const ovulationDate = new Date(start);
    ovulationDate.setDate(ovulationDate.getDate() + ovulationDayOffset);

    return `${ovulationDate.getFullYear()}-${(ovulationDate.getMonth() + 1).toString().padStart(2, '0')}-${ovulationDate.getDate().toString().padStart(2, '0')}`;
  }

  static getFertilityWindow(
    startDate: string,
    cycleLength?: number
  ): FertilityWindow {
    const cycle = cycleLength || 28;
    const ovulationDay = this.getOvulationDay(startDate, cycle);
    const [y, m, d] = ovulationDay.split('-').map(v => parseInt(v, 10));
    const ovulationDate = new Date(y, m - 1, d, 12, 0, 0);

    const startWindow = new Date(ovulationDate);
    startWindow.setDate(ovulationDate.getDate() - 5); // Fertility typically starts 5 days before ovulation

    const startStr = `${startWindow.getFullYear()}-${(startWindow.getMonth() + 1).toString().padStart(2, '0')}-${startWindow.getDate().toString().padStart(2, '0')}`;
    return { start: startStr, end: ovulationDay, ovulationDay };
  }

  static getCyclePhase(
    cycleDay: number,
    averageCycleLength: number = 28
  ): string {
    if (cycleDay <= 5) return 'Menstrual';

    // Scale phases based on actual cycle length
    const follicularEnd = Math.round(10 * (averageCycleLength / 28));
    const ovulatoryEnd = Math.round(14 * (averageCycleLength / 28));

    if (cycleDay <= follicularEnd) return 'Follicular';
    if (cycleDay <= ovulatoryEnd) return 'Ovulatory';
    // Normal cycles can be 21-35 days, so only show "Extended" after day 35
    if (cycleDay <= 35) return 'Luteal';
    return 'Extended';
  }

  static getPhaseDescription(phase: string): string {
    switch (phase) {
      case 'Menstrual':
        return 'The period, or menstruation, is when the lining of the uterus sheds and leaves the body through vaginal bleeding. It typically lasts 3–7 days, but can vary widely. \n\nDuring this time, the body prepares for a potential pregnancy by thickening the uterine lining. If fertilization does not occur, hormone levels drop, and menstruation begins.';
      case 'Follicular':
        return 'The follicular phase is the first part of the menstrual cycle, starting with the first day of your period and ending with ovulation. Energy levels start to rise with increasing estrogen. Good time for starting new projects and physical activity.';
      case 'Ovulatory':
        return 'Ovulation is the release of an egg from the ovary. This is the peak fertility window, and it typically occurs around day 14 of your cycle.';
      case 'Luteal':
        return 'The luteal phase is the second part of the menstrual cycle, lasting from ovulation until the start of your next period, and typically lasts about 12–14 days.\n\nDuring this time, the body prepares for a potential pregnancy by thickening the uterine lining. If fertilization does not occur, hormone levels drop, and menstruation begins.';
      case 'Extended':
        return 'Your cycle is running longer than usual (past day 35). This can be normal occasionally, but if it happens often, consider tracking patterns and chatting with a healthcare provider.';
      default:
        return '';
    }
  }

  static getPregnancyChance(
    cycleDay: number,
    averageCycleLength: number = 28
  ): string {
    const ovulationDay = averageCycleLength - 14; // Ovulation typically 14 days before next period
    const fertilityStart = ovulationDay - 5;
    const fertilityEnd = ovulationDay + 1;

    if (cycleDay >= fertilityStart && cycleDay <= fertilityEnd) return 'High';
    if (cycleDay >= fertilityStart - 2 && cycleDay <= fertilityEnd + 2)
      return 'Medium';
    return 'Low';
  }

  static getPregnancyChanceDescription(chance: string): string {
    switch (chance) {
      case 'High':
        return 'This is your fertile window when conception is most likely to occur. Ovulation typically happens during this time.';
      case 'Medium':
        return 'There is a moderate chance of conception during this time as you approach or move away from your fertile window.';
      case 'Low':
        return 'Conception is less likely during this time. This includes menstrual days and the later luteal phase of your cycle.';
      default:
        return '';
    }
  }

  static getPossibleSymptoms(phase: string): string {
    switch (phase) {
      case 'Menstrual':
        return 'Cramps, fatigue, mood swings, bloating, headaches, and lower back pain. Your energy and mood may be lower than usual.';
      case 'Follicular':
        return 'Rising energy, improved mood, clearer skin, and increased motivation. You may feel more social and confident.';
      case 'Ovulatory':
        return 'Peak energy, heightened sex drive, increased confidence, and possible mild cramping or spotting. You may feel your most attractive.';
      case 'Luteal':
        return 'Bloating, mood swings, food cravings, fatigue, breast tenderness, and irritability. These PMS symptoms typically worsen as your period approaches.';
      case 'Extended':
        return '';
      default:
        return '';
    }
  }

  static getCycleInfo(
    startDate: string,
    currentDate?: string,
    cycleLength?: number
  ): CycleInfo {
    const cycleDay = this.getCurrentCycleDay(startDate, currentDate);
    const avgCycleLength = cycleLength || 28;
    const phase = this.getCyclePhase(cycleDay, avgCycleLength);

    return {
      phase,
      description: this.getPhaseDescription(phase),
      cycleDay,
      pregnancyChance: this.getPregnancyChance(cycleDay, avgCycleLength),
    };
  }

  // Generate fertile windows and ovulation for actual logged periods
  static generateFertilityForLoggedPeriods(
    periodStartDates: string[],
    userCycleLength: number
  ): { [date: string]: { type: 'fertile' | 'ovulation' } } {
    const fertilityDates: {
      [date: string]: { type: 'fertile' | 'ovulation' };
    } = {};

    periodStartDates.forEach(startDate => {
      // Calculate ovulation date (14 days before period start)
      const startDateParts = startDate.split('-');
      const year = parseInt(startDateParts[0]);
      const month = parseInt(startDateParts[1]) - 1; // JS months are 0-indexed
      const day = parseInt(startDateParts[2]);

      const periodDate = new Date(year, month, day, 12, 0, 0);
      const ovulationDate = new Date(periodDate);
      ovulationDate.setDate(ovulationDate.getDate() - 14);
      const ovulationDateString = `${ovulationDate.getFullYear()}-${(ovulationDate.getMonth() + 1).toString().padStart(2, '0')}-${ovulationDate.getDate().toString().padStart(2, '0')}`;

      // Calculate fertile window (5 days before ovulation + ovulation day + 1 day after)
      const fertileStart = new Date(ovulationDate);
      fertileStart.setDate(fertileStart.getDate() - 5);

      const fertileEnd = new Date(ovulationDate);
      fertileEnd.setDate(fertileEnd.getDate() + 1);

      // Add fertile window dates
      for (
        let d = new Date(fertileStart);
        d <= fertileEnd;
        d.setDate(d.getDate() + 1)
      ) {
        const fertileDateString = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

        if (fertileDateString === ovulationDateString) {
          // This is the ovulation day - mark it as ovulation
          fertilityDates[fertileDateString] = { type: 'ovulation' };
        } else {
          // This is a fertile window day (not ovulation)
          fertilityDates[fertileDateString] = { type: 'fertile' };
        }
      }
    });

    return fertilityDates;
  }

  // Generate all predicted dates (periods, fertile window, and ovulation) for multiple cycles
  static generatePredictedDates(
    startDate: string,
    userCycleLength: number,
    userPeriodLength: number,
    numCycles: number = 3
  ): { [date: string]: { type: 'period' | 'fertile' | 'ovulation' } } {
    const predictedDates: {
      [date: string]: { type: 'period' | 'fertile' | 'ovulation' };
    } = {};

    for (let i = 0; i < numCycles; i++) {
      // Calculate next period start date
      const startDateParts = startDate.split('-');
      const year = parseInt(startDateParts[0]);
      const month = parseInt(startDateParts[1]) - 1; // JS months are 0-indexed
      const day = parseInt(startDateParts[2]);

      const nextPeriodDate = new Date(
        year,
        month,
        day + userCycleLength * (i + 1),
        12,
        0,
        0
      );

      // Calculate ovulation date (14 days before period start)
      const ovulationDate = new Date(nextPeriodDate);
      ovulationDate.setDate(ovulationDate.getDate() - 14);
      const ovulationDateString = `${ovulationDate.getFullYear()}-${(ovulationDate.getMonth() + 1).toString().padStart(2, '0')}-${ovulationDate.getDate().toString().padStart(2, '0')}`;

      // Calculate fertile window (5 days before ovulation + ovulation day + 1 day after)
      const fertileStart = new Date(ovulationDate);
      fertileStart.setDate(fertileStart.getDate() - 5);

      const fertileEnd = new Date(ovulationDate);
      fertileEnd.setDate(fertileEnd.getDate() + 1);

      // Add fertile window dates
      for (
        let d = new Date(fertileStart);
        d <= fertileEnd;
        d.setDate(d.getDate() + 1)
      ) {
        const fertileDateString = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

        // Don't override period dates with fertile window
        if (
          !predictedDates[fertileDateString] ||
          predictedDates[fertileDateString].type !== 'period'
        ) {
          if (fertileDateString === ovulationDateString) {
            // This is the ovulation day - mark it as ovulation (will get special styling)
            predictedDates[fertileDateString] = { type: 'ovulation' };
          } else {
            // This is a fertile window day (not ovulation)
            predictedDates[fertileDateString] = { type: 'fertile' };
          }
        }
      }

      // Add period dates
      for (let j = 0; j < userPeriodLength; j++) {
        const periodDay = new Date(nextPeriodDate);
        periodDay.setDate(periodDay.getDate() + j);
        const periodDayString = `${periodDay.getFullYear()}-${(periodDay.getMonth() + 1).toString().padStart(2, '0')}-${periodDay.getDate().toString().padStart(2, '0')}`;
        predictedDates[periodDayString] = { type: 'period' };
      }
    }

    return predictedDates;
  }
}
