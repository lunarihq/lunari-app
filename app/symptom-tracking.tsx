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
import dayjs from 'dayjs';
import { db } from '../db';
import { healthLogs } from '../db/schema';
import { sql, eq, inArray } from 'drizzle-orm';

// Symptom type definition
type Item = {
  id: string;
  icon: React.ReactNode | string;
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

// Date Navigator Component
const DateNavigator = ({ selectedDate, setSelectedDate }: { 
  selectedDate: string, 
  setSelectedDate: React.Dispatch<React.SetStateAction<string>> 
}) => {
  const today = dayjs();
  const isToday = selectedDate === today.format('YYYY-MM-DD');
  
  const formattedDate = isToday 
    ? `Today, ${dayjs(selectedDate).format('MMMM D')}` 
    : dayjs(selectedDate).format('dddd, MMMM D');
  
  const goToPreviousDay = () => {
    setSelectedDate(dayjs(selectedDate).subtract(1, 'day').format('YYYY-MM-DD'));
  };
  
  const goToNextDay = () => {
    setSelectedDate(dayjs(selectedDate).add(1, 'day').format('YYYY-MM-DD'));
  };
  
  const isNextDayInFuture = dayjs(selectedDate).add(1, 'day').isAfter(today, 'day');
  
  return (
    <View style={styles.dateNavigator}>
      <TouchableOpacity 
        onPress={goToPreviousDay} 
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      >
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>
      
      <Text style={styles.dateText}>{formattedDate}</Text>
      
      <TouchableOpacity 
        onPress={goToNextDay}
        disabled={isNextDayInFuture}
        style={{opacity: isNextDayInFuture ? 0.3 : 1}}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      >
        <Ionicons name="chevron-forward" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

// Check if a date is in the future
const isFutureDate = (dateString: string) => {
  const today = dayjs().format('YYYY-MM-DD');
  return dateString > today;
};

export default function SymptomTracking() {
  const params = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState<string>(
    // Use the date from params if provided, otherwise use today's date
    typeof params.date === 'string' ? params.date : dayjs().format('YYYY-MM-DD')
  );
  const [weeksData, setWeeksData] = useState<WeekData[]>(generateWeeksData());
  const [currentMonth, setCurrentMonth] = useState<string>(dayjs().format('MMMM'));
  const [currentWeekIndex, setCurrentWeekIndex] = useState<number>(Math.floor(WEEK_COUNT/2));
  // Track original state to detect changes
  const [originalSymptoms, setOriginalSymptoms] = useState<string[]>([]);
  const [originalMoods, setOriginalMoods] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  
  const flatListRef = useRef<FlatList>(null);
  
  // Symptoms data
  const [symptoms, setSymptoms] = useState<Item[]>([
    { 
      id: '1', 
      icon: '🍓',
      name: 'Acne', 
      selected: false 
    },
    { 
      id: '2', 
      icon: '🔨',
      name: 'Headache', 
      selected: false 
    },
    { 
      id: '3', 
      icon: '⚡',
      name: 'Migraines', 
      selected: false 
    },
    { 
      id: '4', 
      icon: '💫', 
      name: 'Dizziness', 
      selected: false 
    },
  ]);

  // Moods data
  const [moods, setMoods] = useState<Item[]>([
    { 
      id: '1', 
      icon: '👼', 
      name: 'Angelic', 
      selected: false 
    },
    { 
      id: '2', 
      icon: '🤬', 
      name: 'Angry', 
      selected: false 
    },
    { 
      id: '3', 
      icon: '🤔', 
      name: 'Anxious', 
      selected: false 
    },
    { 
      id: '4', 
      icon: '🤷‍♂️', 
      name: 'Ashamed', 
      selected: false 
    },
    { 
      id: '5', 
      icon: '👼', 
      name: 'Angelic', 
      selected: false 
    },
    { 
      id: '6', 
      icon: '👼', 
      name: 'Angelic', 
      selected: false 
    },
    { 
      id: '7', 
      icon: '👼', 
      name: 'Angelic', 
      selected: false 
    },
    { 
      id: '8', 
      icon: '👼', 
      name: 'Angelic', 
      selected: false 
    },
  ]);

  // Load existing health logs when the component mounts or selected date changes
  useEffect(() => {
    const loadExistingHealthLogs = async () => {
      try {
        // Fetch existing entries for the selected date
        const existingEntries = await db.select().from(healthLogs)
          .where(eq(healthLogs.date, selectedDate));
        
        // Create sets for quick lookup
        const symptomIds = new Set();
        const moodIds = new Set();
        
        // Populate the sets
        existingEntries.forEach(entry => {
          if (entry.type === 'symptom') {
            symptomIds.add(entry.item_id);
          } else if (entry.type === 'mood') {
            moodIds.add(entry.item_id);
          }
        });
        
        // Update symptoms state
        setSymptoms(prevSymptoms => 
          prevSymptoms.map(symptom => ({
            ...symptom,
            selected: symptomIds.has(symptom.id)
          }))
        );
        
        // Update moods state
        setMoods(prevMoods => 
          prevMoods.map(mood => ({
            ...mood,
            selected: moodIds.has(mood.id)
          }))
        );
        
        // Store original state for comparison
        setOriginalSymptoms(Array.from(symptomIds) as string[]);
        setOriginalMoods(Array.from(moodIds) as string[]);
        setHasChanges(false);
        
        console.log(`Loaded ${symptomIds.size} symptoms and ${moodIds.size} moods for ${selectedDate}`);
      } catch (error) {
        console.error('Error loading health logs:', error);
      }
    };
    
    loadExistingHealthLogs();
  }, [selectedDate]);
  
  // Check for changes compared to original state
  useEffect(() => {
    // Get current selected symptom IDs
    const currentSelectedSymptoms = symptoms
      .filter(s => s.selected)
      .map(s => s.id);
    
    // Get current selected mood IDs
    const currentSelectedMoods = moods
      .filter(m => m.selected)
      .map(m => m.id);
    
    // Check if the selections have changed
    const symptomsChanged = !(
      currentSelectedSymptoms.length === originalSymptoms.length &&
      currentSelectedSymptoms.every(id => originalSymptoms.includes(id))
    );
    
    const moodsChanged = !(
      currentSelectedMoods.length === originalMoods.length &&
      currentSelectedMoods.every(id => originalMoods.includes(id))
    );
    
    setHasChanges(symptomsChanged || moodsChanged);
  }, [symptoms, moods, originalSymptoms, originalMoods]);

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

  // Save changes
  const saveChanges = async () => {
    try {
      // Get all selected symptoms and moods
      const selectedSymptoms = symptoms.filter(s => s.selected);
      const selectedMoods = moods.filter(m => m.selected);
      
      // STEP 1: Delete ALL existing entries for this date
      await db.delete(healthLogs)
        .where(eq(healthLogs.date, selectedDate));
      
      // STEP 2: Prepare symptom records
      const symptomRecords = selectedSymptoms.map(symptom => {
        // Get the emoji as string
        const emoji = String(symptom.icon);
        let iconColor = '';
        
        if (symptom.id === '1') {
          iconColor = '#FF5C7F';
        } else if (symptom.id === '2') {
          iconColor = '#8B572A';
        } else if (symptom.id === '3') {
          iconColor = '#E73C3C';
        } else if (symptom.id === '4') {
          iconColor = '#8B572A';
        }
        
        return {
          date: selectedDate,
          type: 'symptom',
          item_id: symptom.id,
          name: symptom.name,
          icon: emoji,
          icon_color: iconColor
        };
      });
      
      // STEP 3: Prepare mood records
      const moodRecords = selectedMoods.map(mood => {
        // Get the emoji as string
        const emoji = String(mood.icon);
        
        // Use a standard color for all moods
        const iconColor = '#FFCC00';
        
        return {
          date: selectedDate,
          type: 'mood',
          item_id: mood.id,
          name: mood.name,
          icon: emoji,
          icon_color: iconColor
        };
      });
      
      // STEP 4: Combine all records to insert
      const allRecords = [...symptomRecords, ...moodRecords];
      
      // STEP 5: Insert new records (only if there are any)
      if (allRecords.length > 0) {
        await db.insert(healthLogs).values(allRecords);
      }
      
      // STEP 6: Navigate back
      router.back();
    } catch (error) {
      console.error('Error saving health logs:', error);
    }
  };

  // Check if selected date is in the future
  const isSelectedDateInFuture = isFutureDate(selectedDate);

  return (
    <View style={styles.container}>
      {/* Date Navigator */}
      <DateNavigator
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

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
                      <Text style={styles.emojiText}>{symptom.icon}</Text>
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
                      <Text style={styles.emojiText}>{mood.icon}</Text>
                    </View>
                    <Text style={styles.itemText}>{mood.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Save button that appears only when changes are made and not a future date */}
      {hasChanges && !isSelectedDateInFuture && (
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
  dateNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 35,
    backgroundColor: '#F3F2F7',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
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
  emojiText: {
    fontSize: 24,
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