# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: streaming Task/global_streaming_specs.spec.js >> TC_14_Classic_Manual_Input_Validation
- Location: streaming Task/global_streaming_specs.spec.js:358:1

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: page.waitForTimeout: Target page, context or browser has been closed
```

# Test source

```ts
  340 |     await this.page.waitForTimeout(1000);
  341 | 
  342 |     // Step 2: Click "Confirm & Get Records" to trigger backend fetch
  343 |     const confirmBtn = this.page.getByRole('button', { name: /Confirm & Get Records|Get Records/i })
  344 |       .or(this.page.locator('button:has-text("Confirm & Get Records"), button:has-text("Get Records")')).first();
  345 |     await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
  346 |     await confirmBtn.scrollIntoViewIfNeeded().catch(() => {});
  347 |     await confirmBtn.click({ force: true });
  348 | 
  349 |     // Step 3: Wait for backend fetch to complete and modal to close
  350 |     await this.page.locator('div[role="dialog"]').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  351 |     // Step 4: Buffer for frontend to fully reflect the updated records
  352 |     await this.page.waitForTimeout(5000);
  353 | 
  354 |     return { year, make, model, trim };
  355 |   }
  356 | 
  357 |   async fillModalFormDynamically(specsObj) {
  358 |     const modal = this.page.locator('div[role="dialog"], div[class*="modal"], form').first();
  359 |     const labelEls = modal.locator('label:has(input), div:has(> input)');
  360 |     const count = await labelEls.count();
  361 | 
  362 |     for (let i = 0; i < count; i++) {
  363 |       const fieldGroup = labelEls.nth(i);
  364 |       const isVisible = await fieldGroup.isVisible().catch(() => false);
  365 |       if (!isVisible) continue;
  366 | 
  367 |       const labelText = (await fieldGroup.innerText().catch(() => '')).trim().toLowerCase();
  368 |       const input = fieldGroup.locator('input').first();
  369 |       if (!(await input.isVisible().catch(() => false))) continue;
  370 | 
  371 |       for (const [key, val] of Object.entries(specsObj)) {
  372 |         const spacedKey = key.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
  373 |         if (labelText.includes(spacedKey) || spacedKey.includes(labelText)) {
  374 |           await input.scrollIntoViewIfNeeded().catch(() => {});
  375 |           await input.fill(val).catch(() => {});
  376 |           break;
  377 |         }
  378 |       }
  379 |     }
  380 | 
  381 |     // Fallback pass with getByRole
  382 |     for (const [key, val] of Object.entries(specsObj)) {
  383 |       const nameRegex = new RegExp(key.replace(/([A-Z])/g, ' $1').trim(), 'i');
  384 |       const input = this.page.getByRole('textbox', { name: nameRegex }).first();
  385 |       if (await input.isVisible({ timeout: 500 }).catch(() => false)) {
  386 |         await input.scrollIntoViewIfNeeded().catch(() => {});
  387 |         await input.fill(val).catch(() => {});
  388 |       }
  389 |     }
  390 |   }
  391 | 
  392 |   async ClassicEditibleSpecsManualInput(timeout = TIMEOUT) {
  393 |     const specs = REAL_CLASSIC_SPECS[Math.floor(Math.random() * REAL_CLASSIC_SPECS.length)];
  394 |     
  395 |     // Check if VIN prompt is "No, fix it" or unmapped
  396 |     const noFixBtn = this.page.getByRole('button', { name: /No.*Fix it|No, fix it|Fix it/i })
  397 |       .or(this.page.locator('button:has-text("No"), button:has-text("Fix it")'))
  398 |       .or(this.page.locator('div[class*="cursor-pointer"]:has-text("Fix it"), a:has-text("Fix it")')).first();
  399 | 
  400 |     if (await noFixBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  401 |       console.log('⚡ [ClassicEditibleSpecsManualInput] Detected unmapped prompt, clicking Fix it...');
  402 |       await noFixBtn.click({ force: true }).catch(() => {});
  403 |       await this.page.waitForTimeout(1000);
  404 |     }
  405 | 
  406 |     const updateButton = this.page.getByRole('button', { name: /Click here to update/i })
  407 |       .or(this.page.locator('button:has-text("Click here to update")'))
  408 |       .or(this.page.locator('button:has-text("Update")'))
  409 |       .or(this.page.locator('a:has-text("Click here to update")'))
  410 |       .or(this.page.locator('[data-testid*="update" i]')).first();
  411 | 
  412 |     if (await updateButton.isVisible({ timeout: 5000 }).catch(() => false)) {
  413 |       await updateButton.scrollIntoViewIfNeeded().catch(() => {});
  414 |       await updateButton.click({ force: true });
  415 |     }
  416 |     
  417 |     const ymmButton = this.page.getByRole('button', { name: /Year, Make & Model/i })
  418 |       .or(this.page.locator('button:has-text("Year, Make"), button:has-text("YMM")')).first();
  419 |     if (await ymmButton.isVisible({ timeout: 5000 }).catch(() => false)) {
  420 |       await ymmButton.click({ force: true });
  421 |     }
  422 |     
  423 |     const clickHereBtn = this.page.getByRole('button', { name: 'Click here', exact: true })
  424 |       .or(this.page.locator('button:has-text("Click here")')).first();
  425 |     if (await clickHereBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
  426 |       await clickHereBtn.click({ force: true });
  427 |     }
  428 |     
  429 |     await this.fillModalFormDynamically(specs);
  430 |     
  431 |     const getRecordsBtn = this.page.getByRole('button', { name: /Get Records|Confirm|Continue/i })
  432 |       .or(this.page.locator('button:has-text("Get Records"), button:has-text("Continue")')).first();
  433 |     if (await getRecordsBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  434 |       await getRecordsBtn.scrollIntoViewIfNeeded().catch(() => {});
  435 |       await getRecordsBtn.click({ force: true });
  436 |     }
  437 | 
  438 |     // Wait for modal to close and frontend to reflect updated data (5s+ buffer)
  439 |     await this.page.locator('div[role="dialog"]').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
> 440 |     await this.page.waitForTimeout(3000);
      |                     ^ Error: page.waitForTimeout: Target page, context or browser has been closed
  441 | 
  442 |     return specs;
  443 |   }
  444 | 
  445 |   async classicEditibleSpecsUpdateSpec(timeout = TIMEOUT) {
  446 |     const task = new ClassicEditableSpecsUpdateTask(this.page);
  447 |     return await task.execute(this, timeout);
  448 |   }
  449 | 
  450 |   async runCheckoutFlow() {
  451 |     // 1. Click Access Record
  452 |     await this.clickAccessRecordButton();
  453 | 
  454 |     // 2. Wait for email popup and fill details
  455 |     const emailInput = this.page.locator('input[type="email"]').first();
  456 |     const phoneInput = this.page.locator('input[type="tel"]').first();
  457 |     
  458 |     await emailInput.waitFor({ state: 'visible', timeout: TIMEOUT });
  459 |     
  460 |     await emailInput.fill(PreviewPage.generateUniqueEmail());
  461 |     await phoneInput.fill(PreviewPage.generateUsPhoneNumber());
  462 |     
  463 |     // 3. Click Proceed to checkout and wait for the navigation together (domcontentloaded)
  464 |     await Promise.all([
  465 |       this.page.waitForURL(/.*\/checkout(?:-\d+)?.*/, { waitUntil: 'domcontentloaded', timeout: TIMEOUT }),
  466 |       this.page.getByRole('button', { name: /proceed to checkout/i }).click(),
  467 |     ]);
  468 |   }
  469 | 
  470 |   // Helper: Generate a unique email with increment/unique string before @ to save bounce rate
  471 |   static generateUniqueEmail() {
  472 |     const baseEmail = 'shahnawaz@empirepixel.com';
  473 |     const [localPart, domainPart] = baseEmail.split('@');
  474 |     
  475 |     // Short 2-digit suffix (e.g. 10-99) to keep email short and prevent bouncing
  476 |     const shortSuffix = Math.floor(Math.random() * 90 + 10);
  477 |     return `${localPart}+${shortSuffix}@${domainPart}`;
  478 |   }
  479 | 
  480 |   // Helper: Generate a valid US phone number (XXX) XXX-XXXX
  481 |   static generateUsPhoneNumber() {
  482 |     const areaCode = Math.floor(Math.random() * 800) + 200; // 200-999
  483 |     const prefix = Math.floor(Math.random() * 800) + 200;   // 200-999
  484 |     const lineNumber = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
  485 |     return `(${areaCode}) ${prefix}-${lineNumber}`;
  486 |   }
  487 | }
  488 | 
  489 | class PreviewToCheckoutPriceValidator {
  490 |   constructor(page) {
  491 |     this.page = page;
  492 |   }
  493 | 
  494 |   async selectRandomPlanAndHandleUpsell() {
  495 |     // Locate all plan buttons dynamically by their role on the page
  496 |     const planButtons = this.page.locator('div[role="button"]').filter({
  497 |       hasText: /Report|Check|UVC/i
  498 |     });
  499 |     
  500 |     // Wait for the first plan button to load and render on the DOM before counting
  501 |     await planButtons.first().waitFor({ state: 'visible', timeout: TIMEOUT });
  502 |     
  503 |     const count = await planButtons.count();
  504 |     if (count === 0) {
  505 |       throw new Error("No plan buttons found on the page.");
  506 |     }
  507 |     
  508 |     // Select a random plan index
  509 |     const randomIndex = Math.floor(Math.random() * count);
  510 |     const planLocator = planButtons.nth(randomIndex);
  511 |     
  512 |     // Ensure the plan card is scrolled into view and visible (crucial for mobile carousels/lists)
  513 |     await planLocator.scrollIntoViewIfNeeded().catch(() => {});
  514 |     await planLocator.waitFor({ state: 'visible', timeout: TIMEOUT });
  515 |     
  516 |     // Dynamically extract the title and sale price from the card DOM (no hardcoding)
  517 |     const innerText = await planLocator.innerText();
  518 |     const lines = innerText.split('\n').map(l => l.trim()).filter(Boolean);
  519 |     const planName = lines[0] || '1 Report';
  520 | 
  521 |     const strikethroughLocator = planLocator.locator('.line-through, [class*="line-through"], del, s, [class*="strike"]').first();
  522 |     const hasStrike = await strikethroughLocator.isVisible().catch(() => false);
  523 |     const strikethroughText = hasStrike ? await strikethroughLocator.innerText().catch(() => '') : '';
  524 |     const strikethroughAmount = strikethroughText.match(/[\d.]+/)?.[0];
  525 | 
  526 |     const allPriceMatches = [...innerText.matchAll(/\$([\d.,]+)/g)].map(m => m[1]);
  527 |     const candidates = allPriceMatches.filter(price => !strikethroughAmount || price !== strikethroughAmount);
  528 |     const totalPlanPrice = candidates.length > 1 ? candidates[1] : (candidates[0] || '19.99');
  529 |     
  530 |     await planLocator.scrollIntoViewIfNeeded().catch(() => {});
  531 |     await planLocator.click({ force: true });
  532 |     await this.page.waitForTimeout(800);
  533 |     
  534 |     console.log(`✅ Dynamically selected plan at index ${randomIndex}: "${planName}", Price: $${totalPlanPrice}`);
  535 | 
  536 |     // Handle Upsell
  537 |     let upsellPrice = null;
  538 |     // Use a broader locator for the checkbox since the exact text might change
  539 |     const upsellCheckbox = this.page.getByRole('checkbox').first();
  540 |     
```