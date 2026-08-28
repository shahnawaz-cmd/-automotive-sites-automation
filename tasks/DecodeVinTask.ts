import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { fastInputWithHealing, clickWithHealing, locateElementWithHealing } from '../utils/selfHealingLocator';

export interface VinTaskSelectors {
  vinField1: string;
  vinField2: string;
  vinField3?: string;
  searchButton: string;
  accessButton: string;
  successText: string;
  successText2: string;
  successText3: string;
  successText4?: string;
  successHeading: string;
  successHeading2: string;
}

export class DecodeVinTask {
  constructor(
    public shouldClose: boolean = true,
    public skipSuccessClick: boolean = false,
    private timeout: number = 60000,
    private selectors: VinTaskSelectors = {
      vinField1: 'Vehicle Identification Number',
      vinField2: 'Enter VIN Number',
      vinField3: 'Enter Your VIN',
      searchButton: 'Search VIN',
      accessButton: 'Access Records',
      successText: 'Records found for',
      successText2: 'We found historical records for the',
      successText3: 'Window sticker found for',
      successText4: 'Searching records for',
      successHeading: 'Success! We found detailed',
      successHeading2: 'We found detailed information for the',
    }
  ) {}

  private generateRandomVin(baseVin: string, numToReplace: number = 1): string {
    const randomDigits = Math.floor(Math.random() * Math.pow(10, numToReplace))
      .toString()
      .padStart(numToReplace, '0');
    return baseVin.slice(0, -numToReplace) + randomDigits;
  }

  private generateUSVin(isMVL: boolean = false): string {
    const baseVin = '1FMCU9GD3JUC83708';
    return this.generateRandomVin(baseVin, 2);
  }

  private generateEuVin(): string {
    const baseVins = [
      'VF3YC2MFB12G20874',
      'SHHEU88701U002012'
    ];
    const baseVin = baseVins[Math.floor(Math.random() * baseVins.length)];
    return this.generateRandomVin(baseVin, 1);
  }

  async performAs(actor: Actor) {
    const page = actor.getPage();
    const isMVL = page.url().includes('motorcyclevinlookup.com');
    // ONLY TC_14 (which passes skipSuccessClick = true) uses EU VINs. All other cases use US VINs.
    const isTC14 = this.skipSuccessClick;
    const vin = isTC14 ? this.generateEuVin() : this.generateUSVin(isMVL);
    console.log(`[VIN Decode] Generated VIN (${isTC14 ? 'EU' : 'US'}): ${vin}`);

    // Self-Healing Input: Fills VIN with multi-strategy accessibility, placeholder, label & attributes
    // Utilizes existing robust selectors. The vinField1/2/3 in selectors are likely descriptive labels,
    // not direct Playwright selectors, so relying on generic input attributes is better here.
    await fastInputWithHealing(
      page,
      'VIN', // inputNameOrPlaceholder, often corresponds to placeholder or name attribute
      vin,
      [
        'input[name="vin"]',
        'input[placeholder*="VIN" i]',
        'input[aria-label*="VIN" i]',
        'input[type="text"]',
        'input[inputmode="numeric"]', // Added for potential numeric VIN fields
        page.getByLabel(/vin|vehicle identification number/i), // More semantic approach
        page.getByPlaceholder(/vin|vehicle identification number/i)
      ],
      { timeout: this.timeout }
    );

    // Self-Healing Button: Clicks search/decode button with multi-strategy
    await clickWithHealing(
      page,
      this.selectors.searchButton,
      [
        'button[type="submit"]',
        'button:has-text("Search")',
        'button:has-text("Decode")',
        'button:has-text("Get Window Sticker")',
        `button:has-text("${this.selectors.searchButton}")`, // Use the provided selector text
        page.getByRole('button', { name: /search vin|decode|get window sticker|search/i }) // Robust semantic selector
      ],
      { timeout: this.timeout / 2 } // Give a reasonable time for the button click
    );

    // Removed `await page.waitForTimeout(1000);` as static waits can lead to flakiness.
    // Replaced with a more robust, condition-based wait for success elements.

    // Self-Healing Success Element Detection:
    // Consolidate all potential success messages into a single, robust locator using .or().
    // Use `page.getByText` and `page.getByRole('heading')` for semantic stability.
    const successConditionLocator = page.getByText(this.selectors.successText, { exact: false, visible: true })
      .or(page.getByText(this.selectors.successText2, { exact: false, visible: true }))
      .or(page.getByText(this.selectors.successText3, { exact: false, visible: true }))
      // Conditionally add successText4 if it's defined in selectors
      .or(this.selectors.successText4 ? page.getByText(this.selectors.successText4, { exact: false, visible: true }) : page.locator('__NEVER_MATCH__')) // Use a locator that will never match if text4 is not present
      .or(page.getByRole('heading', { name: this.selectors.successHeading, exact: false, visible: true }))
      .or(page.getByRole('heading', { name: this.selectors.successHeading2, exact: false, visible: true }))
      .or(page.getByRole('heading', { name: /Success/i, exact: false, visible: true })) // Catch-all for generic "Success" headings
      .or(page.getByText('Success!', { exact: false, visible: true })); // Catch-all for generic "Success!" text

    // Wait for the success condition locator to become visible.
    // Use `expect().toBeVisible()` for built-in Playwright retry and better error reporting.
    try {
        await expect(successConditionLocator).toBeVisible({ timeout: 30000 }); // Wait up to 30 seconds for success.
        console.log(`[VIN Decode] Successfully detected success condition: "${await successConditionLocator.first().textContent()}"`);
    } catch (error) {
        console.error(`[VIN Decode] Timeout waiting for VIN decode success condition. Current URL: ${page.url()}`);
        console.error(`[VIN Decode] Error details: ${error}`);
        // Optionally, take a screenshot here for debugging CI failures
        // await page.screenshot({ path: `failure-screenshot-${Date.now()}.png` });
        throw new Error('Failed to find VIN decode success condition after searching.');
    }

    // Handle clicking the access button if `skipSuccessClick` is false.
    if (this.skipSuccessClick) {
      console.log('[VIN Decode] Bypassing next action as requested by task parameters (skipSuccessClick).');
    } else {
      console.log(`[VIN Decode] Attempting to click the access button: "${this.selectors.accessButton}"`);
      try {
        // Use clickWithHealing for the access button for maximum resilience.
        await clickWithHealing(
          page,
          this.selectors.accessButton,
          [
            page.getByRole('button', { name: this.selectors.accessButton, exact: true }),
            page.getByRole('link', { name: this.selectors.accessButton, exact: true }), // Sometimes it's a link
            `button:has-text("${this.selectors.accessButton}")`,
            `a:has-text("${this.selectors.accessButton}")`,
            // Add more generic selectors for access/continue buttons that might appear after VIN decode
            page.getByRole('button', { name: /access|continue|view records|get report/i }),
            page.getByRole('link', { name: /access|continue|view records|get report/i }),
          ],
          { timeout: 15000 } // Give it a reasonable timeout (e.g., 15 seconds) for the button to appear and be clickable
        );
        console.log('[VIN Decode] Access button clicked successfully.');
      } catch (error) {
        console.error(`[VIN Decode] Failed to click access button after success condition. Current URL: ${page.url()}`);
        console.error(`[VIN Decode] Error details: ${error}`);
        // await page.screenshot({ path: `failure-access-button-${Date.now()}.png` });
        throw new Error('Failed to click the "Access Records" or similar button after VIN decode success.');
      }
    }
  }
}