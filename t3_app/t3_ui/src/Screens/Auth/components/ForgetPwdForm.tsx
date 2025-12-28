import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
  AuthApiLoginOkResponse,
  ValidationErrorRequest,
} from "@/types/http_types";
import api_client from "@/axios/api_client";
import { AxiosError } from "axios";
import { Toaster } from "@/shadcnuicomponents/ui/toaster";
import { useToast } from "@/shadcnuicomponents/ui/use-toast";
import { get_required_exception } from "@/lib/helpers/language_validation_helper";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";




interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> { }


export function ForgetPwdForm({ className, ...props }: UserAuthFormProps) {
  const { t } = useTranslation()
  const formSchema = z.object({
    email: z
      .string({
        required_error: t("validation.string.empty", { field: t("email") })
      })
      .min(1, { message: get_required_exception(i18n.language, t("email")) })
      .email({ message: t("invalid_email") }),
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "lupobyquli@mailinator.com",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(data);
    api_client
      .post<AuthApiLoginOkResponse>("/forgot-password", {
        email: data.email,
      })
      .then(() => {


        navigate(`/auth/set-code/${data.email}`, { replace: true })
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
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
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
