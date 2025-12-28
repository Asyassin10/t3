import { Page, TestInfo } from "@playwright/test";
import { ScreenshotHelper } from "../utils/ScreenshotHelper";

export class LoginPage {
  constructor(
    private readonly page: Page,
    private readonly testInfo: TestInfo
  ) {}

  async goto() {
    await this.page.goto("http://localhost:5377/auth/signing");
    await ScreenshotHelper.take(this.page, this.testInfo, "01-login-page");
  }

  async login(email: string, password: string) {
    await this.page.getByRole("textbox", { name: "Adresse email" }).fill(email);
    await this.page
      .getByRole("textbox", { name: "Mot de passe" })
      .fill(password);

    await ScreenshotHelper.take(
      this.page,
      this.testInfo,
      "02-credentials-filled"
    );

    await this.page.getByRole("button", { name: "Login" }).click();
    await ScreenshotHelper.take(this.page, this.testInfo, "03-after-login");
  }
  async openMenu() {
    await this.page.getByRole("button", { name: "JD" }).click();
    await ScreenshotHelper.take(
      this.page,
      this.testInfo,
      "14-user-menu-opened"
    );
  }

  async logout() {
    await this.page.getByText("Se déconnecter").click();
    await ScreenshotHelper.take(this.page, this.testInfo, "15-logout-clicked");
  }
}
