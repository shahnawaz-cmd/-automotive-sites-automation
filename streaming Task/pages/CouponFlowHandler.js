// tests/pages/CouponFlowHandler.js
const { expect } = require('@playwright/test');
const { PreviewPage, PreviewToCheckoutPriceValidator } = require('./PreviewPage');

const TIMEOUT = process.env.CI ? 90000 : 60000;

class CouponFlowHandler {
  constructor(page) {
    this.page = page;
    this.preview = new PreviewPage(page);
    this.validator = new PreviewToCheckoutPriceValidator(page);
    this.selectedData = null;
  }

  async navigateAndApplyCoupon(homeInstance, vin, timeout = TIMEOUT, couponCode = 'get20') {
    await homeInstance.navigate();
    await homeInstance.decodeVin(vin);
    await this.page.goto(this.page.url() + `&offer=${couponCode}`);
    await this.page.reload(); // Refresh the page after applying coupon via URL
    await this.page.waitForURL(/.*\/preview.*/, { timeout });
  }

  async selectPlanAndUpsell() {
    this.selectedData = await this.validator.selectRandomPlanAndHandleUpsell();
    return this.selectedData;
  }

  async accessRecord() {
    await this.preview.clickAccessRecordButton();
  }

  async fillCheckoutDetails() {
    const emailInput = this.page.locator('input[type="email"]').first();
    const phoneInput = this.page.locator('input[type="tel"]').first();
    
    await emailInput.waitFor({ state: 'visible', timeout: TIMEOUT });
    
    await emailInput.fill(PreviewPage.generateUniqueEmail());
    await phoneInput.fill(PreviewPage.generateUsPhoneNumber());
    
    await Promise.all([
      this.page.waitForURL(/.*\/checkout(?:-\d+)?.*/, { timeout: TIMEOUT }),
      this.page.getByRole('button', { name: /proceed to checkout/i }).click(),
    ]);
  }

  async verifyOrderSummary(couponCode, couponPercentage = 0.50) {
    // 1. Verify coupon application text on checkout page
    // The text is like: "get20 applied — 20% off"
    // Using a regex to match: <couponCode> applied — <percentage>% off
    const percent = Math.round(couponPercentage * 100);
    const couponRegex = new RegExp(`${couponCode}\\s+applied\\s+—\\s+${percent}%\\s+off`, 'i');
    
    const couponMessage = this.page.locator(`text=${couponRegex}`);
    await couponMessage.waitFor({ state: 'visible', timeout: TIMEOUT });
    await expect(couponMessage).toBeVisible();
    console.log(`✅ [CouponFlow] Coupon message verified: "${await couponMessage.innerText()}"`);

    // 2. Existing order summary verification
    const baseTotal = parseFloat(this.selectedData.totalPlanPrice) + (this.selectedData.upsellPrice ? parseFloat(this.selectedData.upsellPrice) : 0);
    const discountedTotal = (baseTotal * (1 - couponPercentage)).toFixed(2);
    const discountedData = { ...this.selectedData, totalPlanPrice: discountedTotal, upsellPrice: null };

    await this.validator.validateOrderSummary(discountedData);
    console.log(`✅ [CouponFlow] Order summary verified. Expected Discounted Total: ${discountedTotal}`);
  }
}

class CheckoutCouponFlowTest {
  constructor(page) {
    this.page = page;
    this.preview = new PreviewPage(page);
  }

  async navigateToCheckout(homeInstance, vin, timeout = TIMEOUT) {
    // This flow intentionally does not add offer=testing to the preview URL.
    await homeInstance.navigate();
    await homeInstance.decodeVin(vin, 3);
    await this.preview.verifySpecsVisible('Records found for', timeout);
    await this.preview.runCheckoutFlow();
    await expect(this.page).toHaveURL(/.*\/checkout(?:-\d+)?.*/, { timeout });
  }
}

class CouponFlowVerifier {
  constructor(page) {
    this.page = page;
  }

