export function noDataMessage(lang: string, key: string): string {
    if (lang != "fr" && lang != "en") {
        return "";
    }
    if (lang == "en") {
        return " you have no " + key;
    } else if (lang == "fr") {
        return "Vous n'avez pas de " + key;
    }
    return "";
}

export function deleteConfirmationMessage(lang: string, resource_name: string): string {
    if (lang != "fr" && lang != "en") {
        return "";
    }
    if (lang == "en") {
        return "are yoy sur you want to delete " + resource_name;
    } else if (lang == "fr") {
        return "êtes-vous sûr de vouloir supprimer " + resource_name;
    }
    return "";
}


export function objectCreatedSuccessfully(lang: string, resource_name: string): string {
    if (lang != "fr" && lang != "en") {
        return "";
    }
    if (lang == "en") {
        return "The " + resource_name + " was created successfully.";
    } else if (lang == "fr") {
        return "Le " + resource_name + " a été créé avec succès.";
    }
    return "";
}
export function objectUpdatedSuccessfully(lang: string, resource_name: string): string {
    if (lang != "fr" && lang != "en") {
        return "";
    }
    if (lang == "fr") {
        return "Le " + resource_name + " a été mis à jour avec succès.";
    }
    if (lang == "en") {
        return "The " + resource_name + " was updated successfully.";

    }
    return "";
}

export function objectDeletedSuccessfully(lang: string, resource_name: string): string {
    if (lang != "fr" && lang != "en") {
        return "";
    }
    if (lang == "en") {
        return "The " + resource_name + " was deleted successfully.";
    } else if (lang == "fr") {
        return "Le " + resource_name + " a été supprimé avec succès.";
    }
    return "";
}

export function get_required_exception(lang: string, key: string): string {
    if (lang != "fr" && lang != "en") {
        return "";
    }
    if (lang == "en") {
        return "the " + key + " is required"
    } else if (lang == "fr") {
        return key + " est requis"
    }
    return "";
}
export function get_required_select_exception(lang: string, key: string): string {
    if (lang != "fr" && lang != "en") {
        return "";
    }
    if (lang == "en") {
        return "Please select a  " + key;
    } else if (lang == "fr") {
        return "Veuillez sélectionner " + key;
    }
    return "";
}
export function get_min_exception_string(lang: string, key: string, min: number): string {
    if (lang !== "fr" && lang !== "en") {
        return "";
    }

    if (lang === "en") {
        return "the value of " + key + " must be at least " + min + " characters";
    } else if (lang === "fr") {
        return "la valeur de " + key + " doit contenir au moins " + min + " caractères";
    }

    return "";
}

export function get_max_exception_string(lang: string, key: string, max: number): string {
    if (lang != "fr" && lang != "en") {
        return "";
    }
    if (lang == "en") {
        return "the value of " + key + " cant't pass " + max + " charachter";
    } else if (lang == "fr") {
        return "le maximum " + key + "ne peut pas dépasser " + max + " caractères"
    }
    return "";
}
export function get_invalid_data_exception(lang: string, key: string): string {
    if (lang != "fr" && lang != "en") {
        return "";
    }
    if (lang == "en") {
        return "the " + key + " is invalid";
    } else if (lang == "fr") {
        return key + " n'est pas valide";
    }
    return "";
}