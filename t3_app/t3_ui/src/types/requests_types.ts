import { IAbsenceStatus } from "./AppTypes";



export interface IEditManagerApiData {
    email: string;
    name: string;
    manager_id: number
}
export interface IEditClientB2bApiData {
    name: string;
    id: number
}

export interface updateCommercialDataOfClientApiData {
    data: BaseKeyValue[];
    client_b2b_id: number
}



export interface BaseKeyValue {
    key: string;
    value: string;
}
export interface ICreateProjetData {
    client_b2b_id: string;
    project_name: string;
    dure: string;
    codeprojet: string;
    info: string;
}

export interface IActivityBase {
    activity_name: string;
    project_id: number;
}

export interface ICreateActivity extends IActivityBase { }

export interface IUpdateActivity extends IActivityBase {
    id: number;
}


export interface IUpdateAbsenceStatus { id: number; status: IAbsenceStatus }
export interface CreateManagerDTO {
    name: string;
    email: string;
}
export interface GetManagersParams {
    page: number;
    search?: string;
}

export interface SaveFactureDTO {
    year: string;
    month: string;
    client_id: string;
}


export interface GeneratePdfParams {
    id: number;
    month: number;
    year: number;
}