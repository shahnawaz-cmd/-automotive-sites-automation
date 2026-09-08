# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: global_case_verification.spec.ts >> TC_07 License Plate search validation
- Location: tests/global_case_verification.spec.ts:111:5

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: locator.waitFor: Test timeout of 90000ms exceeded.
Call log:
  - waiting for locator('text=Unlock the history').or(locator('button:has-text("Access Records")')).or(locator('button:has-text("Reveal Records")')).or(locator('text=Vehicle Specifications')).or(getByText('Records found for')).or(getByText('Success! We found detailed')).or(locator('h1:has-text("Success!")')).or(locator('text=5 Reports')).or(locator('text=1 Report')).or(locator('[data-testid*="preview"]')).first() to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]
  - generic [ref=e4]:
    - img [ref=e6]
    - generic [ref=e8]: Engine Trouble
    - heading "Something went wrong" [level=1] [ref=e11]
    - paragraph [ref=e12]: We hit an unexpected bump in the road. Our team has been notified. Try again or head back to the homepage.
    - generic [ref=e13]:
      - button "Try Again" [ref=e14]:
        - img [ref=e15]
        - text: Try Again
      - link "Back to Home" [ref=e18] [cursor=pointer]:
        - /url: /
        - img [ref=e19]
        - text: Back to Home
```

# Test source

```ts
  40  |         'HBL1216',
  41  |         [
  42  |           '.hero-search-panel[aria-hidden="false"] input[name="plate"]',
  43  |           'input[name*="plate" i]',
  44  |           'input[placeholder*="plate" i]',
  45  |           'input[aria-label*="plate" i]',
  46  |           '[data-testid*="plate"]',
  47  |         ],
  48  |         { timeout }
  49  |       );
  50  | 
  51  |       // 2. Select State inside the active in-page search form
  52  |       const selectElement = page.locator('select[name*="state" i]').first();
  53  |       const isNativeSelect = await selectElement.isVisible().catch(() => false);
  54  | 
  55  |       if (isNativeSelect) {
  56  |         await selectElement.selectOption({ label: 'Texas' }).catch(() => selectElement.selectOption('TX'));
  57  |       } else {
  58  |         const stateDropdown = page.locator('.hero-search-panel[aria-hidden="false"] input[role="combobox"]')
  59  |           .or(page.getByRole('combobox', { name: /State|Select/i }))
  60  |           .or(page.locator('input[aria-label*="State" i]'))
  61  |           .or(page.locator('[role="combobox"]'))
  62  |           .first();
  63  | 
  64  |         await stateDropdown.waitFor({ state: 'visible', timeout });
  65  |         await stateDropdown.click({ force: true, timeout: 5000 });
  66  |         await stateDropdown.fill('Texas').catch(() => {});
  67  | 
  68  |         // Target option strictly inside the listbox dropdown popup
  69  |         const texasOption = page.locator('[role="listbox"] [role="option"]:has-text("Texas")')
  70  |           .or(page.locator('[role="listbox"] li:has-text("Texas")'))
  71  |           .or(page.getByRole('option', { name: 'Texas', exact: true }))
  72  |           .first();
  73  | 
  74  |         if (await texasOption.isVisible({ timeout: 2000 }).catch(() => false)) {
  75  |           await texasOption.click({ force: true, timeout: 5000 });
  76  |         } else {
  77  |           await page.keyboard.press('Enter').catch(() => {});
  78  |         }
  79  |       }
  80  | 
  81  |       // 3. Click Search Button in the active form
  82  |       await clickWithHealing(
  83  |         page,
  84  |         'Search License Plate Button',
  85  |         [
  86  |           '.hero-search-panel[aria-hidden="false"] button[type="submit"]',
  87  |           'button:has-text("Search License Plate")',
  88  |           'button:has-text("Get Window Sticker")',
  89  |           'button[type="submit"]',
  90  |           'button:has-text("Search")',
  91  |           '[data-testid*="search-button"]'
  92  |         ]
  93  |       );
  94  | 
  95  |       // 4. Wait for navigation to preview page
  96  |       await page.waitForURL(/.*(license-preview|preview|sticker|report|checkout|payment).*/i, {
  97  |         timeout,
  98  |         waitUntil: 'domcontentloaded'
  99  |       });
  100 |       await page.waitForLoadState('domcontentloaded');
  101 | 
  102 |       // 5. Complete pre-VIN check / goal prompt steps until the actual Preview page is loaded
  103 |       for (let i = 0; i < 5; i++) {
  104 |         const isActualPreviewVisible = await page.locator('text=Unlock the history')
  105 |           .or(page.locator('button:has-text("Access Records")'))
  106 |           .or(page.locator('button:has-text("Reveal Records")'))
  107 |           .first()
  108 |           .isVisible({ timeout: 1500 })
  109 |           .catch(() => false);
  110 | 
  111 |         if (isActualPreviewVisible) {
  112 |           break;
  113 |         }
  114 | 
  115 |         const goalBtn = page.locator('button:has-text("Just checking"), button:has-text("I\'m a buyer"), button:has-text("I\'m a seller"), button:has-text("Continue"), button:has-text("Next")')
  116 |           .locator('visible=true')
  117 |           .first();
  118 | 
  119 |         if (await goalBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
  120 |           console.log(`Advancing pre-VIN check step (${await goalBtn.innerText()})...`);
  121 |           await goalBtn.click({ force: true }).catch(() => {});
  122 |           await page.waitForTimeout(1000);
  123 |         } else {
  124 |           break;
  125 |         }
  126 |       }
  127 | 
  128 |       // 6. Wait for the actual Preview Page containing vehicle YMM details, packages & access CTAs
  129 |       const actualPreviewLocator = page.locator('text=Unlock the history')
  130 |         .or(page.locator('button:has-text("Access Records")'))
  131 |         .or(page.locator('button:has-text("Reveal Records")'))
  132 |         .or(page.locator('text=Vehicle Specifications'))
  133 |         .or(page.getByText('Records found for', { exact: false }))
  134 |         .or(page.getByText('Success! We found detailed', { exact: false }))
  135 |         .or(page.locator('h1:has-text("Success!")'))
  136 |         .or(page.locator('text=5 Reports'))
  137 |         .or(page.locator('text=1 Report'))
  138 |         .or(page.locator('[data-testid*="preview"]'));
  139 | 
> 140 |       await actualPreviewLocator.first().waitFor({ state: 'visible', timeout });
      |                                          ^ Error: locator.waitFor: Test timeout of 90000ms exceeded.
  141 |       await page.waitForTimeout(2000); // Allow full vehicle specs, YMM heading, and pricing packages to render
  142 |       console.log(`✅ Landed on actual Preview Page (${page.url()})`);
  143 | 
  144 |       // 7. Capture and attach screenshot of the actual Preview page
  145 |       try {
  146 |         const screenshotBuffer = await page.screenshot({ fullPage: false });
  147 |         await test.info().attach('Actual_Preview_Page_Screenshot', {
  148 |           body: screenshotBuffer,
  149 |           contentType: 'image/png'
  150 |         });
  151 |         console.log('📸 [Screenshot] Attached actual Preview Page screenshot to Playwright report.');
  152 |       } catch (e: any) {
  153 |         console.log(`[Screenshot] Info attach skipped: ${e.message}`);
  154 |       }
  155 |     } else {
  156 |       console.log('Skipping License Plate decode flow as the tab was not found or interactable.');
  157 |     }
  158 |   }
  159 | }
  160 | 
```