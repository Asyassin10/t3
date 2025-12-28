import { Page, TestInfo, expect } from "@playwright/test";
import { ScreenshotHelper } from "../utils/ScreenshotHelper";

export class ClientsPage {
  constructor(private readonly page: Page, private testInfo: TestInfo) {}

  async goToClients() {
    await this.page.getByRole("link", { name: "Client" }).click();
    await ScreenshotHelper.take(this.page, this.testInfo, "04-clients-menu");
  }

  async verifyListPage() {
    await expect(
      this.page.getByRole("heading", { name: "Liste des Clients B2B:" })
    ).toBeVisible();

    await ScreenshotHelper.take(
      this.page,
      this.testInfo,
      "05-clients-list-page"
    );
  }

  async openAddClientModal() {
    await this.page
      .getByRole("button", { name: "Ajouter un Client B2B" })
      .click();
    await ScreenshotHelper.take(
      this.page,
      this.testInfo,
      "add-client-modal-opened"
    );
  }

  async openEditFirstClientModal() {
    await this.page
      .getByRole("button", { name: "Modifier un B2B Customer" })
      .first()
      .click();

    await ScreenshotHelper.take(
      this.page,
      this.testInfo,
      "edit-client-modal-opened"
    );
  }
  async searchClient(keyword: string) {
    await this.page.getByRole("textbox", { name: "saisie ici" }).fill(keyword);
    await ScreenshotHelper.take(this.page, this.testInfo, "10-search-client");
  }

  async clickDeleteClient(index = 0) {
    await this.page
      .getByRole("button", { name: "Supprimer le client" })
      .nth(index)
      .click();

    await ScreenshotHelper.take(
      this.page,
      this.testInfo,
      "11-click-delete-client"
    );
  }
  async verifyLoggedOut() {
    await expect(
      this.page.getByRole("heading", { name: "Se Connecter" })
    ).toBeVisible();

    await ScreenshotHelper.take(
      this.page,
      this.testInfo,
      "16-login-page-after-logout"
    );
  }

  async verifyMenu() {
    await expect(this.page.getByText("Profile")).toBeVisible();
    await expect(this.page.getByText("Settings")).toBeVisible();
    await expect(this.page.getByText("Se déconnecter")).toBeVisible();
  }
}
