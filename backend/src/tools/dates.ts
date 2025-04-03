export function minDate(){
    return new Date(-62167219200000).toISOString().slice(0,-5)
  }
  
  export function maxDate(){
    return new Date(Date.now() + 2 * (60*60*1000)).toISOString().slice(0,-5)
  }