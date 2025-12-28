import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shadcnuicomponents/ui/card"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcnuicomponents/ui/form'
import { useToast } from '@/shadcnuicomponents/ui/use-toast'
import { Button } from '@/shadcnuicomponents/custom/button'
import { Input } from '@/shadcnuicomponents/ui/input'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChangeLogoSettingMutationApi } from '@/axios/AbstractionsApi/ApiApplicationSetting'


function ChangeLogoSetting() {
    const { t } = useTranslation()
    const formSchema = z.object({
        logo: z
            .instanceof(File) // Check if the input is an instance of File
            .refine(file => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type), {
                message: t("file_must_be_image"),
            })
            .refine(file => file.size <= 5 * 1024 * 1024, { // Maximum file size of 5MB
                message: t("file_size_limit"),
            }),
    });



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    });
    const queryClient = useQueryClient();
    const { toast } = useToast()
    const ChangeLogoSettingMutation = useMutation({
        mutationKey: ['change-logo-setting'],
        mutationFn: (form_data: FormData) => ChangeLogoSettingMutationApi(form_data),
        onSuccess: () => {
            toast({
                title: t("logo_updated_successfully"),
                className: "bg-emerald-500",
                variant: "default",
            });
            queryClient.invalidateQueries({ queryKey: ['application_data_query'] });
        },
        onError: () => {
            toast({
                title: t("general_error"),
                className: "bg-red-500",
                variant: "default",
            });
        }
    })


    function onSubmit(data: z.infer<typeof formSchema>) {
        const form_data = new FormData();
        if (data.logo != null) {
            form_data.append("logo", data.logo)
        }
        ChangeLogoSettingMutation.mutate(form_data);
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card x-chunk="dashboard-04-chunk-1">
                    <CardHeader>
                        <CardTitle>
                            La section de logo
                        </CardTitle>

                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name='logo'

                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            render={({ field: { value, onChange, ...fieldProps } }) => (
                                <FormItem className='space-y-1 text-end'>
                                    <FormLabel className='text-end'>صورة الشارة</FormLabel>
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

                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button className="mt-2" loading={ChangeLogoSettingMutation.isPending} type="submit">
                            Login
                        </Button>
                    </CardFooter>
                </Card>
            </form>

        </Form>
    )
}

export default ChangeLogoSetting
