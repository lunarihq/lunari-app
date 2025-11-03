import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../styles/theme';
import { LinkButton } from './LinkButton';

export function LockScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('settings');
  const { authenticate } = useAuth();

  const handleAuth = useCallback(async () => {
    try {
      // Lock Screen: trigger full device auth to unlock the app
      await authenticate();
    } catch (error) {
      console.error('Authentication error:', error);
    }
  }, [authenticate]);

  useEffect(() => {
    handleAuth();
  }, [handleAuth]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.authContainer}>
          <Text style={[styles.title, { color: colors.textPrimary, marginBottom: 24 }]}>
            {t('lockScreen.unlockApp')}
          </Text>
          <LinkButton
            title={t('lockScreen.unlockButton')}
            onPress={handleAuth}
            showIcon={false}
            fontSize={18}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
  },
});
