# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: streaming Task/global_streaming_specs.spec.js >> TC_13_Classic_VIN_YMM_Edit_Validation
- Location: streaming Task/global_streaming_specs.spec.js:319:1

# Error details

```
TimeoutError: page.waitForURL: Timeout 60000ms exceeded.
=========================== logs ===========================
waiting for navigation until "domcontentloaded"
  navigated to "https://motorcyclevinlookup.com/vin-check/preview?vin=1H57H5Z440189&type=vhr&wpPage=homepage"
============================================================
```

# Test source

```ts
  229 |   await testInfo.attach('TC_08_Full_Checkout_Price_Coupon_Email_Cache_Summary', {
  230 |     body: JSON.stringify(reportData, null, 2),
  231 |     contentType: 'application/json',
  232 |   });
  233 | 
  234 |   await page.close();
  235 | });
  236 | 
  237 | // test('TC_09_Full_Checkout_Flow_Stripe_Visa_US_Validation', async ({ page }, testInfo) => {
  238 | //   const home = new HomePage(page);
  239 | //   const preview = new PreviewPage(page);
  240 | //   const checkout = new CheckoutPage(page);
  241 | //   const apiCapture = new ApiResponseCapture(page, TIMEOUT);
  242 | //   await home.navigate();
  243 | //   await home.decodeVin('4JGED6EB0JA121898', 3);
  244 | //   await preview.verifySpecsVisible();
  245 | //   await preview.runCheckoutFlow();
  246 | //   await expect(page).toHaveURL(/.*\/checkout.*/);
  247 | //   await Promise.all([
  248 | //     checkout.completeCheckoutProcess('visa_us'),
  249 | //     page.waitForURL(/.*\/success.*/, { timeout: TIMEOUT }),
  250 | //     apiCapture.waitForStripePaymentIntent(),
  251 | //     apiCapture.waitForPaymentUpdate(),
  252 | //   ]);
  253 | //   await page.waitForURL(/.*\/dashboard\?vin=[^&]+&generate=true&paid=true#vehicle-history-report/, { timeout: TIMEOUT });
  254 | //   await page.close();
  255 | // });
  256 | 
  257 | // test('TC_10_Full_Window_Sticker_Checkout_Flow_Stripe_Visa_US_Validation', async ({ page }, testInfo) => {
  258 | //   const home = new HomePage(page);
  259 | //   const preview = new PreviewPage(page);
  260 | //   const checkout = new CheckoutPage(page);
  261 | //   const apiCapture = new ApiResponseCapture(page, TIMEOUT);
  262 | //   const vin = process.env.TC_10_VIN || '4JGED6EB0JA121264';
  263 | //   await page.goto('/window-sticker');
  264 | //   await home.decodeVin(vin, 3);
  265 | //   await preview.verifySpecsVisible('Window sticker found for');
  266 | //   await preview.runCheckoutFlow();
  267 | //   await expect(page).toHaveURL(/.*\/checkout.*/);
  268 | //   await Promise.all([
  269 | //     checkout.completeCheckoutProcess('visa_us'),
  270 | //     page.waitForURL(/.*\/success.*/, { timeout: TIMEOUT }),
  271 | //     apiCapture.waitForStripePaymentIntent(),
  272 | //     apiCapture.waitForPaymentUpdate(),
  273 | //   ]);
  274 | //   await page.waitForURL(/.*\/dashboard\?vin=[^&]+&generate=true&paid=true#window-sticker/, { timeout: TIMEOUT });
  275 | //   await page.close();
  276 | // });
  277 | 
  278 | // test('TC_11_Full_Checkout_Flow_Stripe_Generic_Decline_Validation', async ({ page }, testInfo) => {
  279 | //   const home = new HomePage(page);
  280 | //   const preview = new PreviewPage(page);
  281 | //   const checkout = new CheckoutPage(page);
  282 | //   await home.navigate();
  283 | //   await home.decodeVin('4JGED6EB0JA121898', 3);
  284 | //   await preview.verifySpecsVisible();
  285 | //   await preview.runCheckoutFlow();
  286 | //   await expect(page).toHaveURL(/.*\/checkout.*/);
  287 | //   await Promise.all([
  288 | //     checkout.completeCheckoutProcess('generic_decline'),
  289 | //     checkout.waitForPaymentFailureAndClose(),
  290 | //   ]);
  291 | //   await expect(page).not.toHaveURL(/.*\/success.*/);
  292 | //   await page.close();
  293 | // });
  294 | 
  295 | // test('TC_12_Full_Checkout_Flow_Stripe_3DS_Validation', async ({ page }, testInfo) => {
  296 | //   const home = new HomePage(page);
  297 | //   const preview = new PreviewPage(page);
  298 | //   const checkout = new CheckoutPage(page);
  299 | //   const apiCapture = new ApiResponseCapture(page, TIMEOUT);
  300 | //   await home.navigate();
  301 | //   await home.decodeVin('4JGED6EB0JA121898', 3);
  302 | //   await preview.verifySpecsVisible();
  303 | //   await preview.runCheckoutFlow();
  304 | //   await expect(page).toHaveURL(/.*\/checkout.*/);
  305 | //   await Promise.all([
  306 | //     checkout.completeCheckoutProcess('stripe_3ds'),
  307 | //     apiCapture.waitForStripePaymentIntent(),
  308 | //     apiCapture.waitForThreeDSAuthenticate(),
  309 | //   ]);
  310 | //   await Promise.all([
  311 | //     checkout.complete3DSChallenge(),
  312 | //     page.waitForURL(/.*\/(success|success-page).*/, { timeout: TIMEOUT }),
  313 | //   ]);
  314 | //   await expect(page).toHaveURL(/.*\/(success|success-page).*/);
  315 | //   await page.close();
  316 | // });
  317 | 
  318 | // Pool of Classic mapped VINs
  319 | test('TC_13_Classic_VIN_YMM_Edit_Validation', async ({ page, context }, testInfo) => {
  320 |   testInfo.setTimeout(process.env.CI ? 120000 : 90000);
  321 |   const home = new HomePage(page);
  322 |   const preview = new PreviewPage(page);
  323 |   const classicVin = ClassicVinGenerator.getRandomClassicVin(testInfo.workerIndex);
  324 |   try {
  325 |     await context.clearCookies();
  326 |     await context.clearPermissions();
  327 |     await home.navigate();
  328 |     await home.decodeVin(classicVin);
> 329 |     await page.waitForURL(/.*\/preview.*/, { waitUntil: 'domcontentloaded', timeout: 60000 });
      |                ^ TimeoutError: page.waitForURL: Timeout 60000ms exceeded.
  330 |     await preview.verifySpecsVisible('Records found for', 60000);
  331 |     const ymmTask = new StreamingYmmEditTask(page);
  332 |     const selectedYMM = await ymmTask.execute();
  333 | 
  334 |     console.log(`\n📋 [TC_13] Classic YMM Selected Dropdowns:\nVIN: ${classicVin}\n${JSON.stringify(selectedYMM, null, 2)}\n`);
  335 |     await testInfo.attach('TC_13_Selected_YMM_Data', {
  336 |       body: JSON.stringify({ vin: classicVin, ...selectedYMM }, null, 2),
  337 |       contentType: 'application/json',
  338 |     });
  339 | 
  340 |     // Wait 5s+ for frontend to fully update with the modified data
  341 |     await page.waitForTimeout(5000);
  342 | 
  343 |     // Capture screenshot of the updated frontend and attach to report
  344 |     const ss13 = await page.screenshot({ fullPage: false });
  345 |     await testInfo.attach('TC_13_Updated_Frontend_Screenshot', {
  346 |       body: ss13,
  347 |       contentType: 'image/png',
  348 |     });
  349 |   } finally {
  350 |     await page.close();
  351 |   }
  352 | });
  353 | 
  354 | test('TC_14_Classic_Manual_Input_Validation', async ({ page, context }, testInfo) => {
  355 |   const home = new HomePage(page);
  356 |   const preview = new PreviewPage(page);
  357 |   const classicVin = ClassicVinGenerator.getRandomClassicVin(testInfo.workerIndex);
  358 |   try {
  359 |     await context.clearCookies();
  360 |     await context.clearPermissions();
  361 |     await home.navigate();
  362 |     await home.decodeVin(classicVin);
  363 |     await page.waitForURL(/.*\/preview.*/, { waitUntil: 'domcontentloaded', timeout: 60000 });
  364 |     await preview.verifySpecsVisible('Records found for', 60000);
  365 |     const specs = await preview.ClassicEditibleSpecsManualInput();
  366 |     
  367 |     console.log(`\n📋 [TC_14] Manual Classic Specs Input:\nVIN: ${classicVin}\n${JSON.stringify(specs, null, 2)}\n`);
  368 |     await testInfo.attach('TC_14_Manual_Specs_Data', {
  369 |       body: JSON.stringify({ vin: classicVin, ...specs }, null, 2),
  370 |       contentType: 'application/json',
  371 |     });
  372 | 
  373 |     // Wait 5s+ for frontend to fully update with the modified data
  374 |     await page.waitForTimeout(5000);
  375 | 
  376 |     // Capture screenshot of the updated frontend and attach to report
  377 |     const ss14 = await page.screenshot({ fullPage: false });
  378 |     await testInfo.attach('TC_14_Updated_Frontend_Screenshot', {
  379 |       body: ss14,
  380 |       contentType: 'image/png',
  381 |     });
  382 |   } finally {
  383 |     await page.close();
  384 |   }
  385 | });
  386 | 
  387 | test('TC_15_Classic_Editible_Specs_Update', async ({ page, context }, testInfo) => {
  388 |   test.setTimeout(180000);
  389 |   const home = new HomePage(page);
  390 |   const preview = new PreviewPage(page);
  391 |   const classicVin = ClassicVinGenerator.getRandomClassicVin(testInfo.workerIndex);
  392 | 
  393 |   try {
  394 |     await context.clearCookies();
  395 |     await context.clearPermissions();
  396 |     await home.navigate();
  397 |     await home.decodeVin(classicVin);
  398 |     await page.waitForURL(/.*\/preview.*/, { waitUntil: 'domcontentloaded', timeout: 60000 });
  399 |     await preview.verifySpecsVisible('Records found for', 60000);
  400 |     const task = new ClassicEditableSpecsUpdateTask(page);
  401 |     const specs = await task.execute(preview, 60000, testInfo);
  402 |     
  403 |     console.log(`\n📋 [TC_15] Classic Editable Specs Update:\nVIN: ${classicVin}\n${JSON.stringify(specs, null, 2)}\n`);
  404 |     await testInfo.attach('TC_15_Updated_Specs_Data', {
  405 |       body: JSON.stringify({ vin: classicVin, ...specs }, null, 2),
  406 |       contentType: 'application/json',
  407 |     });
  408 | 
  409 |     // Wait 5s+ for frontend to fully update with the modified data
  410 |     await page.waitForTimeout(5000);
  411 | 
  412 |     // Capture screenshot of the updated frontend and attach to report
  413 |     const ss15 = await page.screenshot({ fullPage: false });
  414 |     await testInfo.attach('TC_15_Updated_Frontend_Screenshot', {
  415 |       body: ss15,
  416 |       contentType: 'image/png',
  417 |     });
  418 |   } finally {
  419 |     await page.close();
  420 |   }
  421 | });
  422 | 
  423 | // test('TC_16_PayPal_Successful_Payment', async ({ page, context }) => {
  424 | //   const home = new HomePage(page);
  425 | //   const preview = new PreviewPage(page);
  426 | //   const checkout = new CheckoutPage(page);
  427 | //   await home.navigate();
  428 | //   await home.decodeVin('4JGED6EB0JA121898', 3);
  429 | //   await preview.runCheckoutFlow();
```