import { Page, TestInfo, expect } from "@playwright/test";
import { ScreenshotHelper } from "../utils/ScreenshotHelper";

export class AlertComponent {
  constructor(private readonly page: Page, private testInfo: TestInfo) {}

  async expectSuccess(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
    await ScreenshotHelper.take(this.page, this.testInfo, "success-alert");
  }

  async expectDeleteSuccess() {
    await expect(
      this.page.getByText("Client supprimé avec succès", { exact: true })
    ).toBeVisible({ timeout: 10000 });

    await ScreenshotHelper.take(
      this.page,
      this.testInfo,
      "13-delete-success-alert"
    );
  }
  async expectManagerCreated() {
    await expect(
      this.page.getByText("Le Gestionnaire a été créé", { exact: true })
    ).toBeVisible({ timeout: 10000 });

    await ScreenshotHelper.take(
      this.page,
      this.testInfo,
      "06b-manager-created-alert"
    );
  }
}
