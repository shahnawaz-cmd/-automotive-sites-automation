// tasks/ui_ux/MobileKeyboardTask.ts
import { Page, expect, test } from '@playwright/test';
import { Actor } from '../../actors/Actor';

/**
 * Mobile Soft-Keyboard UX Audit:
 * Simulates soft keyboard opening (reduced viewport height) and verifies focused inputs remain visible.
 */
export class MobileKeyboardTask {
  async performAs(target: Actor | Page) {
    const page = target instanceof Actor ? target.getPage() : target;

    await test.step('UI/UX: Verify Mobile Soft-Keyboard Input Visibility', async () => {
      const viewport = page.viewportSize() || { width: 1280, height: 720 };
      const isMobile = viewport.width < 768;

      if (!isMobile) {
        console.log('ℹ️ [MobileKeyboardTask] Skipping soft-keyboard simulation on desktop viewport.');
        return;
      }

      const inputs = page.locator('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), textarea');
      const inputCount = await inputs.count();

      if (inputCount === 0) {
        console.log('ℹ️ [MobileKeyboardTask] No interactive form inputs found on this page.');
        return;
      }

      const firstInput = inputs.first();
      if (await firstInput.isVisible().catch(() => false)) {
        const originalHeight = viewport.height;
        const keyboardHeight = Math.floor(originalHeight * 0.6); // 40% height reduction

        console.log(`📱 [MobileKeyboardTask] Simulating mobile keyboard pop-up (height ${originalHeight}px -> ${keyboardHeight}px)...`);
        await page.setViewportSize({ width: viewport.width, height: keyboardHeight });
        await firstInput.focus();

        await firstInput.evaluate(async (el) => {
          el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' });
          await new Promise(resolve => requestAnimationFrame(resolve));
        });

        const checkResult = await firstInput.evaluate((el) => {
          const rect = el.getBoundingClientRect();
          const header = document.querySelector('header, nav, [role="banner"]');
          const headerBottom = header ? header.getBoundingClientRect().bottom : 0;

          const isAboveHeader = rect.top < headerBottom;
          const isBelowScreen = rect.bottom > window.innerHeight;

          return {
            isVisible: !isAboveHeader && !isBelowScreen,
            top: Math.round(rect.top),
            bottom: Math.round(rect.bottom),
            headerBottom: Math.round(headerBottom),
            isAboveHeader,
            isBelowScreen
          };
        });

        // Restore viewport
        await page.setViewportSize({ width: viewport.width, height: originalHeight });
        await page.evaluate(() => window.scrollTo(0, 0));

        expect.soft(
          checkResult.isVisible,
          `Form input is obscured by sticky header or pushed below screen when mobile keyboard opens`
        ).toBe(true);

        console.log('✅ [MobileKeyboardTask] Input field remains visible with simulated soft-keyboard open.');
      }
    });
  }
}

export default MobileKeyboardTask;
