import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../app/styles/theme';
import { DataDeletionService } from '../services/dataDeletionService';
import { useNotes } from '../contexts/NotesContext';

interface DataDeletionModalProps {
  visible: boolean;
  onClose: () => void;
  onDataDeleted: () => void;
}

export const DataDeletionModal: React.FC<DataDeletionModalProps> = ({
  visible,
  onClose,
  onDataDeleted,
}) => {
  const { colors } = useTheme();
  const { clearNotes } = useNotes();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteData = async () => {
    Alert.alert(
      'Delete All Data',
      'This action cannot be undone. All your period tracking data, symptoms, reminders, and settings will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All Data',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await DataDeletionService.deleteAllUserData();
              clearNotes(); // Clear notes from context
              onDataDeleted();
              onClose();
              Alert.alert('Success', 'All your data has been deleted.');
            } catch {
              Alert.alert('Error', 'Failed to delete data. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          <View style={styles.header}>
            <Ionicons
              name="warning-outline"
              size={32}
              color="#FF6B6B"
            />
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Delete All Data?
            </Text>
          </View>

          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Do you want to delete all the data you tracked from this phone?
          </Text>

          <Text style={[styles.description, { color: colors.textSecondary }]}>
          This will permanently delete all your data including period logs and settings.
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDeleteData}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.deleteButtonText}>Delete All Data</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 20,
    lineHeight: 22,
  },

  warning: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
