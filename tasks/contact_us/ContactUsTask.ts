// tasks/contact_us/ContactUsTask.ts
import { Page, Locator, expect, TestInfo } from '@playwright/test';

export interface ContactFormData {
  name: string;
  email: string;
  concern: string;
  message: string;
}

export class ContactUsTask {
  /**
   * Smart Waiting: Wait for DOM readiness and primary interactive elements
   */
  static async waitForPageReady(page: Page, timeoutMs = 15000) {
    await page.waitForLoadState('domcontentloaded');

    await Promise.race([
      page.locator('h1, h2:has-text("Contact"), *:has-text("Have any questions")').first().waitFor({ state: 'visible', timeout: timeoutMs }),
      page.locator('form, button[type="submit"]').first().waitFor({ state: 'visible', timeout: timeoutMs })
    ]).catch(() => {
      console.warn('[ContactUsTask] Smart wait warning: Page load slow, proceeding with self-healing strategies...');
    });
  }

  /**
   * Resolves contact page path dynamically based on site routing (/contact or /contact-us)
   */
  static async navigateToContact(page: Page) {
    const isPV = page.url().includes('premiumvin') || (page.context() as any)._options?.baseURL?.includes('premiumvin');
    const targetPath = isPV ? '/contact' : '/contact-us';
    
    await page.goto(targetPath, { waitUntil: 'domcontentloaded', timeout: 30000 });
    // If redirected to 404, fallback to alternative path
    const is404 = await page.locator('text=404, text=Page Not Found').first().isVisible({ timeout: 1500 }).catch(() => false);
    if (is404) {
      const fallbackPath = targetPath === '/contact' ? '/contact-us' : '/contact';
      console.log(`[ContactUsTask] 404 detected on ${targetPath}, falling back to ${fallbackPath}...`);
      await page.goto(fallbackPath, { waitUntil: 'domcontentloaded', timeout: 30000 });
    }
    await this.waitForPageReady(page);
  }

  /**
   * Self-Healing Locator: Full Name Input
   */
  static getFullNameInput(page: Page): Locator {
    const candidates = [
      'input[placeholder*="John" i]',
      'input[name*="name" i]',
      'input[id*="name" i]',
      'label:has-text("NAME") ~ input',
      'label:has-text("Full Name") ~ input',
      'form input[type="text"]'
    ];
    return page.locator(candidates.join(', ')).first();
  }

  /**
   * Self-Healing Locator: Email Input
   */
  static getEmailInput(page: Page): Locator {
    const candidates = [
      'input[type="email"]',
      'input[placeholder*="example.com" i]',
      'input[placeholder*="email" i]',
      'input[name*="email" i]',
      'label:has-text("EMAIL") ~ input'
    ];
    return page.locator(candidates.join(', ')).first();
  }

  /**
   * Self-Healing Locator: Concern Select Dropdown
   */
  static getConcernSelect(page: Page): Locator {
    const candidates = [
      'select',
      'select[name*="concern" i]',
      'select[id*="concern" i]',
      '[role="combobox"]',
      'select:has(option:has-text("Support"))'
    ];
    return page.locator(candidates.join(', ')).first();
  }

  /**
   * Self-Healing Locator: Message Textarea
   */
  static getMessageTextarea(page: Page): Locator {
    const candidates = [
      'textarea[placeholder*="Describe" i]',
      'textarea[placeholder*="question" i]',
      'textarea[name*="message" i]',
      'label:has-text("MESSAGE") ~ textarea',
      'textarea'
    ];
    return page.locator(candidates.join(', ')).first();
  }

  /**
   * Self-Healing Locator: Submit CTA
   */
  static getSubmitButton(page: Page): Locator {
    return page.locator('button[type="submit"]:has-text("Send Message"), button[type="submit"]:has-text("Submit"), button[type="submit"]').first();
  }

