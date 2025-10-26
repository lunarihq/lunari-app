import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { AuthService, PinVerificationResult } from '../services/authService';

type LockMode = 'none' | 'pin' | 'biometric';

interface AuthContextType {
  isLocked: boolean;
  isPinSet: boolean;
  isAuthenticated: boolean;
  canUseBiometric: boolean;
  lockMode: LockMode;
  lockApp: () => void;
  unlockApp: () => void;
  setupPin: (pin: string) => Promise<boolean>;
  verifyPin: (pin: string) => Promise<PinVerificationResult>;
  checkPin: (pin: string) => Promise<boolean>;
  removePin: () => Promise<boolean>;
  refreshPinStatus: () => Promise<void>;
  authenticateWithBiometric: () => Promise<boolean>;
  setBiometricEnabled: (enabled: boolean) => Promise<boolean>;
  getBiometricType: () => Promise<string>;
  checkLockoutStatus: () => Promise<{
    isLockedOut: boolean;
    lockoutUntil?: number;
    remainingMs?: number;
  }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLocked, setIsLocked] = useState(false);
  const [isPinSet, setIsPinSet] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appStateBackground, setAppStateBackground] = useState(false);
  const [canUseBiometric, setCanUseBiometric] = useState(false);
  const [lockMode, setLockMode] = useState<LockMode>('none');

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const mode = await AuthService.getLockMode();
      const pinSet = await AuthService.isPinSet();
      const biometricAvailable = await AuthService.canUseBiometric();

      setLockMode(mode);
      setIsPinSet(pinSet);
      setCanUseBiometric(biometricAvailable);

      // Check for biometric enrollment loss
      if (mode === 'biometric') {
        const enrolled = await AuthService.isBiometricEnrolled();
        if (!enrolled) {
          // Biometric was enabled but device enrollment removed
          await AuthService.setBiometricEnabled(false);
          setLockMode('none');
          setIsLocked(false);
          setIsAuthenticated(true);
          console.warn('App lock disabled - biometric data removed from device');
          return;
        }
      }

      // If lock is enabled, app should be locked initially
      if (mode !== 'none') {
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

  const handleAppStateChange = useCallback(
    async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        setAppStateBackground(true);
      } else if (nextAppState === 'active' && appStateBackground && lockMode !== 'none') {
        // Check for biometric enrollment loss when app becomes active
        if (lockMode === 'biometric') {
          const enrolled = await AuthService.isBiometricEnrolled();
          if (!enrolled) {
            await AuthService.setBiometricEnabled(false);
            setLockMode('none');
            setIsLocked(false);
            setIsAuthenticated(true);
            setAppStateBackground(false);
            console.warn('App lock disabled - biometric data removed from device');
            return;
          }
        }

        // Lock app when returning from background if lock is enabled
        setIsLocked(true);
        setIsAuthenticated(false);
        setAppStateBackground(false);
      }
    },
    [appStateBackground, lockMode]
  );

  // Handle app state changes for auto-lock
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    return () => subscription?.remove();
  }, [handleAppStateChange]);

  const lockApp = () => {
    if (lockMode !== 'none') {
      setIsLocked(true);
      setIsAuthenticated(false);
    }
  };

  const unlockApp = () => {
    setIsLocked(false);
    setIsAuthenticated(true);
  };

  const setupPin = async (pin: string): Promise<boolean> => {
    try {
      const success = await AuthService.setPin(pin);
      if (success) {
        setIsPinSet(true);
        setIsAuthenticated(true);
        setIsLocked(false);
      }
      return success;
    } catch (error) {
      console.error('Error setting up PIN:', error);
      return false;
    }
  };

  const verifyPin = async (pin: string): Promise<PinVerificationResult> => {
    try {
      const result = await AuthService.verifyPin(pin);
      if (result.success) {
        unlockApp();
      }
      return result;
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return { success: false, isLockedOut: false };
    }
  };

  const checkPin = async (pin: string): Promise<boolean> => {
    try {
      const result = await AuthService.verifyPin(pin);
      return result.success;
    } catch (error) {
      console.error('Error checking PIN:', error);
      return false;
    }
  };

  const checkLockoutStatus = async () => {
    return await AuthService.checkLockoutStatus();
  };

  const removePin = async (): Promise<boolean> => {
    try {
      const success = await AuthService.removePin();
      if (success) {
        setIsPinSet(false);
        setIsLocked(false);
        setIsAuthenticated(true);
      }
      return success;
    } catch (error) {
      console.error('Error removing PIN:', error);
      return false;
    }
  };

  const refreshPinStatus = async (): Promise<void> => {
    await initializeAuth();
  };

  const authenticateWithBiometric = async (): Promise<boolean> => {
    try {
      // For biometric-only mode, allow device fallback
      const disableDeviceFallback = lockMode === 'pin';
      const result = await AuthService.authenticateWithBiometric(disableDeviceFallback);
      if (result.success) {
        unlockApp();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error with biometric authentication:', error);
      return false;
    }
  };

  const setBiometricEnabled = async (enabled: boolean): Promise<boolean> => {
    try {
      const success = await AuthService.setBiometricEnabled(enabled);
      if (success) {
        const biometricAvailable = await AuthService.canUseBiometric();
        setCanUseBiometric(biometricAvailable);
      }
      return success;
    } catch (error) {
      console.error('Error setting biometric enabled:', error);
      return false;
    }
  };

  const getBiometricType = async (): Promise<string> => {
    try {
      const types = await AuthService.getBiometricType();
      if (types.includes(1)) return 'Touch ID';
      if (types.includes(2)) return 'Face ID';
      if (types.includes(3)) return 'Fingerprint';
      return 'Biometric';
    } catch (error) {
      console.error('Error getting biometric type:', error);
      return 'Biometric';
    }
  };

  const value: AuthContextType = {
    isLocked,
    isPinSet,
    isAuthenticated,
    canUseBiometric,
    lockMode,
    lockApp,
    unlockApp,
    setupPin,
    verifyPin,
    checkPin,
    removePin,
    refreshPinStatus,
    authenticateWithBiometric,
    setBiometricEnabled,
    getBiometricType,
    checkLockoutStatus,
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