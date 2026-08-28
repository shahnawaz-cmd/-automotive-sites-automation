import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { fastInputWithHealing, clickWithHealing, locateElementWithHealing } from '../utils/selfHealingLocator';

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
    public shouldClose: boolean = true,
    public skipSuccessClick: boolean = false,
    public useEuVin: boolean = false,
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

  private generateEuVin(): string {
    const baseVins = [
      'VF3YC2MFB12G20874',
      'SHHEU88701U002012'
    ];
    const baseVin = baseVins[Math.floor(Math.random() * baseVins.length)];
    return this.generateRandomVin(baseVin, 1);
  }

  async performAs(actor: Actor) {
    const page = actor.getPage();
    const isMVL = page.url().includes('motorcyclevinlookup.com');
    const isEuSite = page.url().includes('vehiclehistory.eu');
    
    // Always use US VIN unless explicitly requested (useEuVin = true) or on vehiclehistory.eu
    const shouldGenerateEu = this.useEuVin || isEuSite;
    const vin = shouldGenerateEu ? this.generateEuVin() : this.generateUSVin(isMVL);
    console.log(`[VIN Decode] Generated VIN (${shouldGenerateEu ? 'EU' : 'US'}): ${vin}`);

    // Self-Healing Input: Fills VIN with multi-strategy accessibility, placeholder, label & attributes
    await fastInputWithHealing(
      page,
      'VIN',
      vin,
      [
        'input[name="vin"]',
        'input[placeholder*="VIN" i]',
        'input[aria-label*="VIN" i]',
        'input[type="text"]'
      ],
      { timeout: this.timeout }
    );

    // Self-Healing Button: Clicks search/decode button with multi-strategy
    await clickWithHealing(
      page,
      this.selectors.searchButton,
      [
        'button[type="submit"]',
        'button:has-text("Search")',
        'button:has-text("Decode")',
        'button:has-text("Get Window Sticker")',
        'button:has-text("Search VIN")'
      ]
    );

    await page.waitForTimeout(1000);

    // Self-Healing Success Element Detection
    const successLocator = page.getByText('Records found for', { exact: false })
      .or(page.locator('h1:has-text("Records found for")'))
      .or(page.locator('text=We found detailed information for the'))
      .or(page.locator('h2:has-text("We found")'))
      .or(page.getByRole('heading', { name: 'Success' }))
      .or(page.getByRole('heading', { name: 'Success! We found detailed' }))
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
      page.getByRole('heading', { name: 'Success! We found detailed' }),
      page.locator('h4:has-text("Success!")'),
      page.getByText('Success! We found detailed', { exact: false }),
      page.locator('text=Window sticker found for'),
      page.locator('text=We found historical records for the'),
      page.locator('text=Success!')
    ].filter(Boolean);

    let successClicked = false;

    // If skipSuccessClick is explicitly enabled, skip clicking the success banner
    if (this.skipSuccessClick) {
      console.log('[VIN Decode] Bypassing success banner click as requested by task parameters.');
      successClicked = true;
    } else {
      for (const locator of successLocators) {
        if (await locator.isVisible().catch(() => false)) {
          console.log('[VIN Decode] Clicking success element...');
          await locator.click().catch(() => {});
          successClicked = true;
          break;
        }
      }
    }

    if (!successClicked) {
      console.log('Failed to click success condition. Current URL:', page.url());
      throw new Error('Success condition not found');
    }

    console.log('Success condition met.');
  }
}