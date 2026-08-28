import { Page } from '@playwright/test';
import { clickWithHealing } from '../utils/selfHealingLocator';

// Helper class to trigger the exit intent banner with self-healing
export class ExitIntentHelper {
  static async triggerExitIntent(page: Page) {
    // Scroll and mouse movement logic to simulate human behavior
    await page.mouse.move(640, 400, { steps: 10 });
    await page.waitForTimeout(1000);
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(500);
    await page.mouse.wheel(0, -500);
    await page.waitForTimeout(500);

    await page.mouse.move(400, 600, { steps: 10 });
    await page.waitForTimeout(300);
    await page.mouse.move(400, 400, { steps: 10 });
    await page.waitForTimeout(300);
    await page.mouse.move(400, 200, { steps: 15 });
    await page.waitForTimeout(300);
    await page.mouse.move(400, 100, { steps: 15 });
    await page.waitForTimeout(300);
    await page.mouse.move(400, 10, { steps: 10 });
    await page.waitForTimeout(300);

    // Dispatch mouse events on the document and window
    await page.evaluate(() => {
      const opts = { bubbles: true, cancelable: true, clientX: 400, clientY: -1 };
      document.dispatchEvent(new MouseEvent('mouseleave', opts));
      document.dispatchEvent(new MouseEvent('mouseout', opts));
      window.dispatchEvent(new MouseEvent('mouseleave', opts));
      document.documentElement.dispatchEvent(new MouseEvent('mouseleave', opts));
    });

    await page.waitForTimeout(3000);

    // Self-healing popup button click
    const timeout = process.env.CI ? 10000 : 5000;
    try {
      await clickWithHealing(
        page,
        'Claim 15% Off',
        [
          'button:has-text("Claim 15% Off")',
          'button:has-text("Click here to redeem instantly")',
          'button:has-text("Take 15% off")',
          'button:has-text("Redeem 15% off")'
        ],
        { timeout }
      );
      console.log('Clicked exit intent pop-up button.');
    } catch (e) {
      console.log('pop-up not trigger');
    }
  }
}
