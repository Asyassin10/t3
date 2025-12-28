import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shadcnuicomponents/ui/dialog";
import { Button } from '@/shadcnuicomponents/custom/button';
import { useTranslation } from 'react-i18next';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/shadcnuicomponents/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { get_invalid_data_exception, get_max_exception_string, get_min_exception_string, get_required_exception, objectUpdatedSuccessfully } from '@/lib/helpers/language_validation_helper';
import i18n from '@/i18n';
import { IManager } from '@/types/AppTypes';
import { Input } from '@/shadcnuicomponents/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editManagerApi } from '@/axios/AbstractionsApi/ApiManager';
import { toast } from '@/shadcnuicomponents/ui/use-toast';
import { AxiosError } from 'axios';
import { ValidationErrorRequest } from '@/types/http_types';
import { IEditManagerApiData } from '@/types/requests_types';
import { Edit } from 'lucide-react';

function EditManager({ manager }: { manager: IManager }) {
    const { t } = useTranslation()

    const editManagerSchema = z.object({
        email: z
            .string({
                required_error: t("validation.string.empty", { field: t("email") })
            })
            .min(1, { message: get_min_exception_string(i18n.language, t("email"), 1) })
            .max(200, {
                message: get_max_exception_string(i18n.language, t("email"), 200),
            })
            .email({
                message: get_invalid_data_exception(i18n.language, t("email")),
            }),
        name: z
            .string({
                required_error: t("validation.string.empty", { field: t("name") })
            })
            .max(200, {
                message: get_max_exception_string(i18n.language, t("name"), 200),
            })
            .min(1, { message: get_required_exception(i18n.language, t("name")) }),
    });
    const form = useForm<z.infer<typeof editManagerSchema>>({
        resolver: zodResolver(editManagerSchema),
        defaultValues: {
            name: manager.user.name,
            email: manager.user.email,
        },
    });
    const queryClient = useQueryClient();

    const [IsAlertOpen, setIsAlertOpen] = useState(false);
    const editManagerMutation = useMutation({
        mutationKey: ["edit-manager-api"],
        mutationFn: ({ email, name, manager_id }: IEditManagerApiData) => editManagerApi({ email: email, name: name, manager_id: manager_id }),
        onSuccess: () => {
            setIsAlertOpen(false);
            toast({
                title: objectUpdatedSuccessfully(i18n.language, t("manager")),
                className: "bg-emerald-500",
                variant: "default",
            });
            queryClient.invalidateQueries({
                queryKey: ["managers"],
            });

            queryClient.invalidateQueries({
                queryKey: ["managers", 0],
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
    function onSubmit(values: z.infer<typeof editManagerSchema>) {
        editManagerMutation.mutate({
            email: values.email,
            name: values.name,
            manager_id: manager.id
        });
    }
    return (
        <Dialog open={IsAlertOpen} onOpenChange={() =>
            setIsAlertOpen(!IsAlertOpen)}
        >
            <DialogTrigger asChild>
                <Button size={"icon"} variant="outline" onClick={() => {
                    setIsAlertOpen(true);
                }}
                >
                    <Edit className="w-8 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle> {t("labelEditManagers")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8">
                            <FormField control={form.control} name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        {/* <FormLabel>{t("name")}</FormLabel>
                                                                                */}
                                        <FormControl>
                                            <Input placeholder={t("name")}
                                                {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField control={form.control}
                                name="email" render={({ field }) => (
                                    <FormItem>
                                        {/* <FormLabel> {t("email")}
                                                                                    </FormLabel>
                                                                                    */}
                                        <FormControl>
                                            <Input placeholder="E-mail"
                                                {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="button"
                                    variant={"destructive"}
                                    onClick={() => {
                                        setIsAlertOpen(false);
                                        form.reset({
                                            email: "",
                                            name: "",
                                        });
                                    }}
                                >
                                    {t("btn_cancel_txt")}
                                </Button>
                                <Button type="submit"
                                    loading={editManagerMutation.isPending}>
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

export default EditManager