import { Page, TestInfo, expect } from "@playwright/test";
import { ScreenshotHelper } from "../utils/ScreenshotHelper";

export class ManagersPage {
  constructor(
    private readonly page: Page,
    private readonly testInfo: TestInfo
  ) {}

  async verifyListPage() {
    await expect(
      this.page.getByRole("heading", { name: "Liste des gestionnaires:" })
    ).toBeVisible();

    await ScreenshotHelper.take(this.page, this.testInfo, "03-managers-list");
  }

  async openCreateModal() {
    await this.page
      .getByRole("button", { name: "Ajouter un gestionnaire" })
      .click();
    await ScreenshotHelper.take(
      this.page,
      this.testInfo,
      "04-open-create-manager-modal"
    );
  }

  async openDeleteModalForRow(rowText: string) {
    await this.page
      .getByRole("row", { name: rowText })
      .getByRole("button")
      .nth(2)
      .click();

    await ScreenshotHelper.take(
      this.page,
      this.testInfo,
      "07-open-delete-manager-modal"
    );
  }
}
