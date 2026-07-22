import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { DecodeVinTask } from './DecodeVinTask';

export class RevisitStickerBannerFlow {
  async performAs(actor: Actor) {
    const page = actor.getPage();
    const decoder = new DecodeVinTask();

    // 1. Navigate to valid sticker path
    const paths = ['/window-sticker', '/window-stickers'];
    let validPath = null;
    
    for (const path of paths) {
      const response = await page.goto(path);
      if (response && response.status() === 200) {
        validPath = path;
        break;
      }
    }

    if (!validPath) {
      throw new Error('Failed: Neither /window-sticker nor /window-stickers paths are accessible.');
    }
    console.log(`Passed: Navigated to valid sticker path: ${validPath}`);
    await page.waitForLoadState('networkidle');

    // 2. Perform VIN Decode
    await actor.attemptsTo(decoder);

    // 3. Return to valid sticker path
    await page.goto(validPath);
    await page.waitForLoadState('networkidle');

    // 4. Click dynamic 'Grab it for only' button
    const timeout = process.env.CI ? 90000 : 60000;
    
    // Regex handles 'Grab it for only', 'Grab it for $', 'Grab it for €', etc.
    const grabItButton = page.getByRole('button', { name: /Grab it for/i });
    
    try {
      console.log(`Checking visibility for sticker banner on: ${page.url()}`);
      await expect(grabItButton).toBeVisible({ timeout: timeout });
      
      // Force click to handle potential overlays
      await grabItButton.click({ force: true });
    } catch (e) {
      console.error('Sticker banner button issue:', e);
      throw e;
    }

    // 5. Verify navigation to sticker preview page
    await page.waitForURL(/.*preview.*/, { timeout: timeout });
    
    // Check URL contains type=sticker AND content=revisit
    await expect(page).toHaveURL(/.*type=sticker.*/);
    await expect(page).toHaveURL(/.*content=revisit.*/);
    
    console.log('Passed: Revisit sticker banner flow verified.');
  }
}
