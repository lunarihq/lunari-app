import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../db';
import { healthLogs } from '../db/schema';
import { eq } from 'drizzle-orm';
import { useTheme, createTypography } from '../styles/theme';
import dayjs from 'dayjs';
import { commonStyles } from '../styles/commonStyles';
import { CustomIcon } from './icons/health';
import { NoteIcon } from './icons/health/Note';
import { SYMPTOMS, MOODS, FLOWS, DISCHARGES } from '../constants/healthTracking';

type QuickHealthSelectorProps = {
  selectedDate?: string;
  titleStyle?: TextStyle;
};

export const QuickHealthSelector = ({
  selectedDate,
  titleStyle,
}: QuickHealthSelectorProps) => {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const { t } = useTranslation('health');
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

  const getIconComponent = (log: any) => {
    const { item_id, type } = log;

    if (type === 'notes') {
      return <NoteIcon size={54} />;
    }

    let iconName: string | undefined;

    if (type === 'symptom') {
      iconName = SYMPTOMS.find(s => s.id === item_id)?.icon;
    } else if (type === 'mood') {
      iconName = MOODS.find(m => m.id === item_id)?.icon;
    } else if (type === 'flow') {
      iconName = FLOWS.find(f => f.id === item_id)?.icon;
    } else if (type === 'discharge') {
      iconName = DISCHARGES.find(d => d.id === item_id)?.icon;
    }

    if (iconName) {
      return <CustomIcon name={iconName as any} size={54} />;
    }

    return <CustomIcon name="im-okay" size={54} />;
  };

  const getDisplayText = (log: any) => {
    const { type, item_id } = log;

    if (type === 'notes') {
      return t('quickHealthSelector.note');
    }

    if (type === 'symptom') {
      return t(`symptoms.${item_id}`);
    } else if (type === 'mood') {
      return t(`moods.${item_id}`);
    } else if (type === 'flow') {
      return t(`flows.${item_id}`);
    } else if (type === 'discharge') {
      return t(`discharge.${item_id}`);
    }

    return item_id;
  };

  const formatDisplayText = (log: any) => {
    const text = getDisplayText(log);
    const words = String(text).trim().split(/\s+/);
    if (words.length === 2) return `${words[0]}\n${words[1]}`;
    return text;
  };

  return (
    <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.scrollContainer, { backgroundColor: 'red' }]}
      >
        {/* Add Button - Always visible */}
        <TouchableOpacity
          onPress={() =>
            router.push(
              selectedDate
                ? `/health-tracking?date=${selectedDate}`
                : '/health-tracking'
            )
          }
          style={styles.itemContainer}
        >
          <View style={[commonStyles.fab, { backgroundColor: colors.primary }]}>
            <Ionicons name="add" size={32} color={colors.white} />
          </View>
          <Text
            style={[
              {
                fontSize: 12,
                fontWeight: '500',
                textAlign: 'center',
                color: colors.textSecondary,
              },
            ]}
          >
            {t('quickHealthSelector.add')}
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
                  pathname: '/health-tracking',
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
                  {
                    fontSize: 12,
                    textAlign: 'center',
                    color: colors.textSecondary,
                  },
                ]}
                numberOfLines={2}
              >
                {formatDisplayText(log)}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          // No items message
          <View style={styles.noItemsContainer}>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              {selectedDate && selectedDate !== dayjs().format('YYYY-MM-DD')
                ? t('quickHealthSelector.noSymptomsThisDate')
                : t('quickHealthSelector.noSymptomsToday')}
            </Text>
          </View>
        )}
      </ScrollView>
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

export default QuickHealthSelector;
