import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';

export class LPcases {
  async performAs(actor: Actor) {
    const page = actor.getPage();
    
    // Check both potential tab naming patterns
    const lpTab = page.getByRole('tab', { name: 'By License Plate' });
    const lpTabAlt = page.getByRole('button', { name: 'By U.S License Plate' });

    let activeTab = null;

    if (await lpTab.isVisible()) {
      activeTab = lpTab;
    } else if (await lpTabAlt.isVisible()) {
      activeTab = lpTabAlt;
    }

    if (activeTab) {
      console.log('LP Tab Found in Website');
      await activeTab.click();
    
      // Set conditional timeout
      const timeout = process.env.CI ? 90000 : 60000;

      // Perform requested interactions
      await page.getByRole('textbox', { name: 'Enter License Plate' }).fill('HBL1216');
      
      // Handle State selection robustly
      await page.getByRole('combobox').click();
      await page.getByRole('option', { name: 'Texas' }).click();
      
      // Locate and click search button
      const searchBtn = page.getByRole('button', { name: 'Get Window Sticker' });
      const altSearchBtn = page.getByRole('button', { name: 'Search License Plate' });

      if (await searchBtn.isVisible()) {
        await searchBtn.click();
      } else if (await altSearchBtn.isVisible()) {
        await altSearchBtn.click();
      } else {
        throw new Error('Search button not found');
      }

      // Wait for navigation and URL match using smart waits
      await page.waitForURL(/.*vin-check\/license-preview/, { timeout: timeout, waitUntil: 'domcontentloaded' });

      // 3. Smart wait for success conditions
      const successText = page.locator('text=Records found for');
      const successHeading = page.getByRole('heading', { name: 'Success! We found detailed' });
      const combinedSuccess = successText.or(successHeading);

      await combinedSuccess.first().waitFor({ state: 'visible', timeout: timeout });

      console.log('Success condition met.');
    } else {
      console.log('Tab not found');
    }
  }
}
