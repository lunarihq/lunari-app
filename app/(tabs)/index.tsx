import { Text, View, StyleSheet, Modal, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';
import { useState } from 'react';
import { PeriodCalendarModal } from '../../components/PeriodCalendar';

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ [date: string]: any }>({});

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Log in your period dates to get started</Text>
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
        onSave={(dates) => {
          // Handle saving dates here
          setModalVisible(false);
        }}
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
