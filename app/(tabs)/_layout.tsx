import { Tabs, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../../styles/theme';

export default function TabLayout() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
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
          headerTitle: 'Lunari',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/(info)/prediction-info')}
              style={{ marginRight: 16 }}
            >
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          ),
          tabBarLabel: 'Today',
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
          headerTitle: 'Calendar',
          headerStyle: {
            height: 100,
            backgroundColor: colors.panel,
          },
          headerTitleStyle: {
            color: colors.textPrimary,
            fontSize: 18,
          },
          headerTintColor: colors.textPrimary,
          tabBarLabel: 'Calendar',
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
          headerTitle: 'Stats',
          tabBarLabel: 'Stats',
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
          headerTitle: 'Settings',
          tabBarLabel: 'Settings',
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
