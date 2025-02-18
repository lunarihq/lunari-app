import { Text, View, StyleSheet, Modal, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';
import { useState, useEffect } from 'react';
import { PeriodCalendarModal } from '../../components/PeriodCalendar';
import { db } from '../../db';
import { PeriodDate, periodDates } from '../../db/schema';

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

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ [date: string]: any }>({});
  const [firstPeriodDate, setFirstPeriodDate] = useState<string | null>(null);
  const [currentCycleDay, setCurrentCycleDay] = useState<number | null>(null);

  useEffect(() => {
    const setup = async () => {
      await loadSavedDates();
    };
    setup();
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

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {firstPeriodDate 
            ? `Your period started on ${new Date(firstPeriodDate).toLocaleDateString()}`
            : 'Log in your period dates to get started'}
        </Text>
        <Pressable onPress={() => setModalVisible(true)} style={styles.button}>
          <Text style={styles.buttonText}>Log in your period</Text>
        </Pressable>
      </View>

      <View style={styles.insightsCard}>
        <Text style={styles.insightsTitle}>Today insights</Text>
        {currentCycleDay ? (
          <>
            <View style={styles.cycleInfo}>
              <Text style={styles.cycleLabel}>Current cycle</Text>
              <Text style={styles.cycleDay}>Day {currentCycleDay}</Text>
            </View>
            <View style={[styles.cycleInfo, styles.mt8]}>
              <Text style={styles.cycleLabel}>Pregnancy chance</Text>
              <Text style={[
                styles.cycleDay,
                styles[`chance${getPregnancyChance(currentCycleDay)}` as keyof typeof styles]
              ]}>
                {getPregnancyChance(currentCycleDay)}
              </Text>
            </View>
            <View style={[styles.cycleInfo, styles.mt8]}>
              <Text style={styles.cycleLabel}>Predicted ovulation</Text>
              <Text style={styles.cycleDay}>{getOvulationDay(firstPeriodDate!)}</Text>
            </View>
            <View style={[styles.cycleInfo, styles.mt8]}>
              <Text style={styles.cycleLabel}>Period started on</Text>
              <Text style={styles.cycleDay}>{new Date(firstPeriodDate!).toLocaleDateString()}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.insightsText}>
            Once you have log in your first period cycle we'll display the insights.
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
    backgroundColor: '#f4f4f4',
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#e8e8e8',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    color: '#fff',
    fontSize: 16,
  },
  insightsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  insightsText: {
    color: '#666',
    fontSize: 16,
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
    textAlign: 'center',
  },
  cycleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  cycleLabel: {
    fontSize: 16,
    color: '#000',
  },
  cycleDay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  mt8: {
    marginTop: 8,
  },
  chanceHigh: {
    color: '#FF597B',
  },
  chanceMedium: {
    color: '#FFA07A',
  },
  chanceLow: {
    color: '#90EE90',
  },
});
