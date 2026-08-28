import { Page } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { generateClassicNumericVin } from './vinHelper';
import { fastInputWithHealing, clickWithHealing, locateInputWithHealing } from '../utils/selfHealingLocator';

export class ClassicEditableSpecsManual {
  private timeout = process.env.CI ? 90000 : 45000;

  async runManualUpdate(page: Page) {
    // 1. Click 'Click here to update'
    await clickWithHealing(page, 'Click here to update', [
      'button:has-text("Click here to update")',
      'button:has-text("update")'
    ]);

    // 2. Click 'Update Year, Make and Model'
    await clickWithHealing(page, 'Update Year, Make and Model', [
      'button:has-text("Update Year, Make and Model")',
      'button:has-text("Year, Make & Model")'
    ]);

    // 3. Click 'Click here' (for manual inputs)
    await clickWithHealing(page, 'Click here', [
      'button:has-text("Click here")',
      'a:has-text("Click here")'
    ]);

    // 4. Self-Healing Manual Field Inputs
    await fastInputWithHealing(page, 'Enter year', '1960', ['input[placeholder*="year" i]']);
    await fastInputWithHealing(page, 'Enter make', 'Ford', ['input[placeholder*="make" i]']);
    await fastInputWithHealing(page, 'Enter model', 'F-250', ['input[placeholder*="model" i]']);
    await fastInputWithHealing(page, 'Enter engine', 'V8', ['input[placeholder*="engine" i]']);
    await fastInputWithHealing(page, 'Enter transmission', 'Auto', ['input[placeholder*="transmission" i]']);
    await fastInputWithHealing(page, 'Enter number of doors', '5', ['input[placeholder*="doors" i]']);
    await fastInputWithHealing(page, 'Enter drive type', 'AWD', ['input[placeholder*="drive" i]']);

    // 5. Submit changes
    await clickWithHealing(page, 'Continue', ['button:has-text("Continue")']);
    await clickWithHealing(page, 'Submit', ['button:has-text("Submit")']);

    await page.waitForURL(/cv=/, { timeout: this.timeout * 2 });
    console.log('✅ Manual update successful');
  }

  async performAs(actor: Actor) {
    const page = actor.getPage();
    await page.goto('/');
    await page.waitForTimeout(1000);

    const classicVin = generateClassicNumericVin();
    
    // Self-healing VIN input & search
    await fastInputWithHealing(page, 'VIN', classicVin, [
      'input[name="vin"]',
      'input[placeholder*="VIN" i]',
      'input[aria-label*="VIN" i]'
    ]);

    await clickWithHealing(page, 'Search', [
      'button[type="submit"]',
      'button:has-text("Search")',
      'button:has-text("Decode")',
      'button:has-text("Get Window Sticker")'
    ]);

    await page.waitForURL(/.*(preview|sticker|license-preview|ws-preview).*/, { timeout: this.timeout });
    await this.runManualUpdate(page);
  }
}
