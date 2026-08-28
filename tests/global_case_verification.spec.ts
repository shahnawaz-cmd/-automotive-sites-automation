import { test } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { DecodeVinTask } from '../tasks/DecodeVinTask';
import { SearchAndVerifyErrorTask } from '../tasks/form_error_messages';
import { FieldValidation } from '../tasks/vin_field_validation';
import { CouponAndPrevCouponVerification, LowToHighCouponFlow, CouponBannerOnOtherPages } from '../tasks/coupon_flow_validation';
import { LPcases } from '../tasks/LPdecode';
import { RevisitBannerFlow } from '../tasks/revisit_banner_flow';
import { RevisitStickerBannerFlow } from '../tasks/revisit_sticker_banner_flow';
import { ExitIntentHelper } from '../tasks/exit_intent_banner';
import { PreviewToCheckoutRedirection } from '../tasks/preview_to_checkout_redirection';
import { ClassicEditableSpecs } from '../tasks/classic_editable_specs';
import { StreamingExitIntentPopup } from '../tasks/exit_intent_popup_preview';
import { GlobalExitIntentPopup } from '../tasks/global_exit_intent_popup';
import { EuVinConfirmationTask } from '../tasks/eu_vin_confirmation';
import { ClassicEditableSpecsManual } from '../tasks/classic_editable_specs_manual';
import { DefaultPlanPriceCheckTask } from '../tasks/default_plan_price_check';

test('TC_01 VIN decode verify', async ({ page }) => {
  const actor = new Actor('User', page);
  try {
    await page.goto('/');
    await page.waitForTimeout(1000); // 1 second delay
    
    // Perform the decoding task
    await actor.attemptsTo(new DecodeVinTask(), true);
  } finally {
    await page.close();
  }
});

test('TC_02 Verify error message on invalid search', async ({ page }) => {
  const actor = new Actor('User', page);
  try {
    // Navigate to the base URL
    await page.goto('/');
    await page.waitForTimeout(1000); // 1 second delay

    const isInfiniti = page.url().includes('infinitiwindowsticker.com');
    const selectors = {
      searchButtonName: isInfiniti ? 'Get Window Sticker' : 'Search VIN',
      errorSelector: isInfiniti ? "text=VIN must be 5-17 characters" : "text=Please enter a VIN number",
      expectedMessage: isInfiniti ? "VIN must be 5-17 characters" : "Please enter a VIN number",
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
    await page.waitForTimeout(1000); // 1 second delay
    
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
    await page.waitForTimeout(1000); // 1 second delay
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
    await page.waitForTimeout(1000); // 1 second delay
    await actor.attemptsTo(new RevisitBannerFlow());
  } finally {
    await page.close();
    console.log('TC_08: page.close() executed.');
  }
});

test('TC_09 Revisit sticker banner flow', async ({ page }) => {
  const actor = new Actor('User', page);
  try {
    await actor.attemptsTo(new RevisitStickerBannerFlow());
  } finally {
    await page.close();
    console.log('TC_09: page.close() executed.');
  }
});

test('TC_10 Exit intent banner verification', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes('_MobileChrome') || testInfo.project.name.includes('_MobileEdge') || testInfo.project.name.includes('_MobileSafari'), 'Skipping exit intent on mobile');
  const timeout = process.env.CI ? 60000 : 30000;
  testInfo.setTimeout(timeout);

  try {
    await page.goto('/');
    await page.waitForTimeout(1000); // 1 second delay
    
    // Trigger the exit intent pop-up logic
    await ExitIntentHelper.triggerExitIntent(page);
  } finally {
    await page.close();
    console.log('TC_10: page.close() executed.');
  }
});

test('TC_11 Preview to checkout redirection', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes('_MobileChrome') || testInfo.project.name.includes('_MobileEdge') || testInfo.project.name.includes('_MobileSafari'), 'Skipping preview checkout on mobile');
  const actor = new Actor('User', page);
  try {
    await page.goto('/');
    await page.waitForTimeout(1000);
    await actor.attemptsTo(new PreviewToCheckoutRedirection());
  } finally {
    await page.close();
    console.log('TC_11: page.close() executed.');
  }
});


