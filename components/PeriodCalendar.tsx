import { View, Modal, Pressable, Text, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useState, useEffect } from 'react';

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
      updatedDates[day.dateString] = { selected: true, selectedColor: '#FF597B' };
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
        />
        <View style={styles.modalButtons}>
          <Pressable 
            style={[styles.button, styles.modalButton]} 
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
          <Pressable 
            style={[styles.button, styles.modalButton]}
            onPress={() => {
              onSave(tempDates);
            }}
          >
            <Text style={styles.buttonText}>Save</Text>
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
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});