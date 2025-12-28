import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconBrandGoogle, IconBrandWindows } from "@tabler/icons-react";
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
import { PasswordInput } from "@/shadcnuicomponents/custom/password-input";
import { cn } from "@/lib/shadcnuiutils";
import {
  AuthApiLoginOkResponse,
  ValidationErrorRequest,
} from "@/types/http_types";
import api_client from "@/axios/api_client";
import { AxiosError } from "axios";
import { Toaster } from "@/shadcnuicomponents/ui/toaster";
import { useToast } from "@/shadcnuicomponents/ui/use-toast";
import moment from "moment";

import { useAtom } from "jotai";
import { json_t3_modules_atom, json_t3_token, json_t3_user } from "@/state/atom";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { get_max_exception_string } from "@/lib/helpers/language_validation_helper";

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> { }


export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();




  const { t } = useTranslation()


  const formSchema = z.object({
    email: z
      .string({
        required_error: t("validation_trans_email_required")
      })
      .min(1, { message: t("validation_trans_email_required") })
      .email({ message: t("validation_trans_email_invalid") }),
    password: z
      .string({
        required_error: t("validation_trans_password_required")
      })
      .min(1, {
        message: t("validation_trans_password_required"),
      })

      .max(255, { message: get_max_exception_string(i18n.language, t("password"), 255) })
  });


  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "lupobyquli@mailinator.com",
      password: "password",
    },
  });
  const [, setT3Modules] = useAtom(json_t3_modules_atom);
  const [, setT3User] = useAtom(json_t3_user);
  const [, setT3Token] = useAtom(json_t3_token);

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(data);
    api_client
      .post<AuthApiLoginOkResponse>("/login", {
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        if (moment().isAfter(moment(res.data.client_esoft.user_subscriptionplan_date_end))) {
          return navigate("/subscription_ended", { replace: true });
        }
        localStorage.setItem("t3_modules", JSON.stringify(res.data.assigned_modules));
        localStorage.setItem("t3_user", JSON.stringify(res.data.user));
        localStorage.setItem("t3_token", res.data.token);
        setT3Modules(res.data.assigned_modules);
        setT3User(res.data.user);
        setT3Token(res.data.token);


        if (res.data.user.role.role_name == "ClientEsoft") {
          return navigate("/app/managers", { replace: true });
        }
        if (res.data.user.role.role_name == "Manager") {
          return navigate("/app/projects", { replace: true });
        }
        if (res.data.user.role.role_name == "Consultant") {
          return navigate("/app/projects", { replace: true });
        }

        //  navigate("/cra", { replace: true })
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
                    <Input placeholder="..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center justify-between">
                    <FormLabel>Mot de passe</FormLabel>
                    <Link
                      to="/auth/forget-password"
                      className="text-sm font-medium text-muted-foreground hover:opacity-75"
                    >
                      {t("forget_pwd")}
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="mt-2" loading={isLoading}>
              Login
            </Button>
            <hr />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="w-full"
                type="button"
                loading={isLoading}
                leftSection={<IconBrandWindows className="w-4 h-4" />}
              >
                Microsoft
              </Button>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                loading={isLoading}
                leftSection={<IconBrandGoogle className="w-4 h-4" />}
              >
                Google
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <Toaster />
    </div>
  );
}
