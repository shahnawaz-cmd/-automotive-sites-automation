# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: global_case_verification.spec.ts >> TC_01 VIN decode verify
- Location: tests/global_case_verification.spec.ts:30:5

# Error details

```
TimeoutError: locator.waitFor: Timeout 60000ms exceeded.
Call log:
  - waiting for getByRole('textbox', { name: 'Vehicle Identification Number' }).or(getByRole('textbox', { name: 'Enter VIN Number' })).or(getByRole('textbox', { name: 'Enter Your VIN' })).or(getByPlaceholder('Vehicle Identification Number')).or(getByPlaceholder('Enter VIN Number')).or(getByPlaceholder('Enter Your VIN')).first() to be visible

```

# Test source

```ts
  1   | import { Actor } from '../actors/Actor';
  2   | 
  3   | export interface VinTaskSelectors {
  4   |   vinField1: string;
  5   |   vinField2: string;
  6   |   vinField3: string;
  7   |   searchButton: string;
  8   |   accessButton: string;
  9   |   successText: string;
  10  |   successText2: string;
  11  |   successText3: string;
  12  |   successHeading: string;
  13  |   successHeading2: string;
  14  | }
  15  | 
  16  | export class DecodeVinTask {
  17  |   constructor(
  18  |     public shouldClose: boolean = true,
  19  |     public skipSuccessClick: boolean = false,
  20  |     public useEuVin: boolean = false,
  21  |     private timeout: number = 60000,
  22  |     private selectors: VinTaskSelectors = {
  23  |       vinField1: 'Vehicle Identification Number',
  24  |       vinField2: 'Enter VIN Number',
  25  |       vinField3: 'Enter Your VIN',
  26  |       searchButton: 'Search VIN',
  27  |       accessButton: 'Access Records',
  28  |       successText: 'Records found for',
  29  |       successText2: 'We found historical records for the',
  30  |       successText3: 'Window sticker found for',
  31  |       successHeading: 'Success! We found detailed',
  32  |       successHeading2: 'We found detailed information for the',
  33  |     }
  34  |   ) {}
  35  | 
  36  |   private generateRandomVin(baseVin: string, numToReplace: number = 1): string {
  37  |     const randomDigits = Math.floor(Math.random() * Math.pow(10, numToReplace))
  38  |       .toString()
  39  |       .padStart(numToReplace, '0');
  40  |     return baseVin.slice(0, -numToReplace) + randomDigits;
  41  |   }
  42  | 
  43  |   private usVinPool: string[] = [
  44  |     '1C4RJHBG0PC533410',
  45  |     '3MW5R1J01M8B87063',
  46  |     '1FMCU0F68LUB98817',
  47  |     'WA1VABGE5KB008242',
  48  |     '2C4RC1BG6JR152015',
  49  |     '1FMCU9GD3JUC83708'
  50  |   ];
  51  | 
  52  |   private generateUSVin(isMVL: boolean = false): string {
  53  |     const baseVin = this.usVinPool[Math.floor(Math.random() * this.usVinPool.length)];
  54  |     return this.generateRandomVin(baseVin, 2);
  55  |   }
  56  | 
  57  |   private generateEuVin(): string {
  58  |     const baseVins = [
  59  |       'VF3YC2MFB12G20874',
  60  |       'SHHEU88701U002012'
  61  |     ];
  62  |     const baseVin = baseVins[Math.floor(Math.random() * baseVins.length)];
  63  |     return this.generateRandomVin(baseVin, 1);
  64  |   }
  65  | 
  66  |   async performAs(actor: Actor) {
  67  |     const page = actor.getPage();
  68  |     const isMVL = page.url().includes('motorcyclevinlookup.com');
  69  |     // ONLY TC_14 (which passes useEuVin = true) uses EU VINs. ALL other cases for VHREU and other brands use US VINs.
  70  |     const vin = this.useEuVin ? this.generateEuVin() : this.generateUSVin(isMVL);
  71  |     console.log(`[VIN Decode] Generated VIN (${this.useEuVin ? 'EU' : 'US'}): ${vin}`);
  72  | 
  73  |     const vinField1 = page.getByRole('textbox', { name: this.selectors.vinField1 });
  74  |     const vinField2 = page.getByRole('textbox', { name: this.selectors.vinField2 });
  75  |     const vinField3 = page.getByRole('textbox', { name: this.selectors.vinField3 });
  76  |     const vinField4 = page.getByPlaceholder(this.selectors.vinField1);
  77  |     const vinField5 = page.getByPlaceholder(this.selectors.vinField2);
  78  |     const vinField6 = page.getByPlaceholder(this.selectors.vinField3);
  79  | 
  80  |     const vinInput = vinField1.or(vinField2).or(vinField3).or(vinField4).or(vinField5).or(vinField6).first();
  81  |     
> 82  |     await vinInput.waitFor({ state: 'visible', timeout: this.timeout });
      |                    ^ TimeoutError: locator.waitFor: Timeout 60000ms exceeded.
  83  |     await vinInput.fill(vin);
  84  | 
  85  |     const searchBtn = page.getByRole('button', { name: this.selectors.searchButton }).first();
  86  |     if (await searchBtn.isVisible()) {
  87  |       await searchBtn.click();
  88  |     } else {
  89  |       await vinInput.locator('xpath=../..').getByRole('button').first().click();
  90  |     }
  91  |     
  92  |     await page.waitForTimeout(1000);
  93  | 
  94  |     // List of potential success elements to check and click
  95  |     const successLocator = page.getByText('Records found for', { exact: false })
  96  |       .or(page.locator('h1:has-text("Records found for")'))
  97  |       .or(page.locator('text=We found detailed information for the'))
  98  |       .or(page.locator('h2:has-text("We found")'))
  99  |       .or(page.getByRole('heading', { name: 'Success' }))
  100 |       .or(page.getByRole('heading', { name: 'Success! We found detailed' }))
  101 |       .or(page.locator('h4:has-text("Success!")'))
  102 |       .or(page.getByText('Success! We found detailed', { exact: false }))
  103 |       .or(page.locator('text=Window sticker found for'))
  104 |       .or(page.locator('text=We found historical records for the'))
  105 |       .or(page.locator('text=Success!'));
  106 | 
  107 |     // Wait for the success element to render on preview page (gives fresh/uncached VINs time to decode)
  108 |     await successLocator.first().waitFor({ state: 'visible', timeout: this.timeout }).catch(() => {
  109 |       console.log('Timeout waiting for success locator visibility');
  110 |     });
  111 | 
  112 |     const successLocators = [
  113 |       page.getByText('Records found for', { exact: false }),
  114 |       page.locator('h1:has-text("Records found for")'),
  115 |       page.locator('text=We found detailed information for the'),
  116 |       page.locator('h2:has-text("We found")'),
  117 |       page.getByRole('heading', { name: 'Success' }),
  118 |       page.getByRole('heading', { name: 'Success! We found detailed' }),
  119 |       page.locator('h4:has-text("Success!")'),
  120 |       page.getByText('Success! We found detailed', { exact: false }),
  121 |       page.locator('text=Window sticker found for'),
  122 |       page.locator('text=We found historical records for the'),
  123 |       page.locator('text=Success!')
  124 |     ].filter(Boolean);
  125 | 
  126 |     let successClicked = false;
  127 | 
  128 |     // If skipSuccessClick is explicitly enabled, skip clicking the success banner
  129 |     if (this.skipSuccessClick) {
  130 |       console.log('[VIN Decode] Bypassing success banner click as requested by task parameters.');
  131 |       successClicked = true;
  132 |     } else {
  133 |       for (const locator of successLocators) {
  134 |         if (await locator.isVisible()) {
  135 |           console.log('[VIN Decode] Clicking success element...');
  136 |           await locator.click().catch(() => {});
  137 |           successClicked = true;
  138 |           break;
  139 |         }
  140 |       }
  141 |     }
  142 | 
  143 |     if (!successClicked) {
  144 |       console.log('Failed to click success condition. Current URL:', page.url());
  145 |       throw new Error('Success condition not found');
  146 |     }
  147 | 
  148 |     console.log('Success condition met.');
  149 | 
  150 |     if (this.shouldClose) {
  151 |       await page.close();
  152 |       console.log('Closed page as requested.');
  153 |     }
  154 |   }
  155 | }
```