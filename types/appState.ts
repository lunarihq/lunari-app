export type AppState =
  | { status: 'initializing' }
  | { status: 'locked'; reason: 'auth_cancelled' | 'background_return' }
  | { status: 'db_error'; error: string }
  | { status: 'checking_onboarding' }
  | { status: 'ready'; onboardingComplete: boolean };

export const createInitialState = (): AppState => ({ status: 'initializing' });

export const createLockedState = (
  reason: 'auth_cancelled' | 'background_return'
): AppState => ({ status: 'locked', reason });

export const createErrorState = (error: string): AppState => ({
  status: 'db_error',
  error,
});

export const createCheckingOnboardingState = (): AppState => ({
  status: 'checking_onboarding',
});

export const createReadyState = (onboardingComplete: boolean): AppState => ({
  status: 'ready',
  onboardingComplete,
});

