import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcnuicomponents/ui/form";

import { toast } from '@/shadcnuicomponents/ui/use-toast';
import { User } from '@/types/AppTypes';
import { ValidationErrorRequest } from '@/types/http_types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Input } from "@/shadcnuicomponents/ui/input";
import { Button } from "@/shadcnuicomponents/custom/button";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateProfileDataApi } from "@/axios/AbstractionsApi/ApiUser";

function ProfileUserData({ user }: { user: User }) {
    const { t } = useTranslation()
    const formSchema = z
        .object({ // .string(
            email: z
                .string({
                    required_error: t("validation_trans_email_required")
                })
                .min(1, { message: t("validation_trans_email_required") })
                .email({ message: t("validation_trans_email_invalid") }),
            name: z
                .string({
                    required_error: t("validation.string.empty", { field: t("name") })
                })
                .min(1, {
                    message: t("validation.string.empty", { field: t("name") })
                }),
            /*  password: z
                 .string({
                     required_error: t("validation_trans_password_required"),
                 })
                 .min(1, {
                     message: t("validation_trans_password_required"),
                 })
                 .min(7, {
                     message: get_max_exception_string(i18n.language, t("password"), 7),
                 }), */
        })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
        },
    })
    useEffect(() => {
        form.setValue('name', user.name)
        form.setValue('email', user.email)
    }, [user])
    const updateProfileDataMutation = useMutation({
        mutationKey: ['update_profile_data'],
        mutationFn: (formData: FormData) => updateProfileDataApi(formData),
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
        form_data.append("name", data.name)
        form_data.append("email", data.email)
        updateProfileDataMutation.mutate(form_data)




    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid gap-2'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem className='space-y-1'>
                                <FormLabel>{t("form_name_label")}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t("form_placeholder_name")} type='text' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem className='space-y-1'>
                                <FormLabel>{t("form_email_label")}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t("form_placeholder_email")} type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <Button type="submit" className='mt-2' /* loading={isLoading} */>
                        {t("change_profile_data")}
                    </Button>




                </div>
            </form>
        </Form>
    )
}

export default ProfileUserData