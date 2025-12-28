import { test } from "@playwright/test";

import { LoginPage } from "../../pages/LoginPage";

import { AlertComponent } from "../../pages/AlertComponent";
import { ManagersPage } from "../../pages/ManagersPage";
import { ManagerModal } from "../../pages/ManagerModal";
import { EmailHelper } from "../../utils/EmailHelper";

test("CRUD Gestionnaire + déconnexion", async ({ page }, testInfo) => {
  const login = new LoginPage(page, testInfo);
  const managers = new ManagersPage(page, testInfo);
  const managerModal = new ManagerModal(page, testInfo);

  const alert = new AlertComponent(page, testInfo);

  await login.goto();
  await login.login("adam_client_esoft@gmail.com", "password");

  await managers.verifyListPage(); /* 
  await managers.openCreateModal();

  await managerModal.verifyModal();
  const randomEmail = EmailHelper.generateRandomEmail(
    "gestionnaire",
    "gmail.com"
  );
  await managerModal.fillForm("Gestionnaire 2", randomEmail);
  await managerModal.save();

  // await alert.expectManagerCreated();

  await managers.openDeleteModalForRow("Gestionnaire 2");
  await managerModal.confirm(); */

  // await login.logout();
});
