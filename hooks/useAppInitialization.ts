import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { initializeDatabase, getSetting, clearDatabaseCache } from '../db';
import { useAuth } from '../contexts/AuthContext';
import {
  EncryptionError,
  ERROR_CODES,
  clearKeyCache,
} from '../services/databaseEncryptionService';
import {
  AppState,
  createInitialState,
  createLockedState,
  createErrorState,
  createCheckingOnboardingState,
  createReadyState,
} from '../types/appState';

/**
 * Manages app initialization flow: database setup → onboarding check → navigation.
 * Handles authentication, background locking, and error recovery.
 */
export function useAppInitialization() {
  const [appState, setAppState] = useState<AppState>(createInitialState());
  const [initialRender, setInitialRender] = useState(true);
  const setupInProgress = useRef(false);

  const router = useRouter();
  const pathname = usePathname();
  const {
    unlockApp,
    startAuthentication,
    endAuthentication,
    justReturnedFromBackground,
    clearBackgroundFlag,
  } = useAuth();

  const setupDatabase = useCallback(async () => {
    if (setupInProgress.current) return;
    setupInProgress.current = true;

    try {
      startAuthentication();
      await initializeDatabase();
      unlockApp();
      endAuthentication();
      setAppState(createCheckingOnboardingState());
    } catch (error) {
      endAuthentication();
      if (
        error instanceof EncryptionError &&
        error.code === ERROR_CODES.USER_CANCELLED
      ) {
        try {
          await clearKeyCache();
          await clearDatabaseCache();
        } catch (cleanupError) {
          console.error('[AppLayout] Cache cleanup failed:', cleanupError);
        } finally {
          setAppState(createLockedState('auth_cancelled'));
        }
      } else {
        console.error('[AppLayout] Database initialization error:', error);
        setAppState(
          createErrorState(
            error instanceof Error ? error.message : 'Unknown error'
          )
        );
      }
    } finally {
      setupInProgress.current = false;
    }
  }, [unlockApp, startAuthentication, endAuthentication]);

  const retryInitialization = useCallback(async () => {
    try {
      await clearKeyCache();
      await clearDatabaseCache();
    } catch (error) {
      console.error('Failed to clear keys during retry:', error);
    } finally {
      setAppState(createInitialState());
    }
  }, []);

  // Re-lock app when returning from background (security requirement)
  useEffect(() => {
    if (justReturnedFromBackground) {
      clearBackgroundFlag();
      setupInProgress.current = false;
      if (appState.status === 'ready') {
        setAppState(createLockedState('background_return'));
      }
    }
  }, [justReturnedFromBackground, appState.status, clearBackgroundFlag]);

  // Trigger database initialization when app starts or after background return
  useEffect(() => {
    if (
      appState.status === 'initializing' ||
      (appState.status === 'locked' && appState.reason === 'background_return')
    ) {
      setupDatabase();
    }
  }, [appState, setupDatabase]);

  // Check onboarding status after database is ready
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

  // Redirect to onboarding on first render if not completed
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

  return {
    appState,
    retryInitialization,
  };
}

