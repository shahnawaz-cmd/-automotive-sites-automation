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

      // Wait for navigation more robustly
      await page.waitForLoadState('networkidle', { timeout: timeout });
      
      // Verify URL pattern after load
      await expect(page).toHaveURL(/.*vin-check\/license-preview/, { timeout: 5000 });

      // 3. Wait for success conditions
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
