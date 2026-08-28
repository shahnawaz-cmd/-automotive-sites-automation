import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { DecodeVinTask } from './DecodeVinTask';
import { clickWithHealing, locateElementWithHealing } from '../utils/selfHealingLocator';

export class RevisitBannerFlow {
  async performAs(actor: Actor) {
    const page = actor.getPage();
    const timeout = process.env.CI ? 90000 : 60000;

    // 1. Perform VIN Decode
    await actor.attemptsTo(new DecodeVinTask(), false);

    // 2. Navigate back to base URL using browser back
    await page.goBack();
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1000);

    // 3. Self-healing 'Grab it for only' button click
    await clickWithHealing(
      page,
      'Grab it for',
      [
        'button:has-text("Grab it for")',
        'button:has-text("Grab it")',
        'button:has-text("Get Window Sticker")',
        'button:has-text("Get Report")'
      ],
      { timeout: timeout }
    );

    // 4. Verify navigation to preview page with specific query parameters
    await page.waitForURL(/.*preview.*/, { timeout: timeout });
    
    // Check URL contains type=vhr AND content=revisit
    await expect(page).toHaveURL(/.*type=vhr.*/);
    await expect(page).toHaveURL(/.*content=revisit.*/);
    
    console.log('Passed: Revisit banner flow verified.');
  }
}
