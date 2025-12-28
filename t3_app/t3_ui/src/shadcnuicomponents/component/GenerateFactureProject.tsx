import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcnuicomponents/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shadcnuicomponents/ui/form";
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shadcnuicomponents/ui/dialog";
import { Button } from '../custom/button';
import { useTranslation } from 'react-i18next';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModuleApp, getProjectsResponse } from "@/types/http_types";
import { useToast } from "../ui/use-toast";
import { MonthApp } from "@/lib/helpers/time_helpers";
import { get_required_exception } from "@/lib/helpers/language_validation_helper";
import i18n from "@/i18n";
import { useMutation } from "@tanstack/react-query";
import { SaveFactureApi } from "@/axios/AbstractionsApi/ApiFacture";
interface GenerateFactureProjectProps {
    projects: getProjectsResponse[]
    months: MonthApp[]
    years: number[]
}
function GenerateFactureProject({ projects, months, years }: GenerateFactureProjectProps) {
    const { t } = useTranslation()
    const generateFactureSchema = z.object({


        Project: z
            .string({
                required_error: get_required_exception(i18n.language, t("project"))
            })
            .min(0, {
                message: get_required_exception(i18n.language, t("project"))
            }),
        Month: z
            .string({
                required_error: get_required_exception(i18n.language, t("month"))
            })
            .min(0, {
                message: get_required_exception(i18n.language, t("month"))
            }),
        Year: z
            .string({
                required_error: get_required_exception(i18n.language, t("year"))
            })
            .min(0, {
                message: get_required_exception(i18n.language, t("year"))
            }),
    });
    const form = useForm<z.infer<typeof generateFactureSchema>>({
        resolver: zodResolver(generateFactureSchema),

    });

    const { toast } = useToast();

    const [isAlertOpenAddingProject, setIsAlertOpenAddingProject] =
        useState(false);
    const SaveFactureApiMutation = useMutation({
        mutationKey: ["SaveFactureApi"],
        mutationFn: (data: FormData) => SaveFactureApi(data),
        onSuccess: (res) => {
            setIsAlertOpenAddingProject(false);
            toast({
                title: t("invoice_generated_successfully"),
                className: "bg-emerald-500",
                variant: "default",
            });
            const link = document.createElement("a");
            link.href = res.full_path;
            link.setAttribute(
                "download",
                res.full_path.split("/").pop() || ""
            );
            link.setAttribute("target", "_blank");

            // Append the link to the body
            document.body.appendChild(link);

            // Trigger the download by simulating a click
            link.click();

            // Clean up and remove the link
            link?.parentNode?.removeChild(link);
        },
        onError: () => {
            setIsAlertOpenAddingProject(false);
            toast({
                title: t("general_error"),
                className: "bg-red-500",
                variant: "default",
            });
        }
    })
    function onSubmitGenerateFacture(
        values: z.infer<typeof generateFactureSchema>
    ) {
        const formData = new FormData();

        formData.append("project_id", String(values.Project));
        formData.append("month", String(values.Month));
        formData.append("year", String(values.Year));

        SaveFactureApiMutation.mutate(formData)
    }
    const modules_json = localStorage.getItem("t3_modules");
    const modules: ModuleApp[] | null = modules_json ? JSON.parse(modules_json) : null;
    const module_exists = modules?.find(mod => mod.module_name == "GFACT") ? true : false;
    if (!module_exists) {
        return null;
    }
    return (
        <Dialog
            open={isAlertOpenAddingProject}
            onOpenChange={() =>
                setIsAlertOpenAddingProject(!isAlertOpenAddingProject)
            }
        >
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    onClick={() => {
                        setIsAlertOpenAddingProject(true);
                    }}
                    className="mx-2 my-2 md:my-0"
                >
                    {t("buttonGenerateFacture")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        generer une facture
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmitGenerateFacture)}
                            className="space-y-8"
                        >


                            <FormField
                                control={form.control}
                                name="Project"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            selectioner un project
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        /* placeholder={t(
                                                            "label_selection"
                                                        ).concat(t("client_b2b_name"))} */
                                                        placeholder="..."
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {projects.map(
                                                    (projects) => (
                                                        <SelectItem
                                                            key={projects.id}
                                                            value={projects.id.toString()}
                                                        >
                                                            {projects.project_name}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="Month"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            selectioner un mois
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder="..."
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {months.map(
                                                    (month) => (
                                                        <SelectItem
                                                            key={month.month_number}
                                                            value={month.month_number.toString()}
                                                        >
                                                            {month.month_name}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="Year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            selectioner un anne
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        /*     placeholder={t(
                                                                "label_selection"
                                                            ).concat(t("client_b2b_name"))} */
                                                        placeholder="..."
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {years.map(
                                                    (year) => (
                                                        <SelectItem
                                                            key={year}
                                                            value={year.toString()}
                                                        >
                                                            {year}
                                                        </SelectItem>
                                                    )
                                                )}
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
                                        setIsAlertOpenAddingProject(false);
                                    }}
                                    className="mx-2 my-2 md:my-0"
                                >
                                    {t("btn_cancel_txt")}
                                </Button>
                                <Button
                                    type="submit"
                                    loading={SaveFactureApiMutation.isPending}
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

export default GenerateFactureProject
