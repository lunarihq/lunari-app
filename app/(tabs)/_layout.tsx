import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
  screenOptions={{
    tabBarActiveTintColor: '#4561D2',
    headerStyle: {
      backgroundColor: '#F3F2F7',
    },
    headerTitleStyle: {
      color: '#332F49',
    },
    headerShadowVisible: false,
    headerTintColor: '#fff',
    tabBarStyle: {
    backgroundColor: '#fff',
    height: 60,
    },
  }}
>
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Lunari",
          tabBarLabel: "Today",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          tabBarLabel: "Stats",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}
