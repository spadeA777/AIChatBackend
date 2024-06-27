export const first = <T>(possibleArray?: T | T[]): T | undefined =>
  Array.isArray(possibleArray) ? possibleArray[0] : possibleArray
