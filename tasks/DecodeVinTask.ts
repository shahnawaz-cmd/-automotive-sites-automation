import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';

export interface VinTaskSelectors {
  vinField1: string;
  vinField2: string;
  searchButton: string;
  accessButton: string;
  successText: string;
  successText2: string;
  successText3: string;
  successHeading: string;
  successHeading2: string;
}

export class DecodeVinTask {
  constructor(
    private timeout: number = 60000,
    private selectors: VinTaskSelectors = {
      vinField1: 'Vehicle Identification Number',
      vinField2: 'Enter VIN Number',
      searchButton: 'Search VIN',
      accessButton: 'Access Records',
      successText: 'Records found for',
      successText2: 'We found historical records for the',
      successText3: 'Window sticker found for',
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

  private generateUSVin(): string {
    const baseVin = '1FMCU9GD3JUC83708';
    return this.generateRandomVin(baseVin, 2);
  }

  async performAs(actor: Actor) {
    const page = actor.getPage();
    const vin = this.generateUSVin();
    console.log(`[VIN Decode] Generated VIN: ${vin}`);

    const vinField1 = page.getByRole('textbox', { name: this.selectors.vinField1 });
    const vinField2 = page.getByRole('textbox', { name: this.selectors.vinField2 });

    // Check which field is available and fill it
    if (await vinField1.isVisible()) {
      await vinField1.fill(vin);
    } else if (await vinField2.isVisible()) {
      await vinField2.fill(vin);
    } else {
      throw new Error('VIN input field not found');
    }

    // Interaction with the search button and wait for navigation
    const startTime = Date.now();
    // Use the container of the VIN field to find the specific search button
    const vinInput = (await vinField1.isVisible()) ? vinField1 : vinField2;
    await vinInput.locator('xpath=../..').getByRole('button', { name: this.selectors.searchButton }).click();
    
    await page.waitForLoadState('networkidle', { timeout: this.timeout });
    const duration = Date.now() - startTime;
    console.log(`[VIN Decode] Navigation to preview page took ${duration}ms`);

    // Ensure page content is loaded before interacting
    await page.waitForLoadState('domcontentloaded');

    // ponytail: Allow time for the page to render success state before checking
    await page.waitForTimeout(5000);

    // Wait until at least one of the success conditions appears
    const successCondition1 = page.locator(`text=${this.selectors.successText}`);
    const successCondition2 = page.locator(`text=${this.selectors.successText2}`);
    const successCondition3 = page.locator(`text=${this.selectors.successText3}`);
    const successCondition4 = page.getByRole('heading', { name: this.selectors.successHeading });
    const successCondition5 = page.getByRole('heading', { name: this.selectors.successHeading2 });

    await expect(async () => {
      const isVisible1 = await successCondition1.isVisible();
      const isVisible2 = await successCondition2.isVisible();
      const isVisible3 = await successCondition3.isVisible();
      const isVisible4 = await successCondition4.isVisible();
      const isVisible5 = await successCondition5.isVisible();
      if (!isVisible1 && !isVisible2 && !isVisible3 && !isVisible4 && !isVisible5) {
        throw new Error('Success condition not found');
      }
    }).toPass({ timeout: this.timeout });

    console.log('Success condition met.');
  }
}
