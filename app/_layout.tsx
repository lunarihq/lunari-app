import React, { useEffect, useRef, useMemo } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AuthProvider } from '../contexts/AuthContext';
import { NotesProvider } from '../contexts/NotesContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { lightColors, darkColors } from '../styles/colors';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import {
  useFonts,
  BricolageGrotesque_700Bold,
} from '@expo-google-fonts/bricolage-grotesque';
import '../i18n/config';
import { useTranslation } from 'react-i18next';
import { dynamicScreens, getBackgroundColor } from '../config/screenConfig';
import { useAppInitialization } from '../hooks/useAppInitialization';

const toastConfig = {
  style: { height: 48 },
  contentContainerStyle: { paddingHorizontal: 16, paddingVertical: 0 },
  text1Style: { fontSize: 16, fontWeight: '400' as const },
};

function AppContent() {
  const notificationResponseListener = useRef<Notifications.Subscription | null>(null);
  const router = useRouter();

  const { appState, retryInitialization } = useAppInitialization();
  const { isDark } = useTheme();
  const { t } = useTranslation(['common', 'settings', 'health', 'info']);

  const [fontsLoaded] = useFonts({
    BricolageGrotesque_700Bold,
  });

  // Initialize notification response listener only (don't request permissions yet)
  useEffect(() => {
    async function setupNotificationListener() {
      // Set up notification response listener
      notificationResponseListener.current =
        Notifications.addNotificationResponseReceivedListener(response => {
          const { notification } = response;
          const data = notification.request.content.data;

          // Handle the notification based on type
          if (data.type === 'period_reminder' || data.type === 'period_start') {
            // Navigate to the home screen when a period notification is tapped
            router.navigate('/(tabs)');
          }
        });
    }

    setupNotificationListener();

    // Clean up notification listeners on unmount
    return () => {
      if (notificationResponseListener.current) {
        notificationResponseListener.current.remove();
      }
    };
  }, [router]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        centerContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: isDark ? darkColors.background : lightColors.background,
        },
        errorTitle: {
          fontSize: 22,
          fontWeight: 'bold',
          marginBottom: 16,
          color: isDark ? darkColors.textPrimary : lightColors.textPrimary,
        },
        errorMessage: {
          fontSize: 16,
          marginBottom: 24,
          color: isDark ? darkColors.textSecondary : lightColors.textSecondary,
          textAlign: 'center',
        },
        lockTitle: {
          fontSize: 28,
          fontWeight: '600',
          marginBottom: 24,
          color: isDark ? darkColors.textPrimary : lightColors.textPrimary,
        },
        button: {
          paddingHorizontal: 24,
          paddingVertical: 12,
          backgroundColor: isDark ? darkColors.primary : lightColors.primary,
          borderRadius: 8,
        },
        buttonText: {
          color: '#fff',
          fontSize: 16,
          fontWeight: '600',
        },
      }),
    [isDark]
  );

  if (appState.status === 'db_error') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>{t('errors.database.title')}</Text>
        <Text style={styles.errorMessage}>{t(appState.error)}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={retryInitialization}
        >
          <Text style={styles.buttonText}>{t('buttons.continue')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (appState.status === 'locked') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.lockTitle}>Unlock Lunari</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={retryInitialization}
        >
          <Text style={styles.buttonText}>Unlock</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (appState.status !== 'ready' || !fontsLoaded) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={isDark ? darkColors.primary : lightColors.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="edit-period" options={{ headerShown: false }} />
        {dynamicScreens.map(screen => (
          <Stack.Screen
            key={screen.name}
            name={screen.name}
            options={{
              headerShown: screen.headerShown,
              headerTitle: screen.titleKey ? t(screen.titleKey) : '',
              headerShadowVisible: screen.headerShadowVisible ?? false,
              headerStyle: {
                backgroundColor: getBackgroundColor(
                  screen.backgroundColorKey,
                  isDark,
                  darkColors,
                  lightColors
                ),
              },
              headerTintColor: isDark ? darkColors.textPrimary : lightColors.textPrimary,
            }}
          />
        ))}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Toast
        position="top"
        topOffset={80}
        config={{
          success: props => (
            <BaseToast
              {...props}
              style={{ ...toastConfig.style, borderLeftColor: '#28a745' }}
              contentContainerStyle={toastConfig.contentContainerStyle}
              text1Style={toastConfig.text1Style}
            />
          ),
          error: props => (
            <ErrorToast
              {...props}
              style={{ ...toastConfig.style, borderLeftColor: '#dc3545' }}
              contentContainerStyle={toastConfig.contentContainerStyle}
              text1Style={toastConfig.text1Style}
            />
          ),
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <NotesProvider>
              <AppContent />
            </NotesProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
