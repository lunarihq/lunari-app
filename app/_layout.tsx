import React, { useEffect, useState, useRef } from 'react';
import { Stack, useRouter, useSegments, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { getSetting } from '../db';
import * as Notifications from 'expo-notifications';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const pathname = usePathname();
  const [initialRender, setInitialRender] = useState(true);
  const notificationResponseListener = useRef<Notifications.Subscription>();

  // Initialize notification response listener only (don't request permissions yet)
  useEffect(() => {
    async function setupNotificationListener() {
      // Set up notification response listener
      notificationResponseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
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
        Notifications.removeNotificationSubscription(notificationResponseListener.current);
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
            headerTitle: "Reminders",
            headerShadowVisible: false,
          }} 
        />
        <Stack.Screen 
          name="symptom-tracking" 
          options={{ 
            headerShown: true, 
            headerTitle: "Symptom Tracking",
            headerShadowVisible: false,
          }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
