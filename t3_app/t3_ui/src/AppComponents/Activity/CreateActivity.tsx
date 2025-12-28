import { createActiviteApi } from '@/axios/AbstractionsApi/ApiProjet';
import i18n from '@/i18n';
import { get_max_exception_string, get_required_exception } from '@/lib/helpers/language_validation_helper';
import { Button } from '@/shadcnuicomponents/custom/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shadcnuicomponents/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcnuicomponents/ui/form';
import { Input } from '@/shadcnuicomponents/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shadcnuicomponents/ui/select';
import { toast } from '@/shadcnuicomponents/ui/use-toast';
import { IProject } from '@/types/AppTypes';
import { ICreateActivity } from '@/types/requests_types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
function CreateActivity({ projects_query }: { projects_query: IProject[] }) {
    const { t } = useTranslation()
    const [IsAlertOpen, setIsAlertOpen] = useState(false)
    const createActiviteSchema = z.object({
        activity_name: z
            .string({ required_error: get_required_exception(i18n.language, t("activity_name")) })
            .min(1, { message: get_required_exception(i18n.language, t("activity_name")) })
            .max(200, { message: get_max_exception_string(i18n.language, t("activity_name"), 200) }),
        project_id: z.number({ required_error: get_required_exception(i18n.language, t("title_name")) }),
    });
    const form = useForm<z.infer<typeof createActiviteSchema>>({
        resolver: zodResolver(createActiviteSchema),
        defaultValues: {
            activity_name: "",
            project_id: undefined,
        },
    });
    const queryClient = useQueryClient();
    const createActiviteApiMutation = useMutation({
        mutationKey: ["createActiviteApi"],
        mutationFn: ({ activity_name, project_id }: ICreateActivity) => createActiviteApi(activity_name, project_id),
        onSuccess: () => {
            setIsAlertOpen(false);
            toast({
                title: t("activity_added_successfully"),
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
            toast({
                title: t("general_error"),
                className: "bg-red-500",
                variant: "default",
            });
        }
    });
    function onSubmit(values: z.infer<typeof createActiviteSchema>) {
        createActiviteApiMutation.mutate({ activity_name: values.activity_name, project_id: values.project_id })
    }
    return (
        <Dialog
            open={IsAlertOpen}
            onOpenChange={() => {
                setIsAlertOpen(!IsAlertOpen);
                form.reset({
                    activity_name: "",
                    project_id: undefined,
                });
            }}
        >
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    onClick={() => {
                        setIsAlertOpen(true);
                    }}
                    className="m-2"
                >
                    {t("create_new_activity")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <DialogHeader>
                            <DialogTitle>
                                {t("add_activity")}
                            </DialogTitle>
                            <DialogDescription>
                                {t("add_activity_form")}
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
                                    loading={createActiviteApiMutation.isPending}
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
export default CreateActivity