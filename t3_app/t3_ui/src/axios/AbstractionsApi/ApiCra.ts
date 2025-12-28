import api_client from "../api_client";
import { PaginatedResponse } from "@/types/PaginateTypes";
import { CRA, IAbsence, JourFerier, Ligne } from "@/types/AppTypes";
import { getStateData } from "./Abstraction";
import { DeleteTimeLigne, GET_ABSENCE_OF_DATE_MONTH_AND_YEAR, SAVING_TIME_LIGNE_URI, SendCraToValidationApi, UndoSendCraToValidationApi, UpdateCommentOfTimeLigne } from "../routes_api";
import moment from "moment";
import { TimeSheetResponse } from "@/types/response_types";



export const does_it_have_data_in_the_current_time_query_api = async (): Promise<{ state: boolean }> => {
    const jwt: string = getStateData();

    const response = await api_client
        .get<{ state: boolean }>(
            "/time_sheet/does_it_have_data_in_the_current_time",
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        );
    return response.data;
};
export const getMyCrasApi = async (selectPage: number, selectedMonth: string | undefined, selectedYear: string | undefined): Promise<PaginatedResponse<CRA>> => {
    const jwt: string = getStateData();
    const params = new URLSearchParams();
    if (selectPage) params.append('page', selectPage.toString());
    if (selectedMonth) params.append('page', selectedMonth.toString());
    if (selectedYear) params.append('page', selectedYear.toString());

    const response = await api_client
        .get<PaginatedResponse<CRA>>(
            "/time_sheet/get_cra_of_me?" + params.toString(),
            {
                params: {
                    page: selectPage,
                    selectedMonth,
                    selectedYear,
                },
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        );
    return response.data;
};

export const initCraApi = async (): Promise<CRA> => {
    const jwt: string = getStateData();

    const response = await api_client.post<CRA>(
        "/time_sheet/init_cra",
        {},
        {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        }
    );

    return response.data; // return only the CRA data
};

export const getHolidaysApi = async (): Promise<JourFerier[]> => {
    const jwt: string = getStateData();

    const response = await api_client.get<JourFerier[]>("/holidays/current-month", {
        headers: {
            Authorization: "Bearer " + jwt,
        },
    });

    return response.data;
};
export const getCra = async (craId: string): Promise<CRA> => {
    const jwt: string = getStateData();

    const response = await api_client
        .get<CRA>(
            "/time_sheet/get_cra/" + craId,
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        );

    return response.data;
};


/* export const UpdateCommentOfTimeLigneApi = async (data: FormData): Promise<Ligne> => {
    const jwt: string = getStateData();

    const response = await api_client
        .post<Ligne>(
            UpdateCommentOfTimeLigne,
            data,
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        )
    return response.data;

} */



export const UpdateCommentOfTimeLigneApi = async (data: FormData): Promise<Ligne> => {
    const jwt: string = getStateData();

    const response = await api_client
        .post<Ligne>(
            UpdateCommentOfTimeLigne,
            data,
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        )
    return response.data;
}



export const fetchAbsenceCountApi = async (craId: string): Promise<IAbsence[]> => {
    const currentDate = moment(); // Get current date

    const jwt: string = getStateData();
    const response = await api_client
        .post<IAbsence[]>(
            GET_ABSENCE_OF_DATE_MONTH_AND_YEAR,
            {
                month: currentDate.format("MM"),
                year: currentDate.format("YYYY"),
                id: craId,
            },
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        );
    return response.data
}
export const SendCraToValidationApiAction = async (): Promise<CRA> => {
    const jwt: string = getStateData();

    const response = await api_client
        .post<CRA>(SendCraToValidationApi, null, {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        })
    return response.data;
}
export const UndoSendCraToValidationApiAction = async (): Promise<CRA> => {
    const jwt: string = getStateData();

    const response = await api_client
        .post<CRA>(UndoSendCraToValidationApi, null, {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        })
    return response.data;
}
export const DeleteLigneApi = async (id: number): Promise<void> => {
    const jwt: string = getStateData();

    const response = await api_client
        .delete(DeleteTimeLigne, {
            headers: {
                Authorization: "Bearer " + jwt,
            },
            data: {
                time_ligne_id: id,
            },
        })
    return response.data;
}

export const fetchHolidaysApi = async (): Promise<JourFerier[]> => {
    const jwt: string = getStateData();

    const response = await api_client.get<JourFerier[]>("/holidays/current-month", {
        headers: {
            Authorization: "Bearer " + jwt,
        },
    })
    return response.data
}
export const setGlobalAvailableDaysCountApi = (
    GlobalAvailableDaysCountValue: number | null | undefined,
    CurrentAvailableDaysCountValue: number | null | undefined,
    Progresse: number | null | undefined,
    craId: string | undefined
): void => {
    const jwt: string = getStateData();

    api_client.post("/time_sheet/UpdateNumbersDaysOfCra", {
        cra_id: craId,
        number_of_days_available: GlobalAvailableDaysCountValue,
        number_of_days_filled: CurrentAvailableDaysCountValue,
        progress: Progresse,
    }, {
        headers: {
            Authorization: "Bearer " + jwt,
        },
    })
}


export const saveTimeLigneApi = async (data: FormData): Promise<TimeSheetResponse> => {

    const jwt: string = getStateData();

    const response = await api_client
        .post<TimeSheetResponse>(
            SAVING_TIME_LIGNE_URI,
            data,
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        );
    return response.data;
}