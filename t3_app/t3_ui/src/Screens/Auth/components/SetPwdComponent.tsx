import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shadcnuicomponents/ui/form";
import { Button } from "@/shadcnuicomponents/custom/button";
import { cn } from "@/lib/shadcnuiutils";
import {
    AuthApiLoginOkResponse,
    ValidationErrorRequest,
} from "@/types/http_types";
import api_client from "@/axios/api_client";
import { AxiosError } from "axios";
import { Toaster } from "@/shadcnuicomponents/ui/toaster";
import { useToast } from "@/shadcnuicomponents/ui/use-toast";
import { PasswordInput } from "@/shadcnuicomponents/custom/password-input";
import { useTranslation } from "react-i18next";

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> { }



export function SetPwdComponent({ className, ...props }: UserAuthFormProps) {
    const navigate = useNavigate();

    const { t } = useTranslation()



    const formSchema = z.object({
        password: z
            .string({
                required_error: t("validation.string.empty", { field: t("password") })
            })
            .min(1, {
                message: t("validation_trans_password_required"),
            })
            .max(7, {
                message: 'Password must be at least 7 characters long',
            }),
        password_confirmation: z
            .string({
                required_error: t("validation.string.empty", { field: t("password_confirmation") })
            })
            .min(1, {
                message: 'Please enter your password',
            })
            .max(7, {
                message: 'Password must be at least 7 characters long',
            }),
    }).refine((data) => data.password === data.password_confirmation, {
        message: t("passwords_dont_match"),
        path: ['password_confirmation'], // Optional: You can point the error to the password confirmation field
    });
    const { toast } = useToast();
    const { token } = useParams();

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true);
        console.log(data);
        api_client
            .post<AuthApiLoginOkResponse>("/reset-code", {
                password: data.password,
                password_confirmation: data.password_confirmation,
                token: token,
            })
            .then(() => {


                navigate(`/auth/signing`, { replace: true })
                setIsLoading(false);

            })
            .catch((err: AxiosError<ValidationErrorRequest>) => {
                console.log(err.response?.data);
                /*  if (err.response?.data.message == "Email & Password does not match with our record.") {
                 setAuthError("Email & Password does not match with our record.")
               } */
                toast({
                    title: t("general_error"),

                    // description: err.response?.data.errors?.email[0],
                    className: "bg-red-500 text-white",
                });
                setIsLoading(false);
            });

        /*  setTimeout(() => {
           setIsLoading(false)
         }, 3000) */
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-2">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>{t("password")}</FormLabel>
                                    <FormControl>
                                        <PasswordInput placeholder="********" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password_confirmation"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>{t("password_confirmation")}</FormLabel>
                                    <FormControl>
                                        <PasswordInput placeholder="********" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <Button className="mt-2" loading={isLoading}>
                            {t("reset_forget_pwd")}
                        </Button>

                    </div>
                </form>
            </Form>
            <Toaster />
        </div>
    );
}
