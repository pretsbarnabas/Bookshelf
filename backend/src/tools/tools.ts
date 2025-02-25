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

export function IsValidEmail(email: string): boolean{
  const emailRegex: RegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  return emailRegex.test(email)
}

export function minDate(){
  return new Date(0).toISOString().slice(0,-5)
}

export function maxDate(){
  return new Date(Date.now() + 2 * (60*60*1000)).toISOString().slice(0,-5)
}