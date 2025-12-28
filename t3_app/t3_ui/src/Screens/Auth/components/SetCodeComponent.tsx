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
import { Input } from "@/shadcnuicomponents/ui/input";
import { Button } from "@/shadcnuicomponents/custom/button";
import { cn } from "@/lib/shadcnuiutils";
import {
    ValidationErrorRequest,
} from "@/types/http_types";
import api_client from "@/axios/api_client";
import { AxiosError } from "axios";
import { Toaster } from "@/shadcnuicomponents/ui/toaster";
import { useToast } from "@/shadcnuicomponents/ui/use-toast";
import { useTranslation } from "react-i18next";

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> { }



export function SetCodeComponent({ className, ...props }: UserAuthFormProps) {

    const { t } = useTranslation()
    const formSchema = z.object({
        code: z
            .string({
                required_error: t("validation.string.empty", { field: t("code") })
            })
            .min(1, { message: t("validation.string.empty", { field: t("code") }) }) // Validate that input is not empty
            .refine((val) => !isNaN(parseInt(val)), { message: t("validation.string.empty", { field: t("code") }) }) // Ensure it can be parsed to a number
            .transform((val) => parseInt(val)) // Transform the string into a number
            .refine((val) => Number.isInteger(val) && val >= 111111 && val <= 999999, {
                message: t("enter_valid_code_1_6"),
            }),
    });
    const navigate = useNavigate();
    const { toast } = useToast();
    const { email } = useParams();

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true);
        console.log(data);
        api_client
            .post<{ code: string }>("/validate-code", {
                code_otp: data.code,
                email: email,
            })
            .then((res) => {


                navigate(`/auth/set-pwd/${res.data.code}`, { replace: true })
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
                            name="code"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>Code verififcation</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="..." {...field} />
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
