import { UpdateActivityApi } from '@/axios/AbstractionsApi/ApiProjet';
import i18n from '@/i18n';
import { get_max_exception_string, get_required_exception } from '@/lib/helpers/language_validation_helper';
import { Button } from '@/shadcnuicomponents/custom/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shadcnuicomponents/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcnuicomponents/ui/form';
import { Input } from '@/shadcnuicomponents/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shadcnuicomponents/ui/select';
import { toast } from '@/shadcnuicomponents/ui/use-toast';
import { Activity, IProject } from '@/types/AppTypes';
import { IUpdateActivity } from '@/types/requests_types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

function UpdateActivity({ projects_query, activity }: { projects_query: IProject[], activity: Activity }) {

    const { t } = useTranslation()
    const [IsAlertOpen, setIsAlertOpen] = useState(false)
    const updateActiviteSchema = z.object({
        activity_name: z
            .string({ required_error: get_required_exception(i18n.language, t("title_name")) })
            .min(1, { message: get_required_exception(i18n.language, t("activity_name")) })
            .max(200, { message: get_max_exception_string(i18n.language, t("activity_name"), 200) }),
        project_id: z.number({ required_error: get_required_exception(i18n.language, t("title_name")) }),
    });
    const form = useForm<z.infer<typeof updateActiviteSchema>>({
        resolver: zodResolver(updateActiviteSchema),
        defaultValues: {
            activity_name: "",
            project_id: undefined,
        },
    });
    const queryClient = useQueryClient();
    const updateActiviteApiMutation = useMutation({
        mutationKey: ["createActiviteApi"],
        mutationFn: ({ activity_name, project_id, id }: IUpdateActivity) => UpdateActivityApi({ activity_name, project_id, id }),
        onSuccess: () => {
            setIsAlertOpen(false);
            toast({
                title: t("activity_updated_successfully"),
                className: "bg-emerald-500",
                variant: "default",
            });
            queryClient.invalidateQueries({
                queryKey: ["activites_query"],
            });
            form.reset({
                activity_name: "",
                project_id: undefined,
            });
        },
        onError: () => {
            setIsAlertOpen(false);
            /*    setIsLoadingAddingActivite(false); */
            toast({
                title: t("general_error"),
                className: "bg-red-500",
                variant: "default",
            });
        }
    });
    function onSubmit(values: z.infer<typeof updateActiviteSchema>) {

        updateActiviteApiMutation.mutate({ activity_name: values.activity_name, project_id: values.project_id, id: activity.id })

    }
    useEffect(() => {
        form.setValue("activity_name", activity.activity_name);
        form.setValue("project_id", activity.project_id);
    }, [activity])

    return (
        <Dialog
            open={IsAlertOpen}
            onOpenChange={() => {
                setIsAlertOpen(!IsAlertOpen);
            }}
        >
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size={"icon"}
                    className='m-0 p-0 '

                >
                    <Edit className='w-5 h-5' />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <DialogHeader>
                            <DialogTitle>

                                {t("activity_modification")}
                            </DialogTitle>
                            <DialogDescription>
                                {t("activity_modification_form")}
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="activity_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("activity_name")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder=" " {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="project_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("project")}</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value?.toString()}
                                                onValueChange={(e) => {
                                                    field.onChange(parseInt(e));
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={t("project_placeholder")} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {projects_query.map(
                                                            (project, index) => (
                                                                <SelectItem
                                                                    value={project.id.toString()}
                                                                    key={index}
                                                                >
                                                                    {project.project_name}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button
                                    type="submit"
                                    loading={updateActiviteApiMutation.isPending}
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

export default UpdateActivity