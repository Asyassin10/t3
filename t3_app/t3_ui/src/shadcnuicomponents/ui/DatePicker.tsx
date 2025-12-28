;

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/shadcnuiutils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shadcnuicomponents/ui/popover";
import { Button } from "@/shadcnuicomponents/custom/button";
import { Calendar } from "@/shadcnuicomponents/ui/calendar";

import { fr } from "date-fns/locale";

// Ajoutez une prop pour la fonction de rappel
export function DatePicker({
  className,
  onDateChange, // Ajoutez cette ligne
}: React.HTMLAttributes<HTMLDivElement> & {
  onDateChange: (date: DateRange | undefined) => void;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });

  // Utilisez la fonction de rappel pour passer les données de date sélectionnées au composant parent
  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: fr })} -{" "}
                  {format(date.to, "LLL dd, y", { locale: fr })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: fr })
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange} // Utilisez handleDateChange ici
            numberOfMonths={2}
            locale={fr}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}