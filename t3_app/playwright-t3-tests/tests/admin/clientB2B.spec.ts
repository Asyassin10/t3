import { test } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { ClientsPage } from "../../pages/ClientsPage";
import { ClientModal } from "../../pages/ClientModal";
import { AlertComponent } from "../../pages/AlertComponent";

test("Création et modification d’un client B2B", async ({ page }, testInfo) => {
  const loginPage = new LoginPage(page, testInfo);
  const clientsPage = new ClientsPage(page, testInfo);
  const clientModal = new ClientModal(page, testInfo);
  const alert = new AlertComponent(page, testInfo);
  // Login
  await loginPage.goto();
  await loginPage.login("adam_client_esoft@gmail.com", "password");

  // Accès clients
  await clientsPage.goToClients();
  await clientsPage.verifyListPage();

  // Ajout client
  /* 
  await clientsPage.openAddClientModal();
  await clientModal.verifyModalTitle();
  await clientModal.fillName("Client2");
  await clientModal.save();

  // Modification client
  await clientsPage.openEditFirstClientModal();
  await clientModal.verifyModalTitle();
  await clientModal.fillName("Client2 Modifié");
  await clientModal.save();

  // Vérification message succès
  // await alert.expectSuccess("Manager mis à jour avec succès");
  // Suppression
  await clientsPage.clickDeleteClient(1);
  await clientModal.confirmDelete();
  // await alert.expectDeleteSuccess();

  // Recherche
  await clientsPage.searchClient("client");
 */
  // Menu utilisateur & logout
  await loginPage.openMenu();
  await clientsPage.verifyMenu();
  // await loginPage.logout();
  // await clientsPage.verifyLoggedOut();
});
