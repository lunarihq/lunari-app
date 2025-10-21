import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';

interface ThemeSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ThemeSelectionModal({
  visible,
  onClose,
}: ThemeSelectionModalProps) {
  const { colors, themeMode, setThemeMode } = useTheme();
  const { width } = useWindowDimensions();
  const { t } = useTranslation('settings');

  const themeOptions: { mode: ThemeMode; label: string }[] = [
    { mode: 'system', label: t('themeOptions.system') },
    { mode: 'light', label: t('themeOptions.light') },
    { mode: 'dark', label: t('themeOptions.dark') },
  ];

  const handleThemeSelect = (mode: ThemeMode) => {
    setThemeMode(mode);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
      >
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.surface,
              width: Math.min(width * 0.8, 320),
            },
          ]}
        >
          <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
            {t('themeModal.title')}
          </Text>

          {themeOptions.map((option, index) => (
            <TouchableOpacity
              key={option.mode}
              style={[
                styles.optionRow,
                index === themeOptions.length - 1 && styles.lastOption,
              ]}
              onPress={() => handleThemeSelect(option.mode)}
            >
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radioButton,
                    {
                      borderColor: colors.border,
                      backgroundColor:
                        themeMode === option.mode
                          ? colors.primary
                          : 'transparent',
                    },
                  ]}
                >
                  {themeMode === option.mode && (
                    <View
                      style={[
                        styles.radioDot,
                        { backgroundColor: colors.white },
                      ]}
                    />
                  )}
                </View>
              </View>
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  radioContainer: {
    marginRight: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
});
