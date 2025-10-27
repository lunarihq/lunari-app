interface CalendarColors {
  accentBlue: string;
  accentPinkLight: string;
  accentPink: string;
  white: string;
}

export type PredictionType = 'ovulation' | 'fertile' | 'next_period';

export interface CalendarDateStyle {
  customStyles: {
    container: {
      borderRadius: number;
      backgroundColor?: string;
      borderWidth?: number;
      borderColor?: string;
      borderStyle?: string;
    };
    text: {
      color: string;
    };
  };
  selected?: boolean;
}

/**
 * Pure function that returns styling for different calendar prediction types (used in view mode)
 */
export function getCalendarDateStyle(
  predictionType: PredictionType,
  colors: CalendarColors
): CalendarDateStyle {
  switch (predictionType) {
    case 'ovulation':
      return {
        customStyles: {
          container: {
            borderRadius: 16,
            borderWidth: 1.6,
            borderColor: colors.accentBlue,
            borderStyle: 'dashed',
          },
          text: {
            color: colors.accentBlue,
          },
        },
      };
    case 'fertile':
      return {
        customStyles: {
          container: {
            borderRadius: 16,
          },
          text: {
            color: colors.accentBlue,
          },
        },
      };
    case 'next_period':
      return {
        customStyles: {
          container: {
            borderRadius: 16,
            backgroundColor: colors.accentPinkLight,
          },
          text: {
            color: colors.accentPink,
          },
        },
      };
  }
}

/**
 * Returns styling for actual logged period dates (used in view mode)
 */
export function getPeriodDateStyle(colors: CalendarColors): CalendarDateStyle {
  return {
    customStyles: {
      container: {
        backgroundColor: colors.accentPink,
        borderRadius: 16,
      },
      text: {
        color: colors.white,
      },
    },
  };
}

/**
 * Returns styling for selected period dates (used in edit mode)
 */
export function createSelectedStyle(colors: CalendarColors): CalendarDateStyle {
  return {
    selected: true,
    customStyles: {
      container: {
        borderRadius: 16,
        backgroundColor: colors.accentPinkLight,
        borderWidth: 2,
        borderColor: colors.accentPink,
      },
      text: {
        color: colors.accentPink,
      },
    },
  };
}
