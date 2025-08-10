import React from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import theme from '../styles/theme';
import Colors from '../styles/colors';
export default function Settings() {
  const router = useRouter();

  return (

      <ScrollView style={theme.globalStyles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => router.push('/reminders')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="alarm-outline" size={24} color={Colors.textPrimary} />
            </View>
            <Text style={styles.settingText}>Reminders</Text>
            <Ionicons name="chevron-forward" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => router.push('/app-lock')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed-outline" size={24} color={Colors.textPrimary} />
            </View>
            <Text style={styles.settingText}>App Lock</Text>
            <Ionicons name="chevron-forward" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingRow}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="document-text-outline" size={24} color={Colors.textPrimary} />
            </View>
            <Text style={styles.settingText}>Privacy policy</Text>
            <Ionicons name="chevron-forward" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingRow, styles.lastRow]}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="information-circle-outline" size={24} color={Colors.textPrimary} />
            </View>
            <Text style={styles.settingText}>About</Text>
            <Ionicons name="chevron-forward" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({

  section: {
    borderRadius: 8,
    marginVertical: 16,
    overflow: 'hidden',
    backgroundColor: Colors.white,
  },
  iconContainer: {
    marginRight: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  settingText: {
    fontSize: 18,
    color: Colors.textPrimary,
    flex: 1,
  },
});
