# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: streaming Task/global_streaming_specs.spec.js >> TC_08_Home_To_Checkout_Price_Coupon_And_Email_Cache_Validation
- Location: streaming Task/global_streaming_specs.spec.js:145:1

# Error details

```
Error: Checkout total mismatch. Expected 26.19, found 30.22

expect(received).toBeLessThan(expected)

Expected: < 0.05
Received:   4.030000000000001
```

# Test source

```ts
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
  113 |     await applyBtn.click();
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
  133 |     const summaryText = await orderSummary.innerText();
  134 |     const reportPrice = this.getLabeledAmount(summaryText, /(?:PACKAGE|Report|VIN Check|Check|Unlimited)[\s\S]*?\$([\d.,]+)/i, 'Report/Package');
  135 |     const discountAmount = this.getLabeledAmount(summaryText, /Discount[\s\S]*?-?\s*\$([\d.,]+)/i, 'Discount');
  136 |     const addOnAmount = this.getOptionalAddOnAmount(summaryText);
  137 |     const totalAmount = this.getDiscountedTotal(summaryText);
  138 |     const expectedDiscount = reportPrice * couponPercentage;
  139 |     const expectedTotal = reportPrice - discountAmount + addOnAmount;
  140 | 
  141 |     expect(
  142 |       Math.abs(discountAmount - expectedDiscount),
  143 |       `Coupon discount mismatch. Expected ${expectedDiscount.toFixed(2)}, found ${discountAmount.toFixed(2)}`
  144 |     ).toBeLessThan(0.05);
  145 |     expect(
  146 |       Math.abs(totalAmount - expectedTotal),
  147 |       `Checkout total mismatch. Expected ${expectedTotal.toFixed(2)}, found ${totalAmount.toFixed(2)}`
> 148 |     ).toBeLessThan(0.05);
      |       ^ Error: Checkout total mismatch. Expected 26.19, found 30.22
  149 | 
  150 |     return {
  151 |       reportPrice,
  152 |       discountAmount,
  153 |       addOnAmount,
  154 |       totalAmount,
  155 |       expectedDiscount,
  156 |       expectedTotal,
  157 |       orderSummary: summaryText,
  158 |     };
  159 |   }
  160 | 
  161 |   getOptionalAddOnAmount(summaryText) {
  162 |     const match = summaryText.match(/(?:Add-on|Upsell|Window Sticker)[\s\S]*?\$([\d.,]+)(?=\s*(?:Coupon|Total))/i);
  163 |     return match ? this.parseAmount(match[1]) : 0;
  164 |   }
  165 | 
  166 |   getLabeledAmount(summaryText, pattern, label) {
  167 |     const match = summaryText.match(pattern);
  168 |     if (!match) {
  169 |       throw new Error(`${label} price was not found in the order summary: "${summaryText}".`);
  170 |     }
  171 |     return this.parseAmount(match[1]);
  172 |   }
  173 | 
  174 |   getDiscountedTotal(summaryText) {
  175 |     const totalText = summaryText.match(/Total[\s\S]*?((?:\$?[\d.,]+(?:\s+\$?[\d.,]+)*))/i)?.[1];
  176 |     const amounts = totalText?.match(/[\d.]+/g);
  177 |     if (!amounts || amounts.length < 1) {
  178 |       throw new Error(`Discounted total was not found in the order summary: "${summaryText}".`);
  179 |     }
  180 |     return this.parseAmount(amounts.at(-1));
  181 |   }
  182 | 
  183 |   parseAmount(amount) {
  184 |     return Number(amount.replace(/,/g, ''));
  185 |   }
  186 | 
  187 |   async applyAndVerifyCoupon(couponCode, couponPercentage) {
  188 |     const applied = await this.applyCoupon(couponCode, couponPercentage);
  189 |     if (applied) {
  190 |       return this.verifyCheckoutTotals(couponPercentage);
  191 |     }
  192 |     return { status: 'skipped_promo_input_hidden' };
  193 |   }
  194 | }
  195 | 
  196 | class CouponBannerHandler {
  197 |   constructor(page) {
  198 |     this.page = page;
  199 |   }
  200 | 
  201 |   async verifyCouponBannerAndCookie(couponCode, expectedDiscount = null) {
  202 |     await this.page.goto(`/?offer=${couponCode}`);
  203 |     await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  204 | 
  205 |     // 1. Match banner dynamically (handles any dynamic % like 10%, 15%, 20%, 25%, etc.)
  206 |     const bannerRegex = expectedDiscount 
  207 |       ? new RegExp(`You have received ${expectedDiscount} Discount!`, 'i')
  208 |       : /You have received \d+% Discount!/i;
  209 | 
  210 |     const bannerLocator = this.page.locator(`text=${bannerRegex}`).first();
  211 |     await expect(bannerLocator).toBeVisible({ timeout: 10000 });
  212 |     
  213 |     const bannerText = await bannerLocator.innerText();
  214 |     const detectedDiscount = bannerText.match(/(\d+%)/)?.[1] || expectedDiscount;
  215 | 
  216 |     // 2. Verify Cookie is set
  217 |     const cookies = await this.page.context().cookies();
  218 |     const couponCookie = cookies.find(c => c.name === 'coupon');
  219 |     if (!couponCookie) {
  220 |       throw new Error(`Failed: Coupon cookie not found for offer ${couponCode}.`);
  221 |     }
  222 | 
  223 |     return { cookie: couponCookie.value, discount: detectedDiscount, bannerText };
  224 |   }
  225 | 
  226 |   async verifyHierarchyAndPersistence(testInfo = null, lowCoupon = 'preview15', highCoupon = 'get20') {
  227 |     // 1. Apply initial coupon (dynamic discount percentage)
  228 |     const lowResult = await this.verifyCouponBannerAndCookie(lowCoupon);
  229 |     if (testInfo) {
  230 |       const ss1 = await this.page.screenshot({ fullPage: false });
  231 |       await testInfo.attach(`TC_24_${lowCoupon}_Banner_Screenshot`, { body: ss1, contentType: 'image/png' });
  232 |     }
  233 | 
  234 |     // 2. Apply higher coupon (dynamic discount percentage)
  235 |     await this.page.goto(`/?offer=${highCoupon}`);
  236 |     await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  237 | 
  238 |     const highBanner = this.page.locator('text=/You have received \\d+% Discount!/i').first();
  239 |     await expect(highBanner).toBeVisible({ timeout: 10000 });
  240 |     const highBannerText = await highBanner.innerText();
  241 | 
  242 |     const cookies = await this.page.context().cookies();
  243 |     const couponCookie = cookies.find(c => c.name === 'coupon');
  244 |     const prevCouponCookie = cookies.find(c => c.name === 'prev_coupon');
  245 | 
  246 |     expect(couponCookie?.value).toBe(highCoupon);
  247 | 
  248 |     if (testInfo) {
```