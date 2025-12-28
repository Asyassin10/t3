import { BaseKeyValue } from "@/types/requests_types";
import { getAppCommercialDataApiRoute, setAppCommercialDataApiRoute } from "../routes_api";
import api_client from "../api_client";

import { getStateData } from "./Abstraction";



export const getAppCommercialDataApi = async (): Promise<BaseKeyValue[]> => {
    const jwt = getStateData();

    const response = await api_client.get<BaseKeyValue[]>(
        getAppCommercialDataApiRoute,
        {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        }
    );

    return response.data;
};
export const setAppCommercialDataApi = async (data: BaseKeyValue[]) => {
    const jwt = getStateData();

    const response = await api_client.post(
        setAppCommercialDataApiRoute,
        { data: data },
        {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        }
    );

    return response.data;
};
