import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Button } from '../components/Button';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../styles/theme';
import { useNotes } from '../contexts/NotesContext';

export default function NotesEditor() {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const { notes, setNotes } = useNotes();
  const [localNotes, setLocalNotes] = useState<string>('');

  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);
  const hasInitialized = useRef(false);

  // Initialize notes from params or context, but only once
  useEffect(() => {
    if (!hasInitialized.current) {
      const initialNotes =
        typeof params.notes === 'string' ? params.notes : notes;
      setLocalNotes(initialNotes);
      hasInitialized.current = true;
    }
  }, [params.notes, notes]);

  // Keyboard event listeners
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      event => {
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

  // Optional: confirm unsaved changes instead of auto-saving on unmount
  // (Keeping UX simple here; remove if you want auto-save-on-unmount back.)

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      {/* Main Content with KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Notes Input */}
        <View style={styles.content}>
          <TextInput
            style={[styles.notesInput, { color: colors.textPrimary }]}
            placeholder="Add notes, any extra symptoms, or how you've been feeling..."
            placeholderTextColor={colors.placeholder}
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

      {/* Done Button - positioned above keyboard or at bottom */}
      {localNotes.trim() && (
        <View
          style={[
            isKeyboardVisible ? styles.keyboardToolbar : styles.bottomToolbar,
            isKeyboardVisible ? { bottom: keyboardHeight } : {},
          ]}
        >
          <Button
            title="Done"
            onPress={handleSave}
            fullWidth
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    textAlignVertical: 'top',
    padding: 0,
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
  bottomToolbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

});
