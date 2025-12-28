import { Moment } from "moment";
import { Activity, ClientB2B, CRA, IAbsence, IProject, LigneDay, User } from "./AppTypes";

export interface TimeSheetResponse {
  /*   project_id:number;
    activite_id:number;
    ids_of_days:number[];
    count_of_days:number; */
  id: number
  project_id: number
  user_id: number
  activite_id: number
  ids_of_days: number[]
  count_of_days: number
  date: string
  comment?: string
  created_at: string
  updated_at: string
  ligne_date: Moment;
  time_sheet_ligne: LigneDay[]
  activite: Activity,
  project: IProject
  cra: CRA
}

export interface ProfileResponse {
  cras_count?: number
  absences_count?: number
  clients_count?: number
  consultants_count?: number
  managers_count?: number
  projects_count?: number
  factures_count?: number
  activities_count?: number
  user: User
}




export interface SaveFactureResponse {
  full_path: string;
}

export interface GeneratePdfResponse {
  message?: string;
  full_path?: string;
}


export interface GlobalSearchApiResponse {
  activities?: Activity[]
  projects?: IProject[]
  clients?: ClientB2B[]
  users?: UserGroupped | [];
  absences?: IAbsence[]
}
export interface UserGroupped {
  Manager?: User[]
  Consultant?: User[]
}