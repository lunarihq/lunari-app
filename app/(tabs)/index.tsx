import { Text, View, StyleSheet, Modal, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';
import { useState, useEffect } from 'react';
import { PeriodCalendarModal } from '../../components/PeriodCalendar';
import { db } from '../../db';
import { PeriodDate, periodDates } from '../../db/schema';

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ [date: string]: any }>({});
  const [firstPeriodDate, setFirstPeriodDate] = useState<string | null>(null);

  useEffect(() => {
    const setup = async () => {
      await loadSavedDates();
    };
    setup();
  }, []);

  const loadSavedDates = async () => {
    const saved = await db.select().from(periodDates);
    
    const dates = saved.reduce((acc: { [key: string]: any }, curr: PeriodDate) => { 
      acc[curr.date] = { selected: true, selectedColor: '#FF597B' };
      return acc;
    }, {} as { [key: string]: any });
    
    setSelectedDates(dates);
    
    if (saved.length > 0) {
      const sortedDates = saved.map(s => s.date).sort();
      setFirstPeriodDate(sortedDates[0]);
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
      }
      
      setSelectedDates(dates);
      setFirstPeriodDate(dateInserts.length > 0 ? Object.keys(dates).sort()[0] : null);
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
        <Text style={styles.insightsText}>
          Once you have log in your first period cycle we'll display the insights.
        </Text>
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
});
