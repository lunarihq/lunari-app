import { Text, View, StyleSheet, Modal, Pressable, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';
import { useState, useEffect } from 'react';
import { PeriodCalendarModal } from '../../components/PeriodCalendar';
import { db } from '../../db';
import { PeriodDate, periodDates } from '../../db/schema';
import { PeriodPredictionService } from '../../services/periodPredictions';
import { validatePeriodDate } from '../../validation/periodData';
import { Ionicons } from '@expo/vector-icons';

const getPregnancyChance = (cycleDay: number): string => {
  if (cycleDay >= 11 && cycleDay <= 17) return 'High';
  if (cycleDay >= 8 && cycleDay <= 20) return 'Medium';
  return 'Low';
};

const getOvulationDay = (startDate: string): string => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + 14);
  return date.toLocaleDateString();
};

const getAverageCycleLength = (dates: string[]): number => {
  if (dates.length < 2) return 28;
  
  const sortedDates = dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const periods: string[][] = [];
  let currentPeriod: string[] = [sortedDates[0]];

  // First group consecutive days into periods
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

  // Then calculate gaps between periods using their first days
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
};

const getNextPeriodPrediction = (startDate: string, allDates: string[]): { days: number; date: string } => {
  const cycleLength = getAverageCycleLength(allDates);
  const today = new Date();
  const nextPeriod = new Date(startDate);
  
  console.log('Cycle length:', cycleLength);
  console.log('Start date:', startDate);
  console.log('Today:', today.toISOString());
  
  nextPeriod.setDate(nextPeriod.getDate() + cycleLength);
  console.log('Next period:', nextPeriod.toISOString());
  
  const daysUntil = Math.ceil((nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  console.log('Days until:', daysUntil);
  
  return { days: daysUntil, date: nextPeriod.toLocaleDateString() };
};

const getCyclePhase = (cycleDay: number): string => {
  if (cycleDay <= 5) return 'Menstrual';
  if (cycleDay <= 10) return 'Follicular';
  if (cycleDay <= 14) return 'Ovulatory';
  if (cycleDay <= 28) return 'Luteal';
  return 'Extended';
};

const getPhaseDescription = (phase: string): string => {
  switch (phase) {
    case 'Menstrual':
      return 'Your period is happening. You might experience cramps, fatigue, and mood changes. Focus on rest and self-care.';
    case 'Follicular':
      return 'Energy levels start to rise with increasing estrogen. Good time for starting new projects and physical activity.';
    case 'Ovulatory':
      return 'Peak fertility window. You might notice increased energy, better mood, and heightened sex drive.';
    case 'Luteal':
      return 'Progesterone rises. You might experience PMS symptoms like bloating or mood changes. Focus on gentle exercise and comfort.';
    case 'Extended':
      return 'Your cycle has gone longer than typical. Consider tracking any symptoms and consulting your healthcare provider if this persists.';
    default:
      return '';
  }
};

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ [date: string]: any }>({});
  const [firstPeriodDate, setFirstPeriodDate] = useState<string | null>(null);
  const [currentCycleDay, setCurrentCycleDay] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  useEffect(() => {
    const setup = async () => {
      await loadSavedDates();
    };
    setup();

    // Update date every day at midnight
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000 * 60 * 60 * 24);

    return () => clearInterval(timer);
  }, []);

  const calculateCurrentCycleDay = (dates: string[]) => {
    if (dates.length === 0) return null;
    
    const sortedDates = dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const mostRecentStart = new Date(sortedDates[0]);
    const today = new Date();
    
    const diffTime = today.getTime() - mostRecentStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return diffDays;
  };

  const loadSavedDates = async () => {
    const saved = await db.select().from(periodDates);
    
    const dates = saved.reduce((acc: { [key: string]: any }, curr: PeriodDate) => { 
      acc[curr.date] = { selected: true, selectedColor: '#FF597B' };
      return acc;
    }, {} as { [key: string]: any });
    
    setSelectedDates(dates);
    
    if (saved.length > 0) {
      // Sort dates in ascending order for grouping
      const sortedDates = saved.map(s => s.date)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // Changed to descending order
      
      const periods: string[][] = [];
      let currentPeriod: string[] = [sortedDates[0]];

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

      // Get the start date of the most recent period
      const mostRecentPeriod = periods[0]; // Changed to first period since we sorted in descending order
      const mostRecentStart = mostRecentPeriod[mostRecentPeriod.length - 1]; // Get the earliest date in the period
      
      setFirstPeriodDate(mostRecentStart);
      setCurrentCycleDay(calculateCurrentCycleDay([mostRecentStart]));
    }
  };

  const savePeriodDates = async (dates: { [date: string]: any }) => {
    try {
      // Validate dates before saving
      if (!Object.keys(dates).every(date => validatePeriodDate(date))) {
        console.error('Invalid dates detected');
        return;
      }
      
      console.log('Saving dates:', dates);
      
      await db.delete(periodDates);
      console.log('Deleted old dates');
      
      const dateInserts = Object.keys(dates).map(date => ({
        date
      }));
      
      if (dateInserts.length > 0) {
        await db.insert(periodDates).values(dateInserts);
        console.log('Inserted new dates:', dateInserts);
        
        // Use the same logic as loadSavedDates to find the most recent period
        const sortedDates = Object.keys(dates)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        
        const periods: string[][] = [];
        let currentPeriod: string[] = [sortedDates[0]];

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

        const mostRecentPeriod = periods[0];
        const mostRecentStart = mostRecentPeriod[mostRecentPeriod.length - 1];
        
        setSelectedDates(dates);
        setFirstPeriodDate(mostRecentStart);
        setCurrentCycleDay(calculateCurrentCycleDay([mostRecentStart]));
      } else {
        setSelectedDates({});
        setFirstPeriodDate(null);
        setCurrentCycleDay(null);
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving dates:', error);
    }
  };

  const prediction = firstPeriodDate 
    ? PeriodPredictionService.getPrediction(firstPeriodDate, Object.keys(selectedDates))
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.predictionCard}>
        <View style={styles.predictionCircle}>
          {prediction ? (
            <>
              <Text style={styles.predictionLabel}>Period in</Text>
              <Text style={styles.predictionDays}>{prediction.days} days</Text>
            </>
          ) : (
            // Empty state  
            <Text style={styles.emptyStateText}>Log the first day of your period to get started.</Text>
          )}
        </View>
        <Pressable onPress={() => setModalVisible(true)} style={styles.button}>
          <Text style={styles.buttonText}>Log your period</Text>
        </Pressable>
      </View>

      <View style={styles.insightsCard}>
        <Text style={styles.insightsTitle}>
          {currentCycleDay 
            ? `Your cycle • Day ${currentCycleDay}`
            : "Your cycle"}
        </Text>
        {currentCycleDay ? (
          <>
            <View style={[styles.cycleInfo, styles.mt8]}>
              <View style={styles.labelWithIcon}>
                <Ionicons name="heart" size={20} color="#666" />
                <Text style={styles.cycleLabel}>Chance to conceive</Text>
              </View>
              <Text style={styles.cycleDay}>{getPregnancyChance(currentCycleDay)}</Text>
            </View>
            <View style={[styles.cycleInfo, styles.mt8]}>
              <View style={styles.labelWithIcon}>
                <Ionicons name="sync" size={20} color="#666" />
                <Text style={styles.cycleLabel}>Cycle phase</Text>
              </View>
              <View>
                <TouchableOpacity 
                  style={styles.phaseContainer}
                  onPress={() => {
                    const phase = getCyclePhase(currentCycleDay!);
                    setExpandedPhase(expandedPhase === phase ? null : phase);
                  }}
                >
                  <Text style={styles.cycleDay}>
                    {currentCycleDay ? getCyclePhase(currentCycleDay) : '-'}
                  </Text>
                  <Ionicons 
                    name={expandedPhase ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color="#666" 
                  />
                </TouchableOpacity>
                {expandedPhase && (
                  <Text style={styles.phaseDescription}>
                    {getPhaseDescription(expandedPhase)}
                  </Text>
                )}
              </View>
            </View>
            <View style={[styles.cycleInfo, styles.mt8]}>
              <View style={styles.labelWithIcon}>
                <Ionicons name="star" size={20} color="#666" />
                <Text style={styles.cycleLabel}>Predicted ovulation</Text>
              </View>
              <Text style={styles.cycleDay}>{getOvulationDay(firstPeriodDate!)}</Text>
            </View>
            <View style={[styles.cycleInfo, styles.mt8]}>
              <View style={styles.labelWithIcon}>
                <Ionicons name="water" size={20} color="#666" />
                <Text style={styles.cycleLabel}>Period started on</Text>
              </View>
              <Text style={styles.cycleDay}>{new Date(firstPeriodDate!).toLocaleDateString()}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.insightsText}>
            Please log at least one finished period to view your cycle insights.
          </Text>
        )}
      </View>

      <PeriodCalendarModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={savePeriodDates}
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F2F7',
    padding: 16,
    gap: 16,
  },
  predictionCard: {
    alignItems: 'center',
    gap: 24,
  },
  predictionCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#FFEAEE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: '#FFADBD',
  },
  predictionLabel: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
  },
  predictionDays: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#000',
  },
  button: {
    backgroundColor: '#4561D2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  insightsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  insightsTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
    color: '#332F49',
  },
  insightsText: {
    color: '#332F49',
    fontSize: 16,
    lineHeight: 22,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  cycleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 8,
  },
  cycleLabel: {
    fontSize: 16,
    color: '#332F49',
  },
  cycleDay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#332F49',
  },
  mt8: {
    marginTop: 2,
  },
  emptyStateText: {
    fontSize: 19,
    fontWeight: '500',
    lineHeight: 24,
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phaseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phaseDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    maxWidth: 200,
  },
});
