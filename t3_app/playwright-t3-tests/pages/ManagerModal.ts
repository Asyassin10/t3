import { Page, TestInfo, expect } from "@playwright/test";
import { ScreenshotHelper } from "../utils/ScreenshotHelper";

export class ManagerModal {
  constructor(
    private readonly page: Page,
    private readonly testInfo: TestInfo
  ) {}

  async verifyModal() {
    await expect(
      this.page.getByRole("heading", { name: "Ajouter un gestionnaire" })
    ).toBeVisible();

    await ScreenshotHelper.take(
      this.page,
      this.testInfo,
      "05-create-manager-modal"
    );
  }

  async fillForm(name: string, email: string) {
    await this.page.getByRole("textbox", { name: "Nom" }).fill(name);
    await this.page.getByRole("textbox", { name: "E-mail" }).fill(email);

    await ScreenshotHelper.take(
      this.page,
      this.testInfo,
      "06-manager-form-filled"
    );
  }

  async save() {
    await this.page.getByRole("button", { name: "Enregistrer" }).click();
  }
  async confirm() {
    await expect(
      this.page.getByRole("heading", { name: "êtes-vous sûr de vouloir" })
    ).toBeVisible();

    await ScreenshotHelper.take(
      this.page,
      this.testInfo,
      "08-delete-confirm-modal"
    );

    await this.page.getByRole("button", { name: "Supprimer" }).click();
  }
}
