import React, { useEffect, useState, useRef } from 'react';
import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { initializeDatabase, getSetting, deleteDatabaseFile, clearDatabaseCache } from '../db';
import * as Notifications from 'expo-notifications';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { NotesProvider } from '../contexts/NotesContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { lightColors, darkColors } from '../styles/colors';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { EncryptionError, ERROR_CODES, clearKeyCache, clearAllKeys } from '../services/databaseEncryptionService';
import {
  useFonts,
  BricolageGrotesque_700Bold,
} from '@expo-google-fonts/bricolage-grotesque';
import '../i18n/config';
import { useTranslation } from 'react-i18next';

// Shared toast styles
const toastConfig = {
  style: { height: 48 },
  contentContainerStyle: { paddingHorizontal: 16, paddingVertical: 0 },
  text1Style: { fontSize: 16, fontWeight: '400' as const },
};

function AppContent() {
  const [isReady, setIsReady] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [authCancelled, setAuthCancelled] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const [initialRender, setInitialRender] = useState(true);
  const notificationResponseListener =
    useRef<Notifications.Subscription | null>(null);
  const { isLocked, unlockApp } = useAuth();
  const { isDark } = useTheme();
  const { t } = useTranslation(['settings', 'health', 'info']);

  // Load fonts
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_700Bold,
  });

  const setupDatabase = React.useCallback(async () => {
    try {
      await initializeDatabase();
      setDbInitialized(true);
      if (isLocked) {
        unlockApp();
      }
    } catch (error) {
      if (error instanceof EncryptionError) {
        switch (error.code) {
          case ERROR_CODES.USER_CANCELLED:
          case ERROR_CODES.AUTH_IN_PROGRESS:
            clearKeyCache();
            await clearDatabaseCache();
            setAuthCancelled(true);
            break;
          case ERROR_CODES.KEY_CORRUPTION:
            setDbError('CORRUPTION');
            break;
          case ERROR_CODES.SECURE_STORE_UNAVAILABLE:
            setDbError('SECURE_STORE_UNAVAILABLE');
            break;
          default:
            console.error('Failed to initialize database:', error);
            setDbError(error.message);
        }
      } else {
        console.error('Failed to initialize database:', error);
        setDbError(error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }, [isLocked, unlockApp]);

  // Reset DB state when app gets locked (after background)
  useEffect(() => {
    if (isLocked && dbInitialized) {
      setDbInitialized(false);
      setAuthCancelled(false);
    }
  }, [isLocked, dbInitialized]);

  // Initialize database (even if locked - this triggers biometric prompt)
  useEffect(() => {
    if (dbInitialized) return;
    setupDatabase();
  }, [dbInitialized, setupDatabase]);

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

  // Only check onboarding status once during initial mount (after DB is ready)
  useEffect(() => {
    if (!dbInitialized) return;

    async function checkOnboardingStatus() {
      try {
        const status = await getSetting('onboardingCompleted');
        setOnboardingCompleted(status === 'true');
      } catch (error) {
        console.error('Failed to check onboarding status', error);
        setOnboardingCompleted(false);
      } finally {
        setIsReady(true);
      }
    }

    checkOnboardingStatus();
  }, [dbInitialized]);

  // Handle initial redirect if needed
  useEffect(() => {
    if (!isReady) return;

    // Only redirect on initial app launch
    if (initialRender) {
      setInitialRender(false);

      const inOnboardingPath = pathname.startsWith('/onboarding');

      if (!onboardingCompleted && !inOnboardingPath) {
        // If onboarding not completed and not on onboarding screen,
        // redirect to onboarding
        router.replace('/onboarding');
      }
    }
  }, [isReady, onboardingCompleted, pathname, router, initialRender]);

  // Show database error screen
  if (dbError) {
    const isCorruption = dbError === 'CORRUPTION';
    const isSecureStoreUnavailable = dbError === 'SECURE_STORE_UNAVAILABLE';

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: isDark ? darkColors.background : lightColors.background }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: isDark ? darkColors.textPrimary : lightColors.textPrimary }}>
          {isCorruption ? 'Data Corruption Detected' : isSecureStoreUnavailable ? 'Security Unavailable' : 'Database Error'}
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 24, color: isDark ? darkColors.textSecondary : lightColors.textSecondary, textAlign: 'center' }}>
          {isCorruption
            ? 'Your encryption keys are corrupted and your data cannot be decrypted. To continue using the app, you must reset all data.'
            : isSecureStoreUnavailable
            ? 'Secure storage is not available on this device. The app cannot function without secure storage.'
            : dbError}
        </Text>
        {isCorruption ? (
          <TouchableOpacity
            style={{ paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#ef4444', borderRadius: 8 }}
            onPress={async () => {
              try {
                await clearAllKeys();
                await clearDatabaseCache();
                await deleteDatabaseFile();
                setDbError(null);
                setDbInitialized(false);
              } catch (error) {
                console.error('Failed to reset data:', error);
              }
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Reset All Data</Text>
          </TouchableOpacity>
        ) : !isSecureStoreUnavailable ? (
          <TouchableOpacity
            style={{ paddingHorizontal: 24, paddingVertical: 12, backgroundColor: isDark ? darkColors.primary : lightColors.primary, borderRadius: 8 }}
            onPress={async () => {
              try {
                clearKeyCache();
                await clearDatabaseCache();
                setDbError(null);
                setDbInitialized(false);
              } catch (error) {
                console.error('Failed to clear keys during retry:', error);
              }
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Retry</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  // Show loading/unlock screen while database initializes
  if (!dbInitialized || !isReady || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: isDark ? darkColors.background : lightColors.background }}>
        {isLocked ? (
          <>
            <Text style={{ fontSize: 28, fontWeight: '600', marginBottom: 24, color: isDark ? darkColors.textPrimary : lightColors.textPrimary }}>
              Unlock Lunari
            </Text>
            {authCancelled && (
              <TouchableOpacity
                style={{ paddingHorizontal: 24, paddingVertical: 12, backgroundColor: isDark ? darkColors.primary : lightColors.primary, borderRadius: 8 }}
                onPress={async () => {
                  setAuthCancelled(false);
                  await new Promise(resolve => setTimeout(resolve, 300)); // Wait for UI to update
                  setupDatabase();
                }}
              >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Unlock</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <ActivityIndicator size="large" color={isDark ? darkColors.primary : lightColors.primary} />
        )}
      </View>
    );
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="edit-period" options={{ headerShown: false }} />
        <Stack.Screen
          name="settings/calendar-view"
          options={{
            headerShown: true,
            headerTitle: 'Calendar view',
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: isDark
                ? darkColors.background
                : lightColors.background,
            },
            headerTintColor: isDark
              ? darkColors.textPrimary
              : lightColors.textPrimary,
          }}
        />
        <Stack.Screen
          name="settings/reminders"
          options={{
            headerShown: true,
            headerTitle: t('settings:screenTitles.reminders'),
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: isDark
                ? darkColors.background
                : lightColors.background,
            },
            headerTintColor: isDark
              ? darkColors.textPrimary
              : lightColors.textPrimary,
          }}
        />
        <Stack.Screen
          name="settings/app-lock"
          options={{
            headerShown: true,
            headerTitle: t('settings:screenTitles.appLock'),
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: isDark
                ? darkColors.background
                : lightColors.background,
            },
            headerTintColor: isDark
              ? darkColors.textPrimary
              : lightColors.textPrimary,
          }}
        />
        <Stack.Screen
          name="settings/about"
          options={{
            headerShown: true,
            headerTitle: t('settings:screenTitles.about'),
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: isDark
                ? darkColors.background
                : lightColors.background,
            },
            headerTintColor: isDark
              ? darkColors.textPrimary
              : lightColors.textPrimary,
          }}
        />
        <Stack.Screen
          name="settings/privacy-policy"
          options={{
            headerShown: true,
            headerTitle: t('settings:screenTitles.privacyPolicy'),
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: isDark
                ? darkColors.background
                : lightColors.background,
            },
            headerTintColor: isDark
              ? darkColors.textPrimary
              : lightColors.textPrimary,
          }}
        />
        <Stack.Screen
          name="health-tracking"
          options={{
            headerShown: true,
            headerTitle: t('health:tracking.screenTitle'),
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: isDark
                ? darkColors.background
                : lightColors.background,
            },
            headerTintColor: isDark
              ? darkColors.textPrimary
              : lightColors.textPrimary,
          }}
        />
        <Stack.Screen
          name="notes-editor"
          options={{
            headerShown: true,
            headerTitle: 'Notes',
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: isDark ? darkColors.panel : lightColors.panel,
            },
            headerTintColor: isDark
              ? darkColors.textPrimary
              : lightColors.textPrimary,
          }}
        />
        <Stack.Screen
          name="(info)/cycle-phase-details"
          options={{
            headerShown: true,
            headerTitle: t('info:screenTitles.todaysInsights'),
            headerShadowVisible: true,
            headerStyle: {
              backgroundColor: isDark
                ? darkColors.surface
                : lightColors.surfaceVariant,
            },
            headerTintColor: isDark
              ? darkColors.textPrimary
              : lightColors.textPrimary,
          }}
        />
        <Stack.Screen
          name="(info)/cycle-length-info"
          options={{
            headerShown: true,
            headerTitle: t('info:screenTitles.cycleLength'),
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: isDark
                ? darkColors.surface
                : lightColors.surface,
            },
            headerTintColor: isDark
              ? darkColors.textPrimary
              : lightColors.textPrimary,
          }}
        />
        <Stack.Screen
          name="(info)/period-length-info"
          options={{
            headerShown: true,
            headerTitle: t('info:screenTitles.periodLength'),
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: isDark
                ? darkColors.surface
                : lightColors.surface,
            },
            headerTintColor: isDark
              ? darkColors.textPrimary
              : lightColors.textPrimary,
          }}
        />
        <Stack.Screen
          name="(info)/late-period-info"
          options={{
            headerShown: true,
            headerTitle: t('info:screenTitles.latePeriod'),
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: isDark
                ? darkColors.surface
                : lightColors.surface,
            },
            headerTintColor: isDark
              ? darkColors.textPrimary
              : lightColors.textPrimary,
          }}
        />
        <Stack.Screen
          name="(info)/prediction-info"
          options={{
            headerShown: true,
            headerTitle: t('info:screenTitles.howPredictionsWork'),
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: isDark ? darkColors.panel : lightColors.panel,
            },
            headerTintColor: isDark
              ? darkColors.textPrimary
              : lightColors.textPrimary,
          }}
        />
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
