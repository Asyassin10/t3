import { Moment } from "moment";
import { daysOfWeek } from "../types/Contant";
import { Ligne } from "@/types/AppTypes";

export const getDeyIndexOfTheWeek = (date:Moment):number => {
    return daysOfWeek.indexOf(date.format("dddd"))
}

export const IsDayBetweenTwoDays = (event_start:Moment,event_end:Moment,day:Moment):boolean => {
    return day.isSameOrBefore(event_start, 'day') && day.isSameOrBefore(event_end, 'day');

}

export const CaluclateStatsOfTimes = (data_times:Ligne[]) : void =>{
    console.log(data_times)
}