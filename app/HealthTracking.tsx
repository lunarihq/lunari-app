import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Button } from '../components/Button';
import { router, useLocalSearchParams } from 'expo-router';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { db } from '../db';
import { healthLogs, periodDates } from '../db/schema';
import { eq } from 'drizzle-orm';
import { useFocusEffect } from '@react-navigation/native';
import defaultTheme, { useTheme, createTypography } from '../styles/theme';
import { useNotes } from '../contexts/NotesContext';
import Toast from 'react-native-toast-message';
import { formatTodayOrDate } from '../utils/localeUtils';
import { useTranslation } from 'react-i18next';
import {
  SYMPTOMS,
  MOODS,
  FLOWS,
  DISCHARGES,
  SELECTION_COLORS,
} from '../constants/healthTracking';
import { HealthItemGrid } from '../components/HealthItemGrid';
import { DateNavigator } from '../components/DateNavigator';
import { CycleIcon as DeleteIcon } from '../components/icons/general/delete';
import { CycleIcon as EditIcon } from '../components/icons/general/edit';

dayjs.extend(isoWeek);

// leftover types used to render week data were removed

export default function HealthTracking() {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const { t } = useTranslation(['common', 'health']);
  const params = useLocalSearchParams();
  const { notes, setNotes } = useNotes();
  const ICON_SIZE = 50;

  const [selectedDate, setSelectedDate] = useState<string>(
    typeof params.date === 'string' ? params.date : dayjs().format('YYYY-MM-DD')
  );

  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(
    new Set()
  );
  const [selectedMoods, setSelectedMoods] = useState<Set<string>>(new Set());
  const [selectedFlows, setSelectedFlows] = useState<Set<string>>(new Set());
  const [selectedDischarges, setSelectedDischarges] = useState<Set<string>>(
    new Set()
  );

  const [originalSymptoms, setOriginalSymptoms] = useState<Set<string>>(
    new Set()
  );
  const [originalMoods, setOriginalMoods] = useState<Set<string>>(new Set());
  const [originalFlows, setOriginalFlows] = useState<Set<string>>(new Set());
  const [originalDischarges, setOriginalDischarges] = useState<Set<string>>(
    new Set()
  );
  const [originalNotes, setOriginalNotes] = useState<string>('');
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const [isPeriodDate, setIsPeriodDate] = useState<boolean>(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const notesSectionRef = useRef<View>(null);

  // Update header title on focused
  useFocusEffect(
    React.useCallback(() => {
      const formattedDate = formatTodayOrDate(selectedDate);

      // If possible, update the header title
      if (router.canGoBack()) {
        router.setParams({ title: formattedDate });
      }

      return () => {};
    }, [selectedDate])
  );

  // Handle date change from DateNavigator
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
  };
  const checkIsPeriodDate = async (date: string) => {
    try {
      const result = await db
        .select()
        .from(periodDates)
        .where(eq(periodDates.date, date));
      setIsPeriodDate(result.length > 0);
    } catch (error) {
      console.error('Error checking period date:', error);
      setIsPeriodDate(false);
    }
  };

  useEffect(() => {
    const loadExistingHealthLogs = async () => {
      try {
        await checkIsPeriodDate(selectedDate);

        const existingEntries = await db
          .select()
          .from(healthLogs)
          .where(eq(healthLogs.date, selectedDate));

        const symptomIds = new Set<string>();
        const moodIds = new Set<string>();
        const flowIds = new Set<string>();
        const dischargeIds = new Set<string>();
        let notesText = '';

        existingEntries.forEach(entry => {
          if (entry.type === 'symptom') {
            symptomIds.add(entry.item_id);
          } else if (entry.type === 'mood') {
            moodIds.add(entry.item_id);
          } else if (entry.type === 'flow') {
            flowIds.add(entry.item_id);
          } else if (entry.type === 'discharge') {
            dischargeIds.add(entry.item_id);
          } else if (entry.type === 'notes') {
            notesText = entry.name || '';
          }
        });

        setSelectedSymptoms(symptomIds);
        setSelectedMoods(moodIds);
        setSelectedFlows(flowIds);
        setSelectedDischarges(dischargeIds);
        setNotes(notesText);

        setOriginalSymptoms(new Set(symptomIds));
        setOriginalMoods(new Set(moodIds));
        setOriginalFlows(new Set(flowIds));
        setOriginalDischarges(new Set(dischargeIds));
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

  useEffect(() => {
    const areSetsEqual = (a: Set<string>, b: Set<string>) => {
      if (a.size !== b.size) return false;
      for (const item of a) {
        if (!b.has(item)) return false;
      }
      return true;
    };

    const symptomsChanged = !areSetsEqual(selectedSymptoms, originalSymptoms);
    const moodsChanged = !areSetsEqual(selectedMoods, originalMoods);
    const flowsChanged = !areSetsEqual(selectedFlows, originalFlows);
    const dischargesChanged = !areSetsEqual(
      selectedDischarges,
      originalDischarges
    );
    const notesChanged = notes !== originalNotes;

    setHasChanges(
      symptomsChanged ||
        moodsChanged ||
        flowsChanged ||
        dischargesChanged ||
        notesChanged
    );
  }, [
    selectedSymptoms,
    selectedMoods,
    selectedFlows,
    selectedDischarges,
    notes,
    originalSymptoms,
    originalMoods,
    originalFlows,
    originalDischarges,
    originalNotes,
  ]);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleMood = (id: string) => {
    setSelectedMoods(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleFlow = (id: string) => {
    setSelectedFlows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleDischarge = (id: string) => {
    setSelectedDischarges(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Navigate to notes editor
  const openNotesEditor = () => {
    router.push({
      pathname: '/notes-editor',
      params: { notes: notes },
    });
  };

  const saveChanges = async () => {
    try {
      await db.delete(healthLogs).where(eq(healthLogs.date, selectedDate));

      const allRecords = [];

      for (const id of selectedSymptoms) {
        allRecords.push({
          date: selectedDate,
          type: 'symptom',
          item_id: id,
        });
      }

      for (const id of selectedMoods) {
        allRecords.push({
          date: selectedDate,
          type: 'mood',
          item_id: id,
        });
      }

      for (const id of selectedFlows) {
        allRecords.push({
          date: selectedDate,
          type: 'flow',
          item_id: id,
        });
      }

      for (const id of selectedDischarges) {
        allRecords.push({
          date: selectedDate,
          type: 'discharge',
          item_id: id,
        });
      }

      if (notes.trim()) {
        allRecords.push({
          date: selectedDate,
          type: 'notes',
          item_id: 'note',
          name: notes.trim(),
        });
      }

      if (allRecords.length > 0) {
        await db.insert(healthLogs).values(allRecords);
      }

      Toast.show({
        type: 'success',
        text1: t('health:tracking.successMessage'),
        visibilityTime: 3000,
      });

      router.back();
    } catch (error) {
      console.error('Error saving health logs:', error);

      Toast.show({
        type: 'error',
        text1: t('health:tracking.errorMessage'),
        visibilityTime: 3000,
      });
    }
  };

  return (
    <View
      style={[
        defaultTheme.globalStyles.container,
        { backgroundColor: colors.background },
      ]}
    >

      <DateNavigator
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        maxDate={dayjs().format('YYYY-MM-DD')}
      />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isPeriodDate && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={styles.sectionHeader}>
              <Text style={[typography.heading2]}>
                {t('health:tracking.flow')}
              </Text>
            </View>

            <HealthItemGrid
              items={FLOWS}
              selectedIds={selectedFlows}
              onToggle={toggleFlow}
              translationKey="health:flows"
              selectionColor={SELECTION_COLORS.flow}
              iconSize={ICON_SIZE}
            />
          </View>
        )}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[typography.heading2]}>
              {t('health:tracking.symptoms')}
            </Text>
          </View>

          <HealthItemGrid
            items={SYMPTOMS}
            selectedIds={selectedSymptoms}
            onToggle={toggleSymptom}
            translationKey="health:symptoms"
            selectionColor={SELECTION_COLORS.symptom}
            iconSize={ICON_SIZE}
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[typography.heading2]}>
              {t('health:tracking.moods')}
            </Text>
          </View>

          <HealthItemGrid
            items={MOODS}
            selectedIds={selectedMoods}
            onToggle={toggleMood}
            translationKey="health:moods"
            selectionColor={SELECTION_COLORS.mood}
            iconSize={ICON_SIZE}
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[typography.heading2]}>
              {t('health:tracking.discharge')}
            </Text>
          </View>

          <HealthItemGrid
            items={DISCHARGES}
            selectedIds={selectedDischarges}
            onToggle={toggleDischarge}
            translationKey="health:discharge"
            selectionColor={SELECTION_COLORS.discharge}
            iconSize={ICON_SIZE}
          />
        </View>

        {/* Notes */}
        <View
          ref={notesSectionRef}
          style={[styles.section, { backgroundColor: colors.surface }]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[typography.heading2]}>{t('health:tracking.notes')}</Text>
            <View style={styles.notesIconsContainer}>
              {notes.trim() && (
                <TouchableOpacity
                  style={styles.notesIcon}
                  onPress={() => setNotes('')}
                  activeOpacity={0.7}
                >
                  <DeleteIcon
                    color={colors.neutral400}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.notesIcon}
                onPress={openNotesEditor}
                activeOpacity={0.7}
              >
                <EditIcon
                  color={colors.neutral400}
                />
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
                style={[typography.body, { flex: 1 }]}
                numberOfLines={3}
              >
                {notes}
              </Text>
            ) : (
              <Text
                style={[
                  typography.body,
                  { flex: 1, color: colors.placeholder },
                ]}
              >
                {t('health:tracking.notesPlaceholder')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Save button that appears only when changes are made */}
      {hasChanges && (
        <View style={styles.saveButtonContainer}>
          <Button title={t('buttons.save')} onPress={saveChanges} fullWidth />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    minHeight: 60,
  },
  notesIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notesIcon: {
    marginLeft: 16,
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
  },
});
