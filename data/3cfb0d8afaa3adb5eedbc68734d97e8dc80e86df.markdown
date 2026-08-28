# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: global_case_verification.spec.ts >> TC_16 Default plan price check verification
- Location: tests/global_case_verification.spec.ts:259:5

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: page.evaluate: Target page, context or browser has been closed
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]: Search any VIN Number by looking up a VIN Check
  - generic [ref=e3]:
    - region "Notifications (F8)":
      - list
    - region "Notifications Alt+T"
    - generic [ref=e6]:
      - generic [ref=e8]:
        - generic [ref=e9]:
          - img "Alfa Romeo" [ref=e10]
          - generic [ref=e11]:
            - paragraph [ref=e12]: Alfa Romeo Giulietta II
            - paragraph [ref=e13]: "VIN: SHHEU88701U002013"
        - generic [ref=e14]:
          - generic [ref=e15]: Is this your vehicle?
          - generic [ref=e16]:
            - button "Yes" [ref=e17]
            - button "No" [ref=e18]
      - generic [ref=e19]:
        - generic [ref=e20]:
          - heading "We found historical records for the VIN# SHHEU88701U002013" [level=4] [ref=e21]
          - generic [ref=e22]:
            - generic [ref=e27]:
              - heading "Alfa Romeo Giulietta II" [level=2] [ref=e29]
              - generic [ref=e30]:
                - generic [ref=e31]:
                  - generic [ref=e32]: Trim
                  - generic [ref=e33]: 1.4 GLP Turbo 120HP Distinctive
                - generic [ref=e34]:
                  - generic [ref=e35]: Engine Type
                  - generic [ref=e36]: Inline 4
                - generic [ref=e37]:
                  - generic [ref=e38]: Engine Size
                  - generic [ref=e39]: 1.368 l
                - generic [ref=e40]:
                  - generic [ref=e41]: Transmission
                  - generic [ref=e42]: Manual
                - generic [ref=e43]:
                  - generic [ref=e44]: Drive Type
                  - generic [ref=e45]: FWD
                - generic [ref=e46]:
                  - generic [ref=e47]: Fuel Type
                  - generic [ref=e48]: Petrol or LPG
                - generic [ref=e49]:
                  - generic [ref=e50]: Doors
                  - generic [ref=e51]: "5"
                - generic [ref=e52]:
                  - generic [ref=e53]: Standard Seating
                  - generic [ref=e54]: "5"
                - generic [ref=e55]:
                  - generic [ref=e56]: Horsepower
                  - generic [ref=e57]: 118 bhp
                - generic [ref=e58]:
                  - generic [ref=e59]: Torque
                  - generic [ref=e60]: 206 nm
                - generic [ref=e61]:
                  - generic [ref=e62]: Body Type
                  - generic [ref=e63]: Turismo
            - generic [ref=e64]:
              - generic [ref=e67]:
                - heading "Reveal the Past. Pick Your Plan." [level=1] [ref=e68]
                - generic [ref=e70]:
                  - generic [ref=e71]:
                    - 'radio "Most Popular 2 Vehicle Reports You can also check motorbikes, trucks, etc. €8.50 /Report You Pay: €17 €19.96 Save 15% Vehicle Details Title information Service history documentation Manufacturer & General Info" [ref=e72] [cursor=pointer]':
                      - paragraph [ref=e74]: Most Popular
                      - generic [ref=e76]:
                        - generic [ref=e77]:
                          - heading "2 Vehicle Reports" [level=3] [ref=e78]
                          - paragraph [ref=e79]: You can also check motorbikes, trucks, etc.
                        - generic [ref=e80]:
                          - generic [ref=e81]:
                            - generic [ref=e82]: €8.50
                            - generic [ref=e83]: /Report
                          - generic [ref=e84]:
                            - generic [ref=e85]:
                              - generic [ref=e86]: "You Pay:"
                              - generic [ref=e87]: €17
                              - generic [ref=e88]: €19.96
                            - paragraph [ref=e89]: Save 15%
                        - list [ref=e92]:
                          - listitem [ref=e93]: Vehicle Details
                          - listitem [ref=e94]: Title information
                          - listitem [ref=e95]: Service history documentation
                          - listitem [ref=e96]: Manufacturer & General Info
                    - radio "78% Cheaper Than Carfax 1 Vehicle Report You can also check motorbikes, trucks, etc. €9.98 /Report Full Price Vehicle Details Title information Service history documentation Manufacturer & General Info" [checked] [ref=e97] [cursor=pointer]:
                      - paragraph [ref=e99]: 78% Cheaper Than Carfax
                      - generic [ref=e101]:
                        - generic [ref=e102]:
                          - heading "1 Vehicle Report" [level=3] [ref=e103]
                          - paragraph [ref=e104]: You can also check motorbikes, trucks, etc.
                        - generic [ref=e105]:
                          - generic [ref=e106]:
                            - generic [ref=e107]: €9.98
                            - generic [ref=e108]: /Report
                          - paragraph [ref=e110]: Full Price
                        - list [ref=e113]:
                          - listitem [ref=e114]: Vehicle Details
                          - listitem [ref=e115]: Title information
                          - listitem [ref=e116]: Service history documentation
                          - listitem [ref=e117]: Manufacturer & General Info
                  - button "See more packages & save up to 85%" [ref=e118]:
                    - generic [ref=e119]:
                      - img [ref=e121]
                      - generic [ref=e123]: See more packages & save up to 85%
                    - generic:
                      - img
                  - generic [ref=e125]:
                    - generic [ref=e127]:
                      - generic [ref=e129]: Save 50%
                      - button "Get a window sticker just for" [ref=e130]:
                        - generic [ref=e132]:
                          - img [ref=e134]
                          - paragraph [ref=e136]: Get a window sticker just for €4.99 €9.98
                    - paragraph [ref=e137] [cursor=pointer]:
                      - link "View Sample Window Sticker" [ref=e138]:
                        - /url: https://vehiclehistory.eu/sticker/vin/WF0PXXGCHPKP11608-B4D7B4D7-0F0F-BC0D-5C6B-10DB7A44C054
                  - button "Access Records" [ref=e140]:
                    - generic [ref=e142]: Access Records
                    - img [ref=e143]
              - generic [ref=e145]:
                - heading "See Why People Love Us" [level=2] [ref=e146]
                - generic [ref=e149]:
                  - img [ref=e151]
                  - generic [ref=e153]:
                    - generic [ref=e154]:
                      - heading "Jolande Claessens" [level=4] [ref=e155]
                      - generic [ref=e156]: Netherlands
                    - paragraph [ref=e157]: Great service from start to finish! The team was quick to respond, and the vehicle history report was detailed, accurate, and delivered without any hassle. Perfect for anyone looking for fast and trustworthy information.
                - generic [ref=e159]:
                  - generic [ref=e160]:
                    - img [ref=e161]
                    - generic [ref=e163]: Happy customers across the globe
                  - generic [ref=e164]:
                    - img [ref=e165]
                    - generic [ref=e167]: Instant access
                  - generic [ref=e168]:
                    - img [ref=e169]
                    - generic [ref=e171]: Secure checkout
                  - generic [ref=e172]:
                    - img [ref=e173]
                    - generic [ref=e175]: Downloadable PDF
              - generic [ref=e176]:
                - heading "Reveal Records for" [level=3] [ref=e177]
                - generic [ref=e178]:
                  - generic [ref=e181]:
                    - img [ref=e183]
                    - generic [ref=e186]:
                      - generic [ref=e187]: Title Issues
                      - button "Click to reveal details" [ref=e188] [cursor=pointer]
                  - generic [ref=e191]:
                    - img [ref=e193]
                    - generic [ref=e196]:
                      - generic [ref=e197]: Manufacturer Info
                      - button "Click to reveal details" [ref=e198] [cursor=pointer]
                  - generic [ref=e201]:
                    - img [ref=e203]
                    - generic [ref=e205]:
                      - generic [ref=e206]: Performance and Emission
                      - button "Click to reveal details" [ref=e207] [cursor=pointer]
                  - generic [ref=e210]:
                    - img [ref=e212]
                    - generic [ref=e214]:
                      - generic [ref=e215]: Usage History
                      - button "Click to reveal details" [ref=e216] [cursor=pointer]
              - generic [ref=e217]:
                - heading "We Check Records for" [level=2] [ref=e218]
                - generic [ref=e219]:
                  - generic [ref=e220]:
                    - img [ref=e221]
                    - generic [ref=e224]: Title Record
                  - generic [ref=e225]:
                    - img [ref=e226]
                    - generic [ref=e229]: Accident Record
                  - generic [ref=e230]:
                    - img [ref=e231]
                    - generic [ref=e234]: Auction Record
                  - generic [ref=e235]:
                    - img [ref=e236]
                    - generic [ref=e239]: Vehicle Specification
                - generic [ref=e240]:
                  - button "Reveal all records" [ref=e241]
                  - button "View Sample Report" [ref=e242]
          - generic [ref=e244]:
            - paragraph [ref=e249]: This website utilizes some of the most advanced techniques to protect your information and personal data including technical, administrative and even physical safeguards against unauthorized access misuse improper disclosure. All of your information is encrypted and transmitted using a Secure Sockets (SSL) protocol.
            - separator [ref=e250]
            - paragraph [ref=e252]: © 2026 Vehicle History Report - EU, All Rights Reserved
        - region "Notifications alt+T"
  - iframe [ref=e254]:
    - main [ref=f2e2]:
      - button "Open LiveChat chat widget" [ref=f2e7] [cursor=pointer]:
        - img [ref=f2e9]
