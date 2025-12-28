import api_client from "../api_client";
import { ListAssignedModulesApiRoute } from "../routes_api";
import { AssignedModule } from "@/types/http_types";

import { getStateData } from "./Abstraction";

export const getAssignedModules = async (): Promise<AssignedModule[]> => {
    const jwt = getStateData();

    const response = await api_client.get<AssignedModule[]>(
        ListAssignedModulesApiRoute,
        {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        }
    );

    return response.data;
};
