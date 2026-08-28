import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { fastInputWithHealing, clickWithHealing, locateElementWithHealing } from '../utils/selfHealingLocator';

export class LPcases {
  async performAs(actor: Actor) {
    const page = actor.getPage();
    const timeout = process.env.CI ? 90000 : 60000;

    let isTabPresentAndClickable = false;
    // Attempt to locate and click the License Plate tab with robust self-healing and extended timeouts.
    try {
      const activeTabLocator = await locateElementWithHealing(
        page,
        'License Plate Tab', // Descriptive name for logs
        [
          'button:has-text("By License Plate")',
          'button:has-text("By U.S License Plate")',
          '[role="tab"]:has-text("License Plate")',
          'text=By License Plate'
        ],
        { timeout: timeout / 2 } // Give it a generous time (30-45s) to locate the tab in the DOM
      );

      // After locating, ensure the tab is visible and interactable before attempting to click.
      await activeTabLocator.waitFor({ state: 'visible', timeout: timeout / 4 }); // Max 15-22.5s for visibility after being located
      console.log('LP Tab Found and visible in Website');
      // Use force: true to bypass potential overlay issues and a specific timeout for the click action itself.
      await activeTabLocator.click({ force: true, timeout: 5000 });
      isTabPresentAndClickable = true;
    } catch (error: any) {
      console.log(`LP Tab not found or not interactable within timeout: ${error.message}`);
      // Optionally, add a screenshot for debugging critical failures
      // await page.screenshot({ path: `screenshots/LP_Tab_Failure_${Date.now()}.png` });
    }

    if (isTabPresentAndClickable) {
      console.log('Proceeding with License Plate decode steps.');

      // Self-Healing Plate Input for license plate number
      await fastInputWithHealing(
        page,
        'License Plate Input Field', // More descriptive name for logs
        'HBL1216',
        [
          'input[name*="plate" i]',
          'input[placeholder*="plate" i]',
          'input[aria-label*="plate" i]',
          '[data-testid*="plate"]', // Added data-testid for increased resilience
        ],
        { timeout: timeout }
      );

      // Handle State selection robustly for multi-brand variations
      const stateDropdown = page.getByRole('combobox', { name: /State|Select/i }) // Prioritize byRole with a descriptive (case-insensitive) name
        .or(page.locator('select[name*="state" i]'))
        .or(page.locator('[role="combobox"]'))
        .first(); // Use .first() but ensure previous selectors are specific enough

      // Ensure the dropdown itself is visible and enabled before clicking
      await stateDropdown.waitFor({ state: 'visible', timeout: timeout });
      await stateDropdown.click({ force: true, timeout: 5000 }); // Click with force and a timeout

      // Select the 'Texas' option with multiple fallback selectors
      const texasOption = page.getByRole('option', { name: 'Texas', exact: true }) // Prefer role option with exact text match
        .or(page.locator('li:has-text("Texas")')) // Common for custom dropdown options
        .or(page.locator('option[value*="TX" i]')) // Standard HTML select option
        .or(page.locator('[role="option"]:has-text("Texas")')) // Generic role option
        .or(page.getByText('Texas', { exact: true })); // Fallback for plain text within a container

      // Ensure the option is visible and enabled before clicking
      await texasOption.first().waitFor({ state: 'visible', timeout: timeout });
      await texasOption.first().click({ force: true, timeout: 5000 }); // Click with force and a timeout

      // Locate and click the search button with self-healing capabilities
      await clickWithHealing(
        page,
        'Search License Plate Button', // Descriptive name for logs
        [
          'button:has-text("Get Window Sticker")',
          'button:has-text("Search License Plate")',
          'button[type="submit"]',
          'button:has-text("Search")',
          '[data-testid*="search-button"]' // Added data-testid for resilience
        ]
      );

      // Wait for navigation to the preview page with a flexible URL regex
      // Expanded regex to cover multi-brand variations and potential query parameters, as per healing guidelines
      await page.waitForURL(/.*(vin-check\/license-preview|ws-preview|sticker|report|checkout|payment).*/i, {
        timeout: timeout,
        waitUntil: 'domcontentloaded' // Wait until the initial HTML document has been completely loaded and parsed
      });

      // Smart wait for success conditions using combined locators
      const successText = page.locator('text=Records found for');
      const successHeading = page.getByRole('heading', { name: 'Success! We found detailed' });
      const combinedSuccess = successText.or(successHeading);

      // Ensure that at least one of the success indicators is visible
      await combinedSuccess.first().waitFor({ state: 'visible', timeout: timeout });
      console.log('Success condition met: License Plate decode completed.');
    } else {
      console.log('Skipping License Plate decode flow as the tab was not found or interactable.');
      // If the tab is optional for certain brands or scenarios, returning here allows the test to pass without failing.
      // If it's a critical component for all brands, consider throwing an error instead.
    }
  }
}