

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcnuicomponents/ui/select";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shadcnuicomponents/ui/popover";
import { createAbsenceRequestApi, getAbsenceTypeApi } from '@/axios/AbstractionsApi/ApiAbsence';
import i18n from '@/i18n';
import { ObjectCreatedSuccessfullyWithoutDescription } from '@/lib/helpers/language_http_messages_hekper';
import { get_required_exception, get_required_select_exception } from '@/lib/helpers/language_validation_helper';
import { toast } from '@/shadcnuicomponents/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
interface CreateAbsenceRequestProps {
    setSelectPage: React.Dispatch<React.SetStateAction<number>>;
}
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shadcnuicomponents/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shadcnuicomponents/ui/form";
import { Button } from '@/shadcnuicomponents/custom/button';
import { Textarea } from '@/shadcnuicomponents/ui/textarea';
import { cn } from "@/lib/shadcnuiutils";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { Calendar } from "@/shadcnuicomponents/ui/calendar";
function CreateAbsenceRequest({ setSelectPage }: CreateAbsenceRequestProps) {
    const absenceTypeQuery = useQuery({
        queryKey: ["absences_types"],
        queryFn: () => getAbsenceTypeApi()
    });


    const { t } = useTranslation()
    const queryClient = useQueryClient();
    const [IsAlertOpenAddingAbsenceRequest, setIsAlertOpenAddingAbsenceRequest] = useState(false);
    const createQbsenceRequestSchema = z.object({
        reason: z
            .string({
                required_error: t("validation.string.empty", { field: t("reason") })
            })
            .min(1, { message: get_required_exception(i18n.language, t("reason")) }),
        date_debut: z.date({
            required_error: get_required_exception(i18n.language, t("date_of_start")),
        }),
        date_fin: z.date({
            required_error: get_required_exception(i18n.language, t("date_of_end")),
        }),
        type_absence_id: z
            .string({
                required_error: get_required_select_exception(
                    i18n.language,
                    t("alpha_type_absence")
                ),
            })
            .min(0, { message: get_required_exception(i18n.language, t("alpha_type_absence")) }),
    });
    const formcreateQbsenceRequestSchema = useForm<
        z.infer<typeof createQbsenceRequestSchema>
    >({
        resolver: zodResolver(createQbsenceRequestSchema),
        defaultValues: {
            reason: "",
        },
    });
    const createAbsenceRequestApiMutation = useMutation({
        mutationKey: ['createAbsenceRequestApi'],
        mutationFn: (data: FormData) => createAbsenceRequestApi(data),
        onSuccess: () => {
            setIsAlertOpenAddingAbsenceRequest(false);
            toast({
                title: ObjectCreatedSuccessfullyWithoutDescription(
                    i18n.language,
                    t("alpha_type_absence_full")
                ),
                className: "bg-emerald-500",
                variant: "default",
            });
            setSelectPage(1)

            queryClient.invalidateQueries({
                queryKey: ["absences", 1],
            });
        }
    })

    function omsubmitCreateAbsenceRequest(
        values: z.infer<typeof createQbsenceRequestSchema>
    ) {
        const data = new FormData();
        data.append("reason", values.reason)
        data.append("absence_request_type_id", values.type_absence_id)
        data.append("date_debut", moment(values.date_debut).format("YYYY-MM-DD"))
        data.append("date_fin", moment(values.date_fin).format("YYYY-MM-DD"))
        createAbsenceRequestApiMutation.mutate(data)

    }
    return (
        <Dialog
            open={IsAlertOpenAddingAbsenceRequest}
            onOpenChange={() =>
                setIsAlertOpenAddingAbsenceRequest(
                    !IsAlertOpenAddingAbsenceRequest
                )
            }
        >
            <DialogTrigger asChild>

                <Button
                    onClick={() => {
                        setIsAlertOpenAddingAbsenceRequest(true);
                    }}
                    size="lg"
                    className="flex shadow-lg text-center shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
                >
                    <Plus className="h-4 w-4" />
                    {t("buttonAddAbsence")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle> {t("labelAddAbsence")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...formcreateQbsenceRequestSchema}>
                        <form
                            onSubmit={formcreateQbsenceRequestSchema.handleSubmit(
                                omsubmitCreateAbsenceRequest
                            )}
                            className="space-y-8"
                        >
                            <FormField
                                control={formcreateQbsenceRequestSchema.control}
                                name="reason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea placeholder={t("reason")} {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={formcreateQbsenceRequestSchema.control}
                                name="date_debut"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center">
                                        <FormLabel className="mr-2">
                                            {t("date_debut")} :
                                        </FormLabel>
                                        <div>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>{t("pick_a_data")}</span>
                                                            )}
                                                            <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        /*   disabled={(date) =>
                                                          date > new Date() ||
                                                          date < new Date("1900-01-01")
                                                        } */
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={formcreateQbsenceRequestSchema.control}
                                name="date_fin"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center">
                                        <FormLabel className="mr-7">
                                            {t("date_fin")} :
                                        </FormLabel>
                                        <div>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>{t("pick_a_data")}</span>
                                                            )}
                                                            <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}

                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>


                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={formcreateQbsenceRequestSchema.control}
                                name="type_absence_id"
                                render={({ field }) => (
                                    <FormItem>
                                        {/*   <FormLabel>{t("label_type_absence")}</FormLabel> */}
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={t("label_selection").concat(
                                                            "Type Absence"
                                                        )}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {absenceTypeQuery.data?.map((abs_type) => (
                                                    <SelectItem
                                                        value={abs_type.id.toString()}
                                                        key={abs_type.id.toString()}
                                                    >
                                                        {abs_type.label_type_absence}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant={"destructive"}
                                    onClick={() => {
                                        setIsAlertOpenAddingAbsenceRequest(false);
                                    }}
                                >
                                    {t("btn_cancel_txt")}
                                </Button>
                                <Button
                                    type="submit"
                                    loading={createAbsenceRequestApiMutation.isPending}
                                >
                                    {t("btn_submit_txt")}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateAbsenceRequest