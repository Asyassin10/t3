import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/shadcnuiutils'
import { Button } from '@/shadcnuicomponents/custom/button'
import { Calendar } from '@/shadcnuicomponents/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/shadcnuicomponents/ui/command'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shadcnuicomponents/ui/form'
import { Input } from '@/shadcnuicomponents/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shadcnuicomponents/ui/popover'
import { toast } from '@/shadcnuicomponents/ui/use-toast'
import { get_max_exception_string, get_min_exception_string } from '@/lib/helpers/language_validation_helper'
import i18n from '@/i18n'

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const




// This can come from your database or API.


export function AccountForm() {
  const { t } = useTranslation()
  const accountFormSchema = z.object({
    name: z
      .string({
        required_error: t("validation.string.empty", { field: t("name") })
      })
      .min(2, {
        message: get_min_exception_string(i18n.language, t("name"), 2)

      })
      .max(30, { message: get_max_exception_string(i18n.language, t("name"), 30) }),
    dob: z.date({
      required_error: t("validation.string.empty", { field: t("date_of_birth") })
    }),
    language: z.string({
      required_error: t("validation.string.empty", { field: t("language") })

    }),
  })
  type AccountFormValues = z.infer<typeof accountFormSchema>
  const defaultValues: Partial<AccountFormValues> = {
    // name: "Your name",
    // dob: new Date("2023-01-23"),
  }
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  function onSubmit(data: AccountFormValues) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form_name_label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("form_placeholder_name")} {...field} />
              </FormControl>
              <FormDescription>
                {t("description_name_will_be_displayed")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='dob'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>{t("form_dob_label")}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        dayjs(field.value).format('MMM D, YYYY')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date: Date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='language'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>{t("language")}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      role='combobox'
                      className={cn(
                        'w-[200px] justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? languages.find(
                          (language) => language.value === field.value
                        )?.label
                        : t("label_selection") + "language"}
                      <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-[200px] p-0'>
                  <Command>
                    <CommandInput placeholder={t("label_selection") + "language..."} />
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      {languages.map((language) => (
                        <CommandItem
                          value={language.label}
                          key={language.value}
                          onSelect={() => {
                            form.setValue('language', language.value)
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              'mr-2 h-4 w-4',
                              language.value === field.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {language.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the language that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>{t("btn_submit_txt")}</Button>
      </form>
    </Form>
  )
}
