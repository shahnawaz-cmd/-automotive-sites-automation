# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: global_case_verification.spec.ts >> TC_09 Revisit sticker banner flow
- Location: tests/global_case_verification.spec.ts:122:5

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /Grab it for/i })
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 90000ms
  - waiting for getByRole('button', { name: /Grab it for/i })

```

```yaml
- checkbox "Toggle menu"
- banner:
  - link "Vehicle History Europe logo":
    - /url: /
    - img "Vehicle History Europe logo"
  - navigation:
    - link "Vehicle History":
      - /url: /
    - link "VIN Check":
      - /url: /vin-check
    - link "Window Sticker":
      - /url: /window-sticker
    - link "Pricing":
      - /url: /pricing
    - link "Sample Reports":
      - /url: /sample-report
  - group:
    - text: 🇬🇧 en
    - img
  - link "Login":
    - /url: /login
  - link "Sign Up":
    - /url: /signup
- main:
  - navigation "Breadcrumb":
    - list:
      - listitem:
        - link "Home":
          - /url: /
      - listitem:
        - img
        - text: Window Sticker
  - text: Original Factory Specifications
  - heading "Look Up a Vehicle's Original Window Sticker Online" [level=1]
  - paragraph: Buying in Europe? Don't guess the trim or options. Run a window sticker by VIN and get the factory spec in one place. This includes the equipment lists, packages, key specs, and even the vehicle MSRP. Enter your VIN and check the car before you purchase or sale.
  - text: Vehicle Identification Number (VIN)
  - textbox "Vehicle Identification Number (VIN) Vehicle Identification Number (VIN)":
    - /placeholder: Enter VIN
  - button "Search VIN"
  - text: Factory Specs Equipment Lists Original MSRP Instant Results The Monroney Label, Explained
  - heading "What Is a Window Sticker by VIN?" [level=2]
  - paragraph: A window sticker by VIN is a document that shows what a specific vehicle was configured with when it left the factory, using the VIN as the key. In the U.S., it's commonly known as the Monroney label by VIN, tied to federal disclosure rules under the Automobile Information Disclosure Act.
  - paragraph: In Europe, dealers more commonly display the official fuel consumption and CO₂ label for new passenger cars, which is different from a full equipment breakdown.
  - paragraph: Our window sticker by VIN lookup tool focuses on available factory data like trim, standard equipment, optional packages, MSRP, and the emission block with Euro standard fuel consumption and CO₂. And yes, classic vehicles aren't left out; we can also decode many classic VIN formats (5 to 14 characters) when records exist.
  - img "Window Sticker Sample — Ford Focus"
  - text: The Full Factory Breakdown
  - heading "Details You Can Find on a Factory Window Sticker" [level=2]
  - paragraph: Our original window sticker by VIN is where you get the deeper factory breakdown. It's made to help you confirm the exact build, compare two similar cars, and negotiate using real equipment and pricing context (when available).
  - heading "Vehicle Description" [level=3]
  - paragraph: This part tells you exactly what the car is, in plain factory terms, including the model year, make, model/derivative, engine line, gearbox, and the VIN. This section helps you verify the vehicle you're looking at, especially when listings use vague trim names or mixed photos.
  - list:
    - listitem:
      - heading "Vehicle year, make, and model" [level=4]
      - paragraph: Shows the official year, manufacturer, and model name so you can confirm you're looking at the right vehicle and not a similar version with a different spec.
    - listitem:
      - heading "Trim level and body style" [level=4]
      - paragraph: Lists the specific trim/derivative and body style where available. This helps you understand the equipment level and why two "same model" cars can be priced differently.
    - listitem:
      - heading "Vehicle Identification Number (VIN)" [level=4]
      - paragraph: Displays the VIN used for the lookup. This ties our original window sticker by VIN to that exact vehicle, so you can cross-check it against the VIN on the car or documents.
  - heading "Standard Equipment" [level=3]
  - paragraph: This is where the sticker becomes buyer-friendly. Knowing this, you can instantly see what the car was supposed to include from the factory, without relying on memory or brochure hunting. It's also perfect for spotting missing items on a used car.
  - list:
    - listitem:
      - heading "Core comfort and convenience features" [level=4]
      - paragraph: Shows the day-to-day features that typically come standard on that trim level, making it easier to understand what "normal spec" looks like.
    - listitem:
      - heading "Safety basics" [level=4]
      - paragraph: Includes basic safety and driver support items when present in the record, so you can confirm what safety equipment should be on the car.
  - heading "Optional Equipment" [level=3]
  - paragraph: The window sticker lists the recorded factory-fitted upgrades and packages that were not standard, like tech features, comfort upgrades, or trim enhancements, tied to its VIN. This is the part that separates "nice spec" from "basic spec" without guesswork.
  - list:
    - listitem:
      - heading "Factory option packages" [level=4]
      - paragraph: Packages bundle upgrades together (tech packs, comfort packs, appearance packs). When available, this section helps you see what bundle was fitted and how it changes the car's value.
    - listitem:
      - heading "Individual add-on options" [level=4]
      - paragraph: Shows the available single options added to the vehicle, like upgraded seats, lighting, wheels, or driver assistance items.
    - listitem:
      - heading "Trim-level additions" [level=4]
      - paragraph: Some trims come with factory upgrades not found on the base model. This part clarifies which extras are trim-tied and which were ordered separately.
  - heading "Pricing Information" [level=3]
  - paragraph: When available in the record, the original MSRP helps you understand what the vehicle was worth new. This is particularly helpful when evaluating used cars or comparing similar models with different option packages.
  - list:
    - listitem:
      - heading "Base MSRP" [level=4]
      - paragraph: The starting price of the vehicle before any options or packages were added.
    - listitem:
      - heading "Options pricing" [level=4]
      - paragraph: Individual prices for factory-installed options and packages when available in the record.
    - listitem:
      - heading "Total MSRP" [level=4]
      - paragraph: The final manufacturer's suggested retail price including all options and destination charges.
  - heading "Technical Specifications" [level=3]
  - paragraph: Core vehicle specs like engine type, displacement, transmission, drivetrain, fuel type, and emission standards. This section is critical for confirming the exact powertrain configuration.
  - list:
    - listitem:
      - heading "Engine and performance" [level=4]
      - paragraph: Engine size, type, horsepower, and torque figures when available in the factory record.
    - listitem:
      - heading "Fuel economy and emissions" [level=4]
      - paragraph: Official fuel consumption figures (city/highway/combined) and CO₂ emissions per Euro standards.
  - heading "Safety Ratings" [level=3]
  - paragraph: When present in records, safety ratings from Euro NCAP or other testing organizations provide independent assessment of crash protection and safety features.
  - list:
    - listitem:
      - heading "Crash test results" [level=4]
      - paragraph: Overall safety rating and specific scores for adult occupant, child occupant, pedestrian, and safety assist categories.
  - link "View Window Sticker Sample":
    - /url: https://vehiclehistory.eu/sticker/vin/WF0PXXGCHPKP11608-B4D7B4D7-0F0F-BC0D-5C6B-10DB7A44C054
  - text: Built for Buyers & Sellers
  - heading "Who Benefits Most From Checking a Window Sticker?" [level=2]
  - paragraph: In Europe, trims and equipment can change by country, model year, and even engine rules. A window sticker by VIN helps you confirm the factory spec before you trust a listing. It's not hype. It's a cleaner way to compare cars and avoid expensive misunderstandings.
  - heading "Used Car Buyers" [level=3]
  - paragraph: Buying used in Europe can feel like decoding a puzzle. A car window sticker lookup shows what the vehicle originally came with, so you can compare the ad to the factory record and ask smarter questions before you travel, pay a deposit, or sign anything.
  - list:
    - listitem:
      - heading "Identify hidden damages before purchase" [level=4]
      - paragraph: A window sticker helps you spot red flags by showing what should be there. Missing equipment, swapped trims, or "wrong spec" claims can hint at past repairs or a rough history.
    - listitem:
      - heading "Support smarter negotiation" [level=4]
      - paragraph: Factory options and original specs give you a factual base for negotiation, instead of arguing over opinions or sales talk.
    - listitem:
      - heading "Compare two similar cars fairly" [level=4]
      - paragraph: Two cars can look identical, but the sticker shows what separates them by looking at the packages, equipment, and specs information.
  - heading "Sellers & Dealers" [level=3]
  - paragraph: If you sell cars in Europe, buyers may ask the same questions again and again about the trim, packages, and specs. A window sticker lookup gives you a clean, shareable answer, so your listing feels more trustworthy and less like a negotiation trap.
  - list:
    - listitem:
      - heading "Verify a vehicle's value" [level=4]
      - paragraph: Showing factory options and the original spec helps justify your price. It's easier to defend value when the equipment list backs it up.
    - listitem:
      - heading "Stand out in crowded marketplaces" [level=4]
      - paragraph: In many European markets, detailed listings win. A sticker gives you instant detail without sounding salesy.
    - listitem:
      - heading "Speed up the sales process" [level=4]
      - paragraph: Clear info reduces delays, fewer misunderstandings, and fewer "let me confirm and get back to you" moments.
  - heading "Automotive Enthusiasts & Collectors" [level=3]
  - paragraph: Collectors in Europe care about authenticity. An original window sticker by VIN can help confirm how the car was built when new, what options it had, and whether it's truly a rare spec. For restorations, resale, or just peace of mind, factory details matter more than stories.
  - list:
    - listitem:
      - heading "Confirm originality for concours or shows" [level=4]
      - paragraph: A factory equipment record helps prove the car is presented in its correct original configuration, not just "close enough."
    - listitem:
      - heading "Verify rare factory options" [level=4]
      - paragraph: Collectors pay for rarity. The sticker can confirm special packages or equipment tied to that VIN.
    - listitem:
      - heading "Reduce uncertainty on classic purchases" [level=4]
      - paragraph: For older cars that still have retrievable records, a sticker report can reduce the "unknown spec" concern.
  - text: Three Steps, One Sticker
  - heading "How to Get a Window Sticker by VIN" [level=2]
  - paragraph: The Window sticker itself contains valuable information about the vehicle's original specifications, features, and more. By using the VIN, you can access a detailed sticker in three simple steps.
  - heading "Find the VIN" [level=3]
  - paragraph: Look for the VIN on the vehicle. Then, examine the official documentation or insurance paperwork.
  - heading "Fill out the form" [level=3]
  - paragraph: Type or copy the VIN into the form. Make sure you entered the correct VIN. Submit it to begin the process.
  - heading "Review the sticker details" [level=3]
  - paragraph: In seconds, you will see the free preview with the basic details. Proceed to payment and receive your detailed window sticker, complete with all the information you need.
  - link "Get Window Sticker Now":
    - /url: "#top"
  - link "View Window Sticker Sample":
    - /url: https://vehiclehistory.eu/sticker/vin/WF0PXXGCHPKP11608-B4D7B4D7-0F0F-BC0D-5C6B-10DB7A44C054
  - text: Find Your 17-Digit Code
  - heading "Where is the VIN Located?" [level=2]
  - paragraph: "The VIN is designed to be located in several easy-to-access spots on the vehicle. Here are some places you should check first:"
  - heading "Dashboard" [level=3]
  - paragraph: Look at the lower corner of the windscreen on the driver's side. Many cars have a VIN plate visible from the outside.
  - heading "Driver's Door Area" [level=3]
  - paragraph: Open the driver's door and check the door frame area. Often, there's a manufacturer's label with the VIN.
  - heading "Vehicle Documents" [level=3]
  - paragraph: VINs are usually printed on registration documents, title paperwork, and many insurance cards or policy documents.
  - heading "Under the bonnet" [level=3]
  - paragraph: Some vehicles have stamped VIN locations in the engine bay, depending on make and model.
  - heading "Get a Window Sticker for Your Vehicle Now!" [level=2]
  - paragraph: Check your vehicle's original factory details in just a few steps. Enter your VIN to see if a window sticker is available.
  - text: Vehicle Identification Number (VIN)
  - textbox "Enter VIN"
  - button "Search VIN"
  - text: All Major Brands Covered
  - heading "Window Sticker Availability by Brand" [level=2]
  - paragraph: "Whether it's Volkswagen, BMW, Mercedes-Benz, or any other brand, our window sticker by VIN lookup tool can work for it. See some of the popular brands below:"
  - link "BMW":
    - /url: /window-sticker/bmw
  - link "Chevrolet":
    - /url: /window-sticker/chevrolet
  - link "Chrysler":
    - /url: /window-sticker/chrysler
  - link "Dodge":
    - /url: /window-sticker/dodge
  - link "Ford":
    - /url: /window-sticker/ford
  - link "Hyundai":
    - /url: /window-sticker/hyundai
  - link "Jeep":
    - /url: /window-sticker/jeep
  - link "Porsche":
    - /url: /window-sticker/porsche
  - link "Subaru":
    - /url: /window-sticker/subaru
  - link "Toyota":
    - /url: /window-sticker/toyota
  - text: Alfa Romeo Audi Citroën Fiat Honda Infiniti Jaguar KIA Land Rover Mazda Mercedes-Benz Mini Nissan Opel Peugeot Renault SEAT Škoda Volkswagen Volvo Your Questions, Answered
  - heading "Common Questions About Window Sticker Lookups" [level=2]
  - group:
    - heading "What exactly is a factory window sticker?" [level=3]
  - group:
    - heading "Can I find a window sticker for a used vehicle?" [level=3]
  - group:
    - heading "How accurate is window sticker information?" [level=3]
  - group:
    - heading "Why doesn't every VIN return a window sticker?" [level=3]
  - group:
    - heading "Is a window sticker the same as a build sheet?" [level=3]
  - group:
    - heading "Does this work for all manufacturers?" [level=3]
  - group:
    - heading "Is it possible to get a window sticker at no cost?" [level=3]
