import { Page } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { generateClassicNumericVin } from './vinHelper';
import { fastInputWithHealing, clickWithHealing, locateInputWithHealing } from '../utils/selfHealingLocator';

export class ClassicEditableFeatureYMM {
  private timeout = process.env.CI ? 60000 : 90000;

  async run(page: Page) {
    // Use self-healing click for the initial "Click here to update" button
    await clickWithHealing(page, 'Click here to update', ['button:has-text("Click here to update")']);

    // Wait for the "Year, Make & Model" button to be visible after the update modal/popup appears
    const ymmButton = page.getByRole('button', { name: 'Year, Make & Model' });
    await ymmButton.waitFor({ state: 'visible', timeout: this.timeout });
    // Use self-healing click for "Year, Make & Model" button
    await clickWithHealing(page, 'Year, Make & Model', ['button:has-text("Year, Make & Model")']);

    // Replace the static 30s delay with a targeted wait for the first interactive element,
    // indicating the form is stable and ready for input.
    const yearBox = page.getByRole('textbox', { name: 'Select year' });
    await yearBox.waitFor({ state: 'visible', timeout: this.timeout }); // Ensure year input is visible and enabled

    // 1. Select Year
    await yearBox.click({ force: true }); // Use force: true to ensure click on potentially covered elements
    await page.waitForTimeout(300); // Small pause for dropdown options to render

    const yearOption = page.getByRole('button', { name: '1923' }).first()
      .or(page.getByRole('option', { name: '1923' }).first())
      .or(page.locator('[role="option"], ul li').filter({ hasText: /\d{4}/ }).first().locator('visible=true')); // Robust fallback for generic list items, ensuring it's visible
    await yearOption.waitFor({ state: 'visible', timeout: 15000 }); // Increased timeout for option visibility
    await yearOption.click({ force: true }); // Use force: true for clicking dropdown option

    // 2. Select Make
    const makeBox = page.getByRole('textbox', { name: 'Select make' });
    await makeBox.waitFor({ state: 'visible', timeout: this.timeout }); // Ensure make box is ready after year selection
    await makeBox.click({ force: true });
    await page.waitForTimeout(300);

    const ambassadorMake = page.getByRole('button', { name: 'Ambassador' }).first()
      .or(page.getByRole('option', { name: 'Ambassador' }).first())
      .or(page.locator('[role="option"], ul li').filter({ hasText: /.+/ }).first().locator('visible=true'));
    await ambassadorMake.waitFor({ state: 'visible', timeout: 15000 });
    await ambassadorMake.click({ force: true });

    // 3. Select Model
    const modelBox = page.getByRole('textbox', { name: 'Select model' });
    await modelBox.waitFor({ state: 'visible', timeout: this.timeout }); // Ensure model box is ready after make selection
    await modelBox.click({ force: true });
    await page.waitForTimeout(300);

    const rModel = page.getByRole('button', { name: 'R', exact: true }).first()
      .or(page.getByRole('option', { name: 'R', exact: true }).first())
      .or(page.locator('[role="option"], ul li').filter({ hasText: /.+/ }).first().locator('visible=true'));
    await rModel.waitFor({ state: 'visible', timeout: 15000 });
    await rModel.click({ force: true });

    // 4. Select Trim
    const trimBox = page.getByRole('textbox', { name: 'Select trim' });
    await trimBox.waitFor({ state: 'visible', timeout: this.timeout }); // Ensure trim box is ready after model selection
    await trimBox.click({ force: true });
    await page.waitForTimeout(300);

    const touringTrim = page.getByRole('button', { name: 'Touring' }).first()
      .or(page.getByRole('option', { name: 'Touring' }).first())
      .or(page.locator('[role="option"], ul li').filter({ hasText: /.+/ }).first().locator('visible=true'));
    await touringTrim.waitFor({ state: 'visible', timeout: 15000 });
    await touringTrim.click({ force: true });

    // 5. Submit changes
    const continueButton = page.getByRole('button', { name: 'Continue' });
    await continueButton.waitFor({ state: 'visible', timeout: 10000 }); // Wait for button to be visible
    await continueButton.click({ force: true });

    const confirmButton = page.getByRole('button', { name: 'Confirm & Get Records' });
    await confirmButton.waitFor({ state: 'visible', timeout: 10000 }); // Wait for button to be visible
    await confirmButton.click({ force: true });
  }
}

export class Case5VerifyClassicEditableFeature {
  private timeout = process.env.CI ? 60000 : 90000;

