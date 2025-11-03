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

interface AuthContextType {
  isLocked: boolean;
  isAuthenticated: boolean;
  isLockEnabled: boolean;
  isDeviceSecurityAvailable: boolean;
  lockApp: () => void;
  unlockApp: () => void;
  authenticate: () => Promise<boolean>;
  authenticateForSettings: () => Promise<boolean>;
  setLockEnabled: (enabled: boolean) => Promise<boolean>;
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

  useEffect(() => {
    initializeAuth();
  }, []);

  const handleAppStateChange = useCallback(
    async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        setAppStateBackground(true);
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

  const authenticate = async (): Promise<boolean> => {
    try {
      const result = await AuthService.authenticateWithDevice();
      if (result.success) {
        unlockApp();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error with authentication:', error);
      return false;
    }
  };

  const authenticateForSettings = async (): Promise<boolean> => {
    try {
      const result = await AuthService.authenticateForSettings();
      return result.success;
    } catch (error) {
      console.error('Error with settings authentication:', error);
      return false;
    }
  };

  const setLockEnabled = async (enabled: boolean): Promise<boolean> => {
    try {
      const success = await AuthService.setLockEnabled(enabled);
      if (success) {
        setIsLockEnabledState(enabled);
        if (!enabled) {
          setIsLocked(false);
          setIsAuthenticated(true);
        }
      }
      return success;
    } catch (error) {
      console.error('Error setting lock enabled:', error);
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
    lockApp,
    unlockApp,
    authenticate,
    authenticateForSettings,
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
