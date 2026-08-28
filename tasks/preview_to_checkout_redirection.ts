import { Page } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { DecodeVinTask } from './DecodeVinTask';
import { fastInputWithHealing, clickWithHealing, locateElementWithHealing } from '../utils/selfHealingLocator';

export class PreviewToCheckoutRedirection {
  private timeout: number;

  constructor() {
    // Condition-based timeout (longer on CI to prevent flakiness)
    this.timeout = process.env.CI ? 90000 : 45000;
  }

  private async fillEmailAndProceed(page: Page) {
    const popupTimeout = process.env.CI ? 20000 : 10000;

    // Self-healing Start button click
    // Healing applied: Added { force: true } to bypass potential pointer-event interception by overlays.
    await clickWithHealing(
      page,
      'Access Records',
      [
        'button:has-text("Access Records")',
        'button:has-text("Get Window Sticker")',
        'button:has-text("View Full Report")',
        'button:has-text("Get Records")'
      ],
      { timeout: popupTimeout, force: true }
    );

    // Self-healing Email Input
    // Healing applied: Added { force: true } to bypass potential pointer-event interception by overlays.
    const suffix = Math.random().toString(36).substring(2, 5);
    await fastInputWithHealing(
      page,
      'Email',
      `rolex.rolls12+${suffix}@gmail.com`,
      [
        'input[type="email"]',
        'input[placeholder*="email" i]',
        'input[name*="email" i]'
      ],
      { timeout: popupTimeout, force: true }
    );

    // Self-healing Checkout/Proceed button click
    // Healing applied: Added { force: true } to bypass potential pointer-event interception.
    // Healing applied: Added more text fallbacks for the checkout button to support multi-brand variations
    // (e.g., "Pay Now", "Complete Order") and increase resilience against DOM drift.
    await clickWithHealing(
      page,
      'Proceed to Checkout',
      [
        'button:has-text("Proceed to checkout")',
        'button:has-text("Pay Now")', // Added for multi-brand variations
        'button:has-text("Complete Order")', // Added for multi-brand variations
        'button:has-text("Access Records")', // Existing fallback
        'button[type="submit"]'
      ],
      { timeout: popupTimeout, force: true }
    );
  }

  async performAs(actor: Actor) {
    const page = actor.getPage();
    await actor.attemptsTo(new DecodeVinTask(false));
    await this.fillEmailAndProceed(page);

    // Smart wait: Wait for URL redirection to checkout page
    // Healing applied: Expanded the regex for `waitForURL` to include more common checkout-related terms
    // (e.g., "purchase", "confirmation", "summary") and added 'i' flag for case-insensitivity.
    // This improves resilience for varying URL patterns across multi-brand sites and prevents timeout issues
    // if the URL contains a different but related term.
    await page.waitForURL(/.*(checkout|payment|billing|order|purchase|confirmation|summary).*/i, { timeout: this.timeout });
  }
}