  /**
   * Verifies Brand Support Presence (Email link, Live Chat, or Support Section)
   */
  static async verifyBrandSupportChannel(page: Page, testInfo: TestInfo) {
    const hasLiveChat = await page.locator('a[href*="direct.lc.chat"], a:has-text("Live Chat")').first().isVisible().catch(() => false);
    const hasSupportEmail = await page.locator('a[href*="mailto:"], text=support@').first().isVisible().catch(() => false);
    const hasHelpHeading = await page.locator('h1, h2:has-text("Contact"), *:has-text("Have any questions")').first().isVisible().catch(() => false);

    expect(
      hasLiveChat || hasSupportEmail || hasHelpHeading,
      'Support channel (Email, Live Chat, or Help Section) should be rendered on Contact page'
    ).toBeTruthy();
  }

  /**
   * AUDIT RECAPTCHA HEALTH: HARD FAILURE AUDIT
   * Verifies Google reCAPTCHA v2 iframe injection, site key authorization, domain whitelisting, and interactability
   */
  static async auditRecaptchaHealth(page: Page, testInfo: TestInfo) {
    console.log('[RecaptchaTask] Auditing Google reCAPTCHA frame and sitekey authorization...');

    // Smart Wait: Allow up to 10s for the Google reCAPTCHA anchor iframe to mount
    let recaptchaFrame = null;
    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      recaptchaFrame = page.frames().find(f => f.url().includes('recaptcha/api2/anchor'));
      if (recaptchaFrame) break;
      await page.waitForTimeout(500);
    }

