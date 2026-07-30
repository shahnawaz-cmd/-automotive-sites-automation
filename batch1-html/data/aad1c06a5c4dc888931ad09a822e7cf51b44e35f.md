# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: streaming2-e2e.spec.js >> TC_08_Home_To_Checkout_Flow_Integration_Validation
- Location: tests/streaming2-e2e.spec.js:138:1

# Error details

```
TimeoutError: page.waitForSelector: Timeout 90000ms exceeded.
Call log:
  - waiting for locator('text=Records found for') to be visible

```

# Test source

```ts
  1   | // tests/pages/PreviewPage.js
  2   | const { expect } = require('@playwright/test');
  3   | const TIMEOUT = process.env.CI ? 90000 : 60000;
  4   | 
  5   | class PreviewPage {
  6   |   constructor(page) {
  7   |     this.page = page;
  8   |     // Use .first() to resolve ambiguity if multiple buttons match
  9   |     this.accessRecordButton = page.locator('button:has-text("Access Record")').first();
  10  |   }
  11  | 
  12  |   async handleEUSpecs(timeout = TIMEOUT) {
  13  |     await this.page.getByRole('button', { name: 'No, fix it' }).click();
  14  |     await this.page.waitForTimeout(17000);
  15  |     await this.page.getByRole('textbox', { name: 'Select year' }).click();
  16  |     await this.page.getByRole('button', { name: '2022' }).click();
  17  |     await this.page.getByRole('textbox', { name: 'Select make' }).click();
  18  |     await this.page.getByRole('button', { name: 'Acura' }).click();
  19  |     await this.page.getByRole('textbox', { name: 'Select model' }).click();
  20  |     await this.page.getByRole('button', { name: 'MDX' }).click();
  21  |     await this.page.getByRole('textbox', { name: 'Select trim' }).click();
  22  |     await this.page.getByRole('button', { name: 'V6 FWD - V6' }).click();
  23  |     await this.page.getByRole('button', { name: 'Get Records' }).click();
  24  |   }
  25  | 
  26  |   async confirmSpecs() {
  27  |     // Add logic here
  28  |   }
  29  | 
  30  |   async selectPlan(planName) {
  31  |     // Specifically target the container div acting as a button for the plan
  32  |     const plan = this.page.locator(`div[role="button"]:has(div:has-text("${planName}"))`).first();
  33  |     
  34  |     // Explicit wait for interactability
  35  |     await plan.waitFor({ state: 'visible', timeout: TIMEOUT });
  36  |     
  37  |     // Click the plan
  38  |     await plan.click();
  39  |     
  40  |     // Verify it is selected by checking aria-pressed attribute (in the test file)
  41  |     return plan;
  42  |   }
  43  | 
  44  |   async verifySpecsVisible(expectedText = 'Records found for', timeout = TIMEOUT) {
  45  |     // Wait for the specific text to appear
> 46  |     await this.page.waitForSelector(`text=${expectedText}`, { timeout: timeout });
      |                     ^ TimeoutError: page.waitForSelector: Timeout 90000ms exceeded.
  47  |   }
  48  | 
  49  |   async verifyAccessRecordButton() {
  50  |     await this.accessRecordButton.waitFor({ state: 'visible', timeout: TIMEOUT });
  51  |     await this.accessRecordButton.isEnabled();
  52  |   }
  53  | 
  54  |   async clickAccessRecordButton() {
  55  |     await this.accessRecordButton.click();
  56  |   }
  57  | 
  58  |   async closeAccessRecordPopup() {
  59  |     const closeButton = this.page.getByRole('button', { name: /^Close$/ }).first();
  60  |     await closeButton.waitFor({ state: 'visible', timeout: TIMEOUT });
  61  |     await closeButton.click();
  62  |     await closeButton.waitFor({ state: 'hidden', timeout: TIMEOUT });
  63  |   }
  64  | 
  65  |   async triggerExitIntent() {
  66  |     await this.page.mouse.move(640, 400, { steps: 10 });
  67  |     await this.page.waitForTimeout(1000);
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
```