# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: global_case_verification.spec.ts >> TC_17 Classic editable specs update only from preview validation
- Location: tests/global_case_verification.spec.ts:295:5

# Error details

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('button, a, [role="button"], span').filter({ hasText: /(click here to update|update vehicle|edit specs)/i }).first() to be visible

```

# Test source

```ts
  1   | import { Page } from '@playwright/test';
  2   | import { Actor } from '../actors/Actor';
  3   | import { generateClassicNumericVin } from './vinHelper';
  4   | import { waitForUpdateClassicDecodeResponse } from './classic_editable_specs';
  5   | 
  6   | /**
  7   |  * Class 1: Dynamic Vehicle Specifications Data Generator & Filler
  8   |  * Generates unique values and fills all rendered fields inside the Update Specifications modal.
  9   |  */
  10  | export class ClassicSpecsRandomDataFiller {
  11  |   async fillAndSubmit(page: Page, timeout: number = 30000): Promise<void> {
  12  |     const inputs = page.locator('.modal input:not([type="hidden"]):not([type="submit"]):not([type="button"]), [role="dialog"] input:not([type="hidden"]):not([type="submit"]):not([type="button"]), form input:not([type="hidden"]):not([type="submit"]):not([type="button"])');
  13  |     await inputs.first().waitFor({ state: 'attached', timeout });
  14  | 
  15  |     const count = await inputs.count();
  16  |     console.log(`[ClassicSpecsRandomDataFiller] Found ${count} specification fields to populate.`);
  17  | 
  18  |     for (let i = 0; i < count; i++) {
  19  |       const field = inputs.nth(i);
  20  |       if (await field.isVisible().catch(() => false) || await field.isEditable().catch(() => false)) {
  21  |         const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  22  |         const placeholder = await field.getAttribute('placeholder').catch(() => '') || '';
  23  |         
  24  |         let value = `Val_${suffix}`;
  25  |         if (/doors|passenger/i.test(placeholder)) {
  26  |           value = `${Math.floor(Math.random() * 4) + 2}`;
  27  |         } else if (/oil|fuel|length|width|height|wheelbase/i.test(placeholder)) {
  28  |           value = `${Math.floor(Math.random() * 50) + 10} ${suffix}`;
  29  |         }
  30  | 
  31  |         await field.evaluate((el: HTMLElement) => {
  32  |           el.scrollIntoView({ block: 'center', inline: 'nearest' });
  33  |           el.focus();
  34  |         }).catch(() => {});
  35  | 
  36  |         await field.fill(value).catch(() => {});
  37  |       }
  38  |     }
  39  | 
  40  |     // Submit update & capture API response
  41  |     const updateBtn = page.getByRole('button', { name: 'Update', exact: true })
  42  |       .or(page.locator('button').filter({ hasText: /^Update$/i }))
  43  |       .or(page.locator('button:has-text("Update"), button:has-text("Save")'))
  44  |       .first();
  45  | 
  46  |     await updateBtn.waitFor({ state: 'visible', timeout: 15000 });
  47  | 
  48  |     const apiPromise = waitForUpdateClassicDecodeResponse(page, 20000);
  49  |     await updateBtn.click({ force: true }).catch(async () => {
  50  |       await updateBtn.evaluate((el: HTMLElement) => el.click()).catch(() => {});
  51  |     });
  52  | 
  53  |     await apiPromise;
  54  |     console.log('✅ Vehicle specifications successfully updated.');
  55  |   }
  56  | }
  57  | 
  58  | /**
  59  |  * Class 2: Update Specifications Flow / Click Handler
  60  |  * Handles landing on preview, clicking "Click here to update" and "Update Specifications",
  61  |  * then calls Class 1 to populate unique values and submit.
  62  |  */
  63  | export class ClassicEditableSpecsUpdateOnly {
  64  |   async performAs(actor: Actor): Promise<void> {
  65  |     const page = actor.getPage();
  66  |     await page.context().clearCookies();
  67  |     await page.goto('/');
  68  |     await page.waitForTimeout(1000);
  69  | 
  70  |     const classicVin = generateClassicNumericVin();
  71  | 
  72  |     // 1. Enter Classic VIN & search
  73  |     const vinInput = page.locator('input[name="vin"], input[placeholder*="VIN" i]').first();
  74  |     await vinInput.waitFor({ state: 'visible', timeout: 30000 });
  75  |     await vinInput.fill(classicVin);
  76  | 
  77  |     const searchBtn = page.locator('button[type="submit"], button:has-text("Search"), button:has-text("Decode"), button:has-text("Get Window Sticker")').first();
  78  |     await searchBtn.waitFor({ state: 'visible', timeout: 30000 });
  79  |     await searchBtn.click({ force: true }).catch(async () => {
  80  |       await searchBtn.evaluate((el: HTMLElement) => el.click()).catch(() => {});
  81  |     });
  82  | 
  83  |     // 2. Wait for Preview page
  84  |     await page.waitForURL(/.*(preview|sticker|license-preview|ws-preview).*/, { timeout: 60000 });
  85  |     await page.waitForTimeout(1000); // React hydration
  86  | 
  87  |     // 3. Click 'Click here to update'
  88  |     const updateTrigger = page.locator('button, a, [role="button"], span')
  89  |       .filter({ hasText: /(click here to update|update vehicle|edit specs)/i })
  90  |       .first();
> 91  |     await updateTrigger.waitFor({ state: 'visible', timeout: 30000 });
      |                         ^ TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
  92  |     await updateTrigger.scrollIntoViewIfNeeded().catch(() => {});
  93  |     await updateTrigger.click({ force: true }).catch(async () => {
  94  |       await updateTrigger.evaluate((el: HTMLElement) => el.click()).catch(() => {});
  95  |     });
  96  | 
  97  |     await page.waitForTimeout(500);
  98  | 
  99  |     // 4. Click 'Update Specifications'
  100 |     const updateSpecsBtn = page.locator('button, a, [role="button"]')
  101 |       .filter({ hasText: /(update specifications|specifications|update specs)/i })
  102 |       .first();
  103 |     await updateSpecsBtn.waitFor({ state: 'visible', timeout: 30000 });
  104 |     await updateSpecsBtn.scrollIntoViewIfNeeded().catch(() => {});
  105 |     await updateSpecsBtn.click({ force: true }).catch(async () => {
  106 |       await updateSpecsBtn.evaluate((el: HTMLElement) => el.click()).catch(() => {});
  107 |     });
  108 | 
  109 |     await page.waitForTimeout(500);
  110 | 
  111 |     // 5. Populate unique specifications & submit via Class 1
  112 |     const dataFiller = new ClassicSpecsRandomDataFiller();
  113 |     await dataFiller.fillAndSubmit(page);
  114 |   }
  115 | }
  116 | 
```