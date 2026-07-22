import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { DecodeVinTask } from './DecodeVinTask';

export class RevisitBannerFlow {
  async performAs(actor: Actor) {
    const page = actor.getPage();
    const decoder = new DecodeVinTask();

    // 1. Perform VIN Decode
    await actor.attemptsTo(decoder);

    // 2. Navigate back to base URL explicitly
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 3. Click dynamic 'Grab it for only' button (case-insensitive, flexible currency symbol)
    const timeout = process.env.CI ? 90000 : 60000;
    
    // Add extra wait to ensure page is fully settled after back navigation
    await page.waitForLoadState('networkidle');
    
    // Regex handles 'Grab it for only', 'Grab it for $', 'Grab it for €', etc.
    const grabItButton = page.getByRole('button', { name: /Grab it for/i });
    
    try {
      console.log(`Checking visibility for: ${page.url()}`);
      await expect(grabItButton).toBeVisible({ timeout: timeout });
      
      const isEnabled = await grabItButton.isEnabled();
      console.log(`Button found. Visible: true, Enabled: ${isEnabled}`);
      
      // Force click to handle potential overlays
      await grabItButton.click({ force: true });
    } catch (e) {
      console.error('Grab it button issue:', e);
      console.log('Dumping page text:');
      console.log(await page.innerText('body'));
      throw e;
    }

    // 4. Verify navigation to preview page with specific query parameters
    // Wait for the URL to change to the preview page to ensure navigation occurred
    await page.waitForURL(/.*preview.*/, { timeout: timeout });
    
    // Check URL contains type=vhr AND content=revisit
    await expect(page).toHaveURL(/.*type=vhr.*/);
    await expect(page).toHaveURL(/.*content=revisit.*/);
    
    console.log('Passed: Revisit banner flow verified.');
  }
}
