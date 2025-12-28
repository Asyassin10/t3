import { IApplicationData, User } from '@/types/AppTypes';
import { AssignedModule } from '@/types/http_types';
import { atom } from 'jotai';


// Utility function to get parsed data from localStorage
const getLocalStorageDataNotString = <T>(key: string, defaultValue: T): T => {
    const storedData = localStorage.getItem(key)?.trim();
    return storedData ? JSON.parse(storedData) : defaultValue;
};
/* const getLocalStorageDataString = (key: string, defaultValue: string) => {
    const storedData = localStorage.getItem(key);
    return storedData ? storedData : defaultValue;
};
 */
const getLocalStorageDataStringGeneric = <T>(key: string, defaultValue: T): T => {
    const storedData = localStorage.getItem(key);
    return storedData ? (JSON.parse(storedData) as T) : defaultValue;
};

const getLocalStorageDataNotJsonStringGeneric = <T>(key: string, defaultValue: T): T => {
    const storedData = localStorage.getItem(key);
    return storedData ? (storedData as T) : defaultValue;
};

export const json_t3_modules_atom = atom<AssignedModule[]>(getLocalStorageDataStringGeneric<AssignedModule[]>('t3_modules', []));
export const json_t3_user = atom<User>(getLocalStorageDataStringGeneric<User>('t3_user', {
    email: "",
    is_active: false,
    name: "",
    role: { role_name: "" },
    is_valid: false,
    is_user_completed_profile: false,
    id: 0,
}));
export const json_t3_token = atom<string>(getLocalStorageDataNotJsonStringGeneric<string>('t3_token', ""));

export const json_t3_application_data = atom<IApplicationData>(getLocalStorageDataNotString('t3_application_data', { date_of_start_sending_notifications: 0 }));
