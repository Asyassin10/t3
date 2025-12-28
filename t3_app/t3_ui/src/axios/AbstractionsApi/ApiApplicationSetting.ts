import api_client from "../api_client";
import { IApplicationData } from "@/types/AppTypes";
import { getStateData } from "./Abstraction";





export const ChangeLogoSettingMutationApi = (form_data: FormData) => {
    const jwt: string = getStateData();
    return api_client.post<IApplicationData>("/application-data/update-application-logo", form_data, {
        headers: {
            Authorization: "Bearer " + jwt,
        },
    })
}



export const getApplicationDataApi = async (): Promise<IApplicationData> => {
    const jwt: string = getStateData();

    const response = await api_client.get<IApplicationData>(
        "/application-data/get-application-data",
        {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        }
    );

    return response.data; // ✅ return IApplicationData only
};


export const updateDateOfStartSendingNotificationsApi = async (date_of_start_sending_notifications: number): Promise<IApplicationData> => {
    const jwt: string = getStateData();
    const response = api_client.post("/application-data/update-application-data", {
        date_of_start_sending_notifications: date_of_start_sending_notifications
    }, {
        headers: {
            Authorization: "Bearer " + jwt,
        },
    });
    return (await response).data;
}





export const updateKbisFile = async (form_data: FormData) => {
    const jwt: string = getStateData();
    const response = await api_client.post("/updateKbisFile", form_data, {
        headers: {
            Authorization: "Bearer " + jwt,
        },
    });
    return response.data

}