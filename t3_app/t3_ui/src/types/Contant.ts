import { ActiviteCategory, AppLink } from "./AppTypes";
import { ModuleApp } from "./http_types";

export const daysOfWeek: string[] = [
  "Monday", //0
  "Tuesday", // 1
  "Wednesday", // 2
  "Thursday", // 3
  "Friday", // 4
  "Saturday", // 5
  "Sunday", // 6
];
export const daysOfWeekInFrensh: string[] = [
  "Lundi", // Monday
  "Mardi", // Tuesday
  "Mercredi", // Wednesday
  "Jeudi", // Thursday
  "Vendredi", // Friday
  "Samedi", // Saturday
  "Dimanche", // Sunday
];
//TypeActivite
export const TypeActivite: string[] = ["Absence", "Interne"];
export const ActiviteCategoryList: ActiviteCategory[] = [
  {
    project_title: "Interne",
    category: "int 01",
  },
  {
    project_title: "Interne",
    category: "int 02",
  },
  {
    project_title: "Interne",
    category: "int 03",
  },
  {
    project_title: "Absence",
    category: "",
  },
];
export const URL = "http://localhost:3000/";

const modules_json = localStorage.getItem("t3_modules");
const modules: ModuleApp[] | null = modules_json ? JSON.parse(modules_json) : null;
export const topNav: AppLink[] = [
  {
    title: "projects", // public
    href: "/projects",
    isActive: true,
    supportedRoles: ["ClientEsoft", "Manager", "Consultant"],
    isAccessible: true
  },
  {
    title: "managers",// public
    href: "/managers",
    isActive: true,
    supportedRoles: ["ClientEsoft"],
    isAccessible: true

  },
  {
    title: "factures",
    href: "/factures",
    isActive: true,
    supportedRoles: ["ClientEsoft", "Manager", "Admin"],
    isAccessible: modules?.find(mod => mod.module_name == "GFACT") ? true : false
  },
  {
    title: "clients",// public
    href: "/client_b2b",
    isActive: true,
    isAccessible: true,
    supportedRoles: ["ClientEsoft"],
  },
  {
    title: "consultant",// public
    href: "/concultants",
    isActive: true,
    supportedRoles: ["ClientEsoft"],
    isAccessible: true

  },
  {
    title: "mes temps",
    href: "/cras",
    isActive: true,
    supportedRoles: ["Consultant", "Manager", "ClientEsoft"],
    // isAccessible: modules?.some(mod => mod.module_name == "CRA") ? true : true
    isAccessible: modules?.find(mod => mod.module_name == "CRA") ? true : false

  },

  {
    title: "absences",
    href: "/absences",
    isActive: true,
    supportedRoles: ["ClientEsoft", "Manager", "Consultant"],
    isAccessible: modules?.find(mod => mod.module_name == "ABS") ? true : false
  },

];

export const ApplicationName = "T3";