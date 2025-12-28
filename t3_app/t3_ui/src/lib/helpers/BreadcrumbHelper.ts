import i18n from "@/i18n";

interface Breadcrumb {
    text: string;
    title: string;

}

export function generateBreadcrumb(url: string): Breadcrumb {
    if (url.includes("cras")) {
        return {
            title: i18n.t("time"),
            text: i18n.t("cra"),
        }
    }
    if (url.includes("managers")) {
        return {
            title: i18n.t("manageement"),
            text: i18n.t("manager"),
        }
    }
    if (url.includes("projects")) {
        return {
            title: i18n.t("manageement"),
            text: i18n.t("project"),
        }
    }
    if (url.includes("factures")) {
        return {
            title: i18n.t("manageement"),
            text: i18n.t("facture"),
        }
    }
    if (url.includes("client_b2b")) {
        return {
            title: i18n.t("manageement"),
            text: i18n.t("client_b2b_link"),
        }
    }
    if (url.includes("concultants")) {
        return {
            title: i18n.t("manageement"),
            text: i18n.t("consultant"),
        }
    }
    if (url.includes("absences")) {
        return {
            title: i18n.t("manageement"),
            text: i18n.t("absence"),
        }
    }
    if (url.includes("manager_profile")) {
        return {
            title: i18n.t("manageement"),
            text: i18n.t("profile"),
        }
    }
    return {
        text: "",
        title: "",
    }
}