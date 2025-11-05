import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { AuthService } from '../services/authService';
import { reWrapKEK, clearDEKCache } from '../services/databaseEncryptionService';
import { clearDatabaseCache } from '../db';

interface AuthContextType {
  isLocked: boolean;
  isAuthenticated: boolean;
  isLockEnabled: boolean;
  isDeviceSecurityAvailable: boolean;
  isReWrapping: boolean;
  lockApp: () => void;
  unlockApp: () => void;
  setLockEnabled: (enabled: boolean) => Promise<boolean | 'cancelled'>;
  refreshLockStatus: () => Promise<void>;
  getDeviceSecurityType: () => Promise<string>;
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

  useEffect(() => {
    initializeAuth();
  }, []);

  const handleAppStateChange = useCallback(
    async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        setAppStateBackground(true);
        if (isLockEnabled) {
          clearDEKCache();
          clearDatabaseCache();
        }
      } else if (nextAppState === 'active' && appStateBackground && isLockEnabled) {
        const deviceSecurityAvailable = await AuthService.isDeviceSecurityAvailable();
        if (!deviceSecurityAvailable) {
          await AuthService.setLockEnabled(false);
          setIsLockEnabledState(false);
          setIsLocked(false);
          setIsAuthenticated(true);
          setAppStateBackground(false);
          console.warn('App lock disabled - device security not available');
          return;
        }

        setIsLocked(true);
        setIsAuthenticated(false);
        setAppStateBackground(false);
      }
    },
    [appStateBackground, isLockEnabled]
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
        await AuthService.setLockEnabled(false);
        setIsLockEnabledState(false);
        setIsLocked(false);
        setIsAuthenticated(true);
        console.warn('App lock disabled - device security not available');
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
      console.error('Error initializing auth:', error);
    }
  };

  const lockApp = () => {
    if (isLockEnabled) {
      setIsLocked(true);
      setIsAuthenticated(false);
    }
  };

  const unlockApp = () => {
    setIsLocked(false);
    setIsAuthenticated(true);
  };

  const setLockEnabled = async (enabled: boolean): Promise<boolean | 'cancelled'> => {
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
        await reWrapKEK(!enabled);
      }
      
      setIsReWrapping(false);
      return success;
    } catch (error) {
      setIsReWrapping(false);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage === 'USER_CANCELLED') {
        console.log('User cancelled biometric prompt');
        return 'cancelled';
      }
      
      console.error('Error setting lock enabled:', error);
      try {
        await reWrapKEK(!enabled);
      } catch (rollbackError) {
        console.error('Error rolling back encryption:', rollbackError);
      }
      return false;
    }
  };

  const refreshLockStatus = async (): Promise<void> => {
    await initializeAuth();
  };

  const getDeviceSecurityType = async (): Promise<string> => {
    try {
      const types = await AuthService.getDeviceSecurityType();
      if (types.includes(1)) return 'Touch ID';
      if (types.includes(2)) return 'Face ID';
      if (types.includes(3)) return 'Fingerprint';
      return 'Device passcode';
    } catch (error) {
      console.error('Error getting device security type:', error);
      return 'Device security';
    }
  };

  const value: AuthContextType = {
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
