import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';

export class FieldValidation {
  async performAs(actor: Actor) {
    const page = actor.getPage();

    // Helper to find the VIN input locator dynamically
    const getVinInput = async () => {
      const locators = [
        page.getByRole('textbox', { name: 'Vehicle Identification Number' }),
        page.getByRole('textbox', { name: 'Enter VIN Number' })
      ];
      for (const loc of locators) {
        if (await loc.isVisible()) return loc;
      }
      throw new Error('VIN input locator not found');
    };

    const vinInput = await getVinInput();
    const searchButton = page.getByRole('button', { name: 'Search VIN' });

    // 1. Validate 17-character limit (prevent exceeding)
    const longVin = 'A'.repeat(18);
    await vinInput.fill(longVin);
    // Check if the input only accepted 17 characters
    const actualValue = await vinInput.inputValue();
    if (actualValue.length > 17) {
      throw new Error(`Failed: Input allowed more than 17 characters. Actual: ${actualValue.length}`);
    }
    console.log('Passed: Field restricts input to 17 characters.');

    // 2. Validate error message for < 5 characters (Skip for specific domains)
    const currentUrl = page.url();
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
