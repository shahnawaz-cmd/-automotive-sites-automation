# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: global_case_verification.spec.ts >> TC_12 Classic editable specs feature validation
- Location: tests/global_case_verification.spec.ts:186:5

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for getByRole('option', { name: 'Model 16 350ms' }).or(getByText('Model 16 350ms', { exact: true })).or(locator('[role="option"], [role="listbox"] li, .dropdown-menu li, ul li').filter({ hasText: /.+/ }).first().filter({ visible: true })).first() to be visible

```

# Test source

```ts
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
  195 |       .or(page.getByLabel(/make/i))
  196 |       .or(page.locator('input[placeholder*="make" i], [aria-label*="make" i]'))
  197 |       .first();
  198 |     await makeInput.waitFor({ state: 'visible', timeout: this.timeout });
  199 |     await makeInput.click({ force: true });
  200 |     await page.waitForTimeout(300);
  201 | 
  202 |     const ajsMake = page.getByRole('option', { name: 'AJS' }).or(page.getByText('AJS', { exact: true }));
  203 |     const firstMake = page.locator('[role="option"], [role="listbox"] li, .dropdown-menu li, ul li').filter({ hasText: /.+/ }).first().locator('visible=true'); // Ensure option is visible
  204 | 
  205 |     if (await ajsMake.first().isVisible({ timeout: 2000 }).catch(() => false)) {
  206 |       await ajsMake.first().click({ force: true });
  207 |     } else {
  208 |       await firstMake.click({ force: true });
  209 |     }
  210 | 
  211 |     // 3. Select Model (Wait for get_classic_model API response)
  212 |     await page.waitForResponse(
  213 |       (res) => res.url().includes('get_classic_model') && res.status() === 200,
  214 |       { timeout: 15000 }
  215 |     ).catch(() => null);
  216 |     await page.waitForTimeout(500);
  217 | 
  218 |     const modelInput = page.getByRole('textbox', { name: /model/i })
  219 |       .or(page.getByPlaceholder(/model/i))
  220 |       .or(page.getByLabel(/model/i))
  221 |       .or(page.locator('input[placeholder*="model" i], [aria-label*="model" i]'))
  222 |       .first();
  223 |     await modelInput.waitFor({ state: 'visible', timeout: this.timeout });
  224 |     await modelInput.click({ force: true });
  225 |     await page.waitForTimeout(300);
  226 | 
  227 |     const modelOption = page.getByRole('option', { name: 'Model 16 350ms' })
  228 |       .or(page.getByText('Model 16 350ms', { exact: true }))
  229 |       .or(page.locator('[role="option"], [role="listbox"] li, .dropdown-menu li, ul li').filter({ hasText: /.+/ }).first().locator('visible=true')); // Ensure option is visible
  230 | 
> 231 |     await modelOption.first().waitFor({ state: 'visible', timeout: 10000 });
      |                               ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  232 |     await modelOption.first().click({ force: true });
  233 | 
  234 |     // 4. Select Trim (Wait for get_classic_series API response)
  235 |     await page.waitForResponse(
  236 |       (res) => res.url().includes('get_classic_series') && res.status() === 200,
  237 |       { timeout: 10000 }
  238 |     ).catch(() => null);
  239 |     await page.waitForTimeout(500);
  240 | 
  241 |     const trimInput = page.getByRole('textbox', { name: /trim/i })
  242 |       .or(page.getByPlaceholder(/trim/i))
  243 |       .or(page.getByLabel(/trim/i))
  244 |       .or(page.locator('input[placeholder*="trim" i], [aria-label*="trim" i]'))
  245 |       .first();
  246 |     if (await trimInput.isVisible({ timeout: 3000 }).catch(() => false)) {
  247 |       await trimInput.click({ force: true });
  248 |       await page.waitForTimeout(300);
  249 | 
  250 |       const baseTrim = page.getByText('Base', { exact: true })
  251 |         .or(page.getByRole('option', { name: /base/i }))
  252 |         .or(page.locator('[role="option"], [role="listbox"] li, .dropdown-menu li, ul li').filter({ hasText: /.+/ }).first().locator('visible=true')); // Ensure option is visible
  253 | 
  254 |       if (await baseTrim.first().isVisible({ timeout: 2000 }).catch(() => false)) {
  255 |         await baseTrim.first().click({ force: true });
  256 |       }
  257 |     }
  258 | 
  259 |     // 5. Submit Changes
  260 |     const continueBtn = page.getByRole('button', { name: 'Continue' });
  261 |     await continueBtn.waitFor({ state: 'visible', timeout: this.timeout });
  262 |     await continueBtn.click({ force: true });
  263 | 
  264 |     const confirmBtn = page.getByRole('button', { name: 'Confirm & Get Records' })
  265 |       .or(page.locator('button:has-text("Confirm")'))
  266 |       .or(page.locator('button:has-text("Submit")'));
  267 |     await confirmBtn.first().waitFor({ state: 'visible', timeout: this.timeout });
  268 |     await confirmBtn.first().click({ force: true });
  269 | 
  270 |     await page.waitForURL(/.*(cv=|preview|sticker|report).*/, { timeout: this.timeout });
  271 |     console.log('✅ Dropdown update successful');
  272 |   }
  273 | }
  274 | 
  275 | export class ClassicEditableSpecs {
  276 |   private timeout = process.env.CI ? 60000 : 90000;
  277 | 
  278 |   async performAs(actor: Actor) {
  279 |     const page = actor.getPage();
  280 |     await page.context().clearCookies();
  281 |     await page.goto('/');
  282 |     await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  283 | 
  284 |     const cookies = await page.context().cookies();
  285 |     const isStreaming = cookies.some((c) => c.name === 'checkout_flow' && c.value === 'streaming');
  286 | 
  287 |     const classicVin = generateClassicNumericVin();
  288 | 
  289 |     // Self-healing VIN Input
  290 |     await fastInputWithHealing(
  291 |       page,
  292 |       'VIN',
  293 |       classicVin,
  294 |       [
  295 |         'input[name="vin"]',
  296 |         'input[placeholder*="VIN" i]',
  297 |         'input[aria-label*="VIN" i]'
  298 |       ],
  299 |       { timeout: this.timeout / 3 }
  300 |     );
  301 | 
  302 |     // Self-healing Search Submit
  303 |     await clickWithHealing(
  304 |       page,
  305 |       'Search',
  306 |       [
  307 |         'button[type="submit"]',
  308 |         'button:has-text("Search")',
  309 |         'button:has-text("Decode")',
  310 |         'button:has-text("Get Window Sticker")'
  311 |       ]
  312 |     );
  313 | 
  314 |     // Support preview, sticker, ws-preview, and license-preview URLs
  315 |     await page.waitForURL(/.*(preview|sticker|license-preview|ws-preview).*/, { timeout: this.timeout });
  316 | 
  317 |     // Enable API network listener to capture relevant response URLs and payloads
  318 |     page.on('response', async (response) => {
  319 |       const url = response.url();
  320 | 
  321 |       if (url.includes('/logs') || url.includes('/telemetry')) {
  322 |         return;
  323 |       }
  324 | 
  325 |       const contentType = response.headers()['content-type'] || '';
  326 |       const resourceType = response.request().resourceType();
  327 | 
  328 |       if (resourceType === 'fetch' || resourceType === 'xhr' || contentType.includes('application/json')) {
  329 |         try {
  330 |           const status = response.status();
  331 |           const jsonBody = await response.json();
```