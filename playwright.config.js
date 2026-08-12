const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 90000,
  retries: 1,
  workers: 2,
  fullyParallel: false,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'results.json' }]
  ],
  projects: [
    // --- Desktop Chromium ---
    {
      name: 'VSR',
      use: {
        baseURL: 'https://vehiclesreport.com/',
        headless: !!process.env.CI,
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        launchOptions: {
          args: ['--incognito'],
        },
      },
    },
    {
      name: 'MotorcycleVINLookup',
      use: {
        baseURL: 'https://motorcyclevinlookup.com/',
        headless: !!process.env.CI,
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        launchOptions: {
          args: ['--incognito'],
        },
      },
    },
    {
      name: 'VehicleHistoryEU',
      use: {
        baseURL: 'https://vehiclehistory.eu/',
        headless: !!process.env.CI,
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        launchOptions: {
          args: ['--incognito'],
        },
      },
    },
    {
      name: 'VINNumberCA',
      use: {
        baseURL: 'https://vinnumber.ca/',
        headless: !!process.env.CI,
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        launchOptions: {
          args: ['--incognito'],
        },
      },
    },

    // --- Mobile Chrome ---
    {
      name: 'VSR_MobileChrome',
      use: {
        baseURL: 'https://vehiclesreport.com/',
        ...devices['Pixel 5'],
        headless: !!process.env.CI,
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: 'MotorcycleVINLookup_MobileChrome',
      use: {
        baseURL: 'https://motorcyclevinlookup.com/',
        ...devices['Pixel 5'],
        headless: !!process.env.CI,
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: 'VehicleHistoryEU_MobileChrome',
      use: {
        baseURL: 'https://vehiclehistory.eu/',
        ...devices['Pixel 5'],
        headless: !!process.env.CI,
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: 'VINNumberCA_MobileChrome',
      use: {
        baseURL: 'https://vinnumber.ca/',
        ...devices['Pixel 5'],
        headless: !!process.env.CI,
        ignoreHTTPSErrors: true,
      },
    },
    // --- Mobile Edge (Chromium channel msedge) ---
    {
      name: 'VSR_MobileEdge',
      use: {
        baseURL: 'https://vehiclesreport.com/',
        ...devices['Pixel 5'],
        channel: 'msedge',
        headless: !!process.env.CI,
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: 'MotorcycleVINLookup_MobileEdge',
      use: {
        baseURL: 'https://motorcyclevinlookup.com/',
        ...devices['Pixel 5'],
        channel: 'msedge',
        headless: !!process.env.CI,
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: 'VehicleHistoryEU_MobileEdge',
      use: {
        baseURL: 'https://vehiclehistory.eu/',
        ...devices['Pixel 5'],
        channel: 'msedge',
        headless: !!process.env.CI,
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: 'VINNumberCA_MobileEdge',
      use: {
        baseURL: 'https://vinnumber.ca/',
        ...devices['Pixel 5'],
        channel: 'msedge',
        headless: !!process.env.CI,
        ignoreHTTPSErrors: true,
      },
    },
    // --- Mobile Safari (iOS) ---
    {
      name: 'VSR_MobileSafari',
      use: {
        baseURL: 'https://vehiclesreport.com/',
        ...devices['iPhone 14'],
        browserName: 'webkit',
        headless: !!process.env.CI,
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: 'MotorcycleVINLookup_MobileSafari',
      use: {
        baseURL: 'https://motorcyclevinlookup.com/',
        ...devices['iPhone 14'],
        browserName: 'webkit',
        headless: !!process.env.CI,
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: 'VehicleHistoryEU_MobileSafari',
      use: {
        baseURL: 'https://vehiclehistory.eu/',
        ...devices['iPhone 14'],
        browserName: 'webkit',
        headless: !!process.env.CI,
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: 'VINNumberCA_MobileSafari',
      use: {
        baseURL: 'https://vinnumber.ca/',
        ...devices['iPhone 14'],
        browserName: 'webkit',
        headless: !!process.env.CI,
        ignoreHTTPSErrors: true,
      },
    },
    // {
    //   name: 'InfinitiWindowSticker',
    //   use: {
    //     baseURL: 'https://infinitiwindowsticker.com/',
    //     headless: !!process.env.CI,
    //     browserName: 'chromium',
    //     viewport: { width: 1280, height: 720 },
    //     ignoreHTTPSErrors: true,
    //     launchOptions: {
    //       args: ['--incognito'],
    //     },
    //   },
    // },
  ],
});
