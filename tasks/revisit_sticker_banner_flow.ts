import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { DecodeVinTask } from './DecodeVinTask';
import { clickWithHealing } from '../utils/selfHealingLocator';

export class RevisitStickerBannerFlow {
  async performAs(actor: Actor) {
    const page = actor.getPage();
    const timeout = process.env.CI ? 90000 : 60000;

    // 1. Navigate to valid sticker path
    const isInfiniti = page.url().includes('infinitiwindowsticker.com');
    const paths = isInfiniti ? ['/recalls'] : ['/window-sticker', '/window-stickers'];
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
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

    // 2. Perform VIN Decode
    await actor.attemptsTo(new DecodeVinTask(), false);

    // 3. Return to valid sticker path
    await page.goto(validPath);
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1000);

    // 4. Click dynamic 'Grab it for only' button with self-healing
    await clickWithHealing(
      page,
      'Grab it for',
      [
        'button:has-text("Grab it for")',
        'button:has-text("Grab it")',
        'button:has-text("Get Window Sticker")'
      ],
      { timeout: timeout }
    );

    // 5. Verify navigation to sticker preview page
    await page.waitForURL(/.*preview.*/, { timeout: timeout });
    
    // Check URL contains type=sticker AND content=revisit
    await expect(page).toHaveURL(/.*type=sticker.*/);
    await expect(page).toHaveURL(/.*content=revisit.*/);
    
    console.log('Passed: Revisit sticker banner flow verified.');
  }
}
