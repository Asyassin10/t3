import { HTMLAttributes, useState } from 'react'
import { cn } from '@/lib/shadcnuiutils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/shadcnuicomponents/custom/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shadcnuicomponents/ui/form'
import { Input } from '@/shadcnuicomponents/ui/input'
import { useTranslation } from 'react-i18next'

interface ForgotFormProps extends HTMLAttributes<HTMLDivElement> { }



export function ForgotForm({ className, ...props }: ForgotFormProps) {

  const { t } = useTranslation()


  const formSchema = z.object({
    email: z
      .string({
        required_error: t("validation.string.empty", { field: t("email") })
      })
      .min(1, { message: t("validation_trans_email_required") })
      .email({ message: t("validation_trans_email_invalid") }),
  })
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    console.log(data)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input placeholder='...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isLoading}>
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
