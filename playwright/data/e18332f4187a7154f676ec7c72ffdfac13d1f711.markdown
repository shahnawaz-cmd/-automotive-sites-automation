# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: streaming Task/global_streaming_specs.spec.js >> TC_04_VHR_Revisit_Banner_Validation
- Location: streaming Task/global_streaming_specs.spec.js:87:1

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: page.waitForTimeout: Target page, context or browser has been closed
```

# Test source

```ts
  1   | // tests/tasks/StreamingRevisitBannerTask.js
  2   | const { expect } = require('@playwright/test');
  3   | 
  4   | class StreamingRevisitBannerTask {
  5   |   async perform(page, previewPage, type = 'vhr') {
  6   |     const expectedText = type === 'sticker' ? 'Window sticker found for' : 'Records found for';
  7   |     console.log(`🔄 [StreamingRevisitBannerTask] Verifying preview specs visible for text: "${expectedText}"...`);
  8   | 
  9   |     // 1. Ensure landing on preview URL
  10  |     await page.waitForURL(/.*(preview|vin-check).*/, { timeout: 30000 }).catch(() => {});
  11  |     await page.waitForLoadState('load').catch(() => {});
  12  | 
  13  |     // 2. Verify preview success condition met
  14  |     if (previewPage && typeof previewPage.verifySpecsVisible === 'function') {
  15  |       await previewPage.verifySpecsVisible(expectedText);
  16  |     } else {
  17  |       await page.waitForLoadState('domcontentloaded');
  18  |     }
  19  | 
  20  |     // 3. Wait for preview page to settle
  21  |     await page.waitForLoadState('domcontentloaded');
> 22  |     await page.waitForTimeout(500);
      |                ^ Error: page.waitForTimeout: Target page, context or browser has been closed
  23  | 
  24  |     console.log('🔄 [StreamingRevisitBannerTask] Navigating back to base URL using browser back button...');
  25  |     
  26  |     // 4. Navigate back to base URL using browser back with BFCache fallback
  27  |     const isVSR = page.url().includes('vehiclesreport.com');
  28  |     const stickerPath = isVSR ? '/window-stickers' : '/window-sticker';
  29  |     const targetFallback = type === 'sticker' ? stickerPath : '/';
  30  | 
  31  |     try {
  32  |       await page.goBack();
  33  |       await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
  34  |     } catch {
  35  |       await page.goto(targetFallback, { waitUntil: 'domcontentloaded' });
  36  |     }
  37  | 
  38  |     const timeout = process.env.CI ? 90000 : 60000;
  39  |     
  40  |     // 5. Locate dynamic 'Grab it for' or 'Grab it now' button
  41  |     const grabItButton = page.locator('button:has-text("Grab it now")')
  42  |       .or(page.locator('button:has-text("Grab it for")'))
  43  |       .or(page.getByRole('button', { name: /Grab it/i }))
  44  |       .or(page.locator('.revisit-banner button, [class*="revisit"] button'));
  45  |     
  46  |     try {
  47  |       console.log(`[StreamingRevisitBannerTask] Waiting for Revisit Grab It button on: ${page.url()}`);
  48  |       
  49  |       // If back navigation cached in BFCache without mounting revisit banner, fallback reload
  50  |       let isVisible = await grabItButton.first().waitFor({ state: 'visible', timeout: 8000 }).then(() => true).catch(() => false);
  51  |       if (!isVisible) {
  52  |         console.log('⚠️ [StreamingRevisitBannerTask] Revisit button not visible after goBack. Triggering direct fallback navigation...');
  53  |         await page.goto(targetFallback, { waitUntil: 'domcontentloaded' });
  54  |         await grabItButton.first().waitFor({ state: 'visible', timeout: timeout });
  55  |       }
  56  |       
  57  |       console.log('[StreamingRevisitBannerTask] Revisit button visible - clicking immediately');
  58  |       
  59  |       const isSafari = page.context().browser()?.browserType().name() === 'webkit';
  60  |       if (isSafari) {
  61  |         await SafariRevisitBannerHelper.clickGrabItButton(page, grabItButton);
  62  |       } else {
  63  |         await grabItButton.first().click({ force: true });
  64  |       }
  65  |     } catch (e) {
  66  |       console.error('[StreamingRevisitBannerTask] Grab it button issue:', e.message);
  67  |       throw e;
  68  |     }
  69  | 
  70  |     // 6. Verify navigation to preview page with specific type pattern
  71  |     const urlPattern = type === 'sticker' ? /.*(type=sticker|preview).*/ : /.*(type=vhr|preview).*/;
  72  |     await page.waitForURL(urlPattern, { waitUntil: 'domcontentloaded', timeout: timeout });
  73  |     await expect(page).toHaveURL(urlPattern);
  74  |     
  75  |     console.log('✅ [StreamingRevisitBannerTask] Passed: Revisit banner flow verified.');
  76  |   }
  77  | }
  78  | 
  79  | class SafariRevisitBannerHelper {
  80  |   static async clickGrabItButton(page, grabItButtonLocator) {
  81  |     console.log('🍏 [SafariRevisitBannerHelper] Executing Safari-specific revisit banner click helper...');
  82  |     
  83  |     const button = grabItButtonLocator.first();
  84  |     await button.waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
  85  |     
  86  |     // 1. Try Playwright tap / click first
  87  |     try {
  88  |       await button.tap({ timeout: 3000 });
  89  |     } catch (e) {
  90  |       await button.click({ force: true }).catch(() => {});
  91  |     }
  92  | 
  93  |     // 2. Dispatch native DOM click + touch events on WebKit
  94  |     await page.evaluate(() => {
  95  |       const el = Array.from(document.querySelectorAll('button, a')).find(b => /grab it/i.test(b.innerText || b.textContent || '')) 
  96  |         || document.querySelector('.revisit-banner button, [class*="revisit"] button, [class*="revisit"] a');
  97  |       if (el) {
  98  |         if (typeof el.click === 'function') el.click();
  99  |         el.dispatchEvent(new Event('touchstart', { bubbles: true }));
  100 |         el.dispatchEvent(new Event('touchend', { bubbles: true }));
  101 |         el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  102 |       }
  103 |     });
  104 | 
  105 |     await page.waitForTimeout(1000);
  106 |   }
  107 | }
  108 | 
  109 | module.exports = { StreamingRevisitBannerTask, SafariRevisitBannerHelper };
  110 | 
```