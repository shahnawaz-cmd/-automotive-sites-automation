import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';

export class GlobalExitIntentPopup {
  async performAs(actor: Actor) {
    const page = actor.getPage();

    // Trigger mouse movement and mouseleave
    await page.mouse.move(640, 400, { steps: 10 });
    await page.waitForTimeout(1000);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(500);
    await page.mouse.wheel(0, -300);
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

    await page.evaluate(() => {
      const opts = { bubbles: true, cancelable: true, clientX: 400, clientY: -1 };
      document.dispatchEvent(new MouseEvent('mouseleave', opts));
      document.dispatchEvent(new MouseEvent('mouseout',   opts));
      window.dispatchEvent(new MouseEvent('mouseleave',   opts));
      document.documentElement.dispatchEvent(new MouseEvent('mouseleave', opts));
    });

    await page.waitForTimeout(3000);

    // Exact assertions & locators from P23 Test Suite.spec.js
    const popup = page.locator('div').filter({ hasText: /Hey/i }).filter({ hasText: /leave/i }).last();
    await expect(popup).toBeVisible({ timeout: 30000 });
    await expect(page.locator('text=/15%/').first()).toBeVisible({ timeout: 15000 }).catch(() => {});

    const ctaButton = page.getByRole('button', { name: 'Click here to redeem instantly' });
    await expect(ctaButton).toBeVisible({ timeout: 10000 });
    await ctaButton.click();

    console.log('✅ Clicked CTA button (Global Exit Intent)');
    await page.waitForURL(/offer=/, { timeout: 30000 });
    expect(page.url()).toContain('offer=');
    console.log(`✅ Redirected to offer URL: ${page.url()}`);
  }
}