test('TC_12 Classic editable specs feature validation', async ({ page }, testInfo) => {
  const baseURL = testInfo.project.use.baseURL || '';
  test.skip(baseURL.includes('vehiclehistory.eu'), 'Skipping classic editable specs validation for vehiclehistory.eu');

  // Set timeout to 120s (local) / 150s (CI) to accommodate classic cascading API calls
  testInfo.setTimeout(process.env.CI ? 150000 : 120000);

  const actor = new Actor('User', page);
  try {
    await page.goto('/');
    await page.waitForTimeout(1000); // 1 second delay
    await actor.attemptsTo(new ClassicEditableSpecs());
  } finally {
    await page.close();
    console.log('TC_12: page.close() executed.');
  }
});

test('TC_13 Global Exit Intent Preview Verification', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes('_MobileChrome') || testInfo.project.name.includes('_MobileEdge') || testInfo.project.name.includes('_MobileSafari'), 'Skipping exit intent preview on mobile');
  
  const actor = new Actor('User', page);
  try {
    // Add webdriver spoofing before navigation starts
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    await page.goto('/');
    await page.waitForTimeout(1000); // 1 second delay
    
    // 1. Decode VIN to land on Preview page (with shouldClose set to false)
    await actor.attemptsTo(new DecodeVinTask(), false);
    
    // 2. Try Global Exit Intent Popup first, fallback to StreamingExitIntentPopup if not matched
    try {
      console.log('[TC_13] Running Global Exit Intent Flow...');
      await actor.attemptsTo(new GlobalExitIntentPopup());
      console.log('[TC_13] Global Exit Intent Flow Succeeded.');
    } catch (e) {
      console.log(`[TC_13] Global Exit Intent Flow skipped/failed (${e.message}). Falling back to Streaming Exit Intent Flow...`);
      await actor.attemptsTo(new StreamingExitIntentPopup());
      console.log('[TC_13] Streaming Exit Intent Flow Succeeded.');
    }
  } finally {
    await page.close();
    console.log('TC_13: page.close() executed.');
  }
});

test('TC_14 EU VIN confirmation flow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('VSR'), 'Skipping EU VIN confirmation flow on VSR');

  const actor = new Actor('User', page);
  try {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // 1. Decode VIN to land on Preview page (shouldClose = false, skipSuccessClick = true)
    await actor.attemptsTo(new DecodeVinTask(false, true));

    // 2. Perform EU VIN specification selection on preview page
    await actor.attemptsTo(new EuVinConfirmationTask());
  } finally {
    await page.close();
    console.log('TC_14: page.close() executed.');
  }
});

test('TC_15 Classic editable specs manual update feature validation', async ({ page }, testInfo) => {
  const baseURL = testInfo.project.use.baseURL || '';
  const isMobile = testInfo.project.name.includes('_MobileChrome') || testInfo.project.name.includes('_MobileEdge') || testInfo.project.name.includes('_MobileSafari');
  
  test.skip(!isMobile, 'Skipping classic editable specs manual validation on desktop; runs only on mobile browsers');
  test.skip(testInfo.project.name.startsWith('VSR'), 'Skipping classic editable specs manual validation on VSR');
  test.skip(baseURL.includes('vehiclehistory.eu'), 'Skipping classic editable specs manual validation for vehiclehistory.eu');

  const actor = new Actor('User', page);
  try {
    await actor.attemptsTo(new ClassicEditableSpecsManual());
  } finally {
    await page.close();
    console.log('TC_15: page.close() executed.');
  }
});

test('TC_16 Default plan price check verification', async ({ page }, testInfo) => {
  const isMobile = testInfo.project.name.includes('_MobileChrome') || testInfo.project.name.includes('_MobileEdge') || testInfo.project.name.includes('_MobileSafari');
  test.skip(!isMobile, 'Skipping default plan price check verification on desktop; runs only on mobile devices');

  const actor = new Actor('User', page);
  try {
    await page.goto('/');
    await page.waitForTimeout(1000);
    await actor.attemptsTo(new DefaultPlanPriceCheckTask());
  } finally {
    await page.close();
    console.log('TC_16: page.close() executed.');
  }
});
