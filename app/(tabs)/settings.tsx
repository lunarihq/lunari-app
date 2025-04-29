import React from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView style={styles.content}>
        
        
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => router.push('/reminders')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="alarm-outline" size={24} color="#333" />
            </View>
            <Text style={styles.settingText}>Reminders</Text>
            <Ionicons name="chevron-forward" size={24} color="#333" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingRow}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="document-text-outline" size={24} color="#333" />
            </View>
            <Text style={styles.settingText}>Privacy policy</Text>
            <Ionicons name="chevron-forward" size={24} color="#333" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingRow, styles.lastRow]}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="information-circle-outline" size={24} color="#333" />
            </View>
            <Text style={styles.settingText}>About</Text>
            <Ionicons name="chevron-forward" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F2F7',
  },
  content: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#333',
    padding: 16,
    paddingBottom: 8,
  },
  section: {
    backgroundColor: '#fff',
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  iconContainer: {
    marginRight: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});
