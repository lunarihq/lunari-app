import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextStyle,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../db';
import { healthLogs } from '../db/schema';
import { eq } from 'drizzle-orm';
import { useTheme, createTypography } from '../styles/theme';
import dayjs from 'dayjs';
import { globalStyles } from '../styles/globalStyles';
import { CustomIcon } from './icons';
import { NoteIcon } from './icons/Note';

type SymptomsTrackerProps = {
  selectedDate?: string;
  titleStyle?: TextStyle;
};

export const SymptomsTracker = ({
  selectedDate,
  titleStyle,
}: SymptomsTrackerProps) => {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const [healthLogsForDate, setHealthLogsForDate] = useState<any[]>([]);

  // Load health logs when component is focused or selectedDate changes
  useFocusEffect(
    useCallback(() => {
      const loadHealthLogs = async () => {
        try {
          // Use the selected date or default to today
          const dateToUse = selectedDate || dayjs().format('YYYY-MM-DD');
          const logs = await db
            .select()
            .from(healthLogs)
            .where(eq(healthLogs.date, dateToUse));

          setHealthLogsForDate(logs);
        } catch (error) {
          console.error('Error loading health logs:', error);
        }
      };

      loadHealthLogs();
    }, [selectedDate])
  );

  // Helper function to get the appropriate icon component
  const getIconComponent = (log: any) => {
    const { icon, type } = log;

    if (type === 'notes') {
      return <NoteIcon size={54} />;
    }

    // Use CustomIcon for symptoms, moods, and flows that have custom SVG icons
    if (type === 'symptom' || type === 'mood' || type === 'flow') {
      // Check if this icon name exists in our custom icon system
      const customIconNames = [
        'acne',
        'headache',
        'cramps',
        'dizziness',
        'diarhea',
        'fatigue',
        'bloating',
        'constipation',
        'cravings',
        'calm',
        'happy',
        'energetic',
        'sad',
        'anxious',
        'confused',
        'irritated',
        'angry',
        'mood-swings',
        'frisky',
        'apathetic',
        'bored',
        'light',
        'medium',
        'heavy',
        'blood-clots',
      ];

      if (customIconNames.includes(icon)) {
        return <CustomIcon name={icon as any} size={54} />;
      }
    }

    // For any unrecognized icons, use AcneIcon as placeholder
    return <CustomIcon name="acne" size={54} />;
  };

  // Helper function to get display text for each log item
  const getDisplayText = (log: any) => {
    const { type, name } = log;

    // For notes, always show "Note" instead of the actual note text
    if (type === 'notes') {
      return 'Note';
    }

    // For other types, show the original name
    return name;
  };

  // Get date text for display
  const getDateText = () => {
    const dateToUse = selectedDate || dayjs().format('YYYY-MM-DD');
    const isToday = dateToUse === dayjs().format('YYYY-MM-DD');
    return isToday ? 'today' : 'this date';
  };

  return (
    <View style={[styles.symptomsCard, { backgroundColor: colors.surface }]}>
      <Text style={[typography.heading2, titleStyle, { marginBottom: 16 }]}>
        How do you feel today?
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        {/* Add Button - Always visible */}
        <TouchableOpacity
          onPress={() =>
            router.push(
              selectedDate
                ? `/symptom-tracking?date=${selectedDate}`
                : '/symptom-tracking'
            )
          }
          style={styles.itemContainer}
        >
          <View style={[globalStyles.fab, { backgroundColor: colors.primary }]}>
            <Ionicons name="add" size={32} color={colors.white} />
          </View>
          <Text
            style={[
              typography.caption,
              {
                fontSize: 12,
                fontWeight: '500',
                textAlign: 'center',
                color: colors.textSecondary,
              },
            ]}
          >
            Add
          </Text>
        </TouchableOpacity>

        {/* Either show logged items or "No items" message */}
        {healthLogsForDate.length > 0 ? (
          // Map through logged items
          healthLogsForDate.map(log => (
            <TouchableOpacity
              key={`${log.type}_${log.item_id}`}
              style={styles.itemContainer}
              onPress={() => {
                const params: any = {};
                if (selectedDate) {
                  params.date = selectedDate;
                }
                if (log.type === 'notes') {
                  params.scrollTo = 'notes';
                }

                router.push({
                  pathname: '/symptom-tracking',
                  params,
                });
              }}
              activeOpacity={0.7}
            >
              <View style={styles.itemIconContainer}>
                {getIconComponent(log)}
              </View>
              <Text
                style={[
                  typography.caption,
                  {
                    fontSize: 12,
                    fontWeight: '500',
                    textAlign: 'center',
                    color: colors.textSecondary,
                  },
                ]}
                numberOfLines={1}
              >
                {getDisplayText(log)}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          // No items message
          <View style={styles.noItemsContainer}>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              No symptoms or moods logged {getDateText()}.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  symptomsCard: {
    borderRadius: 12,
    padding: 16,
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  itemContainer: {
    alignItems: 'center',
    marginRight: 16,
  },

  itemIconContainer: {
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  noItemsContainer: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
});

export default SymptomsTracker;
