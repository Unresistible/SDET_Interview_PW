import { defineConfig, devices } from 'playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config({path: '.env'});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 150 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 15000
  },
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 1,
  /* Opt out of parallel tests on CI. */
  workers: 2,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',
    // Allows to download files
    acceptDownloads: true,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    headless: true,
    // baseURL: process.env.baseURL,
    actionTimeout: 15000
  },
  snapshotPathTemplate: `./snapshots/${process.env.BROWSER}/{arg}{ext}`,

  /* Configure projects for major browsers */
  projects: [
    // {
    //   name: 'setup',
    //   testMatch: 'tests/authorization.ts'
    // },
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // storageState: '.auth/storageState.json',
        viewport: { width: 1920, height: 1080 }
      },
      // dependencies: ['setup'],
      testDir: './tests/e2e',
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        // storageState: '.auth/storageState.json',
        viewport: { width: 1920, height: 1080 }
      },
      // dependencies: ['setup'],
      testDir: './tests/e2e',
    },
    {
      name: 'api',
      use: {
        // storageState: '.auth/storageState.json',
        extraHTTPHeaders: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.API_TOKEN}`
        }
      },
      // dependencies: ['setup'],
      testDir: './tests/api'
    }
  ],
  reporter: [
    ['html', {
      outputFolder: `test-results-html/${process.env.BROWSER || 'default'}`,
      open: 'never'
    }]
  ]
});
