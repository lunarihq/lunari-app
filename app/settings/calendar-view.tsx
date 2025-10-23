import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Switch,
  ScrollView,
  Platform,
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { getSetting, setSetting } from '../../db';
import { useTheme } from '../../styles/theme';
import { useAppStyles } from '../../hooks/useStyles';

export default function CalendarView() {
  const { colors } = useTheme();
  const { typography, commonStyles } = useAppStyles();
  const { t } = useTranslation('calendar');
  const [showOvulation, setShowOvulation] = useState(true);
  const [showFuturePeriods, setShowFuturePeriods] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const ovulationSetting = await getSetting('show_ovulation');
        const futurePeriodsSetting = await getSetting('show_future_periods');

        setShowOvulation(ovulationSetting !== 'false');
        setShowFuturePeriods(futurePeriodsSetting !== 'false');
      } catch (error) {
        console.error('Failed to load calendar view settings:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleOvulationToggle = async (value: boolean) => {
    setShowOvulation(value);
    await setSetting('show_ovulation', value.toString());
    DeviceEventEmitter.emit('calendarSettingsChanged');
  };

  const handleFuturePeriodsToggle = async (value: boolean) => {
    setShowFuturePeriods(value);
    await setSetting('show_future_periods', value.toString());
    DeviceEventEmitter.emit('calendarSettingsChanged');
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[typography.body, { marginTop: 16 }]}>
          {t('view.loadingSettings')}
        </Text>
      </View>
    );
  }

  const legendItems = [
    {
      title: t('legend.periodDays'),
      indicator: (
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 24,
            backgroundColor: colors.accentPink,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        ></View>
      ),
    },
    {
      title: t('legend.futurePrediction'),
      indicator: (
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 24,
            backgroundColor: colors.accentPinkLight,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        ></View>
      ),
      isToggleable: true,
      isEnabled: showFuturePeriods,
    },
    {
      title: t('legend.ovulationDay'),
      indicator: (
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 24,
            borderWidth: 1.6,
            borderColor: colors.accentBlue,
            borderStyle: 'dashed',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        ></View>
      ),
      isToggleable: true,
      isEnabled: showOvulation,
    },
    {
      title: t('legend.fertileWindow'),
      indicator: (
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: colors.accentBlue, fontSize: 16 }}>12</Text>
        </View>
      ),
      isToggleable: true,
      isEnabled: showOvulation,
    },
    {
      title: t('legend.symptomsIndicator'),
      indicator: (
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            marginTop: -6,
          }}
        >
          <View
            style={{
              position: 'absolute',
              bottom: 2,
              width: 7,
              height: 7,
              borderRadius: 8,
              backgroundColor: colors.primary,
            }}
          />
        </View>
      ),
    },
  ];

  return (
    <ScrollView
      style={[
        commonStyles.container
      ]}
      contentContainerStyle={commonStyles.scrollContentContainer}
    >
      <Text style={[commonStyles.sectionTitleContainer, typography.headingSm]}>
        {t('view.displayOptions')}
      </Text>
      <View style={[commonStyles.sectionContainer, {padding: 0}]}>
        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <View style={styles.settingContent}>
            <Text
              style={[
                typography.body,
                { flexShrink: 1, paddingRight: 12, flex: 1 },
              ]}
            >
              {t('view.showOvulation')}
            </Text>
          </View>
          <Switch
            value={showOvulation}
            onValueChange={handleOvulationToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
            ios_backgroundColor={colors.border}
          />
        </View>

        <View style={[styles.settingRow, styles.lastRow]}>
          <View style={styles.settingContent}>
            <Text
              style={[
                typography.body,
                { flexShrink: 1, paddingRight: 12, flex: 1 },
              ]}
            >
              {t('view.showFuturePeriods')}
            </Text>
          </View>
          <Switch
            value={showFuturePeriods}
            onValueChange={handleFuturePeriodsToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
            ios_backgroundColor={colors.border}
          />
        </View>
      </View>

      <Text style={[commonStyles.sectionTitleContainer, typography.headingSm]}>
        {t('view.iconsShown')}
      </Text>
      <View style={[commonStyles.sectionContainer, {padding: 0}]}>
        {legendItems.map((item, index) => (
          <View
            key={index}
            style={[
              styles.legendItem,
              {
                opacity:
                  item.isToggleable && !item.isEnabled ? 0.4 : 1,
              },
            ]}
          >
            <View style={styles.legendIndicator}>{item.indicator}</View>
            <View style={styles.legendContent}>
              <Text style={[typography.body]}>{item.title}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={[commonStyles.sectionContainer, {padding: 0}]}>
        <Text style={[commonStyles.sectionTitleContainer, typography.headingSm]}>
          {t('view.iconsShown')}
        </Text>
      </View>
      <View style={[commonStyles.sectionContainer, {padding: 0}]}>
        <Text style={[commonStyles.sectionTitleContainer, typography.headingSm]}>
          {t('view.iconsShown')}
        </Text>
      </View>
      <View style={[commonStyles.sectionContainer, {padding: 0}]}>
        <Text style={[commonStyles.sectionTitleContainer, typography.headingSm]}>
          {t('view.iconsShown')}
        </Text>
      </View>
      <View style={[commonStyles.sectionContainer, {padding: 0}]}>
        <Text style={[commonStyles.sectionTitleContainer, typography.headingSm]}>
          {t('view.iconsShown')}
        </Text>
      </View>
      <View style={[commonStyles.sectionContainer, {padding: 0}]}>
        <Text style={[commonStyles.sectionTitleContainer, typography.headingSm]}>
          {t('view.iconsShown')}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
    borderRadius: 8,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  legendItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendIndicator: {
    marginRight: 12,
  },
  legendContent: {
    flex: 1,
  },
});
