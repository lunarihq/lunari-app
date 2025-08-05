import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import theme from './styles/theme';
import { useNotes } from '../contexts/NotesContext';

export default function NotesEditor() {
  const params = useLocalSearchParams();
  const { notes, setNotes } = useNotes();
  const [localNotes, setLocalNotes] = useState<string>('');
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [originalNotes, setOriginalNotes] = useState<string>('');
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);

  // Get the initial notes from params or context
  useEffect(() => {
    const initialNotes = typeof params.notes === 'string' ? params.notes : notes;
    setLocalNotes(initialNotes);
    setOriginalNotes(initialNotes);
  }, []); // Only run once on mount

  // Check for changes
  useEffect(() => {
    setHasChanges(localNotes !== originalNotes);
  }, [localNotes, originalNotes]);

  // Keyboard event listeners
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
        setIsKeyboardVisible(true);
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  // Handle save
  const handleSave = () => {
    setNotes(localNotes);
    router.back();
  };



  // Handle back navigation with unsaved changes
  useEffect(() => {
    const handleBackPress = () => {
      if (hasChanges) {
        // If there are unsaved changes, save them before going back
        setNotes(localNotes);
      }
    };

    // This will be handled by the default header back button
    return () => {
      handleBackPress();
    };
  }, [hasChanges, localNotes, setNotes]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Content with KeyboardAvoidingView */}
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Notes Input */}
        <View style={styles.content}>
          <TextInput
            style={styles.notesInput}
            placeholder="Add notes, any extra symptoms, or how you've been feeling..."
            placeholderTextColor="#999"
            value={localNotes}
            onChangeText={setLocalNotes}
            multiline
            textAlignVertical="top"
            autoFocus
            returnKeyType="default"
            blurOnSubmit={false}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Done Button - positioned above keyboard */}
      {isKeyboardVisible && localNotes.trim() && (
        <View style={[
          styles.keyboardToolbar,
          { bottom: keyboardHeight }
        ]}>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  notesInput: {
    maxHeight: 300,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlignVertical: 'top',
    padding: 0,
    backgroundColor: 'red',
  },
  keyboardToolbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  saveButton: {
    backgroundColor: '#FF597B',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
}); 