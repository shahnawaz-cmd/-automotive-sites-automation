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
