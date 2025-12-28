export function ObjectCreatedSuccessfullyWithoutDescription(lang: string, key: string) {
    if (lang != "fr" && lang != "en") {
        return "";
    }
    if (lang == "en") {
        return key + " has been created successfully";
    } else if (lang == "fr") {
        return key + " est créée avec succès";
    }
    return "";
}



export function ObjectValidatedWithSuccess(lang: string, key: string) {
    if (lang != "fr" && lang != "en") {
        return "";
    }
    if (lang == "en") {
        return key + " has been validated successfully";
    } else if (lang == "fr") {
        return key + " a été validé avec succès";
    }
    return "";
}

export function ObjectPendingWithSuccess(lang: string, key: string) {
    if (lang != "fr" && lang != "en") {
        return "";
    }
    if (lang == "en") {
        return key + " has been reset successfully";
    } else if (lang == "fr") {
        return key + " a été réinitialisé avec succès";
    }
    return "";
}
export function ObjectNonValidWithSuccess(lang: string, key: string) {
    if (lang != "fr" && lang != "en") {
        return "";
    }
    if (lang == "en") {
        return key + " has been rejected successfully";
    } else if (lang == "fr") {
        return key + " a été rejeté avec succès";
    }
    return "";
}

