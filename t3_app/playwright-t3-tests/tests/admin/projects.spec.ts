import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { ProjectsPage } from "../../pages/ProjectsPage";

test("CRUD Projet + Assignement + Activity", async ({ page }, testInfo) => {
  const login = new LoginPage(page, testInfo);
  const projects = new ProjectsPage(page, testInfo);

  // 1️⃣ Login
  await login.goto();
  await login.login("adam_client_esoft@gmail.com", "password");

  // 2️⃣ Aller à Projects
  await projects.goToProjects();

  // 3️⃣ Ajouter un projet
  const projectName = "Projet3";
  await projects.addProject(
    projectName,
    "Optio incididunt ni",
    24,
    "Client2 Modifié"
  );
  /* 
  // 4️⃣ Assigner le projet à un gestionnaire
  await projects.assignProjectToUser(projectName, 'Gestionnaire 2', 20);

  // 5️⃣ Ajouter une activité au projet
  const activityName = 'activité 1';
  await projects.addActivity(projectName, activityName);

  // 6️⃣ Assertions finales
  await expect(page.getByRole('heading', { name: 'Liste des projets2' })).toBeVisible();
  await expect(page.getByRole('combobox').filter({ hasText: 'selectionner l\'année' })).toBeVisible();
  await expect(page.getByRole('combobox').filter({ hasText: 'selectionner le statut' })).toBeVisible();
  await expect(page.getByRole('combobox').filter({ hasText: 'selectionner le mois' })).toBeVisible();
  await expect(page.getByRole('combobox').filter({ hasText: 'selectionner un utilisateur' })).toBeVisible();
  await expect(page.getByRole('combobox').filter({ hasText: 'selectionner un client' })).toBeVisible();
  await expect(projects.addActivityButton).toBeVisible();
  await expect(projects.assignProjectButton).toBeVisible();
  await expect(projects.addProjectButton).toBeVisible(); */
});
