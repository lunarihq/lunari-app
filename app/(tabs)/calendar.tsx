import { Text, View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

import { Link } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('2025-02-21');
  const markedDates = {
    '2025-02-02': { 
      customStyles: { 
        container: { 
          backgroundColor: selectedDate === '2025-02-02' ? '#FF597B' : '#FF597B',
          borderWidth: selectedDate === '2025-02-02' ? 1.5 : 0 ,
          borderColor: '#000'
        }, 
        text: { color: 'white' } 
      } 
    },
    '2025-02-03': { customStyles: { container: { backgroundColor: '#FF597B' }, text: { color: 'white' } } },
    '2025-02-04': { customStyles: { container: { backgroundColor: '#FF597B' }, text: { color: 'white' } } },
    '2025-02-05': { customStyles: { container: { backgroundColor: '#FF597B' }, text: { color: 'white' } } },
    '2025-02-06': { customStyles: { container: { backgroundColor: '#FF597B' }, text: { color: 'white' } } },
    '2025-02-07': { customStyles: { container: {}, text: { color: '#4561D2' } } },
    '2025-02-08': { customStyles: { container: {}, text: { color: '#4561D2' } } },

    '2025-02-09': { customStyles: { 
      container: {
        borderWidth: selectedDate === '2025-02-09' ? 1.5 : 0,
        borderColor: selectedDate === '2025-02-09' ? '#000' : '#E0E0E0'
      }, 
      text: { color: '#4561D2' } 
    } },

    '2025-02-10': { customStyles: { container: {}, text: { color: '#4561D2' } } },
    '2025-02-11': { customStyles: { container: {}, text: { color: '#4561D2' } } },
    '2025-02-12': { customStyles: { container: {}, text: { color: '#4561D2' } } },
    '2025-02-13': { customStyles: { container: {}, text: { color: '#4561D2' } } },
    '2025-02-14': { 
      customStyles: { 
        container: { 
          borderWidth: selectedDate === '2025-02-14' ? 1.5 : 1.5,
          borderStyle: selectedDate === '2025-02-14' ? 'solid' : 'dotted',
          borderColor: selectedDate === '2025-02-14' ? '#000' : '#4561D2'
        },
        text: { color: '#4561D2' }
      } 
    },
    '2025-02-15': { customStyles: { container: {}, text: { color: '#4561D2' } } },
    '2025-02-16': { customStyles: { container: {}, text: { color: '#4561D2' } } },
    '2025-02-17': { customStyles: { container: {}, text: { color: '#4561D2' } } },
    '2025-02-18': { customStyles: { container: {}, text: { color: '#4561D2' } } },
    '2025-02-21': { customStyles: { container: { backgroundColor: '#E0E0E0' }, text: { color: 'black' } } },
  };

  const getInfoText = (date: string) => {
    if (date === '2025-02-14') {
      return {
        dateText: '14 Feb • Cycle day 13',
        chanceText: 'High chance to conceive.'
      };
    }
    if (date === '2025-02-02') {
      return {
        dateText: '2 Feb • Cycle day 1',
        chanceText: 'Period started. Low chance to conceive.'
      };
    }
    if (date === '2025-02-09') {
      return {
        dateText: '9 Feb • Cycle day 8',
        chanceText: 'Medium chance to conceive.'
      };
    }
    return {
      dateText: '21 Feb • Cycle day 20',
      chanceText: 'Low chance to conceive'
    };
  };

  return (
    <SafeAreaView style={[styles.container, { marginTop: StatusBar.currentHeight }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <View style={styles.backButton}>
          <Link href="/" asChild>
            <Ionicons name="chevron-back" size={24} color="black" />
          </Link>
          <Text style={styles.headerText}>Calendar</Text>
        </View>
        <Text style={styles.editText}>Edit period dates</Text>
      </View>

      <Calendar
        current="2025-02-14"
        markedDates={markedDates}
        markingType="custom"
        onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          todayTextColor: '#000000',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          textMonthFontWeight: 'bold',
          textDayHeaderStyle: { color: '#000000' },
          textSectionTitleColor: '#000000',
          arrowColor: '#000000',
          arrowStyle: { padding: 0 },
          'stylesheet.calendar.main': {
            dayContainer: {
              borderRadius: 20,
            }
          }
        }}
      />

      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#FF597B' }]} />
            <Text>Period</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#4561D2' }]} />
            <Text>Fertility window</Text>
          </View>
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { borderWidth: 1.5, borderStyle: 'dotted' }]} />
            <Text>Ovulation</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { borderColor: '#FF597B', borderWidth: 1.5, borderStyle: 'dotted' }]} />
            <Text>Expected period</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.dateText}>{getInfoText(selectedDate).dateText}</Text>
        <Text style={styles.chanceText}>{getInfoText(selectedDate).chanceText}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  editText: {
    color: '#4561D2',
    fontSize: 16,
    fontWeight: '500',
  },
  legend: {
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingRight: 32,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 10,
  },
  infoBox: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
  },
  chanceText: {
    color: '#666',
    fontSize: 16,
  },
});

CalendarScreen.options = {
  headerShown: false
};
