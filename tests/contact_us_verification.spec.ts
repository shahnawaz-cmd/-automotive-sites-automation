// tests/contact_us_verification.spec.ts
import { test, expect } from '@playwright/test';
import { ContactUsTask } from '../tasks/contact_us/ContactUsTask';

test.describe('Contact Us Verification Suite', () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test.describe.configure({ timeout: process.env.CI ? 60000 : 45000 });

  test.beforeEach(async ({ page }) => {
    await ContactUsTask.navigateToContact(page);
  });

  test('TC_CONTACT_01 — Verify brand support channels and contact navigation',
    { tag: ['@contact', '@desktop'] },
    async ({ page }, testInfo) => {
      await ContactUsTask.verifyBrandSupportChannel(page, testInfo);
    }
  );

  test('TC_CONTACT_02 — Verify Google reCAPTCHA readiness or stealth status',
    { tag: ['@contact', '@captcha', '@P0'] },
    async ({ page }, testInfo) => {
      await ContactUsTask.auditRecaptchaHealth(page, testInfo);
    }
  );

  test('TC_CONTACT_03 — Verify empty form submission triggers self-healing inline validation errors',
    { tag: ['@contact', '@validation'] },
    async ({ page }) => {
      await ContactUsTask.verifyEmptySubmissionErrors(page);
    }
  );

  test('TC_CONTACT_04 — Verify Concern dropdown option parity and selectable states',
    { tag: ['@contact', '@dropdown'] },
    async ({ page }) => {
      await ContactUsTask.verifyConcernOptions(page);
    }
  );

  test('TC_CONTACT_05 — Verify self-healing form input typing and value retention',
    { tag: ['@contact', '@form-fill'] },
    async ({ page }) => {
      await ContactUsTask.fillForm(page, {
        name: 'QA Automation Engineer',
        email: 'qa.automation@empirepixel.com',
        concern: 'Support',
        message: 'Automated test verification of contact form input responsiveness.'
      });

      // Verify fields retain entered values
      await expect(ContactUsTask.getFullNameInput(page)).toHaveValue('QA Automation Engineer');
      await expect(ContactUsTask.getEmailInput(page)).toHaveValue('qa.automation@empirepixel.com');
      await expect(ContactUsTask.getMessageTextarea(page)).toHaveValue('Automated test verification of contact form input responsiveness.');
    }
  );

  test('TC_CONTACT_06 — Verify form submission and backend payload dispatch',
    { tag: ['@contact', '@backend-payload', '@submission'] },
    async ({ page }) => {
      await ContactUsTask.verifySubmissionAndBackendPayload(page, {
        name: 'QA Automation Engineer',
        email: 'qa.automation@empirepixel.com',
        concern: 'Support',
        message: 'Verifying backend server action receives complete form submission payload.'
      });
    }
  );
});
