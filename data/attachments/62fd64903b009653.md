# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: global_case_verification.spec.ts >> TC_15 Classic editable specs manual update feature validation
- Location: tests/global_case_verification.spec.ts:260:5

# Error details

```
TimeoutError: locator.waitFor: Timeout 90000ms exceeded.
Call log:
  - waiting for locator('button, a, [role="button"], span').filter({ hasText: /(click here to update|update vehicle|edit specs)/i }).first() to be visible

```

# Test source

```ts
  1   | import { Page } from '@playwright/test';
  2   | import { Actor } from '../actors/Actor';
  3   | import { generateClassicNumericVin } from './vinHelper';
  4   | import { fastInputWithHealing, clickWithHealing, locateInputWithHealing } from '../utils/selfHealingLocator';
  5   | import { waitForUpdateClassicDecodeResponse } from './classic_editable_specs';
  6   | 
  7   | /**
  8   |  * Class: ClassicManualSpecsDataGenerator
  9   |  * Dynamically generates unique random classic vehicle specifications on every run.
  10  |  */
  11  | export class ClassicManualSpecsDataGenerator {
  12  |   private static randomSuffix(): string {
  13  |     return Math.random().toString(36).substring(2, 6).toUpperCase();
  14  |   }
  15  | 
  16  |   private static pickRandom<T>(array: T[]): T {
  17  |     return array[Math.floor(Math.random() * array.length)];
  18  |   }
  19  | 
  20  |   static generateUniqueData() {
  21  |     const suffix = this.randomSuffix();
  22  |     const years = ['1955', '1960', '1965', '1968', '1970', '1972', '1975', '1978'];
  23  |     const makes = ['Ford', 'Chevrolet', 'Dodge', 'Pontiac', 'Plymouth', 'Buick', 'Oldsmobile'];
  24  |     const models = ['Mustang', 'Corvette', 'Charger', 'Camaro', 'GTO', 'F-250', 'Bel Air', 'Impala'];
  25  |     const engines = ['V8 5.7L', 'V8 4.6L', 'V8 5.0L', 'Inline-6', 'V6 3.8L', 'Hemi 426'];
  26  |     const transmissions = ['Auto', 'Manual', '4-Speed Manual', '3-Speed Auto', '5-Speed Manual'];
  27  |     const doorsList = ['2', '4', '5'];
  28  |     const drives = ['RWD', 'AWD', '4WD'];
  29  | 
  30  |     return {
  31  |       year: this.pickRandom(years),
  32  |       make: `${this.pickRandom(makes)} ${suffix}`,
  33  |       model: `${this.pickRandom(models)} ${suffix}`,
  34  |       engine: `${this.pickRandom(engines)} ${suffix}`,
  35  |       transmission: this.pickRandom(transmissions),
  36  |       door: this.pickRandom(doorsList),
  37  |       drive: this.pickRandom(drives)
  38  |     };
  39  |   }
  40  | }
  41  | 
  42  | export class ClassicEditableSpecsManual {
  43  |   private timeout = process.env.CI ? 90000 : 45000;
  44  | 
  45  |   async runManualUpdate(page: Page) {
  46  |     // 1. Locate and click "Click here to update" with hydration wait & multi-tag fallback
  47  |     const updateTrigger = page.locator('button, a, [role="button"], span')
  48  |       .filter({ hasText: /(click here to update|update vehicle|edit specs)/i })
  49  |       .first();
  50  | 
> 51  |     await updateTrigger.waitFor({ state: 'visible', timeout: this.timeout });
      |                         ^ TimeoutError: locator.waitFor: Timeout 90000ms exceeded.
  52  |     await page.waitForTimeout(1000); // Allow React hydration to complete
  53  |     await updateTrigger.scrollIntoViewIfNeeded().catch(() => {});
  54  |     await updateTrigger.click({ force: true }).catch(async () => {
  55  |       await updateTrigger.evaluate((el: HTMLElement) => el.click()).catch(() => {});
  56  |     });
  57  | 
  58  |     // 2. Wait for modal animation and click "Update Year, Make and Model"
  59  |     const ymmButton = page.locator('button, a, [role="button"]')
  60  |       .filter({ hasText: /(update year, make|year, make & model|year, make and model)/i })
  61  |       .first();
  62  | 
  63  |     await ymmButton.waitFor({ state: 'visible', timeout: this.timeout });
  64  |     await page.waitForTimeout(500); // Modal transition delay
  65  |     await ymmButton.scrollIntoViewIfNeeded().catch(() => {});
  66  |     await ymmButton.click({ force: true }).catch(async () => {
  67  |       await ymmButton.evaluate((el: HTMLElement) => el.click()).catch(() => {});
  68  |     });
  69  | 
  70  |     // 3. Click 'Click here' (for manual inputs, excluding 'Click here to update')
  71  |     const manualTrigger = page.locator('button, a, [role="button"], span')
  72  |       .filter({ hasText: /click here/i })
  73  |       .filter({ hasNotText: /update/i })
  74  |       .first();
  75  | 
  76  |     await manualTrigger.waitFor({ state: 'visible', timeout: this.timeout });
  77  |     await page.waitForTimeout(500);
  78  |     await manualTrigger.scrollIntoViewIfNeeded().catch(() => {});
  79  |     await manualTrigger.click({ force: true }).catch(async () => {
  80  |       await manualTrigger.evaluate((el: HTMLElement) => el.click()).catch(() => {});
  81  |     });
  82  | 
  83  |     await page.waitForTimeout(500); // Allow manual input form fields to render
  84  | 
  85  |     // 4. Generate unique dynamic data and fill fields with multi-tier fallbacks
  86  |     const specsData = ClassicManualSpecsDataGenerator.generateUniqueData();
  87  |     console.log('[ClassicManualSpecsDataGenerator] Generated unique manual specifications:\n', JSON.stringify(specsData, null, 2));
  88  | 
  89  |     const fillManualField = async (keyword: string, value: string) => {
  90  |       const field = page.getByRole('textbox', { name: new RegExp(keyword, 'i') })
  91  |         .or(page.getByPlaceholder(new RegExp(keyword, 'i')))
  92  |         .or(page.getByLabel(new RegExp(keyword, 'i')))
  93  |         .or(page.locator(`input[placeholder*="${keyword}" i], input[name*="${keyword}" i], input[aria-label*="${keyword}" i]`))
  94  |         .first();
  95  |       await field.waitFor({ state: 'visible', timeout: 10000 });
  96  |       await field.scrollIntoViewIfNeeded().catch(() => {});
  97  |       await field.click({ force: true }).catch(() => {});
  98  |       await field.fill(value);
  99  |     };
  100 | 
  101 |     await fillManualField('year', specsData.year);
  102 |     await fillManualField('make', specsData.make);
  103 |     await fillManualField('model', specsData.model);
  104 |     await fillManualField('engine', specsData.engine);
  105 |     await fillManualField('transmission', specsData.transmission);
  106 |     await fillManualField('door', specsData.door);
  107 |     await fillManualField('drive', specsData.drive);
  108 | 
  109 |     // 5. Submit changes and capture update-classic-decode API response
  110 |     const continueBtn = page.getByRole('button', { name: 'Continue' })
  111 |       .or(page.locator('button:has-text("Continue")'));
  112 |     await continueBtn.first().waitFor({ state: 'visible', timeout: 10000 });
  113 |     await continueBtn.first().click({ force: true });
  114 | 
  115 |     const submitBtn = page.getByRole('button', { name: 'Submit' })
  116 |       .or(page.getByRole('button', { name: 'Confirm' }))
  117 |       .or(page.locator('button:has-text("Submit"), button:has-text("Confirm")'));
  118 |     await submitBtn.first().waitFor({ state: 'visible', timeout: 10000 });
  119 | 
  120 |     const apiPromise = waitForUpdateClassicDecodeResponse(page, this.timeout);
  121 |     await submitBtn.first().click({ force: true });
  122 |     await apiPromise;
  123 | 
  124 |     await page.waitForURL(/.*(cv=|preview|sticker|report).*/, { timeout: this.timeout });
  125 |     console.log('✅ Manual update successful');
  126 |   }
  127 | 
  128 |   async performAs(actor: Actor) {
  129 |     const page = actor.getPage();
  130 |     await page.context().clearCookies();
  131 |     await page.goto('/');
  132 |     await page.waitForTimeout(1000);
  133 | 
  134 |     const classicVin = generateClassicNumericVin();
  135 |     
  136 |     // Self-healing VIN input & search
  137 |     await fastInputWithHealing(page, 'VIN', classicVin, [
  138 |       'input[name="vin"]',
  139 |       'input[placeholder*="VIN" i]',
  140 |       'input[aria-label*="VIN" i]'
  141 |     ]);
  142 | 
  143 |     await clickWithHealing(page, 'Search', [
  144 |       'button[type="submit"]',
  145 |       'button:has-text("Search")',
  146 |       'button:has-text("Decode")',
  147 |       'button:has-text("Get Window Sticker")'
  148 |     ]);
  149 | 
  150 |     await page.waitForURL(/.*(preview|sticker|license-preview|ws-preview).*/, { timeout: this.timeout });
  151 |     await this.runManualUpdate(page);
```