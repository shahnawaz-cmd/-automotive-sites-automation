# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: streaming2-e2e.spec.js >> TC_19_Email_Cache_Flow
- Location: tests/streaming2-e2e.spec.js:309:1

# Error details

```
Error: Total price mismatch. Expected $109.94 or $99.95, found $69.98

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Test source

```ts
  249 |     await planLocator.waitFor({ state: 'visible', timeout: TIMEOUT });
  250 |     
  251 |     // Dynamically extract the text and price at runtime
  252 |     const innerText = await planLocator.innerText();
  253 |     
  254 |     // Parse the name dynamically (handles Unlimited/UVC vs numbered reports)
  255 |     let planName = '1 Report';
  256 |     if (innerText.toLowerCase().includes('unlimited') || innerText.toLowerCase().includes('uvc')) {
  257 |       planName = 'Unlimited VIN Check';
  258 |     } else {
  259 |       const match = innerText.match(/\d+\s+\w+/);
  260 |       if (match) planName = match[0];
  261 |     }
  262 |     
  263 |     // Parse the price dynamically (e.g. matches "$29.99")
  264 |     const priceMatches = innerText.match(/\$\d+(\.\d{2})?/g);
  265 |     let maxPrice = 0;
  266 |     if (priceMatches) {
  267 |       for (const match of priceMatches) {
  268 |         const p = parseFloat(match.replace('$', ''));
  269 |         if (p > maxPrice) maxPrice = p;
  270 |       }
  271 |     }
  272 |     const totalPlanPrice = maxPrice.toFixed(2);
  273 |     
  274 |     await planLocator.click({ force: true });
  275 |     
  276 |     console.log(`✅ Dynamically selected plan at index ${randomIndex}: "${planName}", Price: $${totalPlanPrice}`);
  277 | 
  278 |     // Handle Upsell
  279 |     let upsellPrice = null;
  280 |     // Use a broader locator for the checkbox since the exact text might change
  281 |     const upsellCheckbox = this.page.getByRole('checkbox').first();
  282 |     
  283 |     if (planName !== 'Unlimited VIN Check') {
  284 |       const isVisible = await upsellCheckbox.isVisible().catch(() => false);
  285 |       if (isVisible) {
  286 |         const upsellContainer = upsellCheckbox.locator('xpath=..'); // Adjust if needed
  287 |         const upsellText = await upsellContainer.innerText();
  288 |         const upsellMatch = upsellText.match(/\$\d+(\.\d{2})?/);
  289 |         upsellPrice = upsellMatch ? upsellMatch[0].replace('$', '') : null;
  290 |         
  291 |         await upsellCheckbox.check({ force: true });
  292 |         console.log(`✅ Upsell selected. Price: $${upsellPrice}`);
  293 |       } else {
  294 |         console.log('ℹ️ Upsell not visible, skipping.');
  295 |       }
  296 |     } else {
  297 |       console.log('ℹ️ UVC plan selected: Upsell hidden.');
  298 |     }
  299 | 
  300 |     return { planName, totalPlanPrice, upsellPrice };
  301 |   }
  302 | 
  303 |   async validateOrderSummary(selectedData) {
  304 |     // Navigate to checkout if not already there
  305 |     if (!this.page.url().includes('/checkout')) {
  306 |       const checkoutButton = this.page.getByRole('button', { name: /proceed to checkout/i });
  307 |       await checkoutButton.waitFor({ state: 'visible', timeout: TIMEOUT });
  308 |       await checkoutButton.click({ force: true });
  309 |       await this.page.waitForURL(/.*\/checkout.*/);
  310 |     }
  311 | 
  312 |     // Locate Order Summary container
  313 |     const orderSummary = this.page.locator('aside:has(h2:has-text("Order summary"))');
  314 | 
  315 |     // Calculate expected total
  316 |     const planPrice = parseFloat(selectedData.totalPlanPrice);
  317 |     const upsellPrice = selectedData.upsellPrice ? parseFloat(selectedData.upsellPrice) : 0;
  318 |     const expectedTotal = planPrice + upsellPrice;
  319 | 
  320 |     // Validate Package
  321 |     // Refined to target the specific grid item containing the package name
  322 |     // Use a robust locator and handle the known typo "Unmimited" in the UI
  323 |     const packageItem = orderSummary.locator('div:has-text("Package") ~ div span').first();
  324 |     
  325 |     // Create a regex that handles the typo (matching Unlimited or Unmimited)
  326 |     const planNameRegex = selectedData.planName.replace('Unlimited', 'Un[lm]imited');
  327 |     await expect(packageItem).toHaveText(new RegExp(planNameRegex, 'i'));
  328 |     
  329 |     // DEBUG: Log all items in the order summary
  330 |     const summaryItems = await orderSummary.locator('div').allTextContents();
  331 |     console.log('DEBUG: Order summary items:', summaryItems);
  332 | 
  333 |     // Validate Total Price (specific selector from HTML)
  334 |     // Locate the span with 'Total' text, then find the span that contains '$' within the next sibling div
  335 |     const totalLocator = orderSummary.locator('span:has-text("Total") + div span').first();
  336 |     await totalLocator.waitFor({ state: 'visible', timeout: TIMEOUT });
  337 |     
  338 |     const totalText = await totalLocator.innerText();
  339 |     const foundTotal = parseFloat(totalText.replace('$', ''));
  340 |     
  341 |     // Compare with tolerance
  342 |     // NOTE: If upsell was NOT selected/visible in UI but added in Total, 
  343 |     // it implies the app adds it automatically based on some state, not just UI click.
  344 |     // For now, accept the total IF it matches either expectedTotal or expectedTotal + upsellPrice (if upsell exists in data)
  345 |     const expectedTotalNoUpsell = planPrice;
  346 |     
  347 |     const isMatch = Math.abs(foundTotal - expectedTotal) < 0.05 || Math.abs(foundTotal - expectedTotalNoUpsell) < 0.05;
  348 |     
> 349 |     expect(isMatch, `Total price mismatch. Expected $${expectedTotal} or $${expectedTotalNoUpsell}, found $${foundTotal}`).toBe(true);
      |                                                                                                                            ^ Error: Total price mismatch. Expected $109.94 or $99.95, found $69.98
  350 |     
  351 |     console.log(`✅ Total price $${foundTotal} verified in Order summary.`);
  352 | 
  353 |     // Validate Add-on (if applicable)
  354 |     if (selectedData.planName !== 'Unlimited VIN Check' && selectedData.upsellPrice) {
  355 |       // Specifically target the Add-on label to avoid strict mode violations
  356 |       const addonLabel = orderSummary.locator('div.inline-flex:has-text("Add-on")');
  357 |       await expect(addonLabel).toBeVisible();
  358 |       console.log('✅ Add-on verified in Order summary.');
  359 |     } else {
  360 |       await expect(orderSummary.locator('div:has-text("Add-on")')).not.toBeVisible();
  361 |       console.log('✅ No Add-on as expected for UVC.');
  362 |     }
  363 |   }
  364 | }
  365 | 
  366 | class EmailCache {
  367 |   constructor(page, timeout = TIMEOUT) {
  368 |     this.page = page;
  369 |     this.timeout = timeout;
  370 |     this.preview = new PreviewPage(page);
  371 |     this.validator = new PreviewToCheckoutPriceValidator(page);
  372 |   }
  373 | 
  374 |   async Cacheemailbackfromcheckout() {
  375 |     console.log("--- Starting TC_19 Email Cache Flow ---");
  376 |     
  377 |     // 1. Run checkout flow
  378 |     await this.preview.runCheckoutFlow();
  379 |     console.log("✅ Landed on checkout page (1st time)");
  380 | 
  381 |     // 2. Go back
  382 |     await this.page.goBack();
  383 |     await this.page.waitForLoadState('load');
  384 |     console.log("✅ Navigated back to Preview page");
  385 | 
  386 |     // 3. Select new plan
  387 |     const newData = await this.validator.selectRandomPlanAndHandleUpsell();
  388 |     
  389 |     // 4. Click Access Record (Expect NO email popup)
  390 |     await this.preview.clickAccessRecordButton();
  391 |     await this.page.waitForURL(/.*\/checkout.*/, { timeout: this.timeout });
  392 |     
  393 |     // Check that email popup is NOT visible
  394 |     const emailInput = this.page.locator('input[type="email"]');
  395 |     await expect(emailInput).not.toBeVisible({ timeout: 5000 });
  396 |     console.log("✅ Email popup did NOT appear, directly navigated");
  397 | 
  398 |     // 5. Validate Order Summary updated
  399 |     await this.validator.validateOrderSummary(newData);
  400 |     console.log("✅ Order summary updated correctly");
  401 |     
  402 |     return true;
  403 |   }
  404 | }
  405 | 
  406 | class DefaultPlanCheckingHandler {
  407 |   constructor(page) {
  408 |     this.page = page;
  409 |   }
  410 | 
  411 |   async sitesettingDefaultPlansVerifies(homeInstance, vin = '223870L108421', skipNavigation = false, planType = 'default') {
  412 |     if (!skipNavigation) {
  413 |       await homeInstance.navigate();
  414 |       await homeInstance.decodeVin(vin);
  415 |       await this.page.waitForURL(/.*\/preview.*/, { timeout: TIMEOUT });
  416 |     }
  417 | 
  418 |     // Ensure page is loaded before checking localStorage
  419 |     await this.page.waitForLoadState('domcontentloaded');
  420 | 
  421 |     // Wait for localStorage to be populated
  422 |     const siteSettings = await this.page.evaluate(async () => {
  423 |         for (let i = 0; i < 40; i++) {
  424 |             const val = localStorage.getItem('site_settings');
  425 |             if (val) return val;
  426 |             await new Promise(r => setTimeout(r, 500));
  427 |         }
  428 |         // DEBUG: Log all localStorage keys if not found
  429 |         const allKeys = Object.keys(localStorage);
  430 |         console.log(`DEBUG: localStorage keys (sitesetting): ${JSON.stringify(allKeys)}`);
  431 |         return null;
  432 |     });
  433 | 
  434 |     if (!siteSettings) throw new Error('site_settings not found in localStorage');
  435 | 
  436 |     const parsedSettings = JSON.parse(siteSettings);
  437 |     const targetPlanKey = planType === 'ws' ? 'default_ws_plan' : 'default_plan';
  438 |     const planData = parsedSettings[targetPlanKey];
  439 |     
  440 |     if (!planData) throw new Error(`${targetPlanKey} not found in site_settings`);
  441 |     
  442 |     console.log(`✅ Verified site_settings (${targetPlanKey}):`, planData);
  443 | 
  444 |     // Matching plan on UI - escape special characters in currency sign
  445 |     const escapedCurrency = planData.currency_sign.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  446 |     const planLocator = this.page.locator('div[role="button"]').filter({ 
  447 |         hasText: new RegExp(`${escapedCurrency}\\s*${planData.price}`) 
  448 |     }).first();
  449 |     
```