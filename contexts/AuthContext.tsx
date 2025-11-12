import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { AuthService } from '../services/authService';
import { reWrapKEK, clearKeyCache, EncryptionError, ERROR_CODES } from '../services/databaseEncryptionService';
import { clearDatabaseCache } from '../db';

interface SetLockEnabledResult {
  success: boolean;
  cancelled?: boolean;
  error?: string;
  errorCode?: string;
}

interface AuthContextType {
  isLocked: boolean;
  isAuthenticated: boolean;
  isLockEnabled: boolean;
  isDeviceSecurityAvailable: boolean;
  isReWrapping: boolean;
  lockApp: () => void;
  unlockApp: () => void;
  setLockEnabled: (enabled: boolean) => Promise<SetLockEnabledResult>;
  refreshLockStatus: () => Promise<void>;
  getDeviceSecurityType: () => Promise<string>;
  startPermissionRequest: () => void;
  endPermissionRequest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLocked, setIsLocked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appStateBackground, setAppStateBackground] = useState(false);
  const [isLockEnabled, setIsLockEnabledState] = useState(false);
  const [isDeviceSecurityAvailable, setIsDeviceSecurityAvailable] = useState(false);
  const [isReWrapping, setIsReWrapping] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const handleAppStateChange = useCallback(
    async (nextAppState: AppStateStatus) => {
      console.log('[AuthContext] handleAppStateChange', {
        nextAppState,
        appStateBackground,
        isLockEnabled,
        isLocked,
        isAuthenticated,
        isRequestingPermission,
      });

      try {
        if (nextAppState === 'background' || nextAppState === 'inactive') {
          console.log('[AuthContext] App going to background/inactive');
          setAppStateBackground(true);
          if (isLockEnabled && !isRequestingPermission) {
            console.log('[AuthContext] Clearing key cache and database cache');
            clearKeyCache();
            await clearDatabaseCache();
          }
        } else if (nextAppState === 'active' && appStateBackground && isLockEnabled) {
          console.log('[AuthContext] App becoming active after background with lock enabled');
          
          if (isRequestingPermission) {
            console.log('[AuthContext] Returning from permission request, skipping lock');
            setAppStateBackground(false);
            return;
          }
          
          const deviceSecurityAvailable = await AuthService.isDeviceSecurityAvailable();
          console.log('[AuthContext] Device security available:', deviceSecurityAvailable);
          setIsDeviceSecurityAvailable(deviceSecurityAvailable);
          if (!deviceSecurityAvailable) {
            console.warn('[AuthContext] App lock remains enabled - device security not available');
            setIsLocked(true);
            setIsAuthenticated(false);
            setAppStateBackground(false);
            return;
          }

          console.log('[AuthContext] Setting app to locked state (forcing re-lock to trigger DB reset)');
          setIsLocked(false);
          setIsAuthenticated(false);
          setAppStateBackground(false);
          
          setTimeout(() => {
            console.log('[AuthContext] Now locking app after brief unlock');
            setIsLocked(true);
          }, 0);
        }
      } catch (error) {
        console.error('[AuthContext] Error handling app state change:', {
          nextAppState,
          isLockEnabled,
          appStateBackground,
          error,
        });
        setAppStateBackground(false);
      }
    },
    [appStateBackground, isLockEnabled, isLocked, isAuthenticated, isRequestingPermission]
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    return () => subscription?.remove();
  }, [handleAppStateChange]);

  const initializeAuth = async () => {
    console.log('[AuthContext] initializeAuth called');
    try {
      const lockEnabled = await AuthService.isLockEnabled();
      const deviceSecurityAvailable = await AuthService.isDeviceSecurityAvailable();

      console.log('[AuthContext] Auth status:', { lockEnabled, deviceSecurityAvailable });

      setIsLockEnabledState(lockEnabled);
      setIsDeviceSecurityAvailable(deviceSecurityAvailable);

      if (lockEnabled && !deviceSecurityAvailable) {
        console.warn('[AuthContext] App lock remains enabled - device security not available');
        setIsLocked(true);
        setIsAuthenticated(false);
        return;
      }

      if (lockEnabled) {
        console.log('[AuthContext] Lock is enabled, setting locked state');
        setIsLocked(true);
        setIsAuthenticated(false);
      } else {
        console.log('[AuthContext] Lock is disabled, setting unlocked state');
        setIsLocked(false);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('[AuthContext] Error initializing auth:', error);
    }
  };

  const lockApp = useCallback(() => {
    console.log('[AuthContext] lockApp called', { isLockEnabled });
    if (isLockEnabled) {
      setIsLocked(true);
      setIsAuthenticated(false);
    }
  }, [isLockEnabled]);

  const unlockApp = useCallback(() => {
    console.log('[AuthContext] unlockApp called');
    setIsLocked(false);
    setIsAuthenticated(true);
  }, []);

  const setLockEnabled = useCallback(async (enabled: boolean): Promise<SetLockEnabledResult> => {
    console.log('[AuthContext] setLockEnabled called', { enabled });
    try {
      setIsReWrapping(true);

      console.log('[AuthContext] Calling reWrapKEK...');
      await reWrapKEK(enabled);
      console.log('[AuthContext] reWrapKEK completed');

      console.log('[AuthContext] Setting lock enabled in AuthService...');
      const success = await AuthService.setLockEnabled(enabled);
      console.log('[AuthContext] AuthService.setLockEnabled result:', success);
      
      if (success) {
        setIsLockEnabledState(enabled);
        if (!enabled) {
          console.log('[AuthContext] Lock disabled, unlocking app');
          setIsLocked(false);
          setIsAuthenticated(true);
        }
      } else {
        console.log('[AuthContext] Failed to set lock enabled, rolling back...');
        try {
          await reWrapKEK(!enabled);
          console.log('[AuthContext] Rollback successful');
        } catch (rollbackError) {
          console.error('[AuthContext] Failed to rollback encryption state:', rollbackError);
          const rollbackMessage = rollbackError instanceof EncryptionError 
            ? rollbackError.message 
            : rollbackError instanceof Error 
            ? rollbackError.message 
            : 'Failed to rollback encryption state';
          
          const rollbackErrorCode = rollbackError instanceof EncryptionError 
            ? rollbackError.code 
            : 'ROLLBACK_FAILED';
          
          return { 
            success: false, 
            error: `Lock setting failed and rollback failed: ${rollbackMessage}`,
            errorCode: rollbackErrorCode
          };
        }
      }
      
      return { success };
    } catch (error) {
      if (error instanceof EncryptionError && error.code === ERROR_CODES.USER_CANCELLED) {
        console.log('[AuthContext] User cancelled authentication');
        return { success: false, cancelled: true };
      }
      
      console.error('[AuthContext] Error setting lock enabled:', error);
      const errorMessage = error instanceof EncryptionError 
        ? error.message 
        : error instanceof Error 
        ? error.message 
        : 'Failed to update app lock settings. Please try again.';
      
      const errorCode = error instanceof EncryptionError ? error.code : undefined;
      
      return { success: false, error: errorMessage, errorCode };
    } finally {
      setIsReWrapping(false);
    }
  }, []);

  const refreshLockStatus = useCallback(async (): Promise<void> => {
    await initializeAuth();
  }, []);

  const getDeviceSecurityType = useCallback(async (): Promise<string> => {
    try {
      const types = await AuthService.getDeviceSecurityType();
      if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
      }
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        return Platform.OS === 'ios' ? 'Face ID' : 'Facial Recognition';
      }
      if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        return 'Iris Recognition';
      }
      return 'Device passcode';
    } catch (error) {
      console.error('Error getting device security type:', error);
      return 'Device security';
    }
  }, []);

  const startPermissionRequest = useCallback(() => {
    console.log('[AuthContext] Starting permission request');
    setIsRequestingPermission(true);
  }, []);

  const endPermissionRequest = useCallback(() => {
    console.log('[AuthContext] Ending permission request');
    setIsRequestingPermission(false);
  }, []);

  const value: AuthContextType = useMemo(() => ({
    isLocked,
    isAuthenticated,
    isLockEnabled,
    isDeviceSecurityAvailable,
    isReWrapping,
    lockApp,
    unlockApp,
    setLockEnabled,
    refreshLockStatus,
    getDeviceSecurityType,
    startPermissionRequest,
    endPermissionRequest,
  }), [
    isLocked,
    isAuthenticated,
    isLockEnabled,
    isDeviceSecurityAvailable,
    isReWrapping,
    lockApp,
    unlockApp,
    setLockEnabled,
    refreshLockStatus,
    getDeviceSecurityType,
    startPermissionRequest,
    endPermissionRequest,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}