# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: global_case_verification.spec.ts >> TC_12 Classic editable specs feature validation
- Location: tests/global_case_verification.spec.ts:186:5

# Error details

```
Error: locator.waitFor: Error: strict mode violation: getByRole('button', { name: 'Ambassador' }).first().or(getByRole('option', { name: 'Ambassador' }).first()).or(locator('[role="option"], ul li').filter({ hasText: /.+/ }).first().filter({ visible: true })) resolved to 2 elements:
    1) <button type="button" class="block w-full px-3 py-2 text-left text-[length:var(--pv-text-sm)] hover:bg-[var(--pv-brand-soft)] text-[var(--pv-text)]">Ambassador</button> aka getByRole('button', { name: 'Ambassador' })
    2) <li class="flex items-center gap-2 text-[length:var(--pv-text-sm)] text-[var(--pv-text-secondary)]">…</li> aka getByText('Ownership History')

Call log:
  - waiting for getByRole('button', { name: 'Ambassador' }).first().or(getByRole('option', { name: 'Ambassador' }).first()).or(locator('[role="option"], ul li').filter({ hasText: /.+/ }).first().filter({ visible: true })) to be visible

```

# Test source

```ts
  1   | import { Page, Response } from '@playwright/test';
  2   | import { Actor } from '../actors/Actor';
  3   | import { generateClassicNumericVin } from './vinHelper';
  4   | import { fastInputWithHealing, clickWithHealing, locateInputWithHealing } from '../utils/selfHealingLocator';
  5   | 
  6   | /**
  7   |  * Helper to capture the 'api-cwa/update-classic-decode' API response
  8   |  * when classic vehicle data is modified and submitted.
  9   |  */
  10  | export const waitForUpdateClassicDecodeResponse = async (
  11  |   page: Page,
  12  |   timeoutMs: number = 20000
  13  | ): Promise<any> => {
  14  |   console.log(`[CaptureUpdateClassicDecode] Waiting for 'update-classic-decode' API response (Timeout: ${timeoutMs / 1000}s)...`);
  15  |   try {
  16  |     const response: Response = await page.waitForResponse(
  17  |       (res) => (res.url().includes('update-classic-decode') || res.url().includes('update_classic_decode')) && (res.status() === 200 || res.status() === 201),
  18  |       { timeout: timeoutMs }
  19  |     );
  20  | 
  21  |     const status = response.status();
  22  |     const jsonBody = await response.json().catch(() => null);
  23  | 
  24  |     console.log(`\n🌐 [API Response] URL: ${response.url()} (Status: ${status})`);
  25  |     if (jsonBody) {
  26  |       console.log(`📦 [JSON Data]:\n${JSON.stringify(jsonBody, null, 2)}`);
  27  |     }
  28  |     return jsonBody;
  29  |   } catch (err) {
  30  |     console.log(`⚠️ [CaptureUpdateClassicDecode] update-classic-decode response wait ended: ${err.message}`);
  31  |     return null;
  32  |   }
  33  | };
  34  | 
  35  | export class ClassicEditableFeatureYMM {
  36  |   private timeout = process.env.CI ? 60000 : 90000;
  37  | 
  38  |   async run(page: Page) {
  39  |     // 1. Locate and click "Click here to update" with hydration wait & multi-tag fallback
  40  |     const updateTrigger = page.locator('button, a, [role="button"], span')
  41  |       .filter({ hasText: /(click here to update|update vehicle|edit specs)/i })
  42  |       .first();
  43  | 
  44  |     await updateTrigger.waitFor({ state: 'visible', timeout: this.timeout });
  45  |     await page.waitForTimeout(1000); // Allow React hydration to complete
  46  |     await updateTrigger.scrollIntoViewIfNeeded().catch(() => {});
  47  |     await updateTrigger.click({ force: true }).catch(async () => {
  48  |       await updateTrigger.evaluate((el: HTMLElement) => el.click()).catch(() => {});
  49  |     });
  50  | 
  51  |     // 2. Wait for modal animation and click "Year, Make & Model"
  52  |     const ymmButton = page.locator('button, a, [role="button"]')
  53  |       .filter({ hasText: /(update year, make|year, make & model|year, make and model)/i })
  54  |       .first();
  55  | 
  56  |     await ymmButton.waitFor({ state: 'visible', timeout: this.timeout });
  57  |     await page.waitForTimeout(500); // Modal transition delay
  58  |     await ymmButton.scrollIntoViewIfNeeded().catch(() => {});
  59  |     await ymmButton.click({ force: true }).catch(async () => {
  60  |       await ymmButton.evaluate((el: HTMLElement) => el.click()).catch(() => {});
  61  |     });
  62  | 
  63  |     // Targeted wait for year input
  64  |     const yearBox = page.getByRole('textbox', { name: /year/i })
  65  |       .or(page.getByPlaceholder(/year/i))
  66  |       .or(page.getByLabel(/year/i))
  67  |       .or(page.locator('input[placeholder*="year" i], [aria-label*="year" i]'))
  68  |       .first();
  69  |     await yearBox.waitFor({ state: 'visible', timeout: this.timeout });
  70  | 
  71  |     // 1. Select Year
  72  |     await yearBox.click({ force: true });
  73  |     await page.waitForTimeout(300);
  74  | 
  75  |     const yearOption = page.getByRole('button', { name: '1923' }).first()
  76  |       .or(page.getByRole('option', { name: '1923' }).first())
  77  |       .or(page.locator('[role="option"], ul li').filter({ hasText: /\d{4}/ }).first().locator('visible=true'));
  78  |     await yearOption.waitFor({ state: 'visible', timeout: 15000 });
  79  |     await yearOption.click({ force: true });
  80  | 
  81  |     // 2. Select Make
  82  |     const makeBox = page.getByRole('textbox', { name: /make/i })
  83  |       .or(page.getByPlaceholder(/make/i))
  84  |       .or(page.getByLabel(/make/i))
  85  |       .or(page.locator('input[placeholder*="make" i], [aria-label*="make" i]'))
  86  |       .first();
  87  |     await makeBox.waitFor({ state: 'visible', timeout: this.timeout });
  88  |     await makeBox.click({ force: true });
  89  |     await page.waitForTimeout(300);
  90  | 
  91  |     const ambassadorMake = page.getByRole('button', { name: 'Ambassador' }).first()
  92  |       .or(page.getByRole('option', { name: 'Ambassador' }).first())
  93  |       .or(page.locator('[role="option"], ul li').filter({ hasText: /.+/ }).first().locator('visible=true'));
> 94  |     await ambassadorMake.waitFor({ state: 'visible', timeout: 15000 });
      |                          ^ Error: locator.waitFor: Error: strict mode violation: getByRole('button', { name: 'Ambassador' }).first().or(getByRole('option', { name: 'Ambassador' }).first()).or(locator('[role="option"], ul li').filter({ hasText: /.+/ }).first().filter({ visible: true })) resolved to 2 elements:
  95  |     await ambassadorMake.click({ force: true });
  96  | 
  97  |     // 3. Select Model
  98  |     const modelBox = page.getByRole('textbox', { name: /model/i })
  99  |       .or(page.getByPlaceholder(/model/i))
  100 |       .or(page.getByLabel(/model/i))
  101 |       .or(page.locator('input[placeholder*="model" i], [aria-label*="model" i]'))
  102 |       .first();
  103 |     await modelBox.waitFor({ state: 'visible', timeout: this.timeout });
  104 |     await modelBox.click({ force: true });
  105 |     await page.waitForTimeout(300);
  106 | 
  107 |     const rModel = page.getByRole('button', { name: 'R', exact: true }).first()
  108 |       .or(page.getByRole('option', { name: 'R', exact: true }).first())
  109 |       .or(page.locator('[role="option"], ul li').filter({ hasText: /.+/ }).first().locator('visible=true'));
  110 |     await rModel.waitFor({ state: 'visible', timeout: 15000 });
  111 |     await rModel.click({ force: true });
  112 | 
  113 |     // 4. Select Trim
  114 |     const trimBox = page.getByRole('textbox', { name: /trim/i })
  115 |       .or(page.getByPlaceholder(/trim/i))
  116 |       .or(page.getByLabel(/trim/i))
  117 |       .or(page.locator('input[placeholder*="trim" i], [aria-label*="trim" i]'))
  118 |       .first();
  119 |     await trimBox.waitFor({ state: 'visible', timeout: this.timeout });
  120 |     await trimBox.click({ force: true });
  121 |     await page.waitForTimeout(300);
  122 | 
  123 |     const touringTrim = page.getByRole('button', { name: 'Touring' }).first()
  124 |       .or(page.getByRole('option', { name: 'Touring' }).first())
  125 |       .or(page.locator('[role="option"], ul li').filter({ hasText: /.+/ }).first().locator('visible=true'));
  126 |     await touringTrim.waitFor({ state: 'visible', timeout: 15000 });
  127 |     await touringTrim.click({ force: true });
  128 | 
  129 |     // 5. Submit changes
  130 |     const continueButton = page.getByRole('button', { name: 'Continue' });
  131 |     await continueButton.waitFor({ state: 'visible', timeout: 10000 });
  132 |     await continueButton.click({ force: true });
  133 | 
  134 |     const confirmButton = page.getByRole('button', { name: 'Confirm & Get Records' })
  135 |       .or(page.locator('button:has-text("Confirm")'))
  136 |       .or(page.locator('button:has-text("Submit")'));
  137 |     await confirmButton.first().waitFor({ state: 'visible', timeout: 10000 });
  138 |     await confirmButton.first().click({ force: true });
  139 |   }
  140 | }
  141 | 
  142 | export class Case5VerifyClassicEditableFeature {
  143 |   private timeout = process.env.CI ? 60000 : 90000;
  144 | 
  145 |   async runDropdownUpdate(page: Page) {
  146 |     // 1. Locate and click "Click here to update" with hydration wait & multi-tag fallback
  147 |     const updateTrigger = page.locator('button, a, [role="button"], span')
  148 |       .filter({ hasText: /(click here to update|update vehicle|edit specs)/i })
  149 |       .first();
  150 | 
  151 |     await updateTrigger.waitFor({ state: 'visible', timeout: this.timeout });
  152 |     await page.waitForTimeout(1000); // Allow React hydration to complete
  153 |     await updateTrigger.scrollIntoViewIfNeeded().catch(() => {});
  154 |     await updateTrigger.click({ force: true }).catch(async () => {
  155 |       await updateTrigger.evaluate((el: HTMLElement) => el.click()).catch(() => {});
  156 |     });
  157 | 
  158 |     // 2. Wait for modal animation and click "Update Year, Make and Model"
  159 |     const ymmButton = page.locator('button, a, [role="button"]')
  160 |       .filter({ hasText: /(update year, make|year, make & model|year, make and model)/i })
  161 |       .first();
  162 | 
  163 |     await ymmButton.waitFor({ state: 'visible', timeout: this.timeout });
  164 |     await page.waitForTimeout(500); // Modal transition delay
  165 |     await ymmButton.scrollIntoViewIfNeeded().catch(() => {});
  166 |     await ymmButton.click({ force: true }).catch(async () => {
  167 |       await ymmButton.evaluate((el: HTMLElement) => el.click()).catch(() => {});
  168 |     });
  169 | 
  170 |     // 1. Select Year
  171 |     const yearInput = page.getByRole('textbox', { name: /year/i })
  172 |       .or(page.getByPlaceholder(/year/i))
  173 |       .or(page.getByLabel(/year/i))
  174 |       .or(page.locator('input[placeholder*="year" i], [aria-label*="year" i]'))
  175 |       .first();
  176 |     await yearInput.waitFor({ state: 'visible', timeout: this.timeout });
  177 |     await yearInput.click({ force: true });
  178 |     await page.waitForTimeout(300);
  179 | 
  180 |     const yearOption = page.getByRole('option', { name: '1961' })
  181 |       .or(page.getByText('1961', { exact: true }))
  182 |       .or(page.locator('[role="option"], [role="listbox"] li, .dropdown-menu li, ul li').filter({ hasText: /\d{4}/ }).first().locator('visible=true')); // Ensure option is visible
  183 |     await yearOption.first().waitFor({ state: 'visible', timeout: 10000 }); // Wait for the specific option to be visible
  184 |     await yearOption.first().click({ force: true });
  185 | 
  186 |     // 2. Select Make (Wait for get_classic_make API response)
  187 |     await page.waitForResponse(
  188 |       (res) => res.url().includes('get_classic_make') && res.status() === 200,
  189 |       { timeout: 15000 }
  190 |     ).catch(() => null);
  191 |     await page.waitForTimeout(500);
  192 | 
  193 |     const makeInput = page.getByRole('textbox', { name: /make/i })
  194 |       .or(page.getByPlaceholder(/make/i))
```