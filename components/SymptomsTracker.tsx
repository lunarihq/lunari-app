import React, { useState, useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../db';
import { healthLogs } from '../db/schema';
import { eq } from 'drizzle-orm';

export const SymptomsTracker = () => {
  const [todayHealthLogs, setTodayHealthLogs] = useState<any[]>([]);
  
  // Load health logs when component is focused
  useFocusEffect(
    useCallback(() => {
      const loadHealthLogs = async () => {
        try {
          const today = new Date().toISOString().split('T')[0];
          const logs = await db.select().from(healthLogs)
            .where(eq(healthLogs.date, today));
          
          setTodayHealthLogs(logs);
          console.log('Loaded health logs:', logs.length);
        } catch (error) {
          console.error('Error loading health logs:', error);
        }
      };
      
      loadHealthLogs();
    }, [])
  );

  // Helper function to get the appropriate icon component
  const getIconComponent = (log: any) => {
    const { icon, icon_color, type } = log;
    
    if (type === 'symptom') {
      if (icon === 'strawberry') {
        return <FontAwesome5 name="strawberry" size={18} color={icon_color} />;
      } else if (icon === 'hammer') {
        return <Ionicons name="hammer" size={18} color={icon_color} />;
      } else if (icon === 'head-flash') {
        return <MaterialCommunityIcons name="head-flash" size={18} color={icon_color} />;
      } else if (icon === 'rotate-orbit') {
        return <MaterialCommunityIcons name="rotate-orbit" size={18} color={icon_color} />;
      }
    } else if (type === 'mood') {
      return <Ionicons name={icon} size={18} color={icon_color} />;
    }
    
    return <Ionicons name="help-circle" size={18} color="#888" />;
  };

  return (
    <View style={styles.symptomsCard}>
      <View style={styles.symptomsHeader}>
        <Text style={styles.symptomsText}>Log your symptoms</Text>
        <TouchableOpacity 
          onPress={() => router.push('/symptom-tracking')}
          style={styles.addButton}
        >
          <Ionicons name="add-circle" size={24} color="#4561D2" />
        </TouchableOpacity>
      </View>
      
      {todayHealthLogs.length > 0 ? (
        <>
          <View style={styles.loggedItemsContainer}>
            {todayHealthLogs.map((log) => (
              <TouchableOpacity 
                key={`${log.type}_${log.item_id}`} 
                style={styles.loggedItem}
                onPress={() => router.push('/symptom-tracking')}
                activeOpacity={0.7}
              >
                <View style={styles.loggedItemIcon}>
                  {getIconComponent(log)}
                </View>
                <Text style={styles.loggedItemText} numberOfLines={1}>{log.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <Text style={styles.noLoggedItemsText}>No symptoms or moods logged for today</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  symptomsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  symptomsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  symptomsText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#332F49',
  },
  addButton: {
    padding: 5,
  },
  loggedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  loggedItem: {
    alignItems: 'center',
    width: '25%',
    marginBottom: 12,
  },
  loggedItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F9F8D5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  loggedItemText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  noLoggedItemsText: {
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
});