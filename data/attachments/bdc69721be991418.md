# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/ui_ux_verification.spec.ts >> UI/UX & Responsiveness Quality Audit >> TC_UI_UX_01 — UI/UX and Responsiveness Audit on Main Page
- Location: tests/ui_ux_verification.spec.ts:23:7

# Error details

```
Error: Sticky header (bottom: 65px) is obscuring page title (top: -5px)

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

# Test source

```ts
  1  | // tasks/ui_ux/HeaderOverlapTask.ts
  2  | import { Page, expect, test } from '@playwright/test';
  3  | import { Actor } from '../../actors/Actor';
  4  | 
  5  | export class HeaderOverlapTask {
  6  |   async performAs(target: Actor | Page) {
  7  |     const page = target instanceof Actor ? target.getPage() : target;
  8  | 
  9  |     await test.step('UI/UX: Verify Header Does Not Cover Page Title', async () => {
  10 |       console.log('🔍 [HeaderOverlapTask] Measuring clearance between header and main page heading...');
  11 | 
  12 |       const measurements = await page.evaluate(() => {
  13 |         const header = document.querySelector('header, nav, [role="banner"]');
  14 |         const h1 = document.querySelector('h1, main h2, [role="heading"]');
  15 | 
  16 |         if (header && h1) {
  17 |           const hRect = header.getBoundingClientRect();
  18 |           const tRect = h1.getBoundingClientRect();
  19 |           const gap = Math.round(tRect.top - hRect.bottom);
  20 | 
  21 |           return {
  22 |             hasHeader: true,
  23 |             hBottom: Math.round(hRect.bottom),
  24 |             tTop: Math.round(tRect.top),
  25 |             gap,
  26 |             isCovering: hRect.bottom > tRect.top && tRect.bottom > hRect.top && hRect.height > 0
  27 |           };
  28 |         }
  29 |         return { hasHeader: false, isCovering: false, gap: 0 };
  30 |       });
  31 | 
  32 |       if (!measurements.hasHeader) {
  33 |         console.log('ℹ️ [HeaderOverlapTask] No header or main heading detected on this route. Skipping overlap assertion.');
  34 |         return;
  35 |       }
  36 | 
  37 |       console.log(`📊 [HeaderOverlapTask] Header bottom: ${measurements.hBottom}px | Heading top: ${measurements.tTop}px | Clearance: ${measurements.gap}px`);
  38 | 
  39 |       expect.soft(
  40 |         measurements.isCovering,
  41 |         `Sticky header (bottom: ${measurements.hBottom}px) is obscuring page title (top: ${measurements.tTop}px)`
> 42 |       ).toBe(false);
     |         ^ Error: Sticky header (bottom: 65px) is obscuring page title (top: -5px)
  43 | 
  44 |       console.log('✅ [HeaderOverlapTask] Header has clear separation from page heading.');
  45 |     });
  46 |   }
  47 | }
  48 | 
  49 | export default HeaderOverlapTask;
  50 | 
```