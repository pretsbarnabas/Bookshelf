export function isValidISODate(dateString: string): boolean {
    // Regular expression to match 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm:ss.sssZ' formats
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(Z|([+-]\d{2}:\d{2}))?)?$/;
  
    // Check if the string matches the pattern
    if (!isoDatePattern.test(dateString)) {
      return false;
    }
  
    // Create a date object from the string
    const date = new Date(dateString);
  
    // Check if the date object is valid by comparing the string with the format
    // The comparison ensures that invalid dates like "2024-02-30" or "2024-13-01" are rejected
    return date.getTime() === new Date(dateString).getTime();
  }