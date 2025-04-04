export function validatePeriodDate(date: string): boolean {
  const dateObj = new Date(date);
  
  // Allow dates up to 7 days in the future to accommodate auto-selection
  const maxFutureDate = new Date();
  maxFutureDate.setDate(maxFutureDate.getDate() + 7);
  
  // Check if it's a valid date and not too far in the future
  return !isNaN(dateObj.getTime()) && dateObj <= maxFutureDate;
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