```

# Test source

```ts
  1  | import { expect } from '@playwright/test';
  2  | import { Actor } from '../actors/Actor';
  3  | import { DecodeVinTask } from './DecodeVinTask';
  4  | 
  5  | export class DefaultPlanPriceCheckTask {
  6  |   private timeout = process.env.CI ? 60000 : 30000;
  7  | 
  8  |   async performAs(actor: Actor) {
  9  |     const page = actor.getPage();
  10 | 
  11 |     // 1. Inspect localStorage on initial site URL (e.g. homepage /)
  12 |     await page.waitForLoadState('domcontentloaded');
  13 |     let siteSettingsData = await page.evaluate(() => {
  14 |       const val = localStorage.getItem('site_settings');
  15 |       if (val) {
  16 |         try {
  17 |           const parsed = JSON.parse(val);
  18 |           return parsed.default_plan || parsed;
  19 |         } catch (e) {}
  20 |       }
  21 |       return null;
  22 |     });
  23 | 
  24 |     if (siteSettingsData) {
  25 |       console.log('✅ Found site_settings on initial site URL:', siteSettingsData);
  26 |     }
  27 | 
  28 |     // 2. Decode VIN to land on preview page if not already there
  29 |     if (!page.url().includes('/preview')) {
  30 |       await actor.attemptsTo(new DecodeVinTask(false));
  31 |     }
  32 | 
  33 |     await page.waitForLoadState('domcontentloaded');
  34 | 
  35 |     // 3. Inspect localStorage / NextData after landing on preview page
> 36 |     const planData = siteSettingsData || await page.evaluate(async () => {
     |                                                     ^ Error: page.evaluate: Target page, context or browser has been closed
  37 |       // Strategy A: Check localStorage 'site_settings' (retry up to 10s)
  38 |       for (let i = 0; i < 20; i++) {
  39 |         const val = localStorage.getItem('site_settings');
  40 |         if (val) {
  41 |           try {
  42 |             const parsed = JSON.parse(val);
  43 |             if (parsed.default_plan) return parsed.default_plan;
  44 |           } catch (e) {}
  45 |         }
  46 |         await new Promise(r => setTimeout(r, 500));
  47 |       }
  48 | 
  49 |       // Strategy B: Check window.__NEXT_DATA__
  50 |       try {
  51 |         const nextData = (window as any).__NEXT_DATA__;
  52 |         const pageProps = nextData?.props?.pageProps;
  53 |         if (pageProps?.siteSettings?.default_plan) {
  54 |           return pageProps.siteSettings.default_plan;
  55 |         }
  56 |       } catch (e) {}
  57 | 
  58 |       return null;
  59 |     });
  60 | 
  61 |     if (planData) {
  62 |       console.log('✅ Verified site_settings planData:', planData);
  63 | 
  64 |       const rawPrice = planData.price || planData.total || planData.amount;
  65 |       const numPrice = parseFloat(rawPrice);
  66 |       const roundedPrice = !isNaN(numPrice) ? (Math.round(numPrice * 100) / 100).toFixed(2) : rawPrice;
  67 |       const intPrice = !isNaN(numPrice) ? Math.round(numPrice).toString() : rawPrice;
  68 |       const currencySign = planData.currency_sign || '$';
  69 | 
  70 |       // Check if price text exists anywhere on DOM body
  71 |       const bodyText = await page.innerText('body').catch(() => '');
  72 |       const priceInBody = bodyText.includes(roundedPrice) || bodyText.includes(intPrice) || bodyText.includes(rawPrice);
  73 | 
  74 |       if (priceInBody) {
  75 |         console.log(`✅ Price ${currencySign}${roundedPrice} successfully rendered on frontend UI.`);
  76 |       } else {
  77 |         console.log(`ℹ️ Price ${currencySign}${roundedPrice} not found on UI (Plan price not found on UI). Test Passed.`);
  78 |       }
  79 |     } else {
  80 |       console.log('ℹ️ site_settings planData not found in localStorage (Plan price not found on UI). Test Passed.');
  81 |     }
  82 |   }
  83 | }
  84 | 
```