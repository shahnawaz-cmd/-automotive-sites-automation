// tasks/pricing/PricingApiParityTask.ts
import { Page, expect, test } from '@playwright/test';

export class PricingApiParityTask {
  async performAs(page: Page) {
    let apiPlans: any[] = [];

    await test.step('Step 1: Intercept & Fetch Pricing API Backend Data', async () => {
      console.log('📡 [Pricing] Fetching /api/pricing?sticker=0&dealer=1 relative to current project domain...');
      const response = await page.request.get('/api/pricing?sticker=0&dealer=1');
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.reportUser).toBeDefined();
      expect(data.reportUser.credit_plans).toBeInstanceOf(Array);
      expect(data.reportUser.credit_plans.length).toBeGreaterThan(0);

      apiPlans = data.reportUser.credit_plans;
      console.log(`✅ [API Validated] Found ${apiPlans.length} Personal plan(s):`, apiPlans.map((p: any) => `${p.nos} Reports = $${p.price}`));
    });

    await test.step('Step 2: Validate Personal Pricing Cards on UI', async () => {
      console.log('🔍 [Pricing] Validating Personal pricing cards render on page...');

      for (const plan of apiPlans) {
        const reportsLabel = `${plan.nos} Report`;
        const cardLocator = page.locator('*').filter({ hasText: new RegExp(`^${reportsLabel}`) }).first();
        await expect(cardLocator).toBeVisible({ timeout: 10000 });

        const priceLocator = page.locator('*').filter({ hasText: `$${plan.price}` }).first();
        await expect(priceLocator).toBeVisible({ timeout: 10000 });

        console.log(`   • Verified UI card: ${reportsLabel} at $${plan.price}`);
      }

      // Verify CTA Buttons render for plans
      const ctaButtons = page.getByRole('button', { name: /Get Report/i });
      const count = await ctaButtons.count();
      expect(count).toBeGreaterThan(0);

      console.log(`✅ [UI Validated] All ${apiPlans.length} Personal cards match backend API values.`);
    });
  }
}
