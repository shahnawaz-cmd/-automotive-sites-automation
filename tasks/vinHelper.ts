// Shared utility for VIN operations
export const generateRandomVin = (baseVin: string, numToReplace: number = 1): string => {
  const randomDigits = Math.floor(Math.random() * Math.pow(10, numToReplace))
    .toString()
    .padStart(numToReplace, '0');
  return baseVin.slice(0, -numToReplace) + randomDigits;
};

// US-specific VIN generator (randomizes last 2 characters)
export const generateUSVin = (): string => {
  const baseVin = '1FMCU9GD3JUC83708';
  // Last 2 characters, so replace 2 digits
  return generateRandomVin(baseVin, 2);
};
