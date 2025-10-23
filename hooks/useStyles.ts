// hooks/useStyles.ts
import { useMemo } from 'react';
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
  return { typography, commonStyles };
}