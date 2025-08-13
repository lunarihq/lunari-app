import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { db } from '../db';
import { healthLogs } from '../db/schema';
import { eq } from 'drizzle-orm';
import { useFocusEffect } from '@react-navigation/native';
import theme from './styles/theme';
import Colors from './styles/colors';
import { useNotes } from '../contexts/NotesContext';

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

dayjs.extend(isoWeek);

// Generate weeks data for FlatList
const generateWeeksData = (): WeekData[] => {
  const today = dayjs();
  const weeks: WeekData[] = [];
  
  // Generate weeks (centered around current week)
  for (let weekOffset = -Math.floor(WEEK_COUNT/2); weekOffset < Math.ceil(WEEK_COUNT/2); weekOffset++) {
    // Start with Monday of the current week (ISO week)
    const startOfWeek = today.add(weekOffset * 7, 'day').startOf('isoWeek');
    
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

export default function SymptomTracking() {
  const params = useLocalSearchParams();
  const { notes, setNotes } = useNotes();
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
  const [originalFlows, setOriginalFlows] = useState<string[]>([]);
  const [originalNotes, setOriginalNotes] = useState<string>('');
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  
  const flatListRef = useRef<FlatList>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const notesSectionRef = useRef<View>(null);
  
  // Update header title on focused
  useFocusEffect(
    React.useCallback(() => {
      const isToday = selectedDate === dayjs().format('YYYY-MM-DD');
      const formattedDate = isToday 
        ? `Today, ${dayjs(selectedDate).format('MMMM D')}` 
        : dayjs(selectedDate).format('dddd, MMMM D');
      
      // If possible, update the header title
      if (router.canGoBack()) {
        router.setParams({ title: formattedDate });
      }
      
      return () => {};
    }, [selectedDate])
  );
  
  // Navigate to previous day
  const goToPreviousDay = () => {
    setSelectedDate(dayjs(selectedDate).subtract(1, 'day').format('YYYY-MM-DD'));
  };
  
  // Navigate to next day
  const goToNextDay = () => {
    const nextDay = dayjs(selectedDate).add(1, 'day');
    const today = dayjs();
    
    // Don't allow navigating to future dates
    if (!nextDay.isAfter(today, 'day')) {
      setSelectedDate(nextDay.format('YYYY-MM-DD'));
    }
  };

  // Check if next day would be in the future
  const isNextDayDisabled = () => {
    const nextDay = dayjs(selectedDate).add(1, 'day');
    const today = dayjs();
    return nextDay.isAfter(today, 'day');
  };

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
      icon: '🦵',
      name: 'Cramps', 
      selected: false 
    },
    { 
      id: '4', 
      icon: '💫', 
      name: 'Dizziness', 
      selected: false 
    },
    { 
      id: '5', 
      icon: '💤', 
      name: 'Fatigue', 
      selected: false 
    },
    { 
      id: '6', 
      icon: '🫄', 
      name: 'Bloating', 
      selected: false 
    },
    { 
      id: '7', 
      icon: '😬', 
      name: 'Constipation', 
      selected: false 
    },
    { 
      id: '8', 
      icon: '🍔', 
      name: 'Cravings', 
      selected: false 
    },
    
  ]);

  // Moods data
  const [moods, setMoods] = useState<Item[]>([
    { 
      id: '1', 
      icon: '😌', 
      name: 'Calm', 
      selected: false 
    },
    { 
      id: '2', 
      icon: '😀', 
      name: 'Happy', 
      selected: false 
    },
    { 
      id: '3', 
      icon: '💪', 
      name: 'Energetic', 
      selected: false 
    },
    { 
      id: '4', 
      icon: '😥', 
      name: 'Sad', 
      selected: false 
    },
    
    { 
      id: '5', 
      icon: '😰', 
      name: 'Anxious', 
      selected: false 
    },
    { 
      id: '6', 
      icon: '😕', 
      name: 'Confused', 
      selected: false 
    },
    { 
      id: '7', 
      icon: '😖', 
      name: 'Irritated', 
      selected: false 
    },
    { 
      id: '8', 
      icon: '😠', 
      name: 'Angry', 
      selected: false 
    },
    { 
      id: '9', 
      icon: '😭', 
      name: 'Emotional', 
      selected: false 
    },
    
  ]);

  // Flows data
  const [flows, setFlows] = useState<Item[]>([
    { 
      id: '1', 
      icon: '💧',
      name: 'Light', 
      selected: false 
    },
    { 
      id: '2', 
      icon: '💧',
      name: 'Medium', 
      selected: false 
    },
    { 
      id: '3', 
      icon: '💧',
      name: 'Heavy', 
      selected: false 
    },
    { 
      id: '4', 
      icon: '💧',
      name: 'Blood clots', 
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
        const flowIds = new Set();
        let notesText = '';
        
        // Populate the sets
        existingEntries.forEach(entry => {
          if (entry.type === 'symptom') {
            symptomIds.add(entry.item_id);
          } else if (entry.type === 'mood') {
            moodIds.add(entry.item_id);
          } else if (entry.type === 'flow') {
            flowIds.add(entry.item_id);
          } else if (entry.type === 'notes') {
            notesText = entry.name || '';
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
        
        // Update flows state
        setFlows(prevFlows => 
          prevFlows.map(flow => ({
            ...flow,
            selected: flowIds.has(flow.id)
          }))
        );
        
        // Update notes state
        setNotes(notesText);
        
        // Store original state for comparison
        setOriginalSymptoms(Array.from(symptomIds) as string[]);
        setOriginalMoods(Array.from(moodIds) as string[]);
        setOriginalFlows(Array.from(flowIds) as string[]);
        setOriginalNotes(notesText);
        setHasChanges(false);
        
        console.log(`Loaded ${symptomIds.size} symptoms, ${moodIds.size} moods, ${flowIds.size} flows, and notes for ${selectedDate}`);
      } catch (error) {
        console.error('Error loading health logs:', error);
      }
    };
    
    loadExistingHealthLogs();
  }, [selectedDate, setNotes]);

  // Handle scrollTo parameter to navigate to specific sections
  useEffect(() => {
    if (params.scrollTo === 'notes' && scrollViewRef.current && notesSectionRef.current) {
      // Use setTimeout to ensure the component has fully rendered
      setTimeout(() => {
        notesSectionRef.current?.measureLayout(
          scrollViewRef.current as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y, animated: true });
          },
          () => {
            console.log('Failed to measure notes section position');
          }
        );
      }, 100);
    }
  }, [params.scrollTo]);
  
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
    
    // Get current selected flow IDs
    const currentSelectedFlows = flows
      .filter(f => f.selected)
      .map(f => f.id);
    
    // Check if the selections have changed
    const symptomsChanged = !(
      currentSelectedSymptoms.length === originalSymptoms.length &&
      currentSelectedSymptoms.every(id => originalSymptoms.includes(id))
    );
    
    const moodsChanged = !(
      currentSelectedMoods.length === originalMoods.length &&
      currentSelectedMoods.every(id => originalMoods.includes(id))
    );
    
    const flowsChanged = !(
      currentSelectedFlows.length === originalFlows.length &&
      currentSelectedFlows.every(id => originalFlows.includes(id))
    );
    
    const notesChanged = notes !== originalNotes;
    
    setHasChanges(symptomsChanged || moodsChanged || flowsChanged || notesChanged);
  }, [symptoms, moods, flows, notes, originalSymptoms, originalMoods, originalFlows, originalNotes]);

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

  // Toggle flow selection
  const toggleFlow = (id: string) => {
    setFlows(flows.map(flow => 
      flow.id === id ? { ...flow, selected: !flow.selected } : flow
    ));
  };

  // Navigate to notes editor
  const openNotesEditor = () => {
    router.push({
      pathname: '/notes-editor',
      params: { notes: notes }
    });
  };

  // Save changes
  const saveChanges = async () => {
    try {
      // Get all selected symptoms and moods
      const selectedSymptoms = symptoms.filter(s => s.selected);
      const selectedMoods = moods.filter(m => m.selected);
      const selectedFlows = flows.filter(f => f.selected);
      
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
      
      // STEP 4: Prepare flow records
      const flowRecords = selectedFlows.map(flow => {
        // Get the emoji as string
        const emoji = String(flow.icon);
        
        // Use a standard color for all flows
        const iconColor = '#FF597B';
        
        return {
          date: selectedDate,
          type: 'flow',
          item_id: flow.id,
          name: flow.name,
          icon: emoji,
          icon_color: iconColor
        };
      });
      
      // STEP 5: Prepare notes record (only if notes exist)
      const notesRecords = notes.trim() ? [{
        date: selectedDate,
        type: 'notes',
        item_id: '1',
        name: notes.trim(),
        icon: '📝',
        icon_color: '#4561D2'
      }] : [];
      
      // STEP 6: Combine all records to insert
      const allRecords = [...symptomRecords, ...moodRecords, ...flowRecords, ...notesRecords];
      
      // STEP 7: Insert new records (only if there are any)
      if (allRecords.length > 0) {
        await db.insert(healthLogs).values(allRecords);
      }
      
      // STEP 8: Navigate back
      router.back();
    } catch (error) {
      console.error('Error saving health logs:', error);
    }
  };

  return (
    <View style={theme.globalStyles.container}>
      {/* Date Navigation Controls */}
      <View style={styles.dateNavigator}>
        <TouchableOpacity 
          onPress={goToPreviousDay}
          style={styles.headerButton}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.dateText}>
          {selectedDate === dayjs().format('YYYY-MM-DD')
            ? `Today, ${dayjs(selectedDate).format('MMMM D')}`
            : dayjs(selectedDate).format('dddd, MMMM D')
          }
        </Text>
        
        <TouchableOpacity 
          onPress={goToNextDay}
          style={[styles.headerButton, isNextDayDisabled() && styles.disabledButton]}
          disabled={isNextDayDisabled()}
        >
          <Ionicons name="chevron-forward" size={24} color={isNextDayDisabled() ? '#CCC' : Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Flow */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Flow</Text>
            </View>
            
            <View style={styles.itemsGrid}>
              {flows.map((flow) => (
                <TouchableOpacity 
                  key={flow.id} 
                  style={[styles.itemButton, flow.selected && styles.selectedItemButton]}
                  onPress={() => toggleFlow(flow.id)}
                >
                  <View style={[styles.itemIcon, flow.selected && styles.selectedItemIcon]}>
                    <Text style={styles.emojiText}>{flow.icon}</Text>
                  </View>
                  <Text style={styles.itemText}>{flow.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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

          {/* Notes */}
          <View ref={notesSectionRef} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <View style={styles.notesIconsContainer}>
                {notes.trim() && (
                  <TouchableOpacity 
                    style={styles.notesIcon}
                    onPress={() => setNotes('')}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={24} color="#999" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={styles.notesIcon}
                  onPress={openNotesEditor}
                  activeOpacity={0.7}
                >
                  <Ionicons name="create-outline" size={24} color="#999" />
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.notesContainer}
              onPress={openNotesEditor}
              activeOpacity={0.7}
            >
              {notes.trim() ? (
                <Text style={styles.notesText} numberOfLines={3}>
                  {notes}
                </Text>
              ) : (
                <Text style={styles.notesPlaceholder}>
                  Add notes about your day...
                </Text>
              )}
            </TouchableOpacity>
          </View>
      </ScrollView>

      {/* Save button that appears only when changes are made */}
      {hasChanges && (
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

  headerButton: {
    padding: 10,
  },
  disabledButton: { opacity: 0.5 },
  dateNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 80,
  },

  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
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
    fontSize: 22,
    fontWeight: '600',
    color: Colors.black,
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
    width: 56,
    height: 56,
    borderRadius: 30,
    backgroundColor: '#F9F8D5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedItemIcon: {
    borderWidth: 3,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  itemText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emojiText: {
    fontSize: 28,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    minHeight: 60,
  },
  notesText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  notesPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  notesIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notesIcon: {
    marginLeft: 16,
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