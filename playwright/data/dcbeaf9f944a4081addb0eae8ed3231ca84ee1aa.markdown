# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: streaming Task/global_streaming_specs.spec.js >> TC_31_Clarity_Three_Wrapper_Verification
- Location: streaming Task/global_streaming_specs.spec.js:602:1

# Error details

```
TimeoutError: page.waitForURL: Timeout 45000ms exceeded.
=========================== logs ===========================
waiting for navigation until "domcontentloaded"
  navigated to "https://vinnumber.ca/vin-check/preview?vin=1FMCU0F68LUB98826&type=vhr&wpPage=homepage"
============================================================
```

# Test source

```ts
  132 |         // Smart wait: Poll for script tag or window.clarity function
  133 |         await expect.poll(async () => {
  134 |           return await page.evaluate(() => {
  135 |             const hasScript = !!document.querySelector('script[src*="clarity.ms"]');
  136 |             const hasClarityFn = typeof (window as any).clarity === 'function';
  137 |             return hasScript || hasClarityFn;
  138 |           });
  139 |         }, {
  140 |           message: 'Microsoft Clarity script or window.clarity function was not initialized on Homepage within 30s',
  141 |           timeout: 30000,
  142 |           intervals: [500, 1000, 2000]
  143 |         }).toBe(true);
  144 | 
  145 |         console.log('✓ [Clarity Task] window.clarity function detected on Homepage');
  146 | 
  147 |         // Trigger gentle user micro-interaction to prompt Clarity session telemetry start
  148 |         await page.mouse.move(150, 150).catch(() => {});
  149 |         await page.mouse.wheel(0, 100).catch(() => {});
  150 | 
  151 |         // Smart wait: Poll for _clck cookie or session storage token
  152 |         let state: ClarityCookieState = { userId: null, rawClck: null, rawClsk: null, pageSequence: null, sessionToken: null };
  153 |         await expect.poll(async () => {
  154 |           const cookies = await context.cookies();
  155 |           const sessionToken = await page.evaluate(() => {
  156 |             try {
  157 |               return window.sessionStorage.getItem('_cltk');
  158 |             } catch {
  159 |               return null;
  160 |             }
  161 |           });
  162 |           state = this.parseClarityCookies(cookies, sessionToken);
  163 |           return !!state.userId || !!state.sessionToken;
  164 |         }, {
  165 |           message: 'Microsoft Clarity session cookie (_clck) or storage token (_cltk) was not set on Homepage within 20s',
  166 |           timeout: 20000,
  167 |           intervals: [500, 1000]
  168 |         }).toBe(true);
  169 | 
  170 |         // Verify that tag script was requested
  171 |         const tagBeacon = this.capturedBeacons.find(b => b.url.includes('/tag/') || b.url.includes('clarity.js'));
  172 |         console.log(`✓ [Clarity Task] Telemetry beacon detected: ${tagBeacon ? tagBeacon.url.substring(0, 80) : 'Active'}`);
  173 |         console.log(`✓ [Clarity Task] Homepage Clarity User ID: ${state.userId || 'Session token: ' + state.sessionToken}`);
  174 |         console.log(`✓ [Clarity Task] Homepage Raw _clck: ${state.rawClck || 'Pending flush'}`);
  175 |         console.log(`✓ [Clarity Task] Homepage Session Token: ${state.sessionToken || 'None'}`);
  176 | 
  177 |         await testInfo.attach('wrapper1-homepage-clarity.json', {
  178 |           body: JSON.stringify({
  179 |             url: page.url(),
  180 |             cookieState: state,
  181 |             beaconsCount: this.capturedBeacons.length,
  182 |             recentBeacons: this.capturedBeacons.slice(-5)
  183 |           }, null, 2),
  184 |           contentType: 'application/json'
  185 |         });
  186 | 
  187 |         return state;
  188 |       } catch (err: any) {
  189 |         console.error('\n❌ [Clarity Task FAILURE] Wrapper 1 (Homepage) Verification Failed!');
  190 |         console.error(`Page URL: ${page.url()}`);
  191 |         console.error(`Error: ${err.message}`);
  192 |         console.error(`Total Beacons: ${this.capturedBeacons.length}`);
  193 |         await testInfo.attach('wrapper1-failure-diagnostic.txt', {
  194 |           body: `Step: Wrapper 1 Homepage\nURL: ${page.url()}\nError: ${err.stack || err.message}\nBeacons: ${JSON.stringify(this.capturedBeacons, null, 2)}`,
  195 |           contentType: 'text/plain'
  196 |         });
  197 |         throw err;
  198 |       }
  199 |     });
  200 |   }
  201 | 
  202 |   /**
  203 |    * Wrapper 2: Verify Preview Page Microsoft Clarity script and session continuity
  204 |    */
  205 |   async verifyPreviewWrapper(
  206 |     page: Page,
  207 |     context: BrowserContext,
  208 |     testInfo: TestInfo,
  209 |     expectedUserId: string | null,
  210 |     vin: string
  211 |   ): Promise<ClarityCookieState> {
  212 |     return await test.step('Wrapper 2: Verify Microsoft Clarity on Preview Page (Session Continuity)', async () => {
  213 |       console.log('\n===============================================================');
  214 |       console.log('  [Clarity Verification] WRAPPER 2: PREVIEW PAGE VERIFICATION');
  215 |       console.log('===============================================================');
  216 | 
  217 |       try {
  218 |         console.log(`[Clarity Task] Submitting VIN to transition to Preview: ${vin}`);
  219 |         const vinInput = page.locator('input[name="vin"], input[name="vin_number"], input[placeholder*="VIN" i], input[type="text"]').first();
  220 |         await vinInput.waitFor({ state: 'visible', timeout: 20000 });
  221 |         await vinInput.fill(vin);
  222 | 
  223 |         const searchBtn = page.getByRole('button', { name: /search vin|get window sticker|search window sticker|search/i })
  224 |           .or(page.locator('button[type="submit"]'))
  225 |           .or(page.locator('button:has-text("Search VIN")'))
  226 |           .first();
  227 | 
  228 |         await searchBtn.click();
  229 | 
  230 |         // Smart wait: URL transition to Preview page
  231 |         console.log('[Clarity Task] Waiting for Preview page URL transition...');
> 232 |         await page.waitForURL(/.*(\/preview|\/vin-check|\/report|\/ws-preview).*/, {
      |                    ^ TimeoutError: page.waitForURL: Timeout 45000ms exceeded.
  233 |           timeout: 45000,
  234 |           waitUntil: 'domcontentloaded'
  235 |         });
  236 | 
  237 |         console.log(`✓ [Clarity Task] Landed on Preview Page: ${page.url()}`);
  238 | 
  239 |         // Smart wait: Clarity function active on Preview
  240 |         await expect.poll(async () => {
  241 |           return await page.evaluate(() => typeof (window as any).clarity === 'function');
  242 |         }, {
  243 |           message: 'window.clarity function was not available on Preview page within 20s',
  244 |           timeout: 20000,
  245 |           intervals: [500, 1000]
  246 |         }).toBe(true);
  247 | 
  248 |         console.log('✓ [Clarity Task] window.clarity active on Preview Page');
  249 | 
  250 |         // Micro-interaction
  251 |         await page.mouse.move(200, 200).catch(() => {});
  252 |         await page.mouse.wheel(0, 80).catch(() => {});
  253 | 
  254 |         // Smart wait: Verify session stitching via _clck cookie continuity
  255 |         let previewState: ClarityCookieState = { userId: null, rawClck: null, rawClsk: null, pageSequence: null, sessionToken: null };
  256 |         await expect.poll(async () => {
  257 |           const cookies = await context.cookies();
  258 |           const sessionToken = await page.evaluate(() => {
  259 |             try {
  260 |               return window.sessionStorage.getItem('_cltk');
  261 |             } catch {
  262 |               return null;
  263 |             }
  264 |           });
  265 |           previewState = this.parseClarityCookies(cookies, sessionToken);
  266 | 
  267 |           if (expectedUserId && previewState.userId) {
  268 |             return previewState.userId === expectedUserId;
  269 |           }
  270 |           return !!previewState.userId || !!previewState.sessionToken;
  271 |         }, {
  272 |           message: `Clarity session continuity verification failed on Preview page (expected: ${expectedUserId}, got: ${previewState.userId})`,
  273 |           timeout: 20000,
  274 |           intervals: [500, 1000]
  275 |         }).toBe(true);
  276 | 
  277 |         console.log(`✓ [Clarity Task] Preview Clarity User ID: ${previewState.userId}`);
  278 |         console.log(`✓ [Clarity Task] Session continuity maintained from Homepage (Matched: ${previewState.userId === expectedUserId})`);
  279 |         if (previewState.rawClsk) {
  280 |           console.log(`✓ [Clarity Task] Preview Page Sequence / _clsk: ${previewState.rawClsk}`);
  281 |         }
  282 | 
  283 |         await testInfo.attach('wrapper2-preview-clarity.json', {
  284 |           body: JSON.stringify({
  285 |             url: page.url(),
  286 |             cookieState: previewState,
  287 |             matchedInitialUserId: previewState.userId === expectedUserId,
  288 |             beaconsCount: this.capturedBeacons.length
  289 |           }, null, 2),
  290 |           contentType: 'application/json'
  291 |         });
  292 | 
  293 |         return previewState;
  294 |       } catch (err: any) {
  295 |         console.error('\n❌ [Clarity Task FAILURE] Wrapper 2 (Preview Page) Verification Failed!');
  296 |         console.error(`Page URL: ${page.url()}`);
  297 |         console.error(`Error: ${err.message}`);
  298 |         await testInfo.attach('wrapper2-failure-diagnostic.txt', {
  299 |           body: `Step: Wrapper 2 Preview\nURL: ${page.url()}\nError: ${err.stack || err.message}\nBeacons: ${JSON.stringify(this.capturedBeacons, null, 2)}`,
  300 |           contentType: 'text/plain'
  301 |         });
  302 |         throw err;
  303 |       }
  304 |     });
  305 |   }
  306 | 
  307 |   /**
  308 |    * Wrapper 3: Verify Checkout Page Microsoft Clarity script and end-to-end session stitching
  309 |    */
  310 |   async verifyCheckoutWrapper(
  311 |     page: Page,
  312 |     context: BrowserContext,
  313 |     testInfo: TestInfo,
  314 |     expectedUserId: string | null
  315 |   ): Promise<ClarityCookieState> {
  316 |     return await test.step('Wrapper 3: Verify Microsoft Clarity on Checkout Page (E2E Session Stitching)', async () => {
  317 |       console.log('\n===============================================================');
  318 |       console.log('  [Clarity Verification] WRAPPER 3: CHECKOUT PAGE VERIFICATION');
  319 |       console.log('===============================================================');
  320 | 
  321 |       try {
  322 |         console.log('[Clarity Task] Initiating Checkout navigation from Preview...');
  323 | 
  324 |         // 1. Click Access Records CTA button
  325 |         const accessBtn = page.getByRole('button', { name: /access records|get window sticker|view full report|reveal records|get records|instant access/i })
  326 |           .or(page.locator('button:has-text("Access Records"), button:has-text("Get Window Sticker")'))
  327 |           .first();
  328 | 
  329 |         await accessBtn.waitFor({ state: 'visible', timeout: 15000 });
  330 |         console.log('[Clarity Task] Clicking Access Records CTA button...');
  331 |         await accessBtn.click();
  332 | 
```