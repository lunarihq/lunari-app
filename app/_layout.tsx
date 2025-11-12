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

/*
 * DEBUG GUIDE - Double Biometric Prompt Issue
 * 
 * When debugging, look for these patterns in the logs:
 * 1. 🔐 BIOMETRIC PROMPT markers - these show when actual biometric auth is triggered
 * 2. setupDatabase call count - track how many times it's invoked
 * 3. previousLockState transitions - should only reset DB on false → true transition
 * 4. initializeEncryption flow - check if it's being called multiple times or caches are working
 * 5. App state changes - look for background/active transitions
 * 
 * Expected single prompt flow:
 * - App opens or comes from background
 * - setupDatabase is called once per unlock event
 * - initializeDatabase is called once
 * - initializeEncryption triggers ONE biometric prompt (if in protected mode)
 * - Database initialized successfully
 * 
 * Key behavior:
 * - On initial load: previousLockState is null, so no DB reset happens
 * - On background: isLocked goes false → true, DB state is reset (correct)
 * - On foreground: DB reinitializes with ONE prompt
 */
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
  const setupDatabaseCallCount = useRef(0);
  const previousLockState = useRef<boolean | null>(null);
  const { isLocked, unlockApp } = useAuth();
  const { isDark } = useTheme();
  const { t } = useTranslation(['settings', 'health', 'info']);

  console.log('[AppLayout] AppContent render', {
    isReady,
    onboardingCompleted,
    dbInitialized,
    dbError,
    authCancelled,
    isLocked,
  });

  // Load fonts
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_700Bold,
  });

  const setupDatabase = React.useCallback(async () => {
    setupDatabaseCallCount.current++;
    console.log('\n========================================');
    console.log(`[AppLayout] 🚀 setupDatabase INVOKED (Call #${setupDatabaseCallCount.current})`);
    console.log('[AppLayout] setupDatabase state:', {
      isLocked,
      dbInitialized,
      authCancelled,
    });
    console.log('========================================\n');

    try {
      console.log('[AppLayout] Calling initializeDatabase...');
      await initializeDatabase();
      console.log('[AppLayout] ✅ Database initialized successfully');
      
      setDbInitialized(true);
      console.log('[AppLayout] Set dbInitialized to true');
      
      if (isLocked) {
        console.log('[AppLayout] App was locked, calling unlockApp...');
        unlockApp();
      }
    } catch (error) {
      console.log('[AppLayout] ❌ Database initialization error:', error);
      if (error instanceof EncryptionError) {
        switch (error.code) {
          case ERROR_CODES.USER_CANCELLED:
          case ERROR_CODES.AUTH_IN_PROGRESS:
            console.log('[AppLayout] User cancelled or auth in progress, clearing caches');
            clearKeyCache();
            await clearDatabaseCache();
            setAuthCancelled(true);
            break;
          case ERROR_CODES.KEY_CORRUPTION:
            console.log('[AppLayout] Key corruption detected');
            setDbError('CORRUPTION');
            break;
          case ERROR_CODES.SECURE_STORE_UNAVAILABLE:
            console.log('[AppLayout] Secure store unavailable');
            setDbError('SECURE_STORE_UNAVAILABLE');
            break;
          default:
            console.error('[AppLayout] Failed to initialize database:', error);
            setDbError(error.message);
        }
      } else {
        console.error('[AppLayout] Failed to initialize database:', error);
        setDbError(error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }, [isLocked, unlockApp]);

  // Log when setupDatabase callback is recreated
  useEffect(() => {
    console.log('[AppLayout] setupDatabase callback recreated due to dependency change');
  }, [setupDatabase]);

  // Reset DB state when app gets locked (after background)
  // Only reset when transitioning FROM unlocked TO locked (not during initial load)
  useEffect(() => {
    console.log('[AppLayout] Lock state changed', {
      isLocked,
      dbInitialized,
      previousLockState: previousLockState.current,
    });

    // Only reset DB when transitioning from unlocked to locked (returning from background)
    const isTransitioningToLocked = previousLockState.current === false && isLocked === true;
    
    if (isTransitioningToLocked && dbInitialized) {
      console.log('[AppLayout] App transitioned to locked state, resetting DB state');
      setDbInitialized(false);
      setAuthCancelled(false);
    }
    
    // Update previous lock state for next comparison
    previousLockState.current = isLocked;
  }, [isLocked, dbInitialized]);

  // Initialize database (even if locked - this triggers biometric prompt)
  // Note: We intentionally omit setupDatabase from dependencies to prevent re-running
  // when the callback is recreated due to isLocked changing during AuthContext initialization
  useEffect(() => {
    console.log('[AppLayout] Database initialization effect triggered', {
      dbInitialized,
    });

    if (dbInitialized) {
      console.log('[AppLayout] Database already initialized, skipping');
      return;
    }
    
    console.log('[AppLayout] Starting database setup...');
    setupDatabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbInitialized]);

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
