import api_client from "../api_client";
import { generateProjectCode } from "@/lib/helpers/general_helper";
import { ICreateProjetData, IUpdateActivity } from "@/types/requests_types";
import { CreateActivite, deleteActivityRoute, DeleteProject, get_all_activites, get_all_projects, get_all_projects_non_paginated, UpdateActivite } from "../routes_api";
import { Activity, IProject } from "@/types/AppTypes";
import { getStateData } from "./Abstraction";
import { PaginatedResponse } from "@/types/PaginateTypes";
import { getProjectsResponse } from "@/types/http_types";




export const CreatrProjetApi = (values: ICreateProjetData) => {
    const jwt: string = getStateData();
    return api_client
        .post<ICreateProjetData>(
            "/projects/create_project",
            {
                client_b2b_id: values.client_b2b_id,
                project_name: values.project_name,
                dure: values.dure,
                codeprojet: generateProjectCode(),
                info: values.info,
            },
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        )
}


export const createActiviteApi = (activity_name: string, project_id: number) => {
    const jwt: string = getStateData();
    return api_client
        .post(
            CreateActivite,
            {
                activity_name,
                project_id,
            },
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        )
}


export const UpdateActivityApi = (data: IUpdateActivity) => {
    const jwt: string = getStateData();
    return api_client
        .put(
            UpdateActivite.concat("/" + data.id),
            data,
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        )
}
export const getActivities = async (): Promise<Activity[]> => {
    const jwt: string = getStateData();

    const response = await api_client.get<Activity[]>(get_all_activites, {
        headers: {
            Authorization: "Bearer " + jwt,
        },
    });

    return response.data;
};
export const getProjectsNonPaginated = async (): Promise<IProject[]> => {
    const jwt: string = getStateData();

    const response = await api_client
        .get<IProject[]>(
            get_all_projects_non_paginated,
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        );

    return response.data;
};


export const deleteActivityApi = (id: number) => {
    const jwt: string = getStateData();
    return api_client.delete(deleteActivityRoute + "/" + id, {
        headers: {
            Authorization: "Bearer " + jwt,
        },
    })

}


export const getAllProjects = async (
    page: number,
    selectedMonth?: string,
    selectedYear?: string,
    status?: string,
    clientB2b?: string,
    userId?: string,
): Promise<PaginatedResponse<getProjectsResponse>> => {
    const jwt: string = getStateData();
    const params = new URLSearchParams()
    if (selectedMonth) params.append("selectedMonth", selectedMonth);
    if (selectedYear) params.append("selectedYear", selectedYear);
    if (status) params.append("status", status);
    if (clientB2b) params.append("clientB2b", clientB2b);
    if (userId) params.append("userId", userId);
    params.append("page", page.toString())
    const response = await api_client
        .get<PaginatedResponse<getProjectsResponse>>(get_all_projects + "?" + params.toString(), {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        });
    return response.data
}

export const AssignProjectToManager = async (data: FormData): Promise<void> => {
    const jwt: string = getStateData();

    const response = await api_client
        .post(
            "/projects/assign_project_to_manager",
            data,
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        );
    return response.data
}

export const getAllProjectsStatus = async (): Promise<{ status: string[] }> => {
    const jwt: string = getStateData();

    const response = await api_client
        .get<{ status: string[] }>("/projects/get_all_project_status", {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        });
    return response.data
}

export const deleteProjetAPi = async (id: number): Promise<void> => {
    const jwt: string = getStateData();

    const response = await api_client
        .post(
            DeleteProject + id,
            { id },
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        )
    return response.data

}