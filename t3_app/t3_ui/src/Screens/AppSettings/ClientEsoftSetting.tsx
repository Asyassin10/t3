import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shadcnuicomponents/ui/form'
import { Button } from '@/shadcnuicomponents/custom/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcnuicomponents/ui/card'
import { Input } from '@/shadcnuicomponents/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { useToast } from '@/shadcnuicomponents/ui/use-toast'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateKbisFile } from '@/axios/AbstractionsApi/ApiApplicationSetting'
import { User } from '@/types/AppTypes'
import ErrorPage from '@/AppComponents/ErrorPage'
import UnauthorizedPage from '@/AppComponents/UnauthorizedPage'
function ClientEsoftSetting() {
    const { t } = useTranslation();
    const formSchema = z
        .object({
            file_app: z.instanceof(File, { message: t("file_is_required") }).nullable()
        })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            file_app: null
        },
    })

    const updateKbisFilMutation = useMutation({
        mutationKey: ["updateKbisFileMutation"],
        mutationFn: (data: FormData) => updateKbisFile(data),
        onSuccess: () => {
            toast({
                title: t("data_updated_successfully"),
                className: 'bg-red-500 text-white'
            })
        }
    })
    const { toast } = useToast()
    function onSubmit(data: z.infer<typeof formSchema>) {
        const form_data = new FormData();
        if (data.file_app != null) {
            form_data.append("file_app", data.file_app)
            updateKbisFilMutation.mutate(form_data)
        }
    }
    const queryClient = useQueryClient();

    const user = queryClient.getQueryData<User>(['user_data']);
    if (!user) {
        return <ErrorPage />;
    }
    if (user.role.role_name !== "ClientEsoft") {
        return <UnauthorizedPage />;
    }
    return (
        <div className="w-full bg-gray-50 min-h-screen">
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4  p-4 md:gap-8 md:p-10">
                <div className="mx-auto grid w-full max-w-6xl gap-2">
                    <h1 className="text-3xl font-semibold">{t('settings.title')}</h1>
                </div>
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                    <nav
                        className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
                    >
                        <Link to="#" className="font-semibold text-primary">
                            {t('settings.general')}
                        </Link>
                    </nav>
                    <div className="grid gap-6">
                        <Card x-chunk="dashboard-04-chunk-1">
                            <CardHeader>
                                <CardTitle>{t('settings.store_name.title')}</CardTitle>
                                <CardDescription>{t('settings.store_name.description')}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)}>
                                        <div className='grid gap-2'>
                                            <FormField
                                                control={form.control}
                                                name='file_app'
                                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                render={({ field: { value, onChange, ...fieldProps } }) => (
                                                    <FormItem className='space-y-1'>
                                                        <FormLabel>{t('settings.kbis.label')}</FormLabel>
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
                                            />
                                            <Button className='mt-2' loading={updateKbisFilMutation.isPending}>
                                                {t('settings.kbis.submit_button')}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
export default ClientEsoftSetting
