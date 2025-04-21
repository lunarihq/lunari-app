import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Pressable,
  FlatList,
  Dimensions
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';

// Symptom type definition
type Item = {
  id: string;
  icon: React.ReactNode;
  name: string;
  selected: boolean;
};

type DayInfo = {
  date: dayjs.Dayjs;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isoDate: string;
};

type WeekData = {
  id: string;
  days: DayInfo[];
  month: string;
};

const WEEK_COUNT = 10; // 5 weeks before and after the current week
const screenWidth = Dimensions.get('window').width;

// Generate weeks data for FlatList
const generateWeeksData = (): WeekData[] => {
  const today = dayjs();
  const weeks: WeekData[] = [];
  
  // Generate weeks (centered around current week)
  for (let weekOffset = -Math.floor(WEEK_COUNT/2); weekOffset < Math.ceil(WEEK_COUNT/2); weekOffset++) {
    // Start with Monday of the current week
    const startOfWeek = today.add(weekOffset * 7, 'day').startOf('week');
    
    const days: DayInfo[] = [];
    for (let i = 0; i < 7; i++) {
      const date = startOfWeek.add(i, 'day');
      days.push({
        date: date,
        dayName: date.format('dd')[0], // First letter of day name (M, T, W, etc.)
        dayNumber: date.date(),
        isToday: date.format('YYYY-MM-DD') === today.format('YYYY-MM-DD'),
        isoDate: date.format('YYYY-MM-DD')
      });
    }
    
    weeks.push({
      id: `week-${weekOffset}`,
      days,
      month: days[0].date.format('MMMM'), // Month name from the first day of week
    });
  }
  
  return weeks;
};

// Check if a date is in the future
const isFutureDate = (dateString: string) => {
  const today = dayjs().format('YYYY-MM-DD');
  return dateString > today;
};

export default function SymptomTracking() {
  const params = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [weeksData, setWeeksData] = useState<WeekData[]>(generateWeeksData());
  const [currentMonth, setCurrentMonth] = useState<string>(dayjs().format('MMMM'));
  const [currentWeekIndex, setCurrentWeekIndex] = useState<number>(Math.floor(WEEK_COUNT/2));
  
  const flatListRef = useRef<FlatList>(null);
  
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

  // Go to today function
  const goToToday = () => {
    const todayIndex = Math.floor(WEEK_COUNT/2); // Center week is the current week
    setCurrentWeekIndex(todayIndex);
    flatListRef.current?.scrollToIndex({ index: todayIndex, animated: true });
    setSelectedDate(dayjs().format('YYYY-MM-DD'));
  };

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
  const selectDay = (isoDate: string) => {
    setSelectedDate(isoDate);
  };

  // Handle week change
  const handleViewableItemsChanged = ({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      const visibleWeek = viewableItems[0].item;
      setCurrentMonth(visibleWeek.month);
      setCurrentWeekIndex(viewableItems[0].index);
    }
  };

  // Render week item for FlatList
  const renderWeekItem = ({ item }: { item: WeekData }) => {
    return (
      <View style={styles.weekContainer}>
        <View style={styles.daysRow}>
          {item.days.map((day, index) => (
            <View key={index} style={styles.dayColumn}>
              <Text style={styles.dayName}>{day.dayName}</Text>
              <TouchableOpacity
                onPress={() => selectDay(day.isoDate)}
                style={[
                  styles.dateCircle,
                  day.isToday && styles.todayCircle,
                  selectedDate === day.isoDate && styles.selectedDateCircle
                ]}
              >
                <Text 
                  style={[
                    styles.dateNumber,
                    day.isToday && styles.todayDateNumber,
                    selectedDate === day.isoDate && styles.selectedDateNumber
                  ]}
                >
                  {day.dayNumber}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
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
        <Text style={styles.headerTitle}>{currentMonth}</Text>
        {currentWeekIndex !== Math.floor(WEEK_COUNT/2) ? (
          <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
            <Text style={styles.todayButtonText}>Today</Text>
          </TouchableOpacity>
        ) : (
          <View style={{width: 50}} />
        )}
      </View>

      {/* Calendar (FlatList) */}
      <View style={styles.calendarContainer}>
        <FlatList
          ref={flatListRef}
          data={weeksData}
          renderItem={renderWeekItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={Math.floor(WEEK_COUNT/2)} // Start at current week
          getItemLayout={(data, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        />
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
  calendarContainer: {
    height: 110,
    backgroundColor: '#F3F2F7',
  },
  weekContainer: {
    width: screenWidth,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  dayColumn: {
    alignItems: 'center',
    width: 40,
  },
  dayName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCircle: {
    borderWidth: 2,
    borderColor: '#4561D2',
  },
  selectedDateCircle: {
    backgroundColor: '#4561D2',
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  todayDateNumber: {
    color: '#4561D2',
  },
  selectedDateNumber: {
    color: '#fff',
  },
  todayButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  todayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4561D2',
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