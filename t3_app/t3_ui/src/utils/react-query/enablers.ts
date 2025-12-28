import { json_t3_user } from "@/state/atom";
import { User } from "@/types/AppTypes";
import { getDefaultStore } from "jotai";



const getStateData = (): User => {
    const store = getDefaultStore();
    const user = store.get(json_t3_user);
    return user;
}

export const managerQueryEnables = (): boolean => {
    const user = getStateData();
    if (user.role.role_name == "Admin" || user.role.role_name == "ClientEsoft") {
        return true
    }
    return false;
}
export const get_all_client_b2b_queryEnables = (): boolean => {
    const user = getStateData();

    if (user.role.role_name == "Admin" || user.role.role_name == "ClientEsoft") {
        return true
    }
    return false;
}


export const enabler_get_consultants = (): boolean => {
    const user = getStateData();

    if (user.role.role_name != "Consultant") {
        return true
    }
    return false;
}
export const enabler_get_all_project_status = (): boolean => {
    const user = getStateData();

    if (user.role.role_name != "Consultant") {
        return true
    }
    return false;
}
export const enabler_get_assigned_users_query = (): boolean => {
    const user = getStateData();

    if (user.role.role_name != "Consultant") {
        return true
    }
    return false;
}
export const enabler_client_b2b_query = (): boolean => {
    const user = getStateData();

    if (user.role.role_name == "ClientEsoft") {
        return true
    }
    return false;
}