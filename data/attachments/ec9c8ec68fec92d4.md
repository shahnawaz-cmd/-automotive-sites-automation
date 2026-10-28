# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: streaming Task/global_streaming_specs.spec.js >> TC_08_Home_To_Checkout_Price_Coupon_And_Email_Cache_Validation
- Location: streaming Task/global_streaming_specs.spec.js:160:1

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /^Apply$/i }).or(locator('button:has-text("Apply")')).first()
    - locator resolved to <button disabled type="button" class="inline-flex items-center gap-1.5 rounded-[var(--pv-radius-md)] border border-[var(--pv-border-strong)] px-4 py-2 text-[length:var(--pv-text-sm)] font-bold text-[var(--pv-text)] hover:border-[var(--pv-text)] disabled:opacity-50">Apply</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    27 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

```

# Test source

```ts
  13  |   }
  14  | 
  15  |   async navigateAndApplyCoupon(homeInstance, vin, timeout = TIMEOUT, couponCode = 'get20') {
  16  |     await homeInstance.navigate();
  17  |     await homeInstance.decodeVin(vin);
  18  |     await this.page.goto(this.page.url() + `&offer=${couponCode}`);
  19  |     await this.page.reload(); // Refresh the page after applying coupon via URL
  20  |     await this.page.waitForURL(/.*\/preview.*/, { timeout });
  21  |   }
  22  | 
  23  |   async selectPlanAndUpsell() {
  24  |     this.selectedData = await this.validator.selectRandomPlanAndHandleUpsell();
  25  |     return this.selectedData;
  26  |   }
  27  | 
  28  |   async accessRecord() {
  29  |     await this.preview.clickAccessRecordButton();
  30  |   }
  31  | 
  32  |   async fillCheckoutDetails() {
  33  |     const emailInput = this.page.locator('input[type="email"]').first();
  34  |     const phoneInput = this.page.locator('input[type="tel"]').first();
  35  |     
  36  |     await emailInput.waitFor({ state: 'visible', timeout: TIMEOUT });
  37  |     
  38  |     await emailInput.fill(PreviewPage.generateUniqueEmail());
  39  |     await phoneInput.fill(PreviewPage.generateUsPhoneNumber());
  40  |     
  41  |     await Promise.all([
  42  |       this.page.waitForURL(/.*\/checkout(?:-\d+)?.*/, { timeout: TIMEOUT }),
  43  |       this.page.getByRole('button', { name: /proceed to checkout/i }).click(),
  44  |     ]);
  45  |   }
  46  | 
  47  |   async verifyOrderSummary(couponCode, couponPercentage = 0.50) {
  48  |     // 1. Verify coupon application text on checkout page
  49  |     // The text is like: "get20 applied — 20% off"
  50  |     // Using a regex to match: <couponCode> applied — <percentage>% off
  51  |     const percent = Math.round(couponPercentage * 100);
  52  |     const couponRegex = new RegExp(`${couponCode}\\s+applied\\s+—\\s+${percent}%\\s+off`, 'i');
  53  |     
  54  |     const couponMessage = this.page.locator(`text=${couponRegex}`);
  55  |     await couponMessage.waitFor({ state: 'visible', timeout: TIMEOUT });
  56  |     await expect(couponMessage).toBeVisible();
  57  |     console.log(`✅ [CouponFlow] Coupon message verified: "${await couponMessage.innerText()}"`);
  58  | 
  59  |     // 2. Existing order summary verification
  60  |     const baseTotal = parseFloat(this.selectedData.totalPlanPrice) + (this.selectedData.upsellPrice ? parseFloat(this.selectedData.upsellPrice) : 0);
  61  |     const discountedTotal = (baseTotal * (1 - couponPercentage)).toFixed(2);
  62  |     const discountedData = { ...this.selectedData, totalPlanPrice: discountedTotal, upsellPrice: null };
  63  | 
  64  |     await this.validator.validateOrderSummary(discountedData);
  65  |     console.log(`✅ [CouponFlow] Order summary verified. Expected Discounted Total: ${discountedTotal}`);
  66  |   }
  67  | }
  68  | 
  69  | class CheckoutCouponFlowTest {
  70  |   constructor(page) {
  71  |     this.page = page;
  72  |     this.preview = new PreviewPage(page);
  73  |   }
  74  | 
  75  |   async navigateToCheckout(homeInstance, vin, timeout = TIMEOUT) {
  76  |     // This flow intentionally does not add offer=testing to the preview URL.
  77  |     await homeInstance.navigate();
  78  |     await homeInstance.decodeVin(vin, 3);
  79  |     await this.preview.verifySpecsVisible('Records found for', timeout);
  80  |     await this.preview.runCheckoutFlow();
  81  |     await expect(this.page).toHaveURL(/.*\/checkout(?:-\d+)?.*/, { timeout });
  82  |   }
  83  | }
  84  | 
  85  | class CouponFlowVerifier {
  86  |   constructor(page) {
  87  |     this.page = page;
  88  |   }
  89  | 
  90  |   async applyCoupon(couponCode, couponPercentage) {
  91  |     // If order summary / promo accordion is collapsed on mobile, expand it
  92  |     const summaryToggle = this.page.locator('button:has-text("Order summary"), button:has-text("Show order summary"), [aria-label*="order summary" i], summary').first();
  93  |     if (await summaryToggle.isVisible().catch(() => false)) {
  94  |       await summaryToggle.click().catch(() => {});
  95  |       await this.page.waitForTimeout(500);
  96  |     }
  97  | 
  98  |     const promoCodeInput = this.page.getByRole('textbox', { name: /Promo code|Discount|Coupon/i })
  99  |       .or(this.page.locator('input[placeholder*="promo" i], input[placeholder*="coupon" i], input[name*="coupon" i], input[name*="promo" i]'))
  100 |       .first();
  101 | 
  102 |     const isPromoVisible = await promoCodeInput.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
  103 |     if (!isPromoVisible) {
  104 |       console.log('ℹ️ Promo code input not visible or not present on this viewport, skipping promo code application.');
  105 |       return false;
  106 |     }
  107 | 
  108 |     await promoCodeInput.scrollIntoViewIfNeeded().catch(() => {});
  109 |     await promoCodeInput.fill(couponCode);
  110 | 
  111 |     const applyBtn = this.page.getByRole('button', { name: /^Apply$/i })
  112 |       .or(this.page.locator('button:has-text("Apply")')).first();
> 113 |     await applyBtn.click();
      |                    ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
  114 | 
  115 |     // Wait for asynchronous checkout pricing recalculation to complete
  116 |     await this.page.locator('button:has-text("Updating")').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
  117 | 
  118 |     const percent = Math.round(couponPercentage * 100);
  119 |     const appliedNotice = this.page.getByText(new RegExp(`${couponCode}\\s+applied|Coupon\\s+${couponCode}|${percent}%\\s+off`, 'i'))
  120 |       .or(this.page.locator('aside').filter({ hasText: /Discount/i }))
  121 |       .or(this.page.locator('button:has-text("Remove"), [aria-label*="remove" i]'))
  122 |       .first();
  123 |     await expect(appliedNotice).toBeVisible({ timeout: 20000 });
  124 |     return true;
  125 |   }
  126 | 
  127 |   async verifyCheckoutTotals(couponPercentage) {
  128 |     const orderSummary = this.page.locator('aside').filter({
  129 |       has: this.page.getByRole('heading', { name: 'Order summary' }),
  130 |     });
  131 |     await expect(orderSummary).toBeVisible({ timeout: TIMEOUT });
  132 | 
  133 |     // Use expect.poll to allow asynchronous Next.js recalculation to settle across all sites
  134 |     let lastDetails = null;
  135 |     await expect.poll(async () => {
  136 |       const summaryText = await orderSummary.innerText();
  137 |       const reportPrice = this.getLabeledAmount(summaryText, /(?:PACKAGE|Report|VIN Check|Check|Unlimited)/i, 'Report/Package');
  138 |       const discountAmount = this.getLabeledAmount(summaryText, /Discount/i, 'Discount');
  139 |       const addOnAmount = this.getOptionalAddOnAmount(summaryText);
  140 |       const totalAmount = this.getDiscountedTotal(summaryText);
  141 |       const expectedDiscount = reportPrice * couponPercentage;
  142 |       const expectedTotal = reportPrice - discountAmount + addOnAmount;
  143 | 
  144 |       lastDetails = {
  145 |         reportPrice,
  146 |         discountAmount,
  147 |         addOnAmount,
  148 |         totalAmount,
  149 |         expectedDiscount,
  150 |         expectedTotal,
  151 |         orderSummary: summaryText,
  152 |       };
  153 | 
  154 |       const discountDiff = Math.abs(discountAmount - expectedDiscount);
  155 |       const totalDiff = Math.abs(totalAmount - expectedTotal);
  156 |       return discountDiff < 0.05 && totalDiff < 0.05;
  157 |     }, {
  158 |       message: 'Checkout total or coupon discount calculation did not match in order summary',
  159 |       timeout: 15000,
  160 |       intervals: [500, 1000],
  161 |     }).toBe(true);
  162 | 
  163 |     return lastDetails;
  164 |   }
  165 | 
  166 |   getOptionalAddOnAmount(summaryText) {
  167 |     const parts = summaryText.split(/(?:Add-on|Upsell|Window Sticker)/i);
  168 |     if (parts.length < 2) return 0;
  169 |     const section = parts.slice(1).join('');
  170 |     const match = section.match(/\b\d+\.\d{2}\b/);
  171 |     return match ? this.parseAmount(match[0]) : 0;
  172 |   }
  173 | 
  174 |   getLabeledAmount(summaryText, labelRegex, labelName) {
  175 |     const parts = summaryText.split(labelRegex);
  176 |     if (parts.length < 2) {
  177 |       throw new Error(`${labelName} section was not found in the order summary: "${summaryText}".`);
  178 |     }
  179 |     const section = parts.slice(1).join('');
  180 |     const match = section.match(/\b\d+\.\d{2}\b/);
  181 |     if (!match) {
  182 |       throw new Error(`${labelName} price was not found in the order summary: "${summaryText}".`);
  183 |     }
  184 |     return this.parseAmount(match[0]);
  185 |   }
  186 | 
  187 |   getDiscountedTotal(summaryText) {
  188 |     const parts = summaryText.split(/\bTotal\b/i);
  189 |     if (parts.length < 2) {
  190 |       throw new Error(`Total section was not found in the order summary: "${summaryText}".`);
  191 |     }
  192 |     const totalSection = parts.at(-1);
  193 |     const amounts = totalSection.match(/\b\d+\.\d{2}\b/g);
  194 |     if (!amounts || amounts.length === 0) {
  195 |       throw new Error(`Discounted total was not found in the order summary: "${summaryText}".`);
  196 |     }
  197 |     // The final payable total is always the last amount listed under Total (skips strikethrough original price)
  198 |     return this.parseAmount(amounts.at(-1));
  199 |   }
  200 | 
  201 |   parseAmount(amount) {
  202 |     return Number(amount.replace(/,/g, ''));
  203 |   }
  204 | 
  205 |   async applyAndVerifyCoupon(couponCode, couponPercentage) {
  206 |     const applied = await this.applyCoupon(couponCode, couponPercentage);
  207 |     if (applied) {
  208 |       return this.verifyCheckoutTotals(couponPercentage);
  209 |     }
  210 |     return { status: 'skipped_promo_input_hidden' };
  211 |   }
  212 | }
  213 | 
```