import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shadcnuicomponents/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shadcnuicomponents/ui/form";
import { Button } from "@/shadcnuicomponents/custom/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClientB2B } from "@/types/AppTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IEditClientB2bApiData } from "@/types/requests_types";
import { editClientB2bApi } from "@/axios/AbstractionsApi/ApiClientB2b";
import { Input } from "@/shadcnuicomponents/ui/input";
import { toast } from "@/shadcnuicomponents/ui/use-toast";
import { ValidationErrorRequest } from "@/types/http_types";
import { AxiosError } from "axios";
import i18n from "@/i18n";
import { get_max_exception_string, get_min_exception_string } from "@/lib/helpers/language_validation_helper";
function UpdateClientB2b({ clientB2b }: { clientB2b: ClientB2B }) {

    const { t } = useTranslation()
    const [IsAlertOpen, setIsAlertOpen] = useState(false);

    const updateClientB2bSchema = z.object({
        name: z
            .string({
                required_error: t("validation.string.empty", { field: t("name") })
            })
            .max(200, { message: get_max_exception_string(i18n.language, t("name"), 200) })
            .min(1, { message: get_min_exception_string(i18n.language, t("name"), 1) }),
    });
    const form = useForm<z.infer<typeof updateClientB2bSchema>>({
        resolver: zodResolver(updateClientB2bSchema),
        defaultValues: {
            name: clientB2b.client_b2b_name,
        },
    });
    const queryClient = useQueryClient();

    const EditClientB2bMutation = useMutation({
        mutationKey: ["edit-client-b2b" + clientB2b.id],
        mutationFn: ({ id, name }: IEditClientB2bApiData) =>
            editClientB2bApi({ id, name }),
        onSuccess: () => {
            setIsAlertOpen(false);
            toast({
                title: t("manager_updated_successfully"),
                className: "bg-emerald-500",
                variant: "default",
            });
            queryClient.invalidateQueries({
                queryKey: ["client_b2b_query", 0],
            });
        },
        onError: (err: AxiosError<ValidationErrorRequest>) => {
            setIsAlertOpen(false);
            toast({
                title: t("general_error"),
                description: err.response?.data.message,
                className: "bg-red-500",
                variant: "default",
            });
        }
    })
    function onSubmit(values: z.infer<typeof updateClientB2bSchema>) {
        EditClientB2bMutation.mutate({ id: clientB2b.id, name: values.name })
    }

    return (
        <Dialog
            open={IsAlertOpen}
            onOpenChange={() => setIsAlertOpen(!IsAlertOpen)}
        >
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    onClick={() => {
                        setIsAlertOpen(true);
                    }}
                >
                    {t("buttonEditClientB2B")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle> {t("labelAddClientB2B")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel> {t("name")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t("name")} {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant={"destructive"}
                                    onClick={() => {
                                        setIsAlertOpen(false);
                                    }}
                                >
                                    {t("btn_cancel_txt")}
                                </Button>
                                <Button
                                    type="submit"
                                    loading={EditClientB2bMutation.isPending}
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

export default UpdateClientB2b