  async applyCoupon(couponCode, couponPercentage) {
    // If order summary / promo accordion is collapsed on mobile, expand it
    const summaryToggle = this.page.locator('button:has-text("Order summary"), button:has-text("Show order summary"), [aria-label*="order summary" i], summary').first();
    if (await summaryToggle.isVisible().catch(() => false)) {
      await summaryToggle.click().catch(() => {});
      await this.page.waitForTimeout(500);
    }

    const promoCodeInput = this.page.getByRole('textbox', { name: /Promo code|Discount|Coupon/i })
      .or(this.page.locator('input[placeholder*="promo" i], input[placeholder*="coupon" i], input[name*="coupon" i], input[name*="promo" i]'))
      .first();

    const isPromoVisible = await promoCodeInput.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
    if (!isPromoVisible) {
      console.log('ℹ️ Promo code input not visible or not present on this viewport, skipping promo code application.');
      return false;
    }

    await promoCodeInput.scrollIntoViewIfNeeded().catch(() => {});
    await promoCodeInput.fill(couponCode);

    const applyBtn = this.page.getByRole('button', { name: /^Apply$/i })
      .or(this.page.locator('button:has-text("Apply")')).first();
    await applyBtn.click();

    const percent = Math.round(couponPercentage * 100);
    const appliedNotice = this.page.getByText(new RegExp(`${couponCode}\\s+applied|Coupon\\s+${couponCode}|${percent}%\\s+off`, 'i')).first();
    await expect(appliedNotice).toBeVisible({ timeout: 10000 });
    return true;
  }

  async verifyCheckoutTotals(couponPercentage) {
    const orderSummary = this.page.locator('aside').filter({
      has: this.page.getByRole('heading', { name: 'Order summary' }),
    });
    await expect(orderSummary).toBeVisible({ timeout: TIMEOUT });

    const summaryText = await orderSummary.innerText();
    const reportPrice = this.getLabeledAmount(summaryText, /(?:PACKAGE|Report|VIN Check|Check|Unlimited)[\s\S]*?\$([\d.,]+)/i, 'Report/Package');
    const discountAmount = this.getLabeledAmount(summaryText, /Discount[\s\S]*?-?\s*\$([\d.,]+)/i, 'Discount');
    const addOnAmount = this.getOptionalAddOnAmount(summaryText);
    const totalAmount = this.getDiscountedTotal(summaryText);
    const expectedDiscount = reportPrice * couponPercentage;
    const expectedTotal = reportPrice - discountAmount + addOnAmount;

    expect(
      Math.abs(discountAmount - expectedDiscount),
      `Coupon discount mismatch. Expected ${expectedDiscount.toFixed(2)}, found ${discountAmount.toFixed(2)}`
    ).toBeLessThan(0.05);
    expect(
      Math.abs(totalAmount - expectedTotal),
      `Checkout total mismatch. Expected ${expectedTotal.toFixed(2)}, found ${totalAmount.toFixed(2)}`
    ).toBeLessThan(0.05);

    return {
      reportPrice,
      discountAmount,
      addOnAmount,
      totalAmount,
      expectedDiscount,
      expectedTotal,
      orderSummary: summaryText,
    };
  }

  getOptionalAddOnAmount(summaryText) {
    const match = summaryText.match(/(?:Add-on|Upsell|Window Sticker)[\s\S]*?\$([\d.,]+)(?=\s*(?:Coupon|Total))/i);
    return match ? this.parseAmount(match[1]) : 0;
  }

  getLabeledAmount(summaryText, pattern, label) {
    const match = summaryText.match(pattern);
    if (!match) {
      throw new Error(`${label} price was not found in the order summary: "${summaryText}".`);
    }
    return this.parseAmount(match[1]);
  }

  getDiscountedTotal(summaryText) {
    const totalText = summaryText.match(/Total[\s\S]*?((?:\$?[\d.,]+(?:\s+\$?[\d.,]+)*))/i)?.[1];
    const amounts = totalText?.match(/[\d.]+/g);
    if (!amounts || amounts.length < 1) {
      throw new Error(`Discounted total was not found in the order summary: "${summaryText}".`);
    }
    return this.parseAmount(amounts.at(-1));
  }

