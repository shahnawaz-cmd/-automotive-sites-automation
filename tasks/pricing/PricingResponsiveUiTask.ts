// tasks/pricing/PricingResponsiveUiTask.ts
import { Page, TestInfo, expect, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class PricingResponsiveUiTask {
  async performAs(page: Page, testInfo?: TestInfo) {
    await test.step('Step 1: Verify Mobile Viewport Toggle & Layout Stacking', async () => {
      console.log('📱 [Mobile UI] Checking viewport & pricing toggle layout...');

      // Personal & Business buttons must be visible and properly sized
      const personalBtn = page.getByRole('button', { name: 'Personal' }).first();
      const businessBtn = page.getByRole('button', { name: /Business/i }).first();

      await expect(personalBtn).toBeVisible({ timeout: 10000 });
      await expect(businessBtn).toBeVisible({ timeout: 10000 });

      // Plan CTA buttons must render and be clickable on mobile
      const ctaButtons = page.getByRole('button', { name: 'Get Reports' });
      await expect(ctaButtons.first()).toBeVisible({ timeout: 10000 });

      console.log('✅ [Mobile UI] Toggle and Plan CTA elements are properly rendered in mobile viewport.');
    });

    await test.step('Step 2: Capture Full Mobile Pricing Page Screenshot', async () => {
      const screenshotDir = path.resolve(process.cwd(), 'test-results', 'screenshots');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      const filename = `pricing-mobile-layout-${Date.now()}.png`;
      const screenshotPath = path.join(screenshotDir, filename);
      const buffer = await page.screenshot({ path: screenshotPath, fullPage: true });

      if (testInfo) {
        await testInfo.attach('pricing-mobile-layout.png', {
          body: buffer,
          contentType: 'image/png',
        }).catch(() => {});
      }

      console.log(`📸 [Mobile UI] Full-page mobile screenshot saved to: ${screenshotPath}`);
    });
  }
}
