import api_client from "../api_client";
import { MeRoute, ProfileRoute, UpdateProfileData, UpdateProfilePassword } from "../routes_api";
import { User } from "@/types/AppTypes";
import { GlobalSearchApiResponse, ProfileResponse } from "@/types/response_types";
import { getStateData } from "./Abstraction";

export const getCurrentUser = async (): Promise<User> => {
    const jwt = getStateData();

    const response = await api_client.get<User>(
        MeRoute,
        {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        }
    );

    return response.data;
};
export const getProfileData = async (): Promise<ProfileResponse> => {
    const jwt = getStateData();

    const response = await api_client.get<ProfileResponse>(
        ProfileRoute,
        {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        }
    );

    return response.data;
};
export const updateProfileDataApi = async (data: FormData) => {
    const jwt = getStateData();

    const response = await api_client.post(
        UpdateProfileData, data,
        {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        }
    );

    return response.data;
};
export const updatePasswordDataApi = async (data: FormData) => {
    const jwt = getStateData();

    const response = await api_client.post(
        UpdateProfilePassword, data,
        {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        }
    );

    return response.data;
};

export const getAssignedUsersApi = async (): Promise<User[]> => {
    const jwt = getStateData();

    const response = await api_client
        .get<User[]>("/users/get_assigned_users", {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        })
    return response.data;
}
export const SearchGlobalApi = async (name: string): Promise<GlobalSearchApiResponse> => {
    const jwt = getStateData();
    const params = new URLSearchParams();
    params.append("name", name);

    const response = await api_client
        .get<GlobalSearchApiResponse>("/global-search?" + params.toString(), {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        })
    return response.data;
}