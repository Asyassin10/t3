import { Page, Locator, TestInfo, expect } from "@playwright/test";
import { ScreenshotHelper } from "../utils/ScreenshotHelper";

export class ProjectsPage {
  constructor(private page: Page, private testInfo: TestInfo) {}

  // Boutons et éléments
  get addProjectButton(): Locator {
    return this.page.getByRole("button", { name: "Ajouter un Projet" });
  }

  get assignProjectButton(): Locator {
    return this.page.getByRole("button", { name: "Assigner un projet au" });
  }

  get addActivityButton(): Locator {
    return this.page.getByRole("button", { name: "Ajouter une Activitée" });
  }

  // Méthodes
  async goToProjects() {
    await this.page.getByRole("link", { name: "Projets" }).click();
    await ScreenshotHelper.take(this.page, this.testInfo, "01-projects-page");
  }

  async addProject(
    name: string,
    info: string,
    duration: number,
    client: string
  ) {
    await this.addProjectButton.click();
    await this.page.getByRole("textbox", { name: "projet" }).fill(name);
    await this.page.getByRole("textbox", { name: "Info" }).fill(info);
    await this.page.getByPlaceholder("Durée").fill(duration.toString());

    await this.page
      .getByRole("combobox", { name: "Selectionner un Client" })
      .click();

    // Sélection via option spécifique pour éviter strict mode
    await this.page.getByRole("option", { name: client }).click();
    await ScreenshotHelper.take(this.page, this.testInfo, "02-project-added");
    /* 
    await this.page.getByRole("button", { name: "Enregistrer" }).click(); */
  } /*

  async assignProjectToUser(
    projectName: string,
    managerName: string,
    pricePerDay: number
  ) {
    await this.assignProjectButton.click();

    // Sélection projet
    const projectDropdown = this.page.getByRole("combobox", {
      name: "Selectionner un projet",
    });
    await projectDropdown.click();
    const projectOption = projectDropdown.locator("option", {
      hasText: projectName,
    });
    await expect(projectOption).toHaveCount(1);
    await projectOption.click();

    // Remplir prix
    await this.page
      .getByRole("textbox", { name: "price per day" })
      .fill(pricePerDay.toString());

    // Sélection gestionnaire
    const managerDropdown = this.page.getByRole("combobox", {
      name: "Selectionner un Gestionnaire",
    });
    await managerDropdown.click();
    const managerOption = managerDropdown.locator("option", {
      hasText: managerName,
    });
    await expect(managerOption).toHaveCount(1);
    await managerOption.click();

    await this.page.getByRole("button", { name: "Enregistrer" }).click();
    await ScreenshotHelper.take(
      this.page,
      this.testInfo,
      "03-project-assigned"
    );
  }

 async addActivity(projectName: string, activityName: string) {
    await this.addActivityButton.click();

    // Sélection projet
    const projectDropdown = this.page.getByRole("combobox", {
      name: "Selectionner un Projet",
    });
    await projectDropdown.click();
    const projectOption = projectDropdown.locator("option", {
      hasText: projectName,
    });
    await expect(projectOption).toHaveCount(1);
    await projectOption.click();

    // Ajouter activité
    await this.page
      .getByRole("textbox", { name: "Nom de l'activité" })
      .fill(activityName);

    await this.page.getByRole("button", { name: "Enregistrer" }).click();
    await ScreenshotHelper.take(this.page, this.testInfo, "04-activity-added");
  } */
}
