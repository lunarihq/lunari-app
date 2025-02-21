import { View, Modal, Pressable, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { Calendar, DateData } from 'react-native-calendars';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (dates: { [date: string]: any }) => void;
  selectedDates: { [date: string]: any };
  setSelectedDates: (dates: { [date: string]: any }) => void;
};

export function PeriodCalendarModal({ visible, onClose, onSave, selectedDates, setSelectedDates }: Props) {
  const [tempDates, setTempDates] = useState(selectedDates);

  useEffect(() => {
    setTempDates(selectedDates);
  }, [visible]); // Reset temp dates when modal opens

  const onDayPress = (day: DateData) => {
    const updatedDates = { ...tempDates };
    
    if (updatedDates[day.dateString]) {
      delete updatedDates[day.dateString];
    } else {
      // Check if this is a new period start (no adjacent dates before it)
      const prevDay = new Date(day.dateString);
      prevDay.setDate(prevDay.getDate() - 1);
      const prevDayString = prevDay.toISOString().split('T')[0];
      
      if (!updatedDates[prevDayString]) {
        // Auto-select 5 days
        for (let i = 0; i < 5; i++) {
          const date = new Date(day.dateString);
          date.setDate(date.getDate() + i);
          const dateString = date.toISOString().split('T')[0];
          updatedDates[dateString] = { selected: true, selectedColor: '#FF597B' };
        }
      } else {
        // Normal single day selection
        updatedDates[day.dateString] = { selected: true, selectedColor: '#FF597B' };
      }
    }
    
    setTempDates(updatedDates);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={tempDates}
          markingType="dot"
          maxDate={new Date().toISOString().split('T')[0]}
          theme={{
            todayTextColor: '#000',
            todayBackgroundColor: '#E4E4E4',
            textSectionTitleColor: '#332F49',
            arrowColor: '#332F49',
          }}
        />
        <View style={styles.modalButtons}>
          <Pressable 
            style={[styles.button, styles.modalButton, styles.cancelButton]} 
            onPress={onClose}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
          </Pressable>
          <Pressable 
            style={[styles.button, styles.modalButton, styles.saveButton]}
            onPress={() => {
              onSave(tempDates);
            }}
          >
            <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#4561D2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#D9D8E1',
  },
  cancelButtonText: {
    color: '#332F49',
  },
  saveButton: {
    backgroundColor: '#4561D2',
  },
  saveButtonText: {
    color: '#fff',
  },
});
