import { Moment } from "moment";
import { getProjectsResponse } from "./http_types";
export interface IApplicationData {
  date_of_start_sending_notifications: number;
  logo?: string;
}

export interface Day {
  day_name: string;
  day_full_date: Moment;
  day_abr: string;
  is_in_month: boolean;
  is_before_month: boolean;
  is_after_month: boolean;
  is_jour_ferier: boolean;
}
export interface Event {
  day_start: Moment;
  day_end: Moment;
  title: string;
}
export interface Calendar {
  Event?: Event[];
  days?: Day[];
}
export interface LigneDay {
  app_id: number;
  value: string;
  is_week_end: boolean;
  is_disabled: boolean;
  rest_acceptable: number;
  id?: number;
  is_jour_ferier: boolean;


  time_sheet_id?: number;
}
export interface Ligne {
  days: LigneDay[];
  project_title: string;
  activity_title: string;
  ids_of_days: number[];
  count_of_days: number;
  id?: number;
  comment?: string;
}
export interface Activite {
  title: string;
  type: string;
}
export interface ActiviteCategory {
  project_title: string;
  category: string;
}

export interface IProject {
  id: number;
  client_b2b_id: number;
  project_name: string;
  info: string;
  codeprojet: string;
  dure: number;
  activities?: Activity[];
  project_b_to_b?: ClientB2B;
  status: string;
  manager?: IManager;
}

export interface Activity {
  id: number;
  created_at: string;
  updated_at: string;
  activity_name: string;
  project_id: number;
  project?: IProject
  user?: User
}

// clientesoft.ts
export interface ClienteSoft {
  id: number;
  user: User;
}

// managers.ts
export interface IManager {
  id: number;
  user: User;
  client_esoft: ClienteSoft;
}
// managers.ts
export interface IFature {
  id: number;
  numero_facture: string;
  year: number;
  date_facture: string;
  nombre_consultant: number;
  month: number;
  client_esoft: ClienteSoft;
  client_b2b: ClientB2B;
  manager: IManager;
  status: string
  paid_at: string | null
  note: string | null
}

// consultants.ts
export interface Consultant {
  id: number;
  managers_id: number;
  user_id: number;
  projects_count?: number;
  professionality: string;
  user: User;
  projects?: IProject[];
}
export interface ErrorsByKey {
  [key: string]: string[] | undefined;
}
export interface ErrorObject {
  issues: Issue[];
}
export interface Issue {
  path: string[];
  message: string;
}
// clientb2b.ts
export interface ClientB2B {
  id: number;
  client_b2b_name: string;
  commercial_data?: IkeyValue[]
}

export interface IkeyValue {
  key: string;
  value: string;
  id: number;
}


// joursferies.ts
export interface JourFerie {
  id: number;
  libelle: string;
  date: string; // Format YYYY-MM-DD
}

// modules.ts
/* export interface Module {
  id: number;
  clientesoft_id: number;
  etat: 0 | 1; // 0 ou 1
  libelle: string;
} */

// consultants_projets.ts
export interface ConsultantProjet {
  id: number;
  projets_id: number;
  consultants_id: number;
  duree: number;
}

// activites.ts
export interface Activit {
  id: number;
  consultants_projets_id: number;
  mois: string;
  nbre_jour: number;
  etat: "validé" | "refusé" | "encours" | "envoyé";
}

// timing.ts
export interface Timing {
  id: number;
  activites_id: number;
  datesaisie: string; // Format YYYY-MM-DD
}
export interface User {
  name: string;
  email: string;
  role: Role;
  is_valid: boolean;
  is_active: boolean;
  is_user_completed_profile: boolean;
  id: number;
}
export interface Role {
  role_name: RoleText;
}
export interface CRA {
  id: number;
  time_sheet_id: number;
  user_id: number;
  number_of_days_filled: number | null;
  number_of_days_available: number | null;
  is_sent_to_validation: number;
  is_validated: number;
  date_sent_to_validation?: string;
  date_validation?: string;
  status: CRAStatus;
  created_at: string;
  updated_at: string;
  user?: User;
}
export type CRAStatus =
  | "WAITING_TO_VALIDATION"
  | "VALIDATED"
  | "NOT_SENT_TO_VALIDATION_YET";

export interface IAbsence {
  id: number;
  nombre_des_jours: number;
  reason: string;
  date_debut: string;
  date_fin: string;
  date_exacte: string;
  date_validation: string;
  status: IAbsenceStatus;
  is_valid: boolean;
  type_absence_id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  type_absence: TypeAbsence;
  user?: User;
}
export type IAbsenceStatus = "VALID" | "NOT_VALID" | "PENDING";
export interface TypeAbsence {
  id: number;
  label_type_absence: string;
  created_at: string;
  updated_at: string;
}
export type RoleText = "Admin" | "Manager" | "Consultant" | "ClientEsoft" | "";

export interface AppLink {
  title: string;
  href: string;
  isActive: boolean;
  supportedRoles: RoleText[];
  isAccessible: boolean;
}

export type langApp = "fr" | "en";

export interface QueryObjectProjet {
  data: getProjectsResponse[];
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}
export interface QueryObjectManagers {
  data: IManager[];
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}
export interface QueryObjectFatures {
  data: IFature[];
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}
export interface QueryObject<T> {
  data: T[];
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface JourFerier {
  id: number
  jourferiers_date: number
  created_at: string
  updated_at: string
  description: string
  number_days: number
}

export interface Module {
  module_name: string
  full_name: string
  description: string
}

export interface BreadCrumb {
  category: string;
}

export interface IpaymentFacture {
  facture_id: number
  reference: string
  amount: number
  currency: string
  payment_method: string
  updated_at: string
  created_at: string
  id: number
}