- contentinfo:
  - link "Vehicle History Europe logo (white)":
    - /url: /
    - img "Vehicle History Europe logo (white)"
  - paragraph: +(866)-300-0554
  - paragraph: support@vehiclehistory.eu
  - heading "Company" [level=4]
  - list:
    - listitem:
      - link "About Us":
        - /url: /about-us
    - listitem:
      - link "Contact Us":
        - /url: /contact-us
    - listitem:
      - link "Blog":
        - /url: /blog
    - listitem:
      - link "Login/Sign Up":
        - /url: /login
  - heading "Sample Reports" [level=4]
  - list:
    - listitem:
      - link "2015 Toyota Corolla":
        - /url: https://vehiclehistory.eu/report/vin/NMTER16RX0R073590
    - listitem:
      - link "2005 Renault Clio":
        - /url: https://vehiclehistory.eu/report/vin/VF15RE20A55268448
    - listitem:
      - link "2017 Vauxhall Astra":
        - /url: https://vehiclehistory.eu/report/vin/W0LBF6EC0HG162855
  - heading "Tools" [level=4]
  - list:
    - listitem:
      - link "VIN Decoder":
        - /url: /vin-decoder
    - listitem:
      - link "VIN Check":
        - /url: /vin-check
    - listitem:
      - link "Window Sticker":
        - /url: /window-sticker
    - listitem:
      - link "Classic Car VIN Lookup":
        - /url: https://classicdecoder.com/
  - heading "Quick Link" [level=4]
  - list:
    - listitem:
      - link "Privacy Policy":
        - /url: /privacy-policy
    - listitem:
      - link "Terms and conditions":
        - /url: /terms-of-service
    - listitem:
      - link "Request a Refund":
        - /url: /request-a-refund
    - listitem:
      - link "FAQs":
        - /url: /frequently-asked-questions
  - paragraph: © 2026 Vehicle History Europe. All rights reserved.
