import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button } from '../components/Button';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../styles/theme';
import { useAppStyles } from '../hooks/useStyles';
import { useNotes } from '../contexts/NotesContext';
import { useTranslation } from 'react-i18next';

export default function NotesEditor() {
  const { colors } = useTheme();
  const { typography } = useAppStyles();
  const { t } = useTranslation(['common', 'health']);
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { notes, setNotes } = useNotes();
  const [localNotes, setLocalNotes] = useState<string>('');
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      const initialNotes =
        typeof params.notes === 'string' ? params.notes : notes;
      setLocalNotes(initialNotes);
      hasInitialized.current = true;
    }
  }, [params.notes, notes]);

  const handleSave = () => {
    setNotes(localNotes);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.panel }]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.content}>
          <TextInput
            style={[typography.body, styles.notesInput]}
            placeholder={t('health:tracking.notesEditorPlaceholder')}
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

        {localNotes.trim() && (
          <View
            style={[
              styles.buttonContainer,
              {
                backgroundColor: colors.panel,
                paddingBottom: Math.max(insets.bottom, 120),
              },
            ]}
          >
            <Button title={t('buttons.done')} onPress={handleSave} fullWidth />
          </View>
        )}
      </KeyboardAvoidingView>
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
    flex: 1,
    textAlignVertical: 'top',
    padding: 0,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
