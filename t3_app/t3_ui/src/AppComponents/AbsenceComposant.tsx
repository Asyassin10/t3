import React, { useState } from "react";
import { IAbsence } from "@/types/AppTypes";

interface AbsenceProps {
    month: number;
    year: number;
    listAbsences: IAbsence[];
}

const AbsenceComposant: React.FC<AbsenceProps> = ({
    month,
    year,
    listAbsences,
}) => {
    const [days, setDays] = useState<{ [key: number]: number }>({});

    const handleDayChange = (day: number, value: number) => {
        setDays((prevDays) => ({ ...prevDays, [day]: value }));
    };

    const getDaysInMonth = (month: number, year: number) => {
        const date = new Date(year, month - 1, 1);
        const days = [];
        while (date.getMonth() + 1 === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    const getAbsenceDaysInMonth = (
        month: number,
        year: number,
        listAbsences: IAbsence[]
    ) => {
        const daysInMonth = getDaysInMonth(month, year);
        const absenceDays: { [key: number]: boolean } = {}; // Déclaration explicite du type

        listAbsences.forEach((absence) => {
            const startDate = new Date(absence.date_debut);
            const endDate = new Date(absence.date_fin);
            if (
                startDate.getMonth() + 1 === month &&
                startDate.getFullYear() === year
            ) {
                absenceDays[startDate.getDate()] = true;
            }
            if (endDate.getMonth() + 1 === month && endDate.getFullYear() === year) {
                absenceDays[endDate.getDate()] = true;
            }
            while (startDate < endDate) {
                startDate.setDate(startDate.getDate() + 1);
                if (
                    startDate.getMonth() + 1 === month &&
                    startDate.getFullYear() === year
                ) {
                    absenceDays[startDate.getDate()] = true;
                }
            }
        });

        return { daysInMonth, absenceDays };
    };

    const { daysInMonth, absenceDays } = getAbsenceDaysInMonth(
        month,
        year,
        listAbsences
    );

    return (
        <div
            className="absence"
            style={{ maxWidth: "100%", overflowX: "auto", overflowY: "auto" }}
        >
            <table style={{ width: "100%", tableLayout: "fixed" }}>
                <tbody>
                    <tr>
                        {daysInMonth.map((day, index) => (
                            <td
                                key={index}
                                style={{ width: "14.28%" }}
                                className={
                                    day.getDay() === 0 || day.getDay() === 6 ? "bg-slate-300" : ""
                                }
                            >
                                {["D", "L", "M", "M", "J", "V", "S"][day.getDay()]}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        {daysInMonth.map((day, index) => (
                            <td
                                key={index}
                                style={{ width: "14.28%" }}
                                className={
                                    day.getDay() === 0 || day.getDay() === 6 ? "bg-slate-300" : ""
                                }
                            >
                                {day.getDate()}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        {daysInMonth.map((day, index) => (
                            <td
                                key={index}
                                style={{ width: "14.28%" }}
                                className={
                                    day.getDay() === 0 || day.getDay() === 6 ? "bg-slate-300" : ""
                                }
                            >
                                {absenceDays[day.getDate()] ? (
                                    1 // Afficher 1 si une absence existe pour cette date
                                ) : (
                                    <input
                                        value={days[day.getDate()] || ""}
                                        onChange={(e) =>
                                            handleDayChange(day.getDate(), parseFloat(e.target.value))
                                        }
                                        type="hidden"
                                        style={{ width: "100%" }}
                                    />
                                )}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AbsenceComposant;