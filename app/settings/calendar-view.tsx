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
import { getSetting, setSetting } from '../../db';
import defaultTheme, { useTheme, createTypography } from '../../styles/theme';

export default function CalendarView() {
  const { colors } = useTheme();
  const typography = createTypography(colors);
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
          Loading calendar settings...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        defaultTheme.globalStyles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <View style={styles.settingContent}>
            <Text style={[typography.body, { flexShrink: 1, paddingRight: 12, flex: 1 }]}>
            Show predicted ovulation and fertile days on the calendar
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
            <Text style={[typography.body, { flexShrink: 1, paddingRight: 12, flex: 1 }]}>
              Show predicted future periods on the calendar
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginVertical: 16,
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
});

