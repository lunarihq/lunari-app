import React, { useState, useCallback, memo, useMemo } from 'react';
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
import { db } from '../db';
import { healthLogs } from '../db/schema';
import { eq } from 'drizzle-orm';
import { useTheme } from '../styles/theme';
import { useAppStyles } from '../hooks/useStyles';
import dayjs from 'dayjs';
import { CustomIcon } from './icons/health';
import { NoteIcon } from './icons/health/Note';
import { SYMPTOMS, MOODS, FLOWS, DISCHARGES } from '../constants/healthTracking';
import { FAB } from './FAB';

type QuickHealthSelectorProps = {
  selectedDate?: string;
  titleStyle?: TextStyle;
};

export const QuickHealthSelector = ({
  selectedDate,
  titleStyle,
}: QuickHealthSelectorProps) => {
  const { colors } = useTheme();
  const { typography } = useAppStyles();
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
    return getDisplayText(log);
  };

  // Memoized component for individual health log items
  const HealthLogItem = memo(({ log, selectedDate }: { log: any; selectedDate?: string }) => {
    const icon = useMemo(() => getIconComponent(log), [log]);
    const text = useMemo(() => formatDisplayText(log), [log]);

    return (
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
          {icon}
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
          {text}
        </Text>
      </TouchableOpacity>
    );
  });

  HealthLogItem.displayName = 'HealthLogItem';

  return (
    <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.scrollContainer]}
      >
        {/* Add Button - Always visible */}
        <FAB
          onPress={() =>
            router.push(
              selectedDate
                ? `/health-tracking?date=${selectedDate}`
                : '/health-tracking'
            )
          }
          containerStyle={styles.itemContainer}
          label={t('quickHealthSelector.add')}
        />

        {/* Either show logged items or "No items" message */}
        {healthLogsForDate.length > 0 ? (
          // Map through logged items using memoized component
          healthLogsForDate.map(log => (
            <HealthLogItem key={`${log.type}_${log.item_id}`} log={log} selectedDate={selectedDate} />
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
  scrollContainer: {
    flexDirection: 'row',
  },
  itemContainer: {
    alignItems: 'center',
    width: 80,
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
