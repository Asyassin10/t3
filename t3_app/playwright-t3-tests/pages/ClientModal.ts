import { Page, TestInfo, expect } from "@playwright/test";
import { ScreenshotHelper } from "../utils/ScreenshotHelper";

export class ClientModal {
  constructor(private readonly page: Page, private testInfo: TestInfo) {}

  async verifyModalTitle() {
    await expect(
      this.page.getByRole("heading", { name: "Saisie d'un client B2B" })
    ).toBeVisible();

    await ScreenshotHelper.take(
      this.page,
      this.testInfo,
      "client-modal-visible"
    );
  }

  async fillName(name: string) {
    await this.page.getByRole("textbox", { name: "Nom" }).fill(name);
    await ScreenshotHelper.take(
      this.page,
      this.testInfo,
      `client-name-filled-${name}`
    );
  }

  async save() {
    await this.page.getByRole("button", { name: "Enregistrer" }).click();
    await ScreenshotHelper.take(this.page, this.testInfo, "client-saved");
  }
  async confirmDelete() {
    await this.page
      .getByRole("button", { name: "Supprimer le client" })
      .click();
    await ScreenshotHelper.take(this.page, this.testInfo, "12-confirm-delete");
  }
}
