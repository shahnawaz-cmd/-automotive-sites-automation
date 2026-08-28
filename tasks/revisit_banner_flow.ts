import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { DecodeVinTask } from './DecodeVinTask';
import { clickWithHealing } from '../utils/selfHealingLocator';

export class RevisitBannerFlow {
  async performAs(actor: Actor) {
    const page = actor.getPage();
    const timeout = process.env.CI ? 60000 : 30000;

    // 1. Perform VIN Decode with skipSuccessClick = true to navigate directly to preview without waiting for success banners
    await actor.attemptsTo(new DecodeVinTask(false, true, false));

    // 2. Fast navigate back to base URL
    await page.goBack({ waitUntil: 'domcontentloaded' });

    // 3. Fast Self-healing 'Grab it for only' revisit button click
    await clickWithHealing(
      page,
      'Grab it for',
      [
        'button:has-text("Grab it for")',
        'button:has-text("Grab it")',
        'button:has-text("Get Window Sticker")',
        'button:has-text("Get Report")'
      ],
      { timeout: 10000, force: true }
    );

    // 4. Verify fast navigation to preview page with specific query parameters
    await page.waitForURL(/.*(type=vhr.*content=revisit|content=revisit.*type=vhr).*/, { timeout: timeout, waitUntil: 'domcontentloaded' });
    
    // Validate required query params
    await expect(page).toHaveURL(/.*type=vhr.*/);
    await expect(page).toHaveURL(/.*content=revisit.*/);
    
    console.log('Passed: Revisit banner flow verified.');
  }
}
