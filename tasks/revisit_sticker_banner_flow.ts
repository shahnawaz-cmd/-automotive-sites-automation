import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { DecodeVinTask } from './DecodeVinTask';
import { clickWithHealing } from '../utils/selfHealingLocator';

export class RevisitStickerBannerFlow {
  async performAs(actor: Actor) {
    const page = actor.getPage();
    const timeout = process.env.CI ? 60000 : 30000;

    // 1. Determine valid sticker path
    const isInfiniti = page.url().includes('infinitiwindowsticker.com');
    const validPath = isInfiniti ? '/recalls' : '/window-sticker';

    await page.goto(validPath, { waitUntil: 'domcontentloaded' }).catch(async () => {
      await page.goto('/window-stickers', { waitUntil: 'domcontentloaded' }).catch(() => {});
    });

    // 2. Perform VIN Decode using US VIN with skipSuccessClick = true
    await actor.attemptsTo(new DecodeVinTask(false, true, false));

    // 3. Fast return to sticker path
    await page.goto(validPath, { waitUntil: 'domcontentloaded' }).catch(async () => {
      await page.goto('/window-stickers', { waitUntil: 'domcontentloaded' }).catch(() => {});
    });

    // 4. Click dynamic 'Grab it for only' button with self-healing
    await clickWithHealing(
      page,
      'Grab it for',
      [
        'button:has-text("Grab it for")',
        'button:has-text("Grab it")',
        'button:has-text("Get Window Sticker")'
      ],
      { timeout: 10000, force: true }
    );

    // 5. Verify navigation to sticker preview page with specific query parameters
    await page.waitForURL(/.*(type=sticker.*content=revisit|content=revisit.*type=sticker).*/, { timeout: timeout, waitUntil: 'domcontentloaded' });
    
    // Check URL contains type=sticker AND content=revisit
    await expect(page).toHaveURL(/.*type=sticker.*/);
    await expect(page).toHaveURL(/.*content=revisit.*/);
    
    console.log('Passed: Revisit sticker banner flow verified.');
  }
}
