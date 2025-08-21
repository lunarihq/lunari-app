import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { db } from '../db';
import { healthLogs } from '../db/schema';
import { eq } from 'drizzle-orm';
import { useFocusEffect } from '@react-navigation/native';
import defaultTheme, { useTheme } from './styles/theme';
import { useNotes } from '../contexts/NotesContext';
import { CustomIcon } from '../components/icons';

// Symptom type definition
type Item = {
  id: string;
  icon: string;
  name: string;
  selected: boolean;
};

//

dayjs.extend(isoWeek);

// leftover types used to render week data were removed

export default function SymptomTracking() {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const { notes, setNotes } = useNotes();
  const ICON_SIZE = 48;
  const [selectedDate, setSelectedDate] = useState<string>(
    // Use the date from params if provided, otherwise use today's date
    typeof params.date === 'string' ? params.date : dayjs().format('YYYY-MM-DD')
  );

  // Track original state to detect changes
  const [originalSymptoms, setOriginalSymptoms] = useState<string[]>([]);
  const [originalMoods, setOriginalMoods] = useState<string[]>([]);
  const [originalFlows, setOriginalFlows] = useState<string[]>([]);
  const [originalNotes, setOriginalNotes] = useState<string>('');
  const [hasChanges, setHasChanges] = useState<boolean>(false);

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
    setSelectedDate(
      dayjs(selectedDate).subtract(1, 'day').format('YYYY-MM-DD')
    );
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
      icon: 'acne',
      name: 'Acne',
      selected: false,
    },
    {
      id: '2',
      icon: 'headache',
      name: 'Headache',
      selected: false,
    },
    {
      id: '3',
      icon: 'cramps',
      name: 'Cramps',
      selected: false,
    },
    {
      id: '4',
      icon: 'dizziness',
      name: 'Dizziness',
      selected: false,
    },
    {
      id: '5',
      icon: 'fatigue',
      name: 'Fatigue',
      selected: false,
    },
    {
      id: '6',
      icon: 'bloating',
      name: 'Bloating',
      selected: false,
    },
    {
      id: '7',
      icon: 'constipation',
      name: 'Constipation',
      selected: false,
    },
    {
      id: '8',
      icon: 'cravings',
      name: 'Cravings',
      selected: false,
    },
  ]);

  // Moods data
  const [moods, setMoods] = useState<Item[]>([
    {
      id: '1',
      icon: 'calm',
      name: 'Calm',
      selected: false,
    },
    {
      id: '2',
      icon: 'happy',
      name: 'Happy',
      selected: false,
    },
    {
      id: '3',
      icon: 'energetic',
      name: 'Energetic',
      selected: false,
    },
    {
      id: '4',
      icon: 'sad',
      name: 'Sad',
      selected: false,
    },

    {
      id: '5',
      icon: 'anxious',
      name: 'Anxious',
      selected: false,
    },
    {
      id: '6',
      icon: 'confused',
      name: 'Confused',
      selected: false,
    },
    {
      id: '7',
      icon: 'irritated',
      name: 'Irritated',
      selected: false,
    },
    {
      id: '8',
      icon: 'angry',
      name: 'Angry',
      selected: false,
    },
    {
      id: '9',
      icon: 'emotional',
      name: 'Emotional',
      selected: false,
    },
  ]);

  // Flows data
  const [flows, setFlows] = useState<Item[]>([
    {
      id: '1',
      icon: 'light',
      name: 'Light',
      selected: false,
    },
    {
      id: '2',
      icon: 'medium',
      name: 'Medium',
      selected: false,
    },
    {
      id: '3',
      icon: 'heavy',
      name: 'Heavy',
      selected: false,
    },
    {
      id: '4',
      icon: 'blood-clots',
      name: 'Blood clots',
      selected: false,
    },
  ]);

  // Load existing health logs when the component mounts or selected date changes
  useEffect(() => {
    const loadExistingHealthLogs = async () => {
      try {
        // Fetch existing entries for the selected date
        const existingEntries = await db
          .select()
          .from(healthLogs)
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
            selected: symptomIds.has(symptom.id),
          }))
        );

        // Update moods state
        setMoods(prevMoods =>
          prevMoods.map(mood => ({
            ...mood,
            selected: moodIds.has(mood.id),
          }))
        );

        // Update flows state
        setFlows(prevFlows =>
          prevFlows.map(flow => ({
            ...flow,
            selected: flowIds.has(flow.id),
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
      } catch (error) {
        console.error('Error loading health logs:', error);
      }
    };

    loadExistingHealthLogs();
  }, [selectedDate, setNotes]);

  // Handle scrollTo parameter to navigate to specific sections
  useEffect(() => {
    if (
      params.scrollTo === 'notes' &&
      scrollViewRef.current &&
      notesSectionRef.current
    ) {
      // Use setTimeout to ensure the component has fully rendered
      setTimeout(() => {
        notesSectionRef.current?.measureLayout(
          scrollViewRef.current as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y, animated: true });
          },
          () => {}
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
    const currentSelectedMoods = moods.filter(m => m.selected).map(m => m.id);

    // Get current selected flow IDs
    const currentSelectedFlows = flows.filter(f => f.selected).map(f => f.id);

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

    setHasChanges(
      symptomsChanged || moodsChanged || flowsChanged || notesChanged
    );
  }, [
    symptoms,
    moods,
    flows,
    notes,
    originalSymptoms,
    originalMoods,
    originalFlows,
    originalNotes,
  ]);

  // Toggle symptom selection
  const toggleSymptom = (id: string) => {
    setSymptoms(
      symptoms.map(symptom =>
        symptom.id === id
          ? { ...symptom, selected: !symptom.selected }
          : symptom
      )
    );
  };

  // Toggle mood selection
  const toggleMood = (id: string) => {
    setMoods(
      moods.map(mood =>
        mood.id === id ? { ...mood, selected: !mood.selected } : mood
      )
    );
  };

  // Toggle flow selection
  const toggleFlow = (id: string) => {
    setFlows(
      flows.map(flow =>
        flow.id === id ? { ...flow, selected: !flow.selected } : flow
      )
    );
  };

  // Get icon color based on type and id
  const getIconColor = (type: 'symptom' | 'mood' | 'flow', id: string) => {
    if (type === 'symptom') {
      return '#8B572A'; // brown for all symptoms
    } else if (type === 'mood') {
      return '#FFCC00'; // standard mood color
    } else if (type === 'flow') {
      return '#FF597B'; // standard flow color
    }
    return '#666';
  };

  // Navigate to notes editor
  const openNotesEditor = () => {
    router.push({
      pathname: '/notes-editor',
      params: { notes: notes },
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
      await db.delete(healthLogs).where(eq(healthLogs.date, selectedDate));

      // STEP 2: Prepare symptom records
      const symptomRecords = selectedSymptoms.map(symptom => {
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
          icon: symptom.icon,
          icon_color: iconColor,
        };
      });

      // STEP 3: Prepare mood records
      const moodRecords = selectedMoods.map(mood => {
        // Use a standard color for all moods
        const iconColor = '#FFCC00';

        return {
          date: selectedDate,
          type: 'mood',
          item_id: mood.id,
          name: mood.name,
          icon: mood.icon,
          icon_color: iconColor,
        };
      });

      // STEP 4: Prepare flow records
      const flowRecords = selectedFlows.map(flow => {
        // Use a standard color for all flows
        const iconColor = '#FF597B';

        return {
          date: selectedDate,
          type: 'flow',
          item_id: flow.id,
          name: flow.name,
          icon: flow.icon,
          icon_color: iconColor,
        };
      });

      // STEP 5: Prepare notes record (only if notes exist)
      const notesRecords = notes.trim()
        ? [
            {
              date: selectedDate,
              type: 'notes',
              item_id: '1',
              name: notes.trim(),
              icon: 'notes',
              icon_color: '#4561D2',
            },
          ]
        : [];

      // STEP 6: Combine all records to insert
      const allRecords = [
        ...symptomRecords,
        ...moodRecords,
        ...flowRecords,
        ...notesRecords,
      ];

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
    <View
      style={[
        defaultTheme.globalStyles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Date Navigation Controls */}
      <View style={styles.dateNavigator}>
        <TouchableOpacity onPress={goToPreviousDay} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={[styles.dateText, { color: colors.textPrimary }]}>
          {selectedDate === dayjs().format('YYYY-MM-DD')
            ? `Today, ${dayjs(selectedDate).format('MMMM D')}`
            : dayjs(selectedDate).format('dddd, MMMM D')}
        </Text>

        <TouchableOpacity
          onPress={goToNextDay}
          style={[
            styles.headerButton,
            isNextDayDisabled() && styles.disabledButton,
          ]}
          disabled={isNextDayDisabled()}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={isNextDayDisabled() ? colors.textMuted : colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Flow */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Flow
            </Text>
          </View>

          <View style={styles.itemsGrid}>
            {flows.map(flow => (
              <TouchableOpacity
                key={flow.id}
                style={[
                  styles.itemButton,
                  flow.selected && styles.selectedItemButton,
                ]}
                onPress={() => toggleFlow(flow.id)}
              >
                <View
                  style={[
                    styles.itemIcon,
                    flow.selected && {
                      ...styles.selectedItemIcon,
                      borderColor: colors.primary,
                      backgroundColor: colors.primaryLight,
                    },
                  ]}
                >
                  <CustomIcon 
                    name={flow.icon as any}
                    size={ICON_SIZE}
                    color={getIconColor('flow', flow.id)}
                  />
                </View>
                <Text
                  style={[styles.itemText, { color: colors.textSecondary }]}
                >
                  {flow.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* Symptoms */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Symptoms
            </Text>
          </View>

          <View style={styles.itemsGrid}>
            {symptoms.map(symptom => (
              <TouchableOpacity
                key={symptom.id}
                style={[
                  styles.itemButton,
                  symptom.selected && styles.selectedItemButton,
                ]}
                onPress={() => toggleSymptom(symptom.id)}
              >
                <View
                  style={[
                    styles.itemIcon,
                    symptom.selected && {
                      ...styles.selectedItemIcon,
                      borderColor: colors.primary,
                      backgroundColor: colors.primaryLight,
                    },
                  ]}
                >
                  <CustomIcon 
                    name={symptom.icon as any}
                    size={ICON_SIZE}
                    color={getIconColor('symptom', symptom.id)}
                  />
                </View>
                <Text
                  style={[styles.itemText, { color: colors.textSecondary }]}
                >
                  {symptom.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Moods */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Moods
            </Text>
          </View>

          <View style={styles.itemsGrid}>
            {moods.map(mood => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.itemButton,
                  mood.selected && styles.selectedItemButton,
                ]}
                onPress={() => toggleMood(mood.id)}
              >
                <View
                  style={[
                    styles.itemIcon,
                    mood.selected && {
                      ...styles.selectedItemIcon,
                      borderColor: colors.primary,
                      backgroundColor: colors.primaryLight,
                    },
                  ]}
                >
                  <CustomIcon 
                    name={mood.icon as any}
                    size={ICON_SIZE}
                    color={getIconColor('mood', mood.id)}
                  />
                </View>
                <Text
                  style={[styles.itemText, { color: colors.textSecondary }]}
                >
                  {mood.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View
          ref={notesSectionRef}
          style={[styles.section, { backgroundColor: colors.surface }]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Notes
            </Text>
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
              <Text
                style={[styles.notesText, { color: colors.textPrimary }]}
                numberOfLines={3}
              >
                {notes}
              </Text>
            ) : (
              <Text
                style={[styles.notesPlaceholder, { color: colors.textMuted }]}
              >
                Add notes about your day...
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Save button that appears only when changes are made */}
      {hasChanges && (
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={saveChanges}
          activeOpacity={0.8}
        >
          <Text style={[styles.saveButtonText, { color: colors.white }]}>
            Save
          </Text>
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 80,
  },

  section: {
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
    borderWidth: 1.5,
  },
  itemText: {
    textAlign: 'center',
    fontSize: 12,
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
  },
  notesPlaceholder: {
    flex: 1,
    fontSize: 16,
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
    fontSize: 18,
    fontWeight: '600',
  },
});
