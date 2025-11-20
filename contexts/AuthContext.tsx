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
import { useTranslation } from 'react-i18next';
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
  isAuthenticating: boolean;
  justReturnedFromBackground: boolean;
  lockApp: () => void;
  unlockApp: () => void;
  setLockEnabled: (enabled: boolean) => Promise<SetLockEnabledResult>;
  refreshLockStatus: () => Promise<void>;
  getDeviceSecurityType: () => Promise<string>;
  startPermissionRequest: () => void;
  endPermissionRequest: () => void;
  startAuthentication: () => void;
  endAuthentication: () => void;
  clearBackgroundFlag: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { t } = useTranslation('settings');
  const [isLocked, setIsLocked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appStateBackground, setAppStateBackground] = useState(false);
  const [isLockEnabled, setIsLockEnabledState] = useState(false);
  const [isDeviceSecurityAvailable, setIsDeviceSecurityAvailable] = useState(false);
  const [isReWrapping, setIsReWrapping] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [justReturnedFromBackground, setJustReturnedFromBackground] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const handleAppStateChange = useCallback(
    async (nextAppState: AppStateStatus) => {
      try {
        if (nextAppState === 'background' || nextAppState === 'inactive') {
          if (isAuthenticating) {
            return;
          }
          
          setAppStateBackground(true);
          if (isLockEnabled && !isRequestingPermission) {
            await clearKeyCache();
            await clearDatabaseCache();
          }
        } else if (nextAppState === 'active' && appStateBackground && isLockEnabled) {
          if (isRequestingPermission) {
            setAppStateBackground(false);
            return;
          }
          
          if (isAuthenticating) {
            setAppStateBackground(false);
            return;
          }
          
          const deviceSecurityAvailable = await AuthService.isDeviceSecurityAvailable();
          setIsDeviceSecurityAvailable(deviceSecurityAvailable);
          if (!deviceSecurityAvailable) {
            console.warn('[AuthContext] Device security not available');
            setIsLocked(true);
            setIsAuthenticated(false);
            setAppStateBackground(false);
            return;
          }

          setAppStateBackground(false);
          setJustReturnedFromBackground(true);
          setIsLocked(true);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('[AuthContext] Error handling app state change:', error);
        setAppStateBackground(false);
      }
    },
    [appStateBackground, isLockEnabled, isRequestingPermission, isAuthenticating]
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    return () => subscription?.remove();
  }, [handleAppStateChange]);

  const initializeAuth = async () => {
    try {
      const lockEnabled = await AuthService.isLockEnabled();
      const deviceSecurityAvailable = await AuthService.isDeviceSecurityAvailable();

      setIsLockEnabledState(lockEnabled);
      setIsDeviceSecurityAvailable(deviceSecurityAvailable);

      if (lockEnabled && !deviceSecurityAvailable) {
        console.warn('[AuthContext] Device security not available');
        setIsLocked(true);
        setIsAuthenticated(false);
        return;
      }

      if (lockEnabled) {
        setIsLocked(true);
        setIsAuthenticated(false);
      } else {
        setIsLocked(false);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('[AuthContext] Error initializing auth:', error);
    }
  };

  const lockApp = useCallback(() => {
    if (isLockEnabled) {
      setIsLocked(true);
      setIsAuthenticated(false);
    }
  }, [isLockEnabled]);

  const unlockApp = useCallback(() => {
    setIsLocked(false);
    setIsAuthenticated(true);
  }, []);

  const setLockEnabled = useCallback(async (enabled: boolean): Promise<SetLockEnabledResult> => {
    try {
      setIsReWrapping(true);

      await reWrapKEK(enabled);
      const success = await AuthService.setLockEnabled(enabled);
      
      if (success) {
        setIsLockEnabledState(enabled);
        if (!enabled) {
          setIsLocked(false);
          setIsAuthenticated(true);
        }
      } else {
        try {
          await reWrapKEK(!enabled);
        } catch (rollbackError) {
          console.error('[AuthContext] Rollback failed:', rollbackError);
          const rollbackErrorCode = rollbackError instanceof EncryptionError 
            ? rollbackError.code 
            : 'ROLLBACK_FAILED';
          
          return { 
            success: false, 
            error: t('appLockSettings.error.rewrapFailed'),
            errorCode: rollbackErrorCode
          };
        }
      }
      
      return { success };
    } catch (error) {
      if (error instanceof EncryptionError && error.code === ERROR_CODES.AUTHENTICATION_FAILED) {
        return { success: false, cancelled: true };
      }
      
      console.error('[AuthContext] Error setting lock:', error);
      const errorMessage = error instanceof EncryptionError 
        ? error.message 
        : error instanceof Error 
        ? error.message 
        : t('appLockSettings.error.message');
      
      const errorCode = error instanceof EncryptionError ? error.code : undefined;
      
      return { success: false, error: errorMessage, errorCode };
    } finally {
      setIsReWrapping(false);
    }
  }, [t]);

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
    setIsRequestingPermission(true);
  }, []);

  const endPermissionRequest = useCallback(() => {
    setIsRequestingPermission(false);
  }, []);

  const startAuthentication = useCallback(() => {
    setIsAuthenticating(true);
  }, []);

  const endAuthentication = useCallback(() => {
    setIsAuthenticating(false);
  }, []);

  const clearBackgroundFlag = useCallback(() => {
    setJustReturnedFromBackground(false);
  }, []);

  const value: AuthContextType = useMemo(() => ({
    isLocked,
    isAuthenticated,
    isLockEnabled,
    isDeviceSecurityAvailable,
    isReWrapping,
    isAuthenticating,
    justReturnedFromBackground,
    lockApp,
    unlockApp,
    setLockEnabled,
    refreshLockStatus,
    getDeviceSecurityType,
    startPermissionRequest,
    endPermissionRequest,
    startAuthentication,
    endAuthentication,
    clearBackgroundFlag,
  }), [
    isLocked,
    isAuthenticated,
    isLockEnabled,
    isDeviceSecurityAvailable,
    isReWrapping,
    isAuthenticating,
    justReturnedFromBackground,
    lockApp,
    unlockApp,
    setLockEnabled,
    refreshLockStatus,
    getDeviceSecurityType,
    startPermissionRequest,
    endPermissionRequest,
    startAuthentication,
    endAuthentication,
    clearBackgroundFlag,
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