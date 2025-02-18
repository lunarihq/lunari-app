interface PredictionResult {
  days: number;
  date: string;
  cycleLength: number;
}

export class PeriodPredictionService {
  static getAverageCycleLength(dates: string[]): number {
    if (dates.length < 2) return 28;
    
    const sortedDates = dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const periods: string[][] = [];
    let currentPeriod: string[] = [sortedDates[0]];

    // Group consecutive days into periods
    for (let i = 1; i < sortedDates.length; i++) {
      const dayDiff = Math.abs((new Date(sortedDates[i]).getTime() - new Date(sortedDates[i-1]).getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff <= 7) {
        currentPeriod.push(sortedDates[i]);
      } else {
        periods.push(currentPeriod);
        currentPeriod = [sortedDates[i]];
      }
    }
    periods.push(currentPeriod);

    // Calculate weighted average
    let weightedTotal = 0;
    let weightSum = 0;
    let cycles = 0;

    for (let i = 1; i < Math.min(periods.length, 6); i++) {
      const currentPeriodStart = new Date(periods[i-1][periods[i-1].length-1]);
      const prevPeriodStart = new Date(periods[i][periods[i].length-1]);
      
      const dayDiff = Math.floor(
        (currentPeriodStart.getTime() - prevPeriodStart.getTime()) 
        / (1000 * 60 * 60 * 24)
      );
      
      const weight = Math.max(1 - ((cycles) * 0.2), 0.2);
      weightedTotal += dayDiff * weight;
      weightSum += weight;
      cycles++;
    }
    
    return cycles > 0 ? Math.round(weightedTotal / weightSum) : 28;
  }

  static getPrediction(startDate: string, allDates: string[]): PredictionResult {
    const cycleLength = this.getAverageCycleLength(allDates);
    const today = new Date();
    const nextPeriod = new Date(startDate);
    
    nextPeriod.setDate(nextPeriod.getDate() + cycleLength);
    
    const daysUntil = Math.ceil((nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return { 
      days: daysUntil, 
      date: nextPeriod.toLocaleDateString(),
      cycleLength 
    };
  }
} 