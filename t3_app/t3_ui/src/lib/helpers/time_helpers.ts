
import i18n from "@/i18n";
import moment from "moment"

export const loadYears = (end_year: number): number[] => {
    const lunch_year = 2024;
    const init_results_year: number[] = [];
    const currentTime = moment()
    const currentYear = currentTime.year()

    const startYear = currentYear + end_year;
    for (let index = lunch_year; index < startYear; index++) {
        init_results_year.push(index)
    }

    return init_results_year;
}

export interface MonthApp {
    month_name: string;
    month_number: number;
}
export const loadMonths = (): MonthApp[] => {
    return [
        {
            month_name: i18n.t("m01"),
            month_number: 1
        },
        {
            month_name: i18n.t("m02"),
            month_number: 2
        },
        {
            month_name: i18n.t("m03"),
            month_number: 3
        },
        {
            month_name: i18n.t("m04"),
            month_number: 4
        },
        {
            month_name: i18n.t("m05"),
            month_number: 5
        },
        {
            month_name: i18n.t("m06"),
            month_number: 6
        },
        {
            month_name: i18n.t("m07"),
            month_number: 7
        },
        {
            month_name: i18n.t("m08"),
            month_number: 8
        },
        {
            month_name: i18n.t("m09"),
            month_number: 9
        },
        {
            month_name: i18n.t("m10"),
            month_number: 10
        },
        {
            month_name: i18n.t("m11"),
            month_number: 11
        },
        {
            month_name: i18n.t("m12"),
            month_number: 12
        },
    ]
}

