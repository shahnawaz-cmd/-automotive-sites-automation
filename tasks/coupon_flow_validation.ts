import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';

export class CouponAndPrevCouponVerification {
  async performAs(actor: Actor) {
    await this.couponTest(actor, 'preview15', '15%');
  }

  async couponTest(actor: Actor, couponCode: string, expectedDiscount: string) {
    const page = actor.getPage();

    // 1. Apply coupon via URL
    await page.goto(`/?offer=${couponCode}`);
    await page.waitForLoadState('networkidle');

    // 2. Verify Cookie (Key: 'coupon', Value is dynamic, but we just check presence)
    const cookies = await page.context().cookies();
    const couponCookie = cookies.find(c => c.name === 'coupon');
    if (!couponCookie) {
      throw new Error('Failed: Coupon cookie not found.');
    }
    console.log(`Passed: Cookie found. Name: ${couponCookie.name}, Value: ${couponCookie.value}`);

    // 3. Verify Banner with dynamic text
    // The banner text pattern: "You have received [Dynamic]% Discount!"
    const bannerLocator = page.locator(`text=You have received ${expectedDiscount} Discount!`);
    
    // Conditional timeout: Wait up to 10s for the banner to appear
    try {
      await expect(bannerLocator).toBeVisible({ timeout: 10000 });
      console.log(`Passed: Banner appeared with text: "You have received ${expectedDiscount} Discount!"`);
    } catch (e) {
      console.error(`Failed: Banner with text "You have received ${expectedDiscount} Discount!" did not appear.`);
      throw e;
    }
  }
}

export class LowToHighCouponFlow {
  async performAs(actor: Actor) {
    const page = actor.getPage();
    const verifier = new CouponAndPrevCouponVerification();

    // 1. Apply low discount coupon (preview15)
    console.log('--- Applying 1st Coupon: preview15 ---');
    await verifier.couponTest(actor, 'preview15', '15%');
    const firstCouponVal = (await page.context().cookies()).find(c => c.name === 'coupon')?.value;

    // 2. Apply high discount coupon (get20)
    console.log('--- Applying 2nd Coupon: get20 ---');
    await page.goto('/?offer=get20');
    await page.waitForLoadState('networkidle');
    
    // Verify cookies: coupon should be get20, prev_coupon should be preview15
    const cookies = await page.context().cookies();
    const couponCookie = cookies.find(c => c.name === 'coupon');
    const prevCouponCookie = cookies.find(c => c.name === 'prev_coupon');
    
    if (couponCookie?.value !== 'get20' || prevCouponCookie?.value !== firstCouponVal) {
      throw new Error(`Failed: Cookie verification failed. Coupon: ${couponCookie?.value}, Prev: ${prevCouponCookie?.value}`);
    }
    console.log('Passed: Cookie verification (coupon=get20, prev_coupon=preview15)');

    // 3. Verify Banner for high coupon (20%)
    await expect(page.locator('text=You have received 20% Discount!')).toBeVisible({ timeout: 10000 });
    console.log('Passed: Banner showed 20% Discount.');

    // 4. Apply low coupon again (preview15) - High should remain active
    console.log('--- Applying 1st Coupon again to verify no override ---');
    await page.goto('/?offer=preview15');
    await page.waitForLoadState('networkidle');

    // Expected: Banner should still show 20% (highest coupon not overridden)
    await expect(page.locator('text=You have received 20% Discount!')).toBeVisible({ timeout: 5000 });
    console.log('Passed: Highest coupon (20%) was NOT overridden by lower coupon.');
  }
}

export class CouponBannerOnOtherPages {
  async performAs(actor: Actor) {
    const page = actor.getPage();
    const verifier = new CouponAndPrevCouponVerification();

    // 1. Apply coupon on base URL and verify
    await verifier.couponTest(actor, 'preview15', '15%');

    // 2. Detect which path is valid
    const paths = ['/window-stickers', '/window-sticker'];
    let validPath = null;
    
    for (const path of paths) {
      const response = await page.goto(path);
      if (response && response.status() === 200) {
        validPath = path;
        break;
      }
    }

    if (!validPath) {
      throw new Error('Failed: Neither /window-stickers nor /window-sticker paths are accessible.');
    }

    console.log(`Passed: Navigated to valid path: ${validPath}`);
    await page.waitForLoadState('networkidle');

    // 3. Verify banner is still visible
    const bannerLocator = page.locator('text=You have received 15% Discount!');
    await expect(bannerLocator).toBeVisible({ timeout: 5000 });
    console.log('Passed: Banner persisted on the page: ' + validPath);
  }
}