- alert
```

# Test source

```ts
  1  | import { expect } from '@playwright/test';
  2  | import { Actor } from '../actors/Actor';
  3  | import { DecodeVinTask } from './DecodeVinTask';
  4  | 
  5  | export class RevisitStickerBannerFlow {
  6  |   async performAs(actor: Actor) {
  7  |     const page = actor.getPage();
  8  |     const decoder = new DecodeVinTask();
  9  | 
  10 |     // 1. Navigate to valid sticker path
  11 |     const isInfiniti = page.url().includes('infinitiwindowsticker.com');
  12 |     const paths = isInfiniti ? ['/recalls'] : ['/window-sticker', '/window-stickers'];
  13 |     let validPath = null;
  14 |     
  15 |     for (const path of paths) {
  16 |       const response = await page.goto(path);
  17 |       if (response && response.status() === 200) {
  18 |         validPath = path;
  19 |         break;
  20 |       }
  21 |     }
  22 | 
  23 |     if (!validPath) {
  24 |       throw new Error('Failed: Neither /window-sticker nor /window-stickers paths are accessible.');
  25 |     }
  26 |     console.log(`Passed: Navigated to valid sticker path: ${validPath}`);
  27 |     await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  28 | 
  29 |     // 2. Perform VIN Decode
  30 |     await actor.attemptsTo(new DecodeVinTask(), false);
  31 | 
  32 |     // 3. Return to valid sticker path
  33 |     await page.goto(validPath);
  34 |     await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  35 | 
  36 |     // 4. Click dynamic 'Grab it for only' button
  37 |     const timeout = process.env.CI ? 90000 : 60000;
  38 |     
  39 |     // Regex handles 'Grab it for only', 'Grab it for $', 'Grab it for €', etc.
  40 |     const grabItButton = page.getByRole('button', { name: /Grab it for/i });
  41 |     
  42 |     try {
  43 |       console.log(`Checking visibility for sticker banner on: ${page.url()}`);
> 44 |       await expect(grabItButton).toBeVisible({ timeout: timeout });
     |                                  ^ Error: expect(locator).toBeVisible() failed
  45 |       
  46 |       // Force click to handle potential overlays
  47 |       await grabItButton.click({ force: true });
  48 |     } catch (e) {
  49 |       console.error('Sticker banner button issue:', e);
  50 |       throw e;
  51 |     }
  52 | 
  53 |     // 5. Verify navigation to sticker preview page
  54 |     await page.waitForURL(/.*preview.*/, { timeout: timeout });
  55 |     
  56 |     // Check URL contains type=sticker AND content=revisit
  57 |     await expect(page).toHaveURL(/.*type=sticker.*/);
  58 |     await expect(page).toHaveURL(/.*content=revisit.*/);
  59 |     
  60 |     console.log('Passed: Revisit sticker banner flow verified.');
  61 |   }
  62 | }
  63 | 
```