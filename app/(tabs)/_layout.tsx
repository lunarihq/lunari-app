import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../styles/theme';
import { InfoIcon } from '../../components/icons/general/info';

function createTabIcon(filledName: string, outlineName: string) {
  const TabIcon = ({ color, focused }: { color: string; focused: boolean }) => (
    <Ionicons
      name={focused ? (filledName as any) : (outlineName as any)}
      color={color}
      size={24}
    />
  );
  TabIcon.displayName = `TabIcon(${filledName})`;
  return TabIcon;
}

export default function TabLayout() {
  const { colors } = useTheme();
  const router = useRouter();
  const { t } = useTranslation('common');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.neutral200,
        headerStyle: {
          backgroundColor: colors.background,
          height: 100,
        },
        headerTitleStyle: {
          color: colors.textPrimary,
          fontSize: 18,
        },
        headerShadowVisible: false,
        headerTintColor: colors.textPrimary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          height: 80,
          borderTopColor: colors.border,
        },
        tabBarItemStyle: {
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: t('navigation.appName'),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/(info)/prediction-info')}
              style={{ marginRight: 16 }}
            >
              <InfoIcon
                size={24}
                color={colors.neutral400}
              />
            </TouchableOpacity>
          ),
          tabBarLabel: t('navigation.today'),
          tabBarIcon: createTabIcon('time', 'time-outline'),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          headerShown: true,
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push('/settings/calendar-view')}
              style={{ marginLeft: 16 }}
            >
              <InfoIcon
                size={26}
                color={colors.neutral400}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            height: 100,
            backgroundColor: colors.panel,
          },
          headerTitleStyle: {
            color: colors.textPrimary,
            fontSize: 18,
          },
          headerTintColor: colors.textPrimary,
          tabBarLabel: t('navigation.calendar'),
          tabBarIcon: createTabIcon('calendar', 'calendar-outline'),
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          headerShown: true,
          headerTitle: t('navigation.stats'),
          tabBarLabel: t('navigation.stats'),
          tabBarIcon: createTabIcon('bar-chart', 'bar-chart-outline'),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          headerShown: true,
          headerTitle: t('navigation.settings'),
          tabBarLabel: t('navigation.settings'),
          tabBarIcon: createTabIcon('settings', 'settings-outline'),
        }}
      />
    </Tabs>
  );
}
