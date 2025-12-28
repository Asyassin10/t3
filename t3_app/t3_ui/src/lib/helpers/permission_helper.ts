import { User } from "@/types/AppTypes";

export function IsVisibleForThisUser(user: User): boolean {
    if (user) {
        return false;
    }
    return false;
}

