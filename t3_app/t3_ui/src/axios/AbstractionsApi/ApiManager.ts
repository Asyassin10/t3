import { CreateManagerDTO, GetManagersParams, IEditManagerApiData } from "@/types/requests_types";
import api_client from "../api_client";
import { EditManager, GetManagerProfile } from "../routes_api";
import { getStateData } from "./Abstraction";
import { Consultant, IAbsence, IManager, IProject, User } from "@/types/AppTypes";
import { PaginatedResponse } from "@/types/PaginateTypes";


export const editManagerApi = (data: IEditManagerApiData) => {
    const jwt = getStateData();

    return api_client
        .post(
            EditManager,
            {
                name: data.name,
                email: data.email,
                manager_id: data.manager_id,
            },
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        )
}


export const getManagerProfileData = async (data: FormData) => {
    const jwt = getStateData();

    const response = await api_client
        .post<{ projects: IProject[], consultants: Consultant[], absences: IAbsence[], user: User }>(GetManagerProfile, data, {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        })
    return response.data
}


export const deleteManagerApi = async (id: number): Promise<void> => {
    const jwt = getStateData();

    await api_client.post(
        `/manager/delete-manager/${id}`,
        { id },
        {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        }
    );
};

export const renotifyManagerApi = async (email: string): Promise<void> => {
    const jwt = getStateData();

    await api_client.post(
        "/managers/renotify", // replace with your ReNotifyManager constant
        { email },
        {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        }
    );
};




export const createManagerApi = async (data: CreateManagerDTO): Promise<void> => {
    const jwt = getStateData();

    await api_client.post(
        "/manager/create_manager", // replace with your CreateManager constant
        data,
        {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        }
    );
};


export const getManagersApi = async ({ page, search }: GetManagersParams): Promise<PaginatedResponse<IManager>> => {
    const jwt = getStateData();

    const params = new URLSearchParams();
    params.append("page", page.toString());
    if (search) params.append("search", search);

    const response = await api_client.get<PaginatedResponse<IManager>>(
        `/manager/get_managers?${params.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        }
    );

    return response.data;
};
export const getManagersApiNonPaginated = async (): Promise<IManager[]> => {
    const jwt = getStateData();



    const response = await api_client.get<IManager[]>(
        `/manager/get_managers_non_paginated`,
        {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        }
    );

    return response.data;
};