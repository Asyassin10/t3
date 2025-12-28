import { IProject, User } from "./AppTypes";

// authentication
export interface AuthApiLoginOkResponse {
  status: boolean;
  message: string;
  token: string;
  user: User;
  client_esoft: ClientEsoft;
  assigned_modules: AssignedModule[]
}
export interface ModuleApp {
  id: number
  module_name: string
  description: string
  full_name: string
  created_at: string
  updated_at: string
}
export interface AssignedModule {
  id: number
  assigned_module_name: string
  created_at: string
  updated_at: string
}
interface ClientEsoft {
  id: number
  created_at: string
  updated_at: string
  user_id: number
  kbis_file: string
  app_api_key: string
  user_subscriptionplan_date_start: string
  user_subscriptionplan_date_end: string
}
export interface AuthApiLoginCostomError {
  status: string;
  message: string;
}

export interface ValidationErrorRequest {
  message: string;
  errors?: Record<string, string[]>;
}


export interface getProjectsResponse extends IProject {
  consultants: {
    user: User;
  }[]
}