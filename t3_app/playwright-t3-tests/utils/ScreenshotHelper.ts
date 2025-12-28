import { Page, TestInfo } from "@playwright/test";

export class ScreenshotHelper {
  static async take(page: Page, testInfo: TestInfo, name: string) {
    const screenshot = await page.screenshot({ fullPage: true });

    await testInfo.attach(name, {
      body: screenshot,
      contentType: "image/png",
    });
  }
}
