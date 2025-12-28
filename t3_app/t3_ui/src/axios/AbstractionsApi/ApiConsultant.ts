import { Consultant } from "@/types/AppTypes";
import api_client from "../api_client";
import { getStateData } from "./Abstraction";
import { PaginatedResponse } from "@/types/PaginateTypes";
import { create_consultant, get_consultants } from "../routes_api";

export const getAllConcultantApi = async (selectPage: number, value: string): Promise<PaginatedResponse<Consultant>> => {
    const jwt = getStateData();
    const params = new URLSearchParams()
    params.append("page", selectPage.toString())
    if (value.length > 0) {
        params.append("value", value.toString())
    }
    const response = await api_client
        .get<PaginatedResponse<Consultant>>(
            get_consultants + "?" + params.toString(),
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        );
    return response.data;

}
export const getAllConcultantApiNonPaginated = async (selectPage: number, value: string): Promise<Consultant[]> => {
    const jwt = getStateData();
    const params = new URLSearchParams()
    params.append("page", selectPage.toString())
    if (value.length > 0) {
        params.append("value", value.toString())
    }
    const response = await api_client
        .get<Consultant[]>(
            "/consultant/get_consultants_non_paginated" + "?" + params.toString(),
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        );
    return response.data;

}



export const createConsultantApi = async (data: FormData) => {
    const jwt = getStateData();

    const response = await api_client
        .post(
            create_consultant,
            data,
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        )
    return response.data;
}
export const AssignConsultantToProjetApi = async (data: FormData) => {
    const jwt = getStateData();

    const response = await api_client
        .post(
            "/consultant/assign_concultant_to_project",
            data,
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        );
    return response.data;
}