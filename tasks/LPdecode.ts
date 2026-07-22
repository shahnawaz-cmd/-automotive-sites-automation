import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';

export class LPcases {
  async performAs(actor: Actor) {
    const page = actor.getPage();
    const lpTab = page.getByRole('tab', { name: 'By License Plate' });
    
    // Set conditional timeout
    const timeout = process.env.CI ? 90000 : 60000;

    // 1. Check for tab existence without failing
    if (await lpTab.isVisible()) {
      console.log('LP Tab Found in Website');
      await lpTab.click();

      // 2. Perform Search
      await page.getByRole('textbox', { name: 'Enter License Plate' }).fill('HBL1216');
      await page.getByRole('combobox', { name: 'State' }).click();
      await page.getByRole('option', { name: 'Texas TX' }).click();
      

      const startTime = Date.now();
      await page.getByRole('button', { name: 'Search License Plate' }).click();
      
      // Wait for navigation more robustly
      await page.waitForLoadState('networkidle', { timeout: timeout });
      
      // Verify URL pattern after load
      await expect(page).toHaveURL(/.*vin-check\/license-preview/, { timeout: 5000 });
      
      console.log(`[LP Decode] Navigation to preview page took ${Date.now() - startTime}ms`);

      // 3. Wait for success conditions
      // Using conditional wait instead of hardcoded timeout
      await page.waitForTimeout(process.env.CI ? 10000 : 5000); 
      const successText = page.locator('text=Records found for');
      const successHeading = page.getByRole('heading', { name: 'Success! We found detailed' });

      await expect(async () => {
        const isVisible1 = await successText.isVisible();
        const isVisible2 = await successHeading.isVisible();
        if (!isVisible1 && !isVisible2) {
          throw new Error('Success condition not found');
        }
      }).toPass({ timeout: timeout });

      console.log('Success condition met.');
    } else {
      console.log('Tab not found');
    }
  }
}
