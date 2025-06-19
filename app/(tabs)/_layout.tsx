import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
  screenOptions={{
    tabBarActiveTintColor: '#4561D2',
    headerStyle: {
      backgroundColor: '#E9F0FF',
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
            <Ionicons name={focused ? 'time' : 'time-outline'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          headerShown: true,
          headerTitle: "Calendar",
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push('/period-calendar')}
              style={{ marginRight: 16 }}
            >
              <Text style={{ color: '#4561D2', fontSize: 16, fontWeight: '500' }}>
                Edit period dates
              </Text>
            </TouchableOpacity>
          ),
          tabBarLabel: "Calendar",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} color={color} size={24}/>
          ),
        }}
      />

<Tabs.Screen
        name="stats"
        options={{
          headerShown: true,
          headerTitle: "Stats",
          tabBarLabel: "Stats",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} color={color} size={24}/>
          ),
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: true,
          headerTitle: "Settings",
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24}/>
          ),
        }}
      />
      
    </Tabs>
  );
}
