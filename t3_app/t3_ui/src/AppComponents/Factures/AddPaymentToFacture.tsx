import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcnuicomponents/ui/form';

import { savePaymentFacture } from "@/axios/AbstractionsApi/ApiFacture";
import i18n from "@/i18n";
import { get_max_exception_string, get_required_exception } from "@/lib/helpers/language_validation_helper";
import { Button } from "@/shadcnuicomponents/ui/button";
import {
    Dialog, DialogContent, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/shadcnuicomponents/ui/dialog";
import { Input } from "@/shadcnuicomponents/ui/input";
import { IFature } from '@/types/AppTypes';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

function AddPaymentToFacture({ facture }: { facture: IFature }) {
    const { t } = useTranslation()
    const [IsOpen, setIsOpen] = useState(false)
    const createPaymentSchema = z.object({
        payment_method: z
            .string({ required_error: get_required_exception(i18n.language, t("payment_method")) })
            .min(1, { message: get_required_exception(i18n.language, t("payment_method")) })
            .max(200, { message: get_max_exception_string(i18n.language, t("payment_method"), 200) }),
        amount: z.preprocess((val) => {
            // Convert string to number
            if (typeof val === "string") return parseFloat(val);
            return val;
        }, z.number({
            required_error: get_required_exception(i18n.language, t("amount"))
        }))
    });
    const form = useForm<z.infer<typeof createPaymentSchema>>({
        resolver: zodResolver(createPaymentSchema),
        defaultValues: {
            payment_method: "",
            amount: 0,
        },
    });
    const queryClient = useQueryClient();

    const savePaymentFactureMutation = useMutation({
        mutationKey: ["savePaymentFacture"],
        mutationFn: (data: FormData) => savePaymentFacture(data),
        onSuccess: () => {
            setIsOpen(false);
            queryClient.invalidateQueries({ queryKey: ["facture_query"] })

        }
    })
    function onSubmit(values: z.infer<typeof createPaymentSchema>) {
        const data = new FormData();
        data.append("facture_id", facture.id.toString());
        data.append("payment_method", values.payment_method);
        data.append("amount", values.amount.toString());
        savePaymentFactureMutation.mutate(data)
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
                    {t("add_payment_method")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <DialogHeader>
                            <DialogTitle>
                                {t("add_payment_method")}
                            </DialogTitle>
                        </DialogHeader>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="payment_method"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("payment_method")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder=" " {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("amount")}</FormLabel>
                                        <FormControl>
                                            <Input type='number' placeholder="..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={savePaymentFactureMutation.isPending}
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

export default AddPaymentToFacture