import { test } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { DecodeVinTask } from '../tasks/DecodeVinTask';
import { SearchAndVerifyErrorTask } from '../tasks/form_error_messages';

test('TC_01 VIN decode verify', async ({ page }) => {
  const actor = new Actor('User', page);
  try {
    // Navigate to the base URL and wait for stability
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // 1 second delay
    
    // Perform the decoding task
    await actor.attemptsTo(new DecodeVinTask());
  } finally {
    await page.close();
  }
});

test('TC_02 Verify error message on invalid search', async ({ page }) => {
  const actor = new Actor('User', page);
  try {
    // Navigate to the base URL
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Define selectors for error verification
    // Using text locator to find the error message
    const selectors = {
      searchButtonName: 'Search VIN',
      errorSelector: 'text=Please enter a VIN number', 
      expectedMessage: 'Please enter a VIN number', 
    };

    // Perform the search and error verification task
    await actor.attemptsTo(new SearchAndVerifyErrorTask(
      selectors.searchButtonName,
      selectors.errorSelector,
      selectors.expectedMessage
    ));
  } finally {
    await page.close();
  }
});
