const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 90000,
  retries: 1,
  workers: 1,
  fullyParallel: false,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'results.json' }]
  ],
  projects: [
    {
      name: 'AccessAutoHistory',
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
  ],
});
