import React, { useState, useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, TextStyle } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../db';
import { healthLogs } from '../db/schema';
import { eq } from 'drizzle-orm';

type SymptomsTrackerProps = {
  selectedDate?: string;
  titleStyle?: TextStyle;
};

export const SymptomsTracker = ({ selectedDate, titleStyle }: SymptomsTrackerProps) => {
  const [healthLogsForDate, setHealthLogsForDate] = useState<any[]>([]);
  
  // Load health logs when component is focused or selectedDate changes
  useFocusEffect(
    useCallback(() => {
      const loadHealthLogs = async () => {
        try {
          // Use the selected date or default to today
          const dateToUse = selectedDate || new Date().toISOString().split('T')[0];
          const logs = await db.select().from(healthLogs)
            .where(eq(healthLogs.date, dateToUse));
          
          setHealthLogsForDate(logs);
          console.log(`Loaded health logs for ${dateToUse}:`, logs.length);
        } catch (error) {
          console.error('Error loading health logs:', error);
        }
      };
      
      loadHealthLogs();
    }, [selectedDate])
  );

  // Helper function to get the appropriate icon component
  const getIconComponent = (log: any) => {
    const { icon, icon_color, type } = log;
    
    // Check if the icon is an emoji (starts with a non-ASCII character)
    const isEmoji = /^[^\x00-\x7F]/.test(icon);
    
    if (isEmoji) {
      // Render emoji as text
      return <Text style={{ fontSize: 30 }}>{icon}</Text>;
    }
    
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
    } else if (type === 'notes') {
      // Use a note icon for notes
      return <Ionicons name="document-text" size={18} color={icon_color} />;
    }
    
    return <Ionicons name="help-circle" size={18} color="#888" />;
  };

  // Helper function to get display text for each log item
  const getDisplayText = (log: any) => {
    const { type, name } = log;
    
    // For notes, always show "Note" instead of the actual note text
    if (type === 'notes') {
      return 'Note';
    }
    
    // For other types, show the original name
    return name;
  };

  // Get date text for display
  const getDateText = () => {
    const dateToUse = selectedDate || new Date().toISOString().split('T')[0];
    const isToday = dateToUse === new Date().toISOString().split('T')[0];
    return isToday ? 'today' : 'this date';
  };

  return (
    <View style={styles.symptomsCard}>
      <Text style={[styles.symptomsText, titleStyle]}>Symptoms & moods</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
        {/* Add Button - Always visible */}
        <TouchableOpacity 
          onPress={() => router.push(selectedDate ? 
            `/symptom-tracking?date=${selectedDate}` : 
            '/symptom-tracking')}
          style={styles.itemContainer}
        >
          <View style={styles.addButton}>
            <Ionicons name="add" size={32} color="white" />
          </View>
          <Text style={styles.itemText}>Add</Text>
        </TouchableOpacity>
        
        {/* Either show logged items or "No items" message */}
        {healthLogsForDate.length > 0 ? (
          // Map through logged items
          healthLogsForDate.map((log) => (
            <TouchableOpacity 
              key={`${log.type}_${log.item_id}`} 
              style={styles.itemContainer}
              onPress={() => router.push(selectedDate ? 
                `/symptom-tracking?date=${selectedDate}` : 
                '/symptom-tracking')}
              activeOpacity={0.7}
            >
              <View style={styles.itemIconContainer}>
                {getIconComponent(log)}
              </View>
              <Text style={styles.itemText} numberOfLines={1}>{getDisplayText(log)}</Text>
            </TouchableOpacity>
          ))
        ) : (
          // No items message
          <View style={styles.noItemsContainer}>
            <Text style={styles.noLoggedItemsText}>
              No symptoms or moods logged {getDateText()}.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  symptomsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  symptomsText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#332F49',
    marginBottom: 16,
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  itemContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  addButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#4561D2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F9F8D5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  noItemsContainer: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
  noLoggedItemsText: {
    color: '#676767',
    fontSize: 14,
  },
});

export default SymptomsTracker;