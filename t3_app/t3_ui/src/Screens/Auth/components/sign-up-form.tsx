import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shadcnuicomponents/ui/form'
import { Input } from '@/shadcnuicomponents/ui/input'
import { Button } from '@/shadcnuicomponents/custom/button'
import { PasswordInput } from '@/shadcnuicomponents/custom/password-input'
import { cn } from '@/lib/shadcnuiutils'
import api_client from '@/axios/api_client'
import { REGISTER_API } from '@/axios/routes_api'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { Toaster } from '@/shadcnuicomponents/ui/toaster'
import { useToast } from '@/shadcnuicomponents/ui/use-toast'
import { ValidationErrorRequest } from '@/types/http_types'
import { User } from '@/types/AppTypes'
import { useTranslation } from 'react-i18next'
import { get_max_exception_string } from '@/lib/helpers/language_validation_helper'
import i18n from '@/i18n'

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> { }



export function SignUpForm({ className, ...props }: SignUpFormProps) {

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
      password: z
        .string({
          required_error: t("validation_trans_password_required"),
        })
        .min(1, {
          message: t("validation_trans_password_required"),
        })
        .min(7, {
          message: get_max_exception_string(i18n.language, t("password"), 7),
        }),
    })

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      //  file_app: null
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    //console.log(data)
    // const formData = 
    const form_data = new FormData();
    form_data.append("name", data.name)
    form_data.append("email", data.email)
    form_data.append("password", data.password)
    /*   if (data.file_app != null) {
        form_data.append("file_app", data.file_app)
      }
   */

    api_client.post<{ msg: string, token: string, user: User }>(REGISTER_API, form_data).then((res) => {
      /* if (res.data.msg == "request has been created quccessfully") {
      } */
      localStorage.setItem("t3_user", JSON.stringify(res.data.user));
      localStorage.setItem("t3_token", res.data.token);
      navigate("/app/settings-clientEsoft", { replace: true })
    }).catch((err: AxiosError<ValidationErrorRequest>) => {
      if (err.response?.status == 422) {

        //   if (err.response?.data.message == "validation error") {
        toast({
          title: t("general_error"),

          description: err.response?.data.errors?.email[0],
          className: 'bg-red-500 text-white'
        })
        //   }
      }
      setIsLoading(false)
    })


  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
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
                    <Input placeholder={t("form_placeholder_email")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>{t("form_password_label")}</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder={t("form_placeholder_password")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*  <FormField
              control={form.control}
              name='file_app'

              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>KBIS</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='name@example.com'
                      {...fieldProps}
                      type='file'
                      onChange={(event) =>
                        onChange(event.target.files && event.target.files[0])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            {/*     <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <Button className='mt-2' loading={isLoading}>
              {t("button_create_account")}
            </Button>

            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  {t("button_or_continue_with")}
                </span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                loading={isLoading}
                leftSection={<IconBrandGithub className='h-4 w-4' />}
              >
                {t("social_github")}
              </Button>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                loading={isLoading}
                leftSection={<IconBrandFacebook className='h-4 w-4' />}
              >
                {t("social_facebook")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <Toaster />
    </div>
  )
}
