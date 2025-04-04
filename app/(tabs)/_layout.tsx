import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import { openPeriodModal } from './calendar';

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
            <Ionicons name={focused ? 'time' : 'time-outline'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          headerShown: true,
          headerTitle: "Calendar",
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="chevron-back" size={24} color="#332F49" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => openPeriodModal()}
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
    </Tabs>
  );
}
