# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: streaming2-e2e.spec.js >> TC_15_Classic_Editible_Specs_Update
- Location: tests/streaming2-e2e.spec.js:258:1

# Error details

```
TimeoutError: locator.waitFor: Timeout 90000ms exceeded.
Call log:
  - waiting for getByRole('textbox', { name: 'Axle Type' }) to be visible

```

# Test source

```ts
  68  |     await this.page.mouse.wheel(0, 500);
  69  |     await this.page.waitForTimeout(500);
  70  |     await this.page.mouse.wheel(0, -500);
  71  |     await this.page.waitForTimeout(500);
  72  | 
  73  |     await this.page.mouse.move(400, 600, { steps: 10 });
  74  |     await this.page.waitForTimeout(300);
  75  |     await this.page.mouse.move(400, 400, { steps: 10 });
  76  |     await this.page.waitForTimeout(300);
  77  |     await this.page.mouse.move(400, 200, { steps: 15 });
  78  |     await this.page.waitForTimeout(300);
  79  |     await this.page.mouse.move(400, 100, { steps: 15 });
  80  |     await this.page.waitForTimeout(300);
  81  |     await this.page.mouse.move(400, 10,  { steps: 10 });
  82  |     await this.page.waitForTimeout(300);
  83  | 
  84  |     await this.page.evaluate(() => {
  85  |       const opts = { bubbles: true, cancelable: true, clientX: 400, clientY: -1 };
  86  |       document.dispatchEvent(new MouseEvent('mouseleave', opts));
  87  |       document.dispatchEvent(new MouseEvent('mouseout',   opts));
  88  |       window.dispatchEvent(new MouseEvent('mouseleave',   opts));
  89  |       document.documentElement.dispatchEvent(new MouseEvent('mouseleave', opts));
  90  |     });
  91  | 
  92  |     await this.page.waitForTimeout(3000);
  93  |   }
  94  | 
  95  |   async verifyAndRedeemExitOffer() {
  96  |     // Redeem 15% off
  97  |     await this.page.getByRole('button', { name: 'Redeem 15% off' }).click();
  98  |   }
  99  | 
  100 |   async classicEdtibleFeatureYMM() {
  101 |     const updateButton = this.page.getByRole('button', { name: 'Click here to update' });
  102 |     await updateButton.waitFor({ state: 'visible' });
  103 |     await updateButton.click({ force: true });
  104 | 
  105 |     const ymmButton = this.page.getByRole('button', { name: 'Year, Make & Model The' });
  106 |     await ymmButton.waitFor({ state: 'visible' });
  107 |     await ymmButton.click({ force: true });
  108 | 
  109 |     // Explicit 30s delay to allow popup stabilization as requested
  110 |     await this.page.waitForTimeout(30000);
  111 | 
  112 |     await this.page.getByRole('textbox', { name: 'Select year' }).click();
  113 |     await this.page.getByRole('button', { name: '1923' }).click();
  114 | 
  115 |     await this.page.getByRole('textbox', { name: 'Select make' }).click();
  116 |     await this.page.getByRole('button', { name: 'Ambassador' }).click();
  117 | 
  118 |     await this.page.getByRole('textbox', { name: 'Select model' }).click();
  119 |     await this.page.getByRole('button', { name: 'R', exact: true }).click();
  120 | 
  121 |     await this.page.getByRole('textbox', { name: 'Select trim' }).click();
  122 |     await this.page.getByRole('button', { name: 'Touring' }).click();
  123 | 
  124 |     await this.page.getByRole('button', { name: 'Continue' }).click();
  125 |     await this.page.getByRole('button', { name: 'Confirm & Get Records' }).click();
  126 |   }
  127 | 
  128 |   async ClassicEditibleSpecsManualInput(timeout = TIMEOUT) {
  129 |     const updateButton = this.page.getByRole('button', { name: 'Click here to update' });
  130 |     await updateButton.waitFor({ state: 'visible', timeout });
  131 |     await updateButton.click({ force: true });
  132 |     
  133 |     const ymmButton = this.page.getByRole('button', { name: 'Year, Make & Model The' });
  134 |     await ymmButton.waitFor({ state: 'visible', timeout });
  135 |     await ymmButton.click({ force: true });
  136 |     
  137 |     await this.page.getByRole('button', { name: 'Click here', exact: true }).click();
  138 |     
  139 |     await this.page.getByRole('textbox', { name: 'Year' }).click();
  140 |     await this.page.getByRole('textbox', { name: 'Year' }).fill('1950', { timeout });
  141 |     await this.page.getByRole('textbox', { name: 'Make' }).click();
  142 |     await this.page.getByRole('textbox', { name: 'Make' }).fill('Ford', { timeout });
  143 |     await this.page.getByRole('textbox', { name: 'Model' }).click();
  144 |     await this.page.getByRole('textbox', { name: 'Model' }).fill('F-150', { timeout });
  145 |     await this.page.getByRole('textbox', { name: 'Engine' }).click();
  146 |     await this.page.getByRole('textbox', { name: 'Engine' }).fill('V9', { timeout });
  147 |     await this.page.getByRole('textbox', { name: 'Transmission' }).click();
  148 |     await this.page.getByRole('textbox', { name: 'Transmission' }).fill('Auto', { timeout });
  149 |     await this.page.getByRole('textbox', { name: 'Number of Doors' }).click();
  150 |     await this.page.getByRole('textbox', { name: 'Number of Doors' }).fill('4', { timeout });
  151 |     await this.page.getByRole('textbox', { name: 'Drive Type' }).click();
  152 |     await this.page.getByRole('textbox', { name: 'Drive Type' }).fill('AWD', { timeout });
  153 |     await this.page.getByRole('button', { name: 'Continue' }).click();
  154 |   }
  155 | 
  156 |   async classicEditibleSpecsUpdateSpec(timeout = TIMEOUT) {
  157 |     const updateButton = this.page.getByRole('button', { name: 'Click here to update' });
  158 |     await updateButton.waitFor({ state: 'visible', timeout });
  159 |     await updateButton.click({ force: true });
  160 |     await this.page.waitForTimeout(1000);
  161 |     
  162 |     const specButton = this.page.getByRole('button', { name: 'Specifications Engine,' });
  163 |     await specButton.waitFor({ state: 'visible', timeout });
  164 |     await specButton.click({ force: true });
  165 |     await this.page.waitForTimeout(1000);
  166 |     
  167 |     const axleTypeInput = this.page.getByRole('textbox', { name: 'Axle Type' });
> 168 |     await axleTypeInput.waitFor({ state: 'visible', timeout });
      |                         ^ TimeoutError: locator.waitFor: Timeout 90000ms exceeded.
  169 |     await axleTypeInput.click();
  170 |     await this.page.getByRole('textbox', { name: 'Axle Type' }).fill('Semifloating asdfsss', { timeout });
  171 |     await this.page.getByRole('textbox', { name: 'Body Maker' }).click();
  172 |     await this.page.getByRole('textbox', { name: 'Body Maker' }).fill('Fisher asdsss', { timeout });
  173 |     await this.page.getByRole('textbox', { name: 'Cylinders' }).click();
  174 |     await this.page.getByRole('textbox', { name: 'Cylinders' }).fill('8 3333', { timeout });
  175 |     await this.page.getByRole('textbox', { name: 'Displacement' }).click();
  176 |     await this.page.getByRole('textbox', { name: 'Displacement' }).fill('330 cu. in. 22222', { timeout });
  177 |     await this.page.getByRole('textbox', { name: 'Front Tread' }).click();
  178 |     await this.page.getByRole('textbox', { name: 'Front Tread' }).fill('61.8 inches asdasd', { timeout });
  179 |     await this.page.getByRole('textbox', { name: 'Fuel' }).click();
  180 |     await this.page.getByRole('textbox', { name: 'Fuel' }).fill('25 Gallons sdadad', { timeout });
  181 |     await this.page.getByRole('textbox', { name: 'Height' }).click();
  182 |     await this.page.getByRole('textbox', { name: 'Height' }).fill('55.5 inches adasd', { timeout });
  183 |     await this.page.getByRole('textbox', { name: 'Length' }).click();
  184 |     await this.page.getByRole('textbox', { name: 'Length' }).fill('217 inches adasd', { timeout });
  185 |     
  186 |     await this.page.getByRole('button', { name: 'Continue' }).click();
  187 |     await this.page.getByRole('button', { name: 'Confirm & Get Records' }).click();
  188 |   }
  189 | 
  190 |   async runCheckoutFlow() {
  191 |     // 1. Click Access Record
  192 |     await this.clickAccessRecordButton();
  193 | 
  194 |     // 2. Wait for email popup and fill details
  195 |     const emailInput = this.page.locator('input[type="email"]').first();
  196 |     const phoneInput = this.page.locator('input[type="tel"]').first();
  197 |     
  198 |     await emailInput.waitFor({ state: 'visible', timeout: TIMEOUT });
  199 |     
  200 |     await emailInput.fill(PreviewPage.generateUniqueEmail());
  201 |     await phoneInput.fill(PreviewPage.generateUsPhoneNumber());
  202 |     
  203 |     // 3. Click Proceed to checkout and wait for the navigation together
  204 |     await Promise.all([
  205 |       this.page.waitForURL(/.*\/checkout(?:-\d+)?.*/, { timeout: TIMEOUT }),
  206 |       this.page.getByRole('button', { name: /proceed to checkout/i }).click(),
  207 |     ]);
  208 |   }
  209 | 
  210 |   // Helper: Generate a unique email
  211 |   static generateUniqueEmail() {
  212 |     return `test_${Date.now()}@example.com`;
  213 |   }
  214 | 
  215 |   // Helper: Generate a valid US phone number (XXX) XXX-XXXX
  216 |   static generateUsPhoneNumber() {
  217 |     const areaCode = Math.floor(Math.random() * 800) + 200; // 200-999
  218 |     const prefix = Math.floor(Math.random() * 800) + 200;   // 200-999
  219 |     const lineNumber = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
  220 |     return `(${areaCode}) ${prefix}-${lineNumber}`;
  221 |   }
  222 | }
  223 | 
  224 | class PreviewToCheckoutPriceValidator {
  225 |   constructor(page) {
  226 |     this.page = page;
  227 |   }
  228 | 
  229 |   async selectRandomPlanAndHandleUpsell() {
  230 |     // Locate all plan buttons dynamically by their role on the page
  231 |     const planButtons = this.page.locator('div[role="button"]').filter({
  232 |       hasText: /Report|Check|UVC/i
  233 |     });
  234 |     
  235 |     // Wait for the first plan button to load and render on the DOM before counting
  236 |     await planButtons.first().waitFor({ state: 'visible', timeout: TIMEOUT });
  237 |     
  238 |     const count = await planButtons.count();
  239 |     if (count === 0) {
  240 |       throw new Error("No plan buttons found on the page.");
  241 |     }
  242 |     
  243 |     // Select a random plan index
  244 |     const randomIndex = Math.floor(Math.random() * count);
  245 |     const planLocator = planButtons.nth(randomIndex);
  246 |     
  247 |     // Ensure the plan card is scrolled into view and visible (crucial for mobile carousels/lists)
  248 |     await planLocator.scrollIntoViewIfNeeded();
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
```