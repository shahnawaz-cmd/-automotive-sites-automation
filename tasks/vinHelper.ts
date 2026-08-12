import { Page, Locator } from '@playwright/test';

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
  return generateRandomVin(baseVin, 2);
};

// Classic VIN generator (randomizes last 2 characters to numeric only)
export const generateClassicNumericVin = (baseVin: string = '242370B111346'): string => {
  return generateRandomVin(baseVin, 2);
};

// EU-specific VIN generator (randomizes last 1 character across 5 base VINs)
export const generateEuVin = (): string => {
  const baseVins = [
    'VF3YC2MFB12G20874',
    'WBY1Z62030V719559',
    'WV1ZZZSYZL9025249',
    'SHHEU88701U002012'
  ];
  const baseVin = baseVins[Math.floor(Math.random() * baseVins.length)];
  return generateRandomVin(baseVin, 1);
};

// Centralized robust VIN input locator
export const getRobustVinInput = async (page: Page): Promise<Locator> => {
  const vinSelectors = [
    'Vehicle Identification Number',
    'Enter VIN Number',
    'Enter Your VIN'
  ];
  
  for (const selector of vinSelectors) {
    const field = page.getByRole('textbox', { name: selector });
    if (await field.isVisible()) {
      return field;
    }
  }
  
  return page.getByPlaceholder(/enter vin/i).first();
};
