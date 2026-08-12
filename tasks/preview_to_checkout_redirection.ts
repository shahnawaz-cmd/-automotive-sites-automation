import { Page } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { DecodeVinTask } from './DecodeVinTask';

export class PreviewToCheckoutRedirection {
  private timeout: number;

  constructor() {
    // Condition-based timeout (longer on CI to prevent flakiness)
    this.timeout = process.env.CI ? 90000 : 45000;
  }

  private async fillEmailAndProceed(page: Page) {
    const popupTimeout = process.env.CI ? 20000 : 10000;

    // Smart wait: Click the primary button once visible
    const startButton = page.getByRole('button', { name: /access records|get window sticker|view full report/i }).first();
    await startButton.waitFor({ state: 'visible', timeout: popupTimeout });
    await startButton.click();
    
    // Smart wait: Input email when field is visible
    const emailInput = page.locator('input[type="email"]').first();
    await emailInput.waitFor({ state: 'visible', timeout: popupTimeout });
    const suffix = Math.random().toString(36).substring(2, 5);
    await emailInput.fill(`rolex.rolls12+${suffix}@gmail.com`);

    // Smart wait: Click final submit/checkout button once visible
    const checkoutButton = page.getByRole('button', { name: /proceed to checkout|access records/i }).last();
    await checkoutButton.waitFor({ state: 'visible', timeout: popupTimeout });
    await checkoutButton.click();
  }

  async performAs(actor: Actor) {
    const page = actor.getPage();
    await actor.attemptsTo(new DecodeVinTask(this.timeout));
    await this.fillEmailAndProceed(page);
    
    // Smart wait: Wait for URL redirection to checkout page
    await page.waitForURL(/.*(checkout|payment|billing|order).*/, { timeout: this.timeout });
  }
}
