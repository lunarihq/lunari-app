import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { initializeDatabase, getSetting, clearDatabaseCache } from '../db';
import * as Notifications from 'expo-notifications';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { NotesProvider } from '../contexts/NotesContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { lightColors, darkColors } from '../styles/colors';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { EncryptionError, ERROR_CODES, clearKeyCache } from '../services/databaseEncryptionService';
import {
  useFonts,
  BricolageGrotesque_700Bold,
} from '@expo-google-fonts/bricolage-grotesque';
import '../i18n/config';
import { useTranslation } from 'react-i18next';
import {
  AppState,
  createInitialState,
  createLockedState,
  createErrorState,
  createCheckingOnboardingState,
  createReadyState,
} from '../types/appState';
import { dynamicScreens, getBackgroundColor } from '../config/screenConfig';

const toastConfig = {
  style: { height: 48 },
  contentContainerStyle: { paddingHorizontal: 16, paddingVertical: 0 },
  text1Style: { fontSize: 16, fontWeight: '400' as const },
};

function AppContent() {
  const [appState, setAppState] = useState<AppState>(createInitialState());
  const [initialRender, setInitialRender] = useState(true);
  const notificationResponseListener = useRef<Notifications.Subscription | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const { unlockApp, startAuthentication, endAuthentication, justReturnedFromBackground, clearBackgroundFlag } = useAuth();
  const { isDark } = useTheme();
  const { t } = useTranslation(['settings', 'health', 'info']);

  const [fontsLoaded] = useFonts({
    BricolageGrotesque_700Bold,
  });

  const setupDatabase = React.useCallback(async () => {
    try {
      startAuthentication();
      await initializeDatabase();
      unlockApp();
      endAuthentication();
      setAppState(createCheckingOnboardingState());
    } catch (error) {
      endAuthentication();
      if (error instanceof EncryptionError && error.code === ERROR_CODES.USER_CANCELLED) {
        clearKeyCache();
        await clearDatabaseCache();
        setAppState(createLockedState('auth_cancelled'));
      } else {
        console.error('[AppLayout] Database initialization error:', error);
        setAppState(createErrorState(error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  }, [unlockApp, startAuthentication, endAuthentication]);

  useEffect(() => {
    if (justReturnedFromBackground) {
      clearBackgroundFlag();
      if (appState.status === 'ready') {
        setAppState(createLockedState('background_return'));
      }
    }
  }, [justReturnedFromBackground, appState.status, clearBackgroundFlag]);

  useEffect(() => {
    if (appState.status === 'initializing' || appState.status === 'locked') {
      setupDatabase();
    }
  }, [appState.status, setupDatabase]);

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

  useEffect(() => {
    if (appState.status !== 'checking_onboarding') return;

    async function checkOnboardingStatus() {
      try {
        const status = await getSetting('onboardingCompleted');
        setAppState(createReadyState(status === 'true'));
      } catch (error) {
        console.error('[AppLayout] Failed to check onboarding status', error);
        setAppState(createReadyState(false));
      }
    }

    checkOnboardingStatus();
  }, [appState.status]);

  useEffect(() => {
    if (appState.status !== 'ready') return;

    if (initialRender) {
      setInitialRender(false);

      const inOnboardingPath = pathname.startsWith('/onboarding');

      if (!appState.onboardingComplete && !inOnboardingPath) {
        router.replace('/onboarding');
      }
    }
  }, [appState, pathname, router, initialRender]);

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
        <Text style={styles.errorTitle}>Database Error</Text>
        <Text style={styles.errorMessage}>{appState.error}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            try {
              clearKeyCache();
              await clearDatabaseCache();
              setAppState(createInitialState());
            } catch (error) {
              console.error('Failed to clear keys during retry:', error);
            }
          }}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (appState.status === 'locked') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.lockTitle}>Unlock Lunari</Text>
        {appState.reason === 'auth_cancelled' && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setAppState(createInitialState())}
          >
            <Text style={styles.buttonText}>Unlock</Text>
          </TouchableOpacity>
        )}
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
        {dynamicScreens.map(screen => {
          const titleValue = screen.titleKey?.includes(':') ? t(screen.titleKey) : screen.titleKey;
          
          return (
            <Stack.Screen
              key={screen.name}
              name={screen.name}
              options={{
                headerShown: screen.headerShown,
                headerTitle: titleValue,
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
          );
        })}
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
