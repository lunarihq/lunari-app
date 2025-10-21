import { Tabs, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../styles/theme';
import { InfoIcon } from '../../components/icons/general/info';

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
                size={26}
                color={colors.neutral400}
              />
            </TouchableOpacity>
          ),
          tabBarLabel: t('navigation.today'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'time' : 'time-outline'}
              color={color}
              size={24}
            />
          ),
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
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          headerShown: true,
          headerTitle: t('navigation.stats'),
          tabBarLabel: t('navigation.stats'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'bar-chart' : 'bar-chart-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          headerShown: true,
          headerTitle: t('navigation.settings'),
          tabBarLabel: t('navigation.settings'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
