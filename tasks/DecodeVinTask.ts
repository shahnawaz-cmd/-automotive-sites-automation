import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';

export interface VinTaskSelectors {
  vinField1: string;
  vinField2: string;
  vinField3?: string;
  searchButton: string;
  accessButton: string;
  successText: string;
  successText2: string;
  successText3: string;
  successText4?: string;
  successHeading: string;
  successHeading2: string;
}

export class DecodeVinTask {
  constructor(
    private timeout: number = 60000,
    private selectors: VinTaskSelectors = {
      vinField1: 'Vehicle Identification Number',
      vinField2: 'Enter VIN Number',
      vinField3: 'Enter Your VIN',
      searchButton: 'Search VIN',
      accessButton: 'Access Records',
      successText: 'Records found for',
      successText2: 'We found historical records for the',
      successText3: 'Window sticker found for',
      successText4: 'Searching records for',
      successHeading: 'Success! We found detailed',
      successHeading2: 'We found detailed information for the',
    }
  ) {}

  private generateRandomVin(baseVin: string, numToReplace: number = 1): string {
    const randomDigits = Math.floor(Math.random() * Math.pow(10, numToReplace))
      .toString()
      .padStart(numToReplace, '0');
    return baseVin.slice(0, -numToReplace) + randomDigits;
  }

  private generateUSVin(isMVL: boolean = false): string {
    const baseVin = '1FMCU9GD3JUC83708';
    return this.generateRandomVin(baseVin, 2);
  }

  async performAs(actor: Actor, shouldClose: boolean = true) {
    const page = actor.getPage();
    const isMVL = page.url().includes('motorcyclevinlookup.com');
    const vin = this.generateUSVin(isMVL);
    console.log(`[VIN Decode] Generated VIN: ${vin}`);

    const vinField1 = page.getByRole('textbox', { name: this.selectors.vinField1 });
    const vinField2 = page.getByRole('textbox', { name: this.selectors.vinField2 });
    const vinField3 = this.selectors.vinField3 ? page.getByRole('textbox', { name: this.selectors.vinField3 }) : null;

    // Wait for input to be attached/visible to handle hydration delay
    await page.waitForSelector('input[name="vin"], input[placeholder*="VIN" i], input[aria-label*="VIN" i]', { state: 'attached', timeout: this.timeout }).catch(() => {});

    let vinInput = null;
    if (await vinField1.isVisible()) {
      vinInput = vinField1;
    } else if (await vinField2.isVisible()) {
      vinInput = vinField2;
    } else if (vinField3 && await vinField3.isVisible()) {
      vinInput = vinField3;
    }

    if (!vinInput) {
      // Fallback selector
      vinInput = page.locator('input[name="vin"]').first();
    }
    
    await vinInput.waitFor({ state: 'visible', timeout: this.timeout });
    await vinInput.fill(vin);

    const searchBtn = page.getByRole('button', { name: this.selectors.searchButton }).first();
    if (await searchBtn.isVisible()) {
      await searchBtn.click();
    } else {
      await vinInput.locator('xpath=../..').getByRole('button').first().click();
    }
    
    await page.waitForTimeout(1000);
// List of potential success elements to check and click
// Increased flexibility for locators to cover domain-specific variations
const successLocator = page.getByText('Records found for', { exact: false })
  .or(page.locator('h1:has-text("Records found for")'))
  .or(page.locator('text=We found detailed information for the'))
  .or(page.locator('h2:has-text("We found")'))
  .or(page.getByRole('heading', { name: 'Success' }))
  .or(page.getByRole('heading', { name: 'Success! We found detailed' }))
  .or(page.locator('h4:has-text("Success!")'))
  .or(page.getByText('Success! We found detailed', { exact: false }))
  .or(page.locator('text=Window sticker found for'))
  .or(page.locator('text=We found historical records for the'))
  .or(page.locator('text=Success!'));

// Wait up to 20 seconds for the success element to render on preview page
await successLocator.first().waitFor({ state: 'visible', timeout: 20000 }).catch(() => {
  console.log('Timeout waiting for success locator visibility');
});

const successLocators = [
  page.getByText('Records found for', { exact: false }),
  page.locator('h1:has-text("Records found for")'),
  page.locator('text=We found detailed information for the'),
  page.locator('h2:has-text("We found")'),
  page.getByRole('heading', { name: 'Success' }),
  page.getByRole('heading', { name: 'Success! We found detailed' }),
  page.locator('h4:has-text("Success!")'),
  page.getByText('Success! We found detailed', { exact: false }),
  page.locator('text=Window sticker found for'),
  page.locator('text=We found historical records for the'),
  page.locator('text=Success!')
].filter(Boolean);

let successClicked = false;
for (const locator of successLocators) {
  if (await locator.isVisible()) {
    console.log('[VIN Decode] Clicking success element...');
    await locator.click();
    successClicked = true;
    break;
  }
}

if (!successClicked) {
  console.log('Failed to click success condition. Current URL:', page.url());
  throw new Error('Success condition not found');
}

console.log('Success condition met.');
// Page closure is now handled by the caller, not here.
}
}

