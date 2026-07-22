import { test } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { DecodeVinTask } from '../tasks/DecodeVinTask';
import { SearchAndVerifyErrorTask } from '../tasks/form_error_messages';
import { FieldValidation } from '../tasks/vin_field_validation';
import { CouponAndPrevCouponVerification, LowToHighCouponFlow, CouponBannerOnOtherPages } from '../tasks/coupon_flow_validation';
import { LPcases } from '../tasks/LPdecode';
import { RevisitBannerFlow } from '../tasks/revisit_banner_flow';

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

test('TC_03 VIN field validation', async ({ page }, testInfo) => {
  const actor = new Actor('User', page);
  // Set conditional timeout: 90s for CI, 60s local
  const timeout = process.env.CI ? 90000 : 60000;
  testInfo.setTimeout(timeout);

  try {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await actor.attemptsTo(new FieldValidation());
  } finally {
    await page.close();
  }
});

test('TC_04 Coupon flow validation', async ({ page }) => {
  const actor = new Actor('User', page);
  try {
    await actor.attemptsTo(new CouponAndPrevCouponVerification());
  } finally {
    await page.close();
  }
});

test('TC_05 Low to High Coupon swap validation', async ({ page }) => {
  const actor = new Actor('User', page);
  try {
    await actor.attemptsTo(new LowToHighCouponFlow());
  } finally {
    await page.close();
  }
});

test('TC_06 Coupon banner on other pages', async ({ page }) => {
  const actor = new Actor('User', page);
  try {
    await actor.attemptsTo(new CouponBannerOnOtherPages());
  } finally {
    await page.close();
  }
});

test('TC_07 License Plate search validation', async ({ page }) => {
  const actor = new Actor('User', page);
  try {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await actor.attemptsTo(new LPcases());
  } finally {
    await page.close();
    console.log('TC_07: page.close() executed.');
  }
});

test('TC_08 Revisit banner flow', async ({ page }) => {
  const actor = new Actor('User', page);
  try {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await actor.attemptsTo(new RevisitBannerFlow());
  } finally {
    await page.close();
    console.log('TC_08: page.close() executed.');
  }
});