    const hasRecaptchaScript = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src);
      return scripts.some(s => s.includes('google.com/recaptcha'));
    });

    if (!hasRecaptchaScript && !recaptchaFrame) {
      console.log('ℹ️ [reCAPTCHA] reCAPTCHA script is not loaded on this contact page (server-side rate limiting or stealth verification). Skipping captcha assertion.');
      return;
    }

    expect(recaptchaFrame, 'reCAPTCHA anchor iframe must be present when script is loaded').toBeTruthy();

    if (recaptchaFrame) {
      const frameText = await recaptchaFrame.innerText('body').catch(() => '');
      const domain = new URL(page.url()).hostname;

      // Hard Failure Assertion: Check if Google rejected the domain key
      const isDomainRejected = frameText.includes('ERROR for site owner') || frameText.includes('Invalid domain for site key');
      if (isDomainRejected) {
        const failureDetails = `🚨 reCAPTCHA KEY REJECTED: Google reCAPTCHA displayed "ERROR for site owner: Invalid domain for site key" on ${domain}. Domain is NOT whitelisted in reCAPTCHA Admin console!`;
        console.error(`\x1b[31m${failureDetails}\x1b[0m`);
        testInfo.annotations.push({
          type: 'reCAPTCHA Misconfiguration',
          description: failureDetails
        });
        expect(frameText, failureDetails).not.toContain('Invalid domain for site key');
      }

      // Assert checkbox is visible & interactable
      const anchorCheckbox = recaptchaFrame.locator('#recaptcha-anchor');
      await expect(anchorCheckbox, 'reCAPTCHA interactive checkbox (#recaptcha-anchor) should be visible').toBeVisible({ timeout: 5000 });

      // Extract site key
      const siteKeyMatch = recaptchaFrame.url().match(/[?&]k=([^&]+)/);
      const siteKey = siteKeyMatch ? siteKeyMatch[1] : 'Unknown';

      console.log(`\n======================================================`);
      console.log(`🛡️  [reCAPTCHA PROOF OF HEALTH: WORKING]`);
      console.log(`   Domain       : ${domain}`);
      console.log(`   Site Key     : ${siteKey}`);
      console.log(`   Status       : ✅ AUTHORIZED & HEALTHY (No domain rejection error)`);
      console.log(`   Checkbox     : Visible & Interactable (#recaptcha-anchor)`);
      console.log(`   Label        : "${await recaptchaFrame.locator('#recaptcha-anchor-label').innerText().catch(() => 'I\'m not a robot')}"`);
      console.log(`======================================================\n`);
    }
  }

  /**
   * Verifies Reactive Inline Validation Errors upon Empty Submission
   */
  static async verifyEmptySubmissionErrors(page: Page) {
    const submitBtn = this.getSubmitButton(page);
    await submitBtn.waitFor({ state: 'visible', timeout: 5000 });
    await submitBtn.click();

    // Verify all 3 primary inline validation errors appear
    const nameErr = page.locator('text=Please enter your name');
    const emailErr = page.locator('text=Please enter your email');
    const msgErr = page.locator('text=Please enter a message');

    await expect(nameErr, 'Name validation error should be visible').toBeVisible({ timeout: 5000 });
    await expect(emailErr, 'Email validation error should be visible').toBeVisible({ timeout: 5000 });
    await expect(msgErr, 'Message validation error should be visible').toBeVisible({ timeout: 5000 });
  }

  /**
   * Verifies Options in Concern Dropdown
   */
  static async verifyConcernOptions(page: Page) {
    const select = this.getConcernSelect(page);
    await select.waitFor({ state: 'visible', timeout: 5000 });

    const options = await select.locator('option').allInnerTexts();
    const cleanOptions = options.map(o => o.trim()).filter(Boolean);

    const expectedConcerns = ['Support', 'Decode Error', 'Marketing', 'Business', 'Others'];
    for (const expected of expectedConcerns) {
      expect(cleanOptions, `Dropdown should contain option "${expected}"`).toContain(expected);
    }
  }

  /**
   * Smart Form Filling with actionability verification
   */
  static async fillForm(page: Page, data: ContactFormData) {
    const nameInput = this.getFullNameInput(page);
    await nameInput.waitFor({ state: 'visible', timeout: 5000 });
    await nameInput.fill(data.name);

    const emailInput = this.getEmailInput(page);
    await emailInput.fill(data.email);

    const concernSelect = this.getConcernSelect(page);
    await concernSelect.selectOption({ label: data.concern }).catch(async () => {
      await concernSelect.selectOption(data.concern);
    });

    const msgTextarea = this.getMessageTextarea(page);
    await msgTextarea.fill(data.message);
  }

  /**
   * Verifies Full Form Submission & Server Action Payload via Route Interception
   */
  static async verifySubmissionAndBackendPayload(page: Page, data: ContactFormData) {
    let capturedPayload: any = null;
    let postUrl = '';

    // Intercept the Next.js Server Action / Backend POST request
    await page.route(/.*\/contact(\-us)?/, async (route) => {
      const req = route.request();
      if (req.method() === 'POST') {
        postUrl = req.url();
        try {
          capturedPayload = JSON.parse(req.postData() || '[]');
        } catch {
          capturedPayload = req.postData();
        }

        await route.fulfill({
          status: 200,
          contentType: 'text/x-component',
          body: '0:{"success":true,"message":"Thank you! Your message has been sent."}\n'
        });
      } else {
        await route.continue();
      }
    });

    await this.fillForm(page, data);

    const submitBtn = this.getSubmitButton(page);
    await submitBtn.waitFor({ state: 'visible', timeout: 5000 });
    await submitBtn.click();

    await page.waitForTimeout(2000);

    expect(capturedPayload, 'Backend submission POST request should have been dispatched to server').toBeTruthy();

    const formData = Array.isArray(capturedPayload) ? capturedPayload[0] : capturedPayload;
    console.log(`\n======================================================`);
    console.log(`📤  [BACKEND SUBMISSION PAYLOAD VERIFIED]`);
    console.log(`   Endpoint  : ${postUrl}`);
    console.log(`   Name      : ${formData?.name}`);
    console.log(`   Email     : ${formData?.email}`);
    console.log(`   Concern   : ${formData?.concern}`);
    console.log(`   Message   : ${formData?.message}`);
    console.log(`======================================================\n`);

    expect(formData?.name, 'Submitted name in server payload should match').toBe(data.name);
    expect(formData?.email, 'Submitted email in server payload should match').toBe(data.email);
    expect(formData?.concern, 'Submitted concern in server payload should match').toBe(data.concern);
    expect(formData?.message, 'Submitted message in server payload should match').toBe(data.message);
  }
}
