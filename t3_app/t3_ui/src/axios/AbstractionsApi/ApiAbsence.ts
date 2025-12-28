import { PaginatedResponse } from "@/types/PaginateTypes";
import api_client from "../api_client";
import { getStateData } from "./Abstraction";
import { IAbsence, TypeAbsence } from "@/types/AppTypes";
import { IUpdateAbsenceStatus } from "@/types/requests_types";


export const getAbsences = async (
    selectPage: number,
    selectedMonth: string | undefined,
    selectedYear: string | undefined,
    Status: string | undefined,
    UserId: string | undefined,
): Promise<PaginatedResponse<IAbsence>> => {
    const jwt: string = getStateData();
    const params = new URLSearchParams()
    params.append("page", selectPage.toString())
    if (selectedMonth) {
        params.append("selectedMonth", selectedMonth.toString())
    }
    if (selectedYear) {
        params.append("selectedYear", selectedYear.toString())
    }
    if (Status) {
        params.append("Status", Status.toString())
    }
    if (UserId) {
        params.append("UserId", UserId.toString())
    }


    const response = await api_client
        .get<PaginatedResponse<IAbsence>>(
            "/absence/get_absence_of_user?" + params.toString(),
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        );
    return response.data;

}
export const getAbsenceTypeApi = async (): Promise<TypeAbsence[]> => {
    const jwt: string = getStateData();

    const response = await api_client
        .get<TypeAbsence[]>("/absence/get_absence_types", {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        });
    return response.data;

}



export const updateAbsenceAPi = async (data: IUpdateAbsenceStatus): Promise<IAbsence> => {
    const jwt: string = getStateData();

    const response = await api_client
        .post<IAbsence>("/absence/update_absence", data, {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        });
    return response.data;

}

export const getAllAbsenceStatus = async (): Promise<{ status: string[] }> => {
    const jwt: string = getStateData();

    const response = await api_client
        .get<{
            status: string[];
        }>("/absence/get_all_absence_status", {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        });
    return response.data;
}


export const createAbsenceRequestApi = async (data: FormData) => {
    const jwt: string = getStateData();

    const response = await api_client
        .post(
            "/absence/create_absence_request",
            data,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        )
    return response.data

}