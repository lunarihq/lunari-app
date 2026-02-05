import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/theme';
import { useAppStyles } from '../hooks/useStyles';
import { formatDateShort } from '../utils/localeUtils';
import { getCycleStatus, getPeriodStatus } from '../utils/cycleUtils';
import { parseLocalDate } from '../utils/dateUtils';
import { InfoIcon } from '../components/icons/general/info';

const DayCircles = ({
  totalDays,
  periodDays,
}: {
  totalDays: number;
  periodDays: number;
}) => {
  const { colors } = useTheme();
  const circles = [];

  for (let i = 0; i < totalDays; i++) {
    circles.push(
      <View
        key={i}
        style={[
          styles.circle,
          {
            backgroundColor:
              i < periodDays ? colors.accentPink : colors.neutral100,
          },
        ]}
      />
    );
  }

  return <View style={styles.circleContainer}>{circles}</View>;
};

export default function CycleDetails() {
  const { colors } = useTheme();
  const { typography, commonStyles } = useAppStyles();
  const { t } = useTranslation(['stats', 'common']);
  const params = useLocalSearchParams();

  const startDate = params.startDate as string;
  const endDate = params.endDate as string;
  const cycleLength = parseInt(params.cycleLength as string, 10);
  const periodLength = parseInt(params.periodLength as string, 10);
  const isCurrentCycle = params.isCurrentCycle === 'true';

  const cycleStatus = getCycleStatus(cycleLength);
  const periodStatus = getPeriodStatus(periodLength);

  const formattedStartDate = formatDateShort(parseLocalDate(startDate));
  const formattedEndDate = isCurrentCycle
    ? t('common:time.today')
    : formatDateShort(parseLocalDate(endDate));

  const handleInfoPress = (type: 'cycle' | 'period') => {
    if (type === 'cycle') {
      router.push('/(info)/cycle-length-info');
    } else {
      router.push('/(info)/period-length-info');
    }
  };

  return (
    <ScrollView
      style={[commonStyles.scrollView]}
      contentContainerStyle={commonStyles.scrollContentContainer}
      showsVerticalScrollIndicator={false}
    >
      {isCurrentCycle ? (
        <View style={[styles.headerCard, { backgroundColor: colors.surface }]}>
          <Text style={[typography.headingSm, { marginBottom: 4 }]}>
            {t('stats:cycleHistory.currentCycle')}: {cycleLength} {cycleLength === 1 ? t('common:time.day') : t('common:time.days')}
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginBottom: 12 }]}>
            {formattedStartDate} - {formattedEndDate}
          </Text>
          <DayCircles totalDays={cycleLength} periodDays={periodLength} />
        </View>
      ) : (
        <>
          <View style={[styles.headerCard, { backgroundColor: colors.surface }]}>
            <Text style={[typography.headingSm, { marginBottom: 4 }]}>
              {cycleLength} {cycleLength === 1 ? t('common:time.day') : t('common:time.days')}
            </Text>
            <Text style={[typography.body, { color: colors.textSecondary, marginBottom: 12 }]}>
              {formattedStartDate} - {formattedEndDate}
            </Text>
            <DayCircles totalDays={cycleLength} periodDays={periodLength} />
          </View>

          <View style={[styles.detailCard, { backgroundColor: colors.surface }]}>
            <View style={styles.cardHeader}>
              <Text style={[typography.body, { color: colors.textSecondary }]}>
                {t('stats:cycleHistory.cycleLength')}
              </Text>
              <TouchableOpacity
                onPress={() => handleInfoPress('cycle')}
                style={styles.infoIcon}
                activeOpacity={0.7}
              >
                <InfoIcon size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.valueStatusRow}>
              <Text style={[typography.headingLg, { lineHeight: 32}]}>
                {cycleLength} {cycleLength === 1 ? t('common:time.day') : t('common:time.days')}
              </Text>
              <View style={styles.statusContainer}>
                <Ionicons
                  name={cycleStatus.status === 'normal' ? 'checkmark-circle' : 'alert-circle'}
                  size={20}
                  color={cycleStatus.status === 'normal' ? colors.success : colors.warning}
                />
                <Text style={[typography.body, { color: colors.textSecondary }]}>
                  {cycleStatus.status === 'normal'
                    ? t('common:status.normal')
                    : t('common:status.irregular')}
                </Text>
              </View>
            </View>

            <Text style={[typography.body, { color: colors.textSecondary, marginTop: 8 }]}>
              {cycleStatus.status === 'normal'
                ? t('stats:cycleDetails.cycleNormalRange')
                : t('stats:cycleDetails.cycleIrregularRange')}
            </Text>
          </View>
        </>
      )}

      <View style={[styles.detailCard, { backgroundColor: colors.surface }]}>
        <View style={styles.cardHeader}>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            {t('stats:cycleHistory.periodLength')}
          </Text>
          <TouchableOpacity
            onPress={() => handleInfoPress('period')}
            style={styles.infoIcon}
            activeOpacity={0.7}
          >
            <InfoIcon size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.valueStatusRow}>
          <Text style={[typography.headingLg, { lineHeight: 32}]}>
            {periodLength} {periodLength === 1 ? t('common:time.day') : t('common:time.days')}
          </Text>
          <View style={styles.statusContainer}>
            <Ionicons
              name={periodStatus.status === 'normal' ? 'checkmark-circle' : 'alert-circle'}
              size={20}
              color={periodStatus.status === 'normal' ? colors.success : colors.warning}
            />
            <Text style={[typography.body, { color: colors.textSecondary }]}>
              {periodStatus.status === 'normal'
                ? t('common:status.normal')
                : t('common:status.irregular')}
            </Text>
          </View>
        </View>

        <Text style={[typography.body, { color: colors.textSecondary, marginTop: 8 }]}>
          {periodStatus.status === 'normal'
            ? t('stats:cycleDetails.periodNormalRange')
            : t('stats:cycleDetails.periodIrregularRange')}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  detailCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  circleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
