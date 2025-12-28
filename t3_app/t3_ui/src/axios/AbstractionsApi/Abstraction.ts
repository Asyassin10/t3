import { json_t3_token } from "@/state/atom";
import { getDefaultStore } from "jotai";

export const getStateData = (): string => {
    const store = getDefaultStore();
    const token = store.get(json_t3_token);
    return token;
}