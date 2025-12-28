import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcnuicomponents/ui/form';

import { setNoteApi } from "@/axios/AbstractionsApi/ApiFacture";
import i18n from "@/i18n";
import { get_max_exception_string, get_required_exception } from "@/lib/helpers/language_validation_helper";
import { Button } from "@/shadcnuicomponents/ui/button";
import {
    Dialog, DialogContent, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/shadcnuicomponents/ui/dialog";
import { IFature } from '@/types/AppTypes';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Textarea } from '@/shadcnuicomponents/ui/textarea';

function SetNoteFacture({ facture }: { facture: IFature }) {
    const { t } = useTranslation()
    const [IsOpen, setIsOpen] = useState(false)
    const createPaymentSchema = z.object({
        note: z
            .string({ required_error: get_required_exception(i18n.language, t("note")) })
            .min(1, { message: get_required_exception(i18n.language, t("note")) })
            .max(500, { message: get_max_exception_string(i18n.language, t("note"), 500) })
    });
    const form = useForm<z.infer<typeof createPaymentSchema>>({
        resolver: zodResolver(createPaymentSchema),
        defaultValues: {
            note: "",
        },
    });
    const queryClient = useQueryClient();

    const setNoteApiMutation = useMutation({
        mutationKey: ["setNoteApi"],
        mutationFn: (data: FormData) => setNoteApi(data),
        onSuccess: () => {
            setIsOpen(false);
            queryClient.invalidateQueries({ queryKey: ["facture_query"] })

        }
    })
    function onSubmit(values: z.infer<typeof createPaymentSchema>) {
        const data = new FormData();
        data.append("facture_id", facture.id.toString());
        data.append("note", values.note);

        setNoteApiMutation.mutate(data)
    }
    return (
        <Dialog
            open={IsOpen}
            onOpenChange={setIsOpen}
        >
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="justify-start"
                >
                    {t("set_note_to_invoice")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <DialogHeader>
                            <DialogTitle>
                                {t("set_note_to_invoice")}
                            </DialogTitle>
                        </DialogHeader>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="note"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("note")}</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder=" " {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={setNoteApiMutation.isPending}
                                >
                                    {t("btn_submit_txt")}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SetNoteFacture