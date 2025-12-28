import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/shadcnuicomponents/ui/form";
import { createManagerApi } from '@/axios/AbstractionsApi/ApiManager';
import i18n from '@/i18n';
import { get_invalid_data_exception, get_max_exception_string, get_required_exception, objectCreatedSuccessfully } from '@/lib/helpers/language_validation_helper';
import { toast } from '@/shadcnuicomponents/ui/use-toast';
import { ValidationErrorRequest } from '@/types/http_types';
import { CreateManagerDTO } from '@/types/requests_types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shadcnuicomponents/ui/dialog";
import { Button } from "@/shadcnuicomponents/custom/button";
import { Input } from "@/shadcnuicomponents/ui/input";
interface CreateManagerProps {
    setSelectPage: React.Dispatch<React.SetStateAction<number>>;
}
function CreateManagerScreen({ setSelectPage }: CreateManagerProps) {
    const { t } = useTranslation()

    const createManagerSchema = z.object({
        email: z
            .string({
                required_error: get_required_exception(i18n.language, t("email"))
            })
            .min(1, { message: get_required_exception(i18n.language, t("email")) })
            .max(200, {
                message: get_max_exception_string(i18n.language, t("email"), 200),
            })
            .email({
                message: get_invalid_data_exception(i18n.language, t("email")),
            }),
        name: z
            .string({
                required_error: get_required_exception(i18n.language, t("name"))
            })
            .max(200, {
                message: get_max_exception_string(i18n.language, t("name"), 200),
            })
            .min(1, { message: get_required_exception(i18n.language, t("name")) }),
    });
    const form = useForm<z.infer<typeof createManagerSchema>>({
        resolver: zodResolver(createManagerSchema),
        defaultValues: {
            name: "",
            email: "",
        },
    });
    const [IsAlertOpen, setIsAlertOpen] = useState(false);

    const CreateManagerMutation = useMutation({
        mutationKey: ["createManager"],
        mutationFn: (payload: CreateManagerDTO) => createManagerApi(payload),

        onSuccess: () => {
            setIsAlertOpen(false);

            toast({
                title: objectCreatedSuccessfully(i18n.language, t("manager")),
                className: "bg-emerald-500",
            });

            // Reset form
            form.reset({ name: "", email: "" });

            // Reset filters
            setSelectPage(1);


        },

        onError: (error: AxiosError<ValidationErrorRequest>) => {
            setIsAlertOpen(false);

            toast({
                title: t("general_error"),
                description: error.response?.data?.message,
                className: "bg-red-500",
            });
        },
    });
    function onSubmit(values: z.infer<typeof createManagerSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
        CreateManagerMutation.mutate(values);

    }
    return (
        <Dialog open={IsAlertOpen} onOpenChange={() =>
            setIsAlertOpen(!IsAlertOpen)}
        >
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => {
                    setIsAlertOpen(true);
                }}
                >
                    {t("buttonAddManagers")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle> {t("labelAddManagers")}</DialogTitle>
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
                                    loading={CreateManagerMutation.isPending}>
                                    {t("btn_submit_txt")}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>)
}

export default CreateManagerScreen