  async runDropdownUpdate(page: Page) {
    const updateBtn = page.getByRole('button', { name: 'Click here to update' });
    await updateBtn.waitFor({ state: 'visible', timeout: this.timeout });
    await updateBtn.click({ force: true });

    const ymmBtn = page.getByRole('button', { name: 'Update Year, Make and Model' });
    await ymmBtn.waitFor({ state: 'visible', timeout: this.timeout });
    await ymmBtn.click({ force: true });

    // 1. Select Year
    const yearLabel = page.getByLabel('Year');
    await yearLabel.waitFor({ state: 'visible', timeout: this.timeout });
    await yearLabel.click({ force: true });
    await page.waitForTimeout(300);

    const yearOption = page.getByRole('option', { name: '1961' })
      .or(page.getByText('1961', { exact: true }))
      .or(page.locator('[role="option"], ul li').filter({ hasText: /\d{4}/ }).first().locator('visible=true')); // Ensure option is visible
    await yearOption.first().waitFor({ state: 'visible', timeout: 10000 }); // Wait for the specific option to be visible
    await yearOption.first().click({ force: true });

    // 2. Select Make (Wait for get_classic_make API response)
    await page.waitForResponse(
      (res) => res.url().includes('get_classic_make') && res.status() === 200,
      { timeout: 15000 }
    ).catch(() => null);
    await page.waitForTimeout(500);

    const makeLabel = page.getByLabel('Make');
    await makeLabel.waitFor({ state: 'visible', timeout: this.timeout });
    await makeLabel.click({ force: true });
    await page.waitForTimeout(300);

    const ajsMake = page.getByRole('option', { name: 'AJS' }).or(page.getByText('AJS', { exact: true }));
    const firstMake = page.locator('[role="option"], [role="listbox"] li, .dropdown-menu li, ul li').filter({ hasText: /.+/ }).first().locator('visible=true'); // Ensure option is visible

    if (await ajsMake.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      await ajsMake.first().click({ force: true });
    } else {
      await firstMake.click({ force: true });
    }

    // 3. Select Model (Wait for get_classic_model API response)
    await page.waitForResponse(
      (res) => res.url().includes('get_classic_model') && res.status() === 200,
      { timeout: 15000 }
    ).catch(() => null);
    await page.waitForTimeout(500);

    const modelLabel = page.getByLabel('Model');
    await modelLabel.waitFor({ state: 'visible', timeout: this.timeout });
    await modelLabel.click({ force: true });
    await page.waitForTimeout(300);

    const modelOption = page.getByRole('option', { name: 'Model 16 350ms' })
      .or(page.getByText('Model 16 350ms', { exact: true }))
      .or(page.locator('[role="option"], [role="listbox"] li, .dropdown-menu li, ul li').filter({ hasText: /.+/ }).first().locator('visible=true')); // Ensure option is visible

    await modelOption.first().waitFor({ state: 'visible', timeout: 10000 });
    await modelOption.first().click({ force: true });

    // 4. Select Trim (Wait for get_classic_series API response)
    await page.waitForResponse(
      (res) => res.url().includes('get_classic_series') && res.status() === 200,
      { timeout: 10000 }
    ).catch(() => null);
    await page.waitForTimeout(500);

    const trimLabel = page.getByLabel('Trim');
    if (await trimLabel.isVisible()) {
      await trimLabel.click({ force: true });
      await page.waitForTimeout(300);

      const baseTrim = page.getByText('Base', { exact: true })
        .or(page.getByRole('option', { name: /base/i }))
        .or(page.locator('[role="option"], [role="listbox"] li, .dropdown-menu li, ul li').filter({ hasText: /.+/ }).first().locator('visible=true')); // Ensure option is visible

      if (await baseTrim.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await baseTrim.first().click({ force: true });
      }
    }

    // 5. Submit changes
    const continueButton = page.getByRole('button', { name: 'Continue' });
    await continueButton.waitFor({ state: 'visible', timeout: 10000 }); // Wait for button to be visible
    await continueButton.click({ force: true });

    const confirmSelectionButton = page.getByRole('button', { name: 'Confirm Selection' });
    await confirmSelectionButton.waitFor({ state: 'visible', timeout: 10000 }); // Wait for button to be visible
    await confirmSelectionButton.click({ force: true });

    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.waitFor({ state: 'visible', timeout: 10000 }); // Wait for button to be visible
    await submitButton.click({ force: true });

    await page.waitForURL(/cv=/, { timeout: this.timeout * 2 });
  }
}

export class ClassicEditableSpecs {
  private timeout = process.env.CI ? 90000 : 45000;

  async performAs(actor: Actor) {
    const page = actor.getPage();
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

    const cookies = await page.context().cookies();
    const isStreaming = cookies.some((c) => c.name === 'checkout_flow' && c.value === 'streaming');

    const classicVin = generateClassicNumericVin('242370B111346');

    // Self-healing VIN Input
    await fastInputWithHealing(
      page,
      'VIN',
      classicVin,
      [
        'input[name="vin"]',
        'input[placeholder*="VIN" i]',
        'input[aria-label*="VIN" i]'
      ],
      { timeout: this.timeout / 3 }
    );

    // Self-healing Search Submit
    await clickWithHealing(
      page,
      'Search',
      [
        'button[type="submit"]',
        'button:has-text("Search")',
        'button:has-text("Decode")',
        'button:has-text("Get Window Sticker")'
      ]
    );

    // Support preview, sticker, ws-preview, and license-preview URLs
    await page.waitForURL(/.*(preview|sticker|license-preview|ws-preview).*/, { timeout: this.timeout });

    // Enable API network listener to capture relevant response URLs and payloads
    page.on('response', async (response) => {
      const url = response.url();

      if (url.includes('/logs') || url.includes('/telemetry')) {
        return;
      }

      const contentType = response.headers()['content-type'] || '';
      const resourceType = response.request().resourceType();

      if (resourceType === 'fetch' || resourceType === 'xhr' || contentType.includes('application/json')) {
        try {
          const status = response.status();
          const jsonBody = await response.json();
          console.log(`🌐 [API Response] URL: ${url} (Status: ${status})`);
          console.log(`📦 [JSON Data]:\n${JSON.stringify(jsonBody, null, 2)}`);
        } catch (e) {
          // Handled response payload that is not JSON or cannot be read
        }
      }
    });

    if (isStreaming) {
      await new ClassicEditableFeatureYMM().run(page);
    } else {
      await new Case5VerifyClassicEditableFeature().runDropdownUpdate(page);
    }
  }
}