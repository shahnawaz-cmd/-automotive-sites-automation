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
    await expect(errorElement).toBeVisible({ timeout: this.timeout });

    // Validate the error message text
    await expect(errorElement).toContainText(this.expectedMessage);
    
    console.log(`Error message verified: "${this.expectedMessage}"`);
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
    await page.getByRole('button', { name: this.searchButtonName }).click();
    
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
    console.log(`[Error Verification] Clicking search button: ${this.searchButtonName}`);
    await page.getByRole('button', { name: this.searchButtonName }).click();
    
    const errorTask = new FormErrorMessageTask(
      this.errorSelector,
      this.expectedMessage,
      this.timeout
    );
    await actor.attemptsTo(errorTask);
  }
}
