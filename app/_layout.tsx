import React, { useEffect, useState, useRef } from 'react';
import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
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
  const { isLocked, unlockApp, startAuthentication, endAuthentication, justReturnedFromBackground, clearBackgroundFlag } = useAuth();
  const { isDark } = useTheme();
  const { t } = useTranslation(['settings', 'health', 'info']);

  // Load fonts
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_700Bold,
  });

  const setupDatabase = React.useCallback(async () => {
    try {
      startAuthentication();
      await initializeDatabase();
      setDbInitialized(true);
      unlockApp();
      endAuthentication();
    } catch (error) {
      endAuthentication();
      if (error instanceof EncryptionError && error.code === ERROR_CODES.USER_CANCELLED) {
        clearKeyCache();
        await clearDatabaseCache();
        setAuthCancelled(true);
      } else {
        console.error('[AppLayout] Database initialization error:', error);
        setDbError(error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }, [unlockApp, startAuthentication, endAuthentication]);

  useEffect(() => {
    if (justReturnedFromBackground) {
      clearBackgroundFlag();
      if (dbInitialized) {
        setDbInitialized(false);
        setAuthCancelled(false);
      }
    }
  }, [justReturnedFromBackground, dbInitialized, clearBackgroundFlag]);

  useEffect(() => {
    if (dbInitialized || authCancelled) {
      return;
    }
    
    setupDatabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbInitialized, authCancelled]);

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
    if (!dbInitialized) return;

    async function checkOnboardingStatus() {
      try {
        const status = await getSetting('onboardingCompleted');
        setOnboardingCompleted(status === 'true');
      } catch (error) {
        console.error('[AppLayout] Failed to check onboarding status', error);
        setOnboardingCompleted(false);
      } finally {
        setIsReady(true);
      }
    }

    checkOnboardingStatus();
  }, [dbInitialized]);

  useEffect(() => {
    if (!isReady) return;

    if (initialRender) {
      setInitialRender(false);

      const inOnboardingPath = pathname.startsWith('/onboarding');

      if (!onboardingCompleted && !inOnboardingPath) {
        router.replace('/onboarding');
      }
    }
  }, [isReady, onboardingCompleted, pathname, router, initialRender]);

  if (dbError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: isDark ? darkColors.background : lightColors.background }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: isDark ? darkColors.textPrimary : lightColors.textPrimary }}>
          Database Error
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 24, color: isDark ? darkColors.textSecondary : lightColors.textSecondary, textAlign: 'center' }}>
          {dbError}
        </Text>
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
      </View>
    );
  }

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
                onPress={() => {
                  setAuthCancelled(false);
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
