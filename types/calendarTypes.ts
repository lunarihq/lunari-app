// Custom type for marked dates with today style
export type CustomMarking = {
  selected?: boolean;
  selectedColor?: string;
  customContainerStyle?: any;
  customStyles?: {
    container?: any;
    text?: any;
  };
  marked?: boolean;
  todayStyle?: {
    backgroundColor: string;
  };
  hasHealthLogs?: boolean;
};

// Type for date markers
export type MarkedDates = {
  [date: string]: CustomMarking;
};

// Rules for selection behavior
export type SelectionRules = {
  disableFuture?: boolean;
  autoSelectDays?: number;
};

// Styles for selected dates
export const DEFAULT_SELECTED_STYLE: CustomMarking = {
  selected: true,
  selectedColor: '#FF597B',
  customContainerStyle: {
    borderWidth: 2,
    borderColor: '#FF597B',
    backgroundColor: '#FFEAEE',
  },
  customStyles: {
    text: {
      color: '#FFFFFF',
    },
  },
};

// Helper function to create date string (YYYY-MM-DD)
export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to generate a range of dates
export function generateDateRange(startDate: string, days: number): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);

  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    dates.push(formatDateString(date));
  }

  return dates;
}

export default {} as never;
