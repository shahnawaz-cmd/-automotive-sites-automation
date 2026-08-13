import { Page } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { generateClassicNumericVin } from './vinHelper';
import { DecodeVinTask } from './DecodeVinTask';

export class ClassicEditableSpecsManual {
  private timeout = process.env.CI ? 90000 : 45000;

  async runManualUpdate(page: Page) {
    const updateBtn = page.getByRole('button', { name: 'Click here to update' });
    await updateBtn.waitFor({ state: 'visible', timeout: this.timeout });
    await updateBtn.click({ force: true });

    const ymmBtn = page.getByRole('button', { name: 'Update Year, Make and Model' });
    await ymmBtn.waitFor({ state: 'visible', timeout: this.timeout });
    await ymmBtn.click({ force: true });

    const clickHereBtn = page.getByRole('button', { name: 'Click here' });
    await clickHereBtn.waitFor({ state: 'visible', timeout: this.timeout });
    await clickHereBtn.click({ force: true });

    await page.getByPlaceholder('Enter year').fill('1960');
    await page.getByPlaceholder('Enter make').fill('Ford');
    await page.getByPlaceholder('Enter model').fill('F-250');
    await page.getByPlaceholder('Enter engine (e.g., V8,').fill('V8');
    await page.getByPlaceholder('Enter transmission type').fill('Auto');
    await page.getByPlaceholder('Enter number of doors').fill('5');
    await page.getByPlaceholder('Enter drive type (e.g., RWD,').fill('AWD');

    await page.getByRole('button', { name: 'Continue' }).click({ force: true });
    await page.getByRole('button', { name: 'Submit' }).click({ force: true });
    await page.waitForURL(/cv=/, { timeout: this.timeout * 2 });
    console.log('✅ Manual update successful');
  }

  async performAs(actor: Actor) {
    const page = actor.getPage();
    await page.goto('/');
    await page.waitForTimeout(1000);

    const classicVin = generateClassicNumericVin();
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

    await page.waitForURL(/.*(preview|sticker|license-preview|ws-preview).*/, { timeout: this.timeout });
    await this.runManualUpdate(page);
  }
}
