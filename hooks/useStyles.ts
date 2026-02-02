// hooks/useStyles.ts
import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../styles/theme';
import { createTypography } from '../styles/typography';
import { createCommonStyles } from '../styles/commonStyles';

export function useTypography() {
  const { colors } = useTheme();
  return useMemo(() => createTypography(colors), [colors]);
}

export function useCommonStyles() {
  const { colors } = useTheme();
  return useMemo(() => createCommonStyles(colors), [colors]);
}

// Bonus: Combined hook if components need both
export function useAppStyles() {
  const typography = useTypography();
  const commonStyles = useCommonStyles();
  const insets = useSafeAreaInsets();

  const scrollContentContainerWithSafeArea = useMemo(
    () => [
      commonStyles.scrollContentContainer,
      { paddingBottom: Math.max(insets.bottom, 16) }
    ],
    [commonStyles.scrollContentContainer, insets.bottom]
  );

  return { 
    typography, 
    commonStyles,
    scrollContentContainerWithSafeArea,
    insets
  };
}