import React, { useEffect, useState, useRef } from 'react';
import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { getSetting } from '../db';
import * as Notifications from 'expo-notifications';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { NotesProvider } from '../contexts/NotesContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { LockScreen } from '../components/LockScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { lightColors, darkColors } from './styles/colors';

function AppContent() {
  const [isReady, setIsReady] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const [initialRender, setInitialRender] = useState(true);
  const notificationResponseListener =
    useRef<Notifications.Subscription | null>(null);
  const { isLocked, isAuthenticated } = useAuth();
  const { isDark } = useTheme();

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
        Notifications.removeNotificationSubscription(
          notificationResponseListener.current
        );
      }
    };
  }, [router]);

  // Only check onboarding status once during initial mount
  useEffect(() => {
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
  }, []);

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

  if (!isReady) {
    return null;
  }

  // Show lock screen if app is locked
  if (isLocked && !isAuthenticated) {
    return (
      <>
        <LockScreen />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </>
    );
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="period-calendar" options={{ headerShown: false }} />
        <Stack.Screen
          name="reminders"
          options={{
            headerShown: true,
            headerTitle: 'Reminders',
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
          name="app-lock"
          options={{
            headerShown: true,
            headerTitle: 'App Lock',
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
          name="pin-setup"
          options={({ route }) => ({
            headerShown: true,
            headerTitle:
              (route.params as any)?.mode === 'change'
                ? 'Change PIN'
                : 'Set PIN',
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: isDark
                ? darkColors.background
                : lightColors.background,
            },
            headerTintColor: isDark
              ? darkColors.textPrimary
              : lightColors.textPrimary,
          })}
        />
        <Stack.Screen
          name="symptom-tracking"
          options={{
            headerShown: true,
            headerTitle: 'Symptom Tracking',
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
          name="cycle-phase-details"
          options={{
            headerShown: true,
            headerTitle: 'Cycle Details',
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
          name="cycle-info"
          options={{
            headerShown: true,
            headerTitle: 'Cycle Length',
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
          name="period-info"
          options={{
            headerShown: true,
            headerTitle: 'Period Length',
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
          name="late-period-info"
          options={{
            headerShown: true,
            headerTitle: 'Late Period Information',
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
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <NotesProvider>
            <AppContent />
          </NotesProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
