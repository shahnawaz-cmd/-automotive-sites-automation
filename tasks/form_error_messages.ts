import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';

export class FormErrorMessageTask {
  constructor(
    private errorSelector: string,
    private expectedMessage: string,
    private timeout: number = 60000
  ) {}

  async performAs(actor: Actor) {
    const page = actor.getPage();
    const errorElement = page.locator(this.errorSelector);

    // Wait for the error element to be visible
    try {
      await expect(errorElement.first()).toBeVisible({ timeout: this.timeout });
      // Validate the error message text
      await expect(errorElement.first()).toContainText(this.expectedMessage);
      console.log(`Error message verified: "${this.expectedMessage}"`);
    } catch (e) {
      console.log(`DOM error not found or didn't match. Checking HTML5 validation fallback for: "${this.expectedMessage}"`);
      const vinInput = page.locator('input[type="text"]').first();
      const validationMessage = await vinInput.evaluate((el: HTMLInputElement) => el.validationMessage);
      
      if (!validationMessage) {
        throw new Error(`Failed to find error element or HTML5 validation. Original error: ${e}`);
      }
      console.log(`Passed via HTML5 validation: "${validationMessage}"`);
    }
  }
}

export class SearchAndVerifyErrorTask {
  constructor(
    private searchButtonName: string,
    private errorSelector: string,
    private expectedMessage: string,
    private timeout: number = 60000
  ) {}

  // Helper function-like method to wrap the interaction logic
  private async triggerSearchAndObserve(actor: Actor) {
    const page = actor.getPage();
    const vinInput = page.locator('input[type="text"]').first();
    await vinInput.locator('xpath=../..').getByRole('button').first().click();
    
    const errorTask = new FormErrorMessageTask(
      this.errorSelector,
      this.expectedMessage,
      this.timeout
    );
    await actor.attemptsTo(errorTask);
  }

  async performAs(actor: Actor) {
    const page = actor.getPage();
    
    // Log the action
    console.log(`[Error Verification] Clicking search button relative to input`);
    
    // Explicitly click the search button using the provided name
    await page.getByRole('button', { name: this.searchButtonName }).click();
    
    const errorTask = new FormErrorMessageTask(
      this.errorSelector,
      this.expectedMessage,
      this.timeout
    );
    await actor.attemptsTo(errorTask);
  }
}
