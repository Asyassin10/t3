
import { Button } from "@/shadcnuicomponents/custom/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shadcnuicomponents/ui/card"

import { Input } from "@/shadcnuicomponents/ui/input"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LayoutBody } from '@/shadcnuicomponents/custom/layout'

import Spinner from '@/AppComponents/Spinner'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcnuicomponents/ui/form'
import moment from 'moment'
import { useToast } from '@/shadcnuicomponents/ui/use-toast'
import ChangeLogoSetting from '@/AppComponents/ChangeLogoSetting'
import { useTranslation } from 'react-i18next'
import { updateDateOfStartSendingNotificationsApi } from '@/axios/AbstractionsApi/ApiApplicationSetting'
import { IApplicationData } from "@/types/AppTypes"
function ApplicationData() {
    const dateCurrent = moment().endOf('month').date();
    const { t } = useTranslation();
    const formSchema = z.object({
        date_of_start_sending_notifications: z
            .string({
                required_error: t("validation.string.empty", { field: t("number_of_days") })
            })
            .refine(value => !isNaN(Number(value)), { message: t("value_must_be_number") })
            .transform(value => Number(value))
            .refine(value => value >= 1 && value <= dateCurrent, { message: `The number must be between 1 and ${dateCurrent}` })

            .refine(value => Number.isInteger(value), { message: t("value_must_be_number") })
    });


    const queryClient = useQueryClient();
    const application_data_query = queryClient.getQueryData<IApplicationData>(['application_data_query']);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    });
    const { toast } = useToast()
    const updateDateOfStartSendingNotificationsApiMutation = useMutation({
        mutationKey: ['update-date-of-start-sending-notifications'],
        mutationFn: (date_of_start_sending_notifications: number) => updateDateOfStartSendingNotificationsApi(date_of_start_sending_notifications),
        onSuccess: () => {
            toast({
                title: t("data_updated_successfully"),
                className: "bg-emerald-500",
                variant: "default",
            });
        },
        onError() {
            toast({
                title: t("general_error"),
                className: "bg-red-500",
                variant: "default",
            });
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {

        updateDateOfStartSendingNotificationsApiMutation.mutate(data.date_of_start_sending_notifications);
    }


    return (
        <>
            <div className="w-full h-screen bg-gray-50">
                {application_data_query == undefined ? (
                    <div className="flex items-center justify-center w-full h-5/6">
                        <Spinner />
                    </div>
                ) : (
                    <LayoutBody className="w-full ">

                        <div className="flex-col flex-1 w-full">
                            <main className="flex flex-col flex-1 gap-4 p-4 md:gap-8 md:p-10">
                                <div className="grid w-full max-w-6xl gap-2 mx-auto">
                                    <h1 className="text-3xl font-semibold">Settings</h1>
                                </div>
                                <div className="grid items-start w-full mx-auto">

                                    <div className="w-full my-4 ">
                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                                <Card x-chunk="dashboard-04-chunk-1">
                                                    <CardHeader>
                                                        <CardTitle>
                                                            {t("notification_settings")}
                                                        </CardTitle>
                                                        <CardDescription>
                                                            {t("notification_section_description")}
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <FormField
                                                            control={form.control}
                                                            name="date_of_start_sending_notifications"
                                                            render={({ field }) => (
                                                                <FormItem className="space-y-1">
                                                                    <FormLabel>
                                                                        {t("number_of_days")}
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder={application_data_query.date_of_start_sending_notifications.toString()} {...field} type='number' onChange={e => field.onChange(e.target.value)} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                    </CardContent>
                                                    <CardFooter className="px-6 py-4 border-t">
                                                        <Button className="mt-2" loading={updateDateOfStartSendingNotificationsApiMutation.isPending}>
                                                            {t("save")}
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            </form>

                                        </Form>
                                    </div>
                                    <div className="w-full ">
                                        <ChangeLogoSetting />
                                    </div>
                                </div>
                            </main>
                        </div>
                    </LayoutBody>

                )}
            </div>

        </>
    )
}

export default ApplicationData
