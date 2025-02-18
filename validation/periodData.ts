export function validatePeriodDate(date: string): boolean {
  const dateObj = new Date(date);
  
  // Check if it's a valid date and not in the future
  return !isNaN(dateObj.getTime()) && dateObj <= new Date();
}

// Optional: Add more specific validations
export function validatePeriodDates(dates: string[]): boolean {
  // Check if dates are too old (e.g., > 1 year)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  return dates.every(date => {
    const dateObj = new Date(date);
    return validatePeriodDate(date) && dateObj >= oneYearAgo;
  });
} 