export const parseTimeTo24Hour = (time: string | null | undefined): number => {
  if (!time) return 0; // fallback for null/undefined

  time = time.trim();

  // Match standard "hh:mmAM/PM" or "hhAM/PM"
  let match = time.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (match) {
    let hour = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const modifier = match[3].toUpperCase();

    if (modifier === "PM" && hour !== 12) hour += 12;
    if (modifier === "AM" && hour === 12) hour = 0;

    return hour * 60 + minutes;
  }

  // Try to parse numeric strings like "1130" as HHMM
  const numeric = time.match(/^(\d{1,2})(\d{2})$/);
  if (numeric) {
    let hour = parseInt(numeric[1], 10);
    const minutes = parseInt(numeric[2], 10);
    if (hour >= 0 && hour <= 23 && minutes >= 0 && minutes <= 59) {
      return hour * 60 + minutes;
    }
  }

  // If all else fails, return 0
  return 0;
};
