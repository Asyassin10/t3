import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcnuicomponents/ui/form";

import { toast } from '@/shadcnuicomponents/ui/use-toast';
import { ValidationErrorRequest } from '@/types/http_types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from "@/shadcnuicomponents/custom/button";
import { useMutation } from "@tanstack/react-query";
import { updatePasswordDataApi } from "@/axios/AbstractionsApi/ApiUser";
import i18n from "@/i18n";
import { get_max_exception_string, get_min_exception_string, get_required_select_exception } from "@/lib/helpers/language_validation_helper";
import { PasswordInput } from "@/shadcnuicomponents/custom/password-input";

function ChangePassword() {
    const { t } = useTranslation()
    const formSchema = z
        .object({ // .string(

            current_password: z
                .string({
                    required_error: t("validation_trans_password_required"),
                })
                .min(1, {
                    message: t("validation_trans_password_required"),
                })
                .min(7, {
                    message: get_max_exception_string(i18n.language, t("current_password"), 7),
                }),
            new_password: z
                .string({
                    required_error: get_required_select_exception(i18n.language, t("new_password")),
                })
                .min(1, {
                    message: get_min_exception_string(i18n.language, t("new_password"), 1),
                })
                .min(7, {
                    message: get_max_exception_string(i18n.language, t("new_password"), 7),
                }),
            new_password_confirmation: z
                .string({
                    required_error: get_required_select_exception(i18n.language, t("new_password_confirmation")),
                })
                .min(1, {
                    message: get_min_exception_string(i18n.language, t("new_password_confirmation"), 1),
                })
                .min(7, {
                    message: get_max_exception_string(i18n.language, t("new_password_confirmation"), 7),
                }),
        })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            current_password: '',
            new_password: '',
            new_password_confirmation: '',
        },
    })

    const updatePasswordMutation = useMutation({
        mutationKey: ['update_password_user'],
        mutationFn: (formData: FormData) => updatePasswordDataApi(formData),
        onSuccess: () => {
            toast({
                title: t("data_updated_successfully"),
                className: "bg-emerald-500",
            })
        },
        onError: (error: AxiosError<ValidationErrorRequest>) => {
            toast({
                title: t("general_error"),
                description: error.response?.data.message,
                className: 'bg-red-500 text-white'
            })
        }
    })

    function onSubmit(data: z.infer<typeof formSchema>) {

        const form_data = new FormData();
        form_data.append("current_password", data.current_password)
        form_data.append("new_password", data.new_password)
        form_data.append("new_password_confirmation", data.new_password_confirmation)
        updatePasswordMutation.mutate(form_data)




    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid gap-2'>
                    <FormField
                        control={form.control}
                        name='current_password'
                        render={({ field }) => (
                            <FormItem className='space-y-1'>
                                <FormLabel>{t("current_password")}</FormLabel>
                                <FormControl>
                                    <PasswordInput placeholder={t("current_password")}  {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='new_password'
                        render={({ field }) => (
                            <FormItem className='space-y-1'>
                                <FormLabel>{t("new_password")}</FormLabel>
                                <FormControl>
                                    <PasswordInput placeholder={t("new_password")} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='new_password_confirmation'
                        render={({ field }) => (
                            <FormItem className='space-y-1'>
                                <FormLabel>{t("new_password_confirmation")}</FormLabel>
                                <FormControl>
                                    <PasswordInput placeholder={t("new_password_confirmation")} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className='mt-2' /* loading={isLoading} */>
                        {t("change_password")}
                    </Button>




                </div>
            </form>
        </Form>
    )
}

export default ChangePassword