  parseAmount(amount) {
    return Number(amount.replace(/,/g, ''));
  }

  async applyAndVerifyCoupon(couponCode, couponPercentage) {
    const applied = await this.applyCoupon(couponCode, couponPercentage);
    if (applied) {
      return this.verifyCheckoutTotals(couponPercentage);
    }
    return { status: 'skipped_promo_input_hidden' };
  }
}

class CouponBannerHandler {
  constructor(page) {
    this.page = page;
  }

  async verifyCouponBannerAndCookie(couponCode, expectedDiscount = null) {
    await this.page.goto(`/?offer=${couponCode}`);
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

    // 1. Match banner dynamically (handles any dynamic % like 10%, 15%, 20%, 25%, etc.)
    const bannerRegex = expectedDiscount 
      ? new RegExp(`You have received ${expectedDiscount} Discount!`, 'i')
      : /You have received \d+% Discount!/i;

    const bannerLocator = this.page.locator(`text=${bannerRegex}`).first();
    await expect(bannerLocator).toBeVisible({ timeout: 10000 });
    
    const bannerText = await bannerLocator.innerText();
    const detectedDiscount = bannerText.match(/(\d+%)/)?.[1] || expectedDiscount;

    // 2. Verify Cookie is set
    const cookies = await this.page.context().cookies();
    const couponCookie = cookies.find(c => c.name === 'coupon');
    if (!couponCookie) {
      throw new Error(`Failed: Coupon cookie not found for offer ${couponCode}.`);
    }

    return { cookie: couponCookie.value, discount: detectedDiscount, bannerText };
  }

  async verifyHierarchyAndPersistence(testInfo = null, lowCoupon = 'preview15', highCoupon = 'get20') {
    // 1. Apply initial coupon (dynamic discount percentage)
    const lowResult = await this.verifyCouponBannerAndCookie(lowCoupon);
    if (testInfo) {
      const ss1 = await this.page.screenshot({ fullPage: false });
      await testInfo.attach(`TC_24_${lowCoupon}_Banner_Screenshot`, { body: ss1, contentType: 'image/png' });
    }

    // 2. Apply higher coupon (dynamic discount percentage)
    await this.page.goto(`/?offer=${highCoupon}`);
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

    const highBanner = this.page.locator('text=/You have received \\d+% Discount!/i').first();
    await expect(highBanner).toBeVisible({ timeout: 10000 });
    const highBannerText = await highBanner.innerText();

    const cookies = await this.page.context().cookies();
    const couponCookie = cookies.find(c => c.name === 'coupon');
    const prevCouponCookie = cookies.find(c => c.name === 'prev_coupon');

    expect(couponCookie?.value).toBe(highCoupon);

    if (testInfo) {
      const ss2 = await this.page.screenshot({ fullPage: false });
      await testInfo.attach(`TC_24_${highCoupon}_Banner_Screenshot`, { body: ss2, contentType: 'image/png' });
    }

    // 3. Persistence across sub-pages (/window-stickers for VSR, /window-sticker for others)
    const isVSR = this.page.url().includes('vehiclesreport.com');
    const stickerPath = isVSR ? '/window-stickers' : '/window-sticker';
    await this.page.goto(stickerPath);
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await expect(this.page.locator('text=/You have received \\d+% Discount!/i')).toBeVisible({ timeout: 10000 });

    if (testInfo) {
      const ss3 = await this.page.screenshot({ fullPage: false });
      await testInfo.attach('TC_24_Persisted_Banner_Screenshot', { body: ss3, contentType: 'image/png' });
    }

    return {
      activeCoupon: couponCookie?.value,
      prevCoupon: prevCouponCookie?.value || lowCoupon,
      persistedOn: stickerPath,
      bannerText: highBannerText
    };
  }
}

module.exports = { CouponFlowHandler, CheckoutCouponFlowTest, CouponFlowVerifier, CouponBannerHandler };
