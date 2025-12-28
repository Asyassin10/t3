import { Button } from "@/shadcnuicomponents/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shadcnuicomponents/ui/popover";
import { IFature } from "@/types/AppTypes";
import { Ellipsis } from "lucide-react";
import AddPaymentToFacture from "./AddPaymentToFacture";
import SetNoteFacture from "./SetNoteFacture";
import MakeFacturePaid from "./MakeFacturePaid";

function FactureOptions({ facture }: { facture: IFature }) {

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="mx-4">
                    <Ellipsis />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
                <div className="flex flex-col gap-2">

                    <AddPaymentToFacture facture={facture} />
                    <SetNoteFacture facture={facture} />
                    <MakeFacturePaid facture={facture} />
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default FactureOptions;
