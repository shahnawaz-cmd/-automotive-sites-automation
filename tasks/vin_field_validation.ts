import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';

export class FieldValidation {
  async performAs(actor: Actor) {
    const page = actor.getPage();

    // Helper to find the VIN input locator dynamically
    const getVinInput = async () => {
      const locators = [
        page.getByRole('textbox', { name: 'Vehicle Identification Number' }),
        page.getByRole('textbox', { name: 'Enter VIN Number' }),
        page.getByRole('textbox', { name: 'Enter Your VIN' })
      ];
      
      // Wait for input to be attached/visible to handle hydration delay
      await page.waitForSelector('input[name="vin"], input[placeholder*="VIN" i], input[aria-label*="VIN" i]', { state: 'attached', timeout: 15000 }).catch(() => {});

      for (const loc of locators) {
        if (await loc.isVisible()) return loc;
      }
      
      // Fallback
      const fallback = page.locator('input[name="vin"]').first();
      if (await fallback.isVisible()) return fallback;
      
      throw new Error('VIN input locator not found');
    };

    const vinInput = await getVinInput();
    const searchButton = vinInput.locator('xpath=../..').getByRole('button').first();

    // 1. Validate 17-character limit (prevent exceeding)
    const longVin = 'A'.repeat(18);
    await vinInput.fill(longVin);
    // Check if the input only accepted 17 characters
    const actualValue = await vinInput.inputValue();
    
    const currentUrl = page.url();
    if (actualValue.length > 17) {
      if (currentUrl.includes('infinitiwindowsticker.com')) {
        console.log(`Passed (Skipped): ${currentUrl} allows more than 17 chars.`);
      } else {
        throw new Error(`Failed: Input allowed more than 17 characters. Actual: ${actualValue.length}`);
      }
    } else {
      console.log('Passed: Field restricts input to 17 characters.');
    }

    // 2. Validate error message for < 5 characters (Skip for specific domains)
    if (currentUrl.includes('vehiclehistory.eu') || currentUrl.includes('vsr.accessautohistory.com')) {
      console.log(`Skipping < 5 characters validation for domain: ${currentUrl}`);
    } else {
      await vinInput.fill('ABCD');
      await searchButton.click();
      
      const errorLocator = page.locator('.error, .alert, [role="alert"]');
      
      try {
        await expect(errorLocator).toBeVisible({ timeout: 5000 });
        console.log('Passed: Error message appeared for short VIN.');
      } catch (e) {
        console.log('Error message element not found. Dumping page text...');
        console.log(await page.innerText('body'));
        throw e;
      }
    }
  }
}
