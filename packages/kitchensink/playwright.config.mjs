// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { defineConfig, devices } from '@playwright/test'

const config = {

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 1 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: process.env.CI ? 'dot' : 'list',

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],

  timeout: 10000,

  expect: {
    timeout: 4000,
    toMatchSnapshot: {
      maxDiffPixelRatio: 0.4,
      maxDiffPixels: 6000
    }
  },

  use: {
    launchOptions: {
      ignoreDefaultArgs: ['--hide-scrollbars'],
    },
    trace: 'on-first-retry',
    baseURL: 'http://127.0.0.1:3234'
  },

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run visual',
    url: 'http://127.0.0.1:3234',
    timeout: 30 * 1000,
    reuseExistingServer: !process.env.CI
  }
}

export default defineConfig(config)
