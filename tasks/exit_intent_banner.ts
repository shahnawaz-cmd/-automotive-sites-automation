import { Page } from '@playwright/test';

// Helper class to trigger the exit intent banner
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
    await page.mouse.move(400, 10,  { steps: 10 });
    await page.waitForTimeout(300);

    // Dispatch mouse events on the document and window
    await page.evaluate(() => {
      const opts = { bubbles: true, cancelable: true, clientX: 400, clientY: -1 };
      document.dispatchEvent(new MouseEvent('mouseleave', opts));
      document.dispatchEvent(new MouseEvent('mouseout',   opts));
      window.dispatchEvent(new MouseEvent('mouseleave',   opts));
      document.documentElement.dispatchEvent(new MouseEvent('mouseleave', opts));
    });

    await page.waitForTimeout(3000);

    // Check for the pop-up buttons
    const claim15Btn = page.getByRole('button', { name: 'Claim 15% Off' });
    const redeemBtn = page.getByRole('button', { name: 'Click here to redeem instantly' });
    const take15Btn = page.getByRole('button', { name: 'Take 15% off' });
    
    // Combine locators
    const popupBtn = claim15Btn.or(redeemBtn).or(take15Btn);
    
    // Condition based timeout
    const timeout = process.env.CI ? 10000 : 5000;
    
    try {
      // Wait a short time for the pop-up animation/render
      await popupBtn.first().waitFor({ state: 'visible', timeout: timeout });
      await popupBtn.first().click();
      console.log('Clicked exit intent pop-up button.');
    } catch (e) {
      console.log('pop-up not trigger');
    }
  }
}
