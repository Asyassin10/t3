import i18n from "@/i18n";
import { IAbsenceStatus } from "@/types/AppTypes";

export function generateProjectCode(): string {
    const prefix = "code-projet-"; // 12 characters
    const totalLength = 20;        // required length BEFORE date
    const randomLength = totalLength - prefix.length;

    // generate random alphanumeric string
    const randomPart = Array.from({ length: randomLength }, () =>
        Math.random().toString(36)[2]
    ).join("");

    // format current date as "YYYY-MM-DD HH:mm:ss"
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");

    return `${prefix}${randomPart}-${formattedDate}`;
}



export const getStatusLabel = (
    status: IAbsenceStatus,
) => {
    return i18n.t(`absence_status.status.${status}`)
}
