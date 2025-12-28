import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/admin",
  timeout: 30 * 2000,
  retries: 1,
  reporter: [
    ["line"], // affichage console
    [
      "monocart-reporter",
      {
        name: "Playwright Test Report",
        outputFile: "./playwright-report/monocart-report.html",
        // Quelques options utiles :
        attachments: true,
        overview: true,
        trend: true,
        stats: true,
        // Tu peux aussi ajouter un thème ou un logo :
        title: "Tests E2E - Projet Issaka",
        logo: "https://playwright.dev/img/playwright-logo.svg",
      },
    ],
  ],

  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "Chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],
});
