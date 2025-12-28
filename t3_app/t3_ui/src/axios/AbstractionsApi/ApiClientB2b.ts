import { IEditClientB2bApiData, updateCommercialDataOfClientApiData } from "@/types/requests_types"
import api_client from "../api_client"
import { create_client_b2b, delete_clientB2b, get_all_client_b2b, update_client_b2b_uri, updateCommercialDataOfClientApiRoute } from "../routes_api"

import { getStateData } from "./Abstraction";
import { ClientB2B } from "@/types/AppTypes";
import { PaginatedResponse } from "@/types/PaginateTypes";

export const editClientB2bApi = (data: IEditClientB2bApiData) => {
    const jwt = getStateData();

    return api_client
        .post(
            update_client_b2b_uri + "/" + data.id,
            {
                name: data.name,
            },
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        )
}
export const updateCommercialDataOfClientApi = (data: updateCommercialDataOfClientApiData) => {
    const jwt = getStateData();

    return api_client
        .post(
            updateCommercialDataOfClientApiRoute,
            {
                client_b2b_id: data.client_b2b_id,
                data: data.data
            },
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        )
}


export const getAllClientsApi = async (selectPage: number, value: string): Promise<PaginatedResponse<ClientB2B>> => {
    const jwt = getStateData();
    const params = new URLSearchParams()
    params.append("page", selectPage.toString())
    if (value.length > 0) {
        params.append("value", value.toString())
    }
    const response = await api_client
        .get<PaginatedResponse<ClientB2B>>(
            get_all_client_b2b + "?" + params.toString(),
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        )
    return response.data;

}



export const getAllClientB2BApiQuery = async (): Promise<PaginatedResponse<ClientB2B>> => {
    const jwt = getStateData();

    const response = await api_client.get<PaginatedResponse<ClientB2B>>(
        "/client_b2b/get_all_client_b2b",
        {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        }
    );

    return response.data;
};
export const createClientApi = async (name: string) => {
    const jwt = getStateData();

    const response = await api_client
        .post(
            create_client_b2b,
            {
                name: name,
            },
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        );
    return response.data;
}
export const deleteClientApi = async (id: string) => {
    const jwt = getStateData();

    const response = await api_client
        .post(
            delete_clientB2b + '/' + id,
            { id },
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        )
    return response.data;
}


