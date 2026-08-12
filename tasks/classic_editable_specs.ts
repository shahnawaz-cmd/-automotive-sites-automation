import { Page } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { generateClassicNumericVin } from './vinHelper';

export class ClassicEditableFeatureYMM {
  private timeout = process.env.CI ? 60000 : 90000;

  async run(page: Page) {
    const updateBtn = page.getByRole('button', { name: 'Click here to update' });
    await updateBtn.waitFor({ state: 'visible', timeout: this.timeout });
    await updateBtn.click();

    const ymmBtn = page.getByRole('button', { name: 'Year, Make & Model The' });
    await ymmBtn.waitFor({ state: 'visible', timeout: this.timeout });
    await ymmBtn.click();

    // 30s delay to allow popup stabilization as requested
    await page.waitForTimeout(30000);

    const yearBox = page.getByRole('textbox', { name: 'Select year' });
    await yearBox.waitFor({ state: 'visible', timeout: this.timeout });
    await yearBox.click();
    await page.getByRole('button', { name: '1923' }).first().click();

    await page.getByRole('textbox', { name: 'Select make' }).click();
    await page.getByRole('button', { name: 'Ambassador' }).first().click();

    await page.getByRole('textbox', { name: 'Select model' }).click();
    await page.getByRole('button', { name: 'R', exact: true }).first().click();

    await page.getByRole('textbox', { name: 'Select trim' }).click();
    await page.getByRole('button', { name: 'Touring' }).first().click();

    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Confirm & Get Records' }).click();
  }
}

export class Case5VerifyClassicEditableFeature {
  private timeout = process.env.CI ? 60000 : 90000;

  async runDropdownUpdate(page: Page) {
    const updateBtn = page.getByRole('button', { name: 'Click here to update' });
    await updateBtn.waitFor({ state: 'visible', timeout: this.timeout });
    await updateBtn.click();

    const ymmBtn = page.getByRole('button', { name: 'Update Year, Make and Model' });
    await ymmBtn.waitFor({ state: 'visible', timeout: this.timeout });
    await ymmBtn.click();

    const yearLabel = page.getByLabel('Year');
    await yearLabel.waitFor({ state: 'visible', timeout: this.timeout });
    await yearLabel.click();
    await page.getByLabel('1961').first().click();

    await page.getByLabel('Make').click();
    await page.getByLabel('AJS').first().click();

    await page.getByLabel('Model').click();
    await page.getByText('Model 16 350ms').first().click();

    await page.getByLabel('Trim').click();
    await page.getByText('Base', { exact: true }).first().click();
    
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Confirm Selection' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
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
    const isStreaming = cookies.some(c => c.name === 'checkout_flow' && c.value === 'streaming');

    const classicVin = generateClassicNumericVin('242370B111346');

    // Robust selector logic for Infiniti and other layouts
    const vinInput = page.getByRole('textbox', { name: 'Vehicle Identification Number' })
      .or(page.getByRole('textbox', { name: 'Enter VIN Number' }))
      .or(page.getByRole('textbox', { name: 'Enter Your VIN' }))
      .or(page.locator('input[name="vin"]'))
      .or(page.getByPlaceholder(/enter vin/i))
      .first();

    await vinInput.waitFor({ state: 'visible', timeout: this.timeout / 3 });
    await vinInput.fill(classicVin);

    const submitBtn = page.getByRole('button', { name: /search|decode|get window sticker/i }).first()
      .or(page.locator('button[type="submit"]')).first();
    await submitBtn.click();

    // Support preview, sticker, ws-preview, and license-preview URLs
    await page.waitForURL(/.*(preview|sticker|license-preview|ws-preview).*/, { timeout: this.timeout });

    // Enable API network listener to capture relevant response URLs and payloads
    page.on('response', async (response) => {
      const url = response.url();
      
      // Ignore logging/telemetry endpoints as they are not needed
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
