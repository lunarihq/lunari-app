import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Pressable
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Symptom type definition
type Item = {
  id: string;
  icon: React.ReactNode;
  name: string;
  selected: boolean;
};

// Get current date and week
const getCurrentWeek = () => {
  const today = new Date();
  const day = today.getDay(); // 0 is Sunday, 6 is Saturday
  
  const week = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - day + i);
    week.push({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
      date: date.getDate(),
      full: date.toISOString().split('T')[0],
      isToday: i === day
    });
  }
  return week;
};

// Check if a date is in the future
const isFutureDate = (dateString: string) => {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  return dateString > todayString;
};

export default function SymptomTracking() {
  const params = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [weekDays, setWeekDays] = useState(getCurrentWeek());
  
  // Symptoms data
  const [symptoms, setSymptoms] = useState<Item[]>([
    { 
      id: '1', 
      icon: <FontAwesome5 name="strawberry" size={24} color="#FF5C7F" />,
      name: 'Acne', 
      selected: false 
    },
    { 
      id: '2', 
      icon: <Ionicons name="hammer" size={24} color="#8B572A" />,
      name: 'Headache', 
      selected: false 
    },
    { 
      id: '3', 
      icon: <MaterialCommunityIcons name="head-flash" size={24} color="#E73C3C" />,
      name: 'Migraines', 
      selected: false 
    },
    { 
      id: '4', 
      icon: <MaterialCommunityIcons name="rotate-orbit" size={24} color="#8B572A" />, 
      name: 'Dizziness', 
      selected: false 
    },
  ]);

  // Moods data
  const [moods, setMoods] = useState<Item[]>([
    { 
      id: '1', 
      icon: <Ionicons name="happy" size={24} color="#FFCC00" />, 
      name: 'Angelic', 
      selected: false 
    },
    { 
      id: '2', 
      icon: <Ionicons name="sad" size={24} color="#FFCC00" />, 
      name: 'Angry', 
      selected: false 
    },
    { 
      id: '3', 
      icon: <Ionicons name="help" size={24} color="#FFCC00" />, 
      name: 'Anxious', 
      selected: false 
    },
    { 
      id: '4', 
      icon: <Ionicons name="remove-circle" size={24} color="#FF3B30" />,
      name: 'Ashamed', 
      selected: false 
    },
    { 
      id: '5', 
      icon: <Ionicons name="happy" size={24} color="#FFCC00" />, 
      name: 'Angelic', 
      selected: false 
    },
    { 
      id: '6', 
      icon: <Ionicons name="happy" size={24} color="#FFCC00" />, 
      name: 'Angelic', 
      selected: false 
    },
    { 
      id: '7', 
      icon: <Ionicons name="happy" size={24} color="#FFCC00" />, 
      name: 'Angelic', 
      selected: false 
    },
    { 
      id: '8', 
      icon: <Ionicons name="happy" size={24} color="#FFCC00" />, 
      name: 'Angelic', 
      selected: false 
    },
  ]);

  // Toggle symptom selection
  const toggleSymptom = (id: string) => {
    setSymptoms(symptoms.map(symptom => 
      symptom.id === id ? { ...symptom, selected: !symptom.selected } : symptom
    ));
  };

  // Toggle mood selection
  const toggleMood = (id: string) => {
    setMoods(moods.map(mood => 
      mood.id === id ? { ...mood, selected: !mood.selected } : mood
    ));
  };

  // Select day from calendar
  const selectDay = (day: any) => {
    setSelectedDate(day.full);
  };

  // Save changes
  const saveChanges = () => {
    // Here you would save the selected symptoms and moods to your database
    // For now, we'll just go back to the main screen
    router.back();
  };

  // Check if any symptoms or moods are selected
  const hasSelections = symptoms.some(s => s.selected) || moods.some(m => m.selected);
  
  // Check if selected date is in the future
  const isSelectedDateInFuture = isFutureDate(selectedDate);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {new Date(selectedDate).toLocaleString('default', { month: 'long' })}
        </Text>
        <View style={{width: 28}} />
      </View>

      {/* Calendar */}
      <View style={styles.calendar}>
        {weekDays.map((day, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.dayButton, 
              selectedDate === day.full && styles.selectedDayButton,
              day.isToday && styles.todayButton
            ]}
            onPress={() => selectDay(day)}
          >
            <Text style={styles.dayText}>{day.day}</Text>
            <Text style={[
              styles.dateText, 
              (selectedDate === day.full || day.isToday) && styles.selectedDateText
            ]}>
              {day.date}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView}>
        {isSelectedDateInFuture ? (
          <View style={styles.futureMessageContainer}>
            <Text style={styles.futureMessageText}>
              You can't log symtomps for a future date.
            </Text>
          </View>
        ) : (
          <>
            {/* Symptoms */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Symptoms</Text>
              </View>
              
              <View style={styles.itemsGrid}>
                {symptoms.map((symptom) => (
                  <TouchableOpacity 
                    key={symptom.id} 
                    style={[styles.itemButton, symptom.selected && styles.selectedItemButton]}
                    onPress={() => toggleSymptom(symptom.id)}
                  >
                    <View style={[styles.itemIcon, symptom.selected && styles.selectedItemIcon]}>
                      {symptom.icon}
                    </View>
                    <Text style={styles.itemText}>{symptom.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Moods */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Moods</Text>
              </View>
              
              <View style={styles.itemsGrid}>
                {moods.map((mood) => (
                  <TouchableOpacity 
                    key={mood.id} 
                    style={[styles.itemButton, mood.selected && styles.selectedItemButton]}
                    onPress={() => toggleMood(mood.id)}
                  >
                    <View style={[styles.itemIcon, mood.selected && styles.selectedItemIcon]}>
                      {mood.icon}
                    </View>
                    <Text style={styles.itemText}>{mood.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Save button that appears only when selections are made and not a future date */}
      {hasSelections && !isSelectedDateInFuture && (
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={saveChanges}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#F3F2F7',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dayButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 70,
    borderRadius: 22,
    backgroundColor: '#F9F8D5',
  },
  selectedDayButton: {
    borderWidth: 2,
    borderColor: '#4561D2',
  },
  todayButton: {
    backgroundColor: '#F9F8D5',
  },
  dayText: {
    fontSize: 14,
    color: '#000',
  },
  dateText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  selectedDateText: {
    color: '#000',
  },
  scrollView: {
    flex: 1,
    paddingTop: 16,
  },
  futureMessageContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  futureMessageText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FF597B',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemButton: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedItemButton: {
    opacity: 1,
  },
  itemIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F9F8D5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedItemIcon: {
    borderWidth: 3,
    borderColor: '#FF597B',
    backgroundColor: '#FFECF1',
  },
  itemText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
  saveButton: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    backgroundColor: '#4561D2',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});