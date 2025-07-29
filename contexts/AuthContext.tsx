import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { AuthService } from '../services/authService';

interface AuthContextType {
  isLocked: boolean;
  isPinSet: boolean;
  isAuthenticated: boolean;
  canUseBiometric: boolean;
  lockApp: () => void;
  unlockApp: () => void;
  setupPin: (pin: string) => Promise<boolean>;
  verifyPin: (pin: string) => Promise<boolean>;
  checkPin: (pin: string) => Promise<boolean>;
  removePin: () => Promise<boolean>;
  refreshPinStatus: () => Promise<void>;
  authenticateWithBiometric: () => Promise<boolean>;
  setBiometricEnabled: (enabled: boolean) => Promise<boolean>;
  getBiometricType: () => Promise<string>;
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

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  // Handle app state changes for auto-lock
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [isPinSet]);

  const initializeAuth = async () => {
    try {
      const pinSet = await AuthService.isPinSet();
      const biometricAvailable = await AuthService.canUseBiometric();

      setIsPinSet(pinSet);
      setCanUseBiometric(biometricAvailable);

      // If PIN is set, app should be locked initially
      if (pinSet) {
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

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      setAppStateBackground(true);
    } else if (nextAppState === 'active' && appStateBackground && isPinSet) {
      // Lock app when returning from background if PIN is set
      setIsLocked(true);
      setIsAuthenticated(false);
      setAppStateBackground(false);
    }
  };

  const lockApp = () => {
    if (isPinSet) {
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

  const verifyPin = async (pin: string): Promise<boolean> => {
    try {
      const isValid = await AuthService.verifyPin(pin);
      if (isValid) {
        unlockApp();
      }
      return isValid;
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return false;
    }
  };

  const checkPin = async (pin: string): Promise<boolean> => {
    try {
      return await AuthService.verifyPin(pin);
    } catch (error) {
      console.error('Error checking PIN:', error);
      return false;
    }
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
      const result = await AuthService.authenticateWithBiometric();
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 