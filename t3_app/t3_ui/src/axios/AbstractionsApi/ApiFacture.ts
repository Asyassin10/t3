import { GeneratePdfParams, SaveFactureDTO } from "@/types/requests_types";
import api_client from "../api_client";
import { getStateData } from "./Abstraction";
import { GeneratePdfResponse, SaveFactureResponse } from "@/types/response_types";
import { IFature, IpaymentFacture } from "@/types/AppTypes";
import { PaginatedResponse } from "@/types/PaginateTypes";

export const SaveFactureApi = async (data: FormData): Promise<{ full_path: string }> => {
    const jwt: string = getStateData();
    const response = await api_client
        .post<{ full_path: string }>(
            "/facture/save_facture",
            data,
            {
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            }
        )
    return response.data
}



export const saveFacturesOfClientsApi = async (data: SaveFactureDTO): Promise<SaveFactureResponse> => {
    const jwt = getStateData();

    const response = await api_client.post<SaveFactureResponse>(
        "/facture/save_factures_of_clients",
        data,
        {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        }
    );

    return response.data;
};

export const generatePdfApi = async ({ id, month, year }: GeneratePdfParams): Promise<GeneratePdfResponse> => {
    const jwt = getStateData();

    const response = await api_client.post<GeneratePdfResponse>(
        "/facture/generate-pdf",
        {
            month,
            year,
            facture_id: id,
        },
        {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        }
    );

    return response.data;
};

export const deletePdfApi = async (pdfUrl: string): Promise<void> => {
    const jwt = getStateData();

    await api_client.post(
        "/facture/deletePdf",
        {
            app_url: pdfUrl,
            ahmec: "Ddd",
        },
        {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        }
    );
};


export const getAllFactures = async (selectPage: number,
    selectedMonth: string | undefined,
    clientB2b: string | undefined,
    selectedYear: string | undefined
) => {
    const jwt = getStateData();
    const params = new URLSearchParams();
    params.append("selectPage", selectPage.toString());

    if (selectedMonth) {
        params.append("selectedMonth", selectedMonth);
    }

    if (selectedYear) {
        params.append("selectedYear", selectedYear);
    }

    if (clientB2b) {
        params.append("clientB2b", clientB2b);
    }
    const response = await api_client
        .get<PaginatedResponse<IFature>>("/facture/get_factures" + "?" + params.toString(), {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        });
    return response.data;
}


export const savePaymentFacture = async (data: FormData): Promise<IpaymentFacture> => {
    const jwt = getStateData();

    const response = await api_client
        .post<IpaymentFacture>("/payments_factures/save", data, {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        });
    return response.data;
}

export const setNoteApi = async (data: FormData): Promise<IFature> => {
    const jwt = getStateData();

    const response = await api_client
        .post<IFature>("/facture/save-note", data, {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        });
    return response.data;
}
export const MakeFacturePaidApi = async (data: FormData): Promise<IFature> => {
    const jwt = getStateData();

    const response = await api_client
        .post<IFature>("/facture/make-it-paid", data, {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        });
    return response.data;
}