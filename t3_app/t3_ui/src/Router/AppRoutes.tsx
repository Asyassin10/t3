import { Route, Routes } from "react-router-dom";
import Signing from "@/Screens/Auth/Signing";
import Project from "@/Screens/Projects/Project";
import Page404 from "@/Screens/AppErrors/Page404";
import AuthProtectedRoute from "./AuthProtectedRoute";
import SetSchedule from "@/Screens/SetSchedule";
import LandingPage from "@/Screens/LandingPage";
import AppLayout from "@/Screens/Layout/AppLayout";
import Concultant from "@/Screens/Concultants/Concultant";
import ActivateAccount from "@/Screens/Auth/ActivateAccount";
import AccountWaitForValidation from "@/Screens/Account/AccountWaitForValidation";
import Manager from "@/Screens/managers/Manager";
import ValidateAccount from "@/Screens/Auth/ValidateAccount";
import Absence from "@/Screens/Absence/Absence";
import ManagerProfile from "@/Screens/Profile/ManagerProfile";
import ClientB2BScreen from "@/Screens/ClientB2B/ClientB2B";
import ClientB2BDetailsScreen from "@/Screens/ClientB2B/ClientB2BDetailsScreen";
import Profile from "@/Screens/Profile/Profile";
import Activites from "@/Screens/Activites";
import SchedileList from "@/Screens/SchedileList";
import SetSchedulePreview from "@/Screens/SetSchedulePreview";
import Facture from "@/Screens/Gfacture/Facture";
import ClientEsoftSetting from "@/Screens/AppSettings/ClientEsoftSetting";
import SubscriptionEnded from "@/Screens/AppErrors/SubscriptionEnded";
import ApplicationData from "@/Screens/ApplicationData/ApplicationData";
import SetEmail from "@/Screens/Auth/ForgetPassword/SetEmail";
import SetCode from "@/Screens/Auth/ForgetPassword/SetCode";
import SetPwd from "@/Screens/Auth/ForgetPassword/SetPwd";
import AppNewLayout from "@/Screens/Layout/AppNewLayout";
import DashboardHome from "@/Screens/DashboardHome";
import { routes } from "./AppRoutesList";
import JourFeries from "@/Screens/JourFeries";
import SettingsProfile from "@/Screens/settings/profile";
import CommercialData from "@/Screens/settings/CommercialData/CommercialData";
import SubscriptionRequired from "@/Screens/SubscriptionRequired";
function AppRoutes() {
  return (
    <Routes>
      <Route
        path={routes.accountWaitForValidation}
        element={<AccountWaitForValidation />}
      />
      <Route path={routes.accountValidate} element={<ValidateAccount />} />
      <Route path={routes.authSigning} element={<Signing />} />
      <Route path={routes.authForgetPassword} element={<SetEmail />} />
      <Route path={routes.authSetCode} element={<SetCode />} />
      <Route path={routes.authSetPwd} element={<SetPwd />} />
      <Route path="/" element={<AppLayout />}>
        <Route index element={<LandingPage />} />

        <Route path="/app" element={<AuthProtectedRoute><AppNewLayout /> </AuthProtectedRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="managers" element={<Manager />} />
          <Route path="projects" element={<Project />} />
          <Route path="factures" element={<Facture />} />
          <Route path="client_b2b" element={<ClientB2BScreen />} />
          <Route path="concultants" element={<Concultant />} />
          <Route path="commercial-data" element={<CommercialData />} />
          <Route
            path="client_b2b_profile/:maangerId"
            element={
              <ClientB2BDetailsScreen />
            }
          />
          <Route
            path="settings-clientEsoft"
            element={
              <ClientEsoftSetting />
            }
          />
          <Route
            path={routes.profile}
            element={
              <Profile />
            }
          />
          <Route
            path={"setting-profile"}
            element={
              <SettingsProfile />
            }
          />
          <Route
            path="cra/:craId"
            element={
              <SetSchedule />
            }
          />
          <Route
            path="cra/preview/:craId"
            element={
              <SetSchedulePreview />
            }
          />
          <Route
            path="app-data"
            element={
              <ApplicationData />
            }
          />
          <Route
            path="cras"
            element={
              <SchedileList />
            }
          />
          <Route path="absences" element={
            <Absence />
          }
          />
          <Route
            path="manager_profile/:maangerId"
            element={
              <ManagerProfile />
            }
          />
          <Route path="activites" element={
            <Activites />
          } />
        </Route>
        {/**-- nnew latyout --------------------------------------------------- */}
      </Route>

      <Route path="/jourFeries" element={<JourFeries />} />
      <Route path="*" element={<Page404 />} />
      <Route path="subscription_ended" element={<SubscriptionEnded />} />
      <Route path="/activate_account/:token" element={<ActivateAccount />} />
        <Route path="/subscription-required" element={<SubscriptionRequired />} />

    </Routes>
  );
}
export default AppRoutes;
