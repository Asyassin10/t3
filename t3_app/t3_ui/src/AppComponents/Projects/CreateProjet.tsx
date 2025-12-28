
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcnuicomponents/ui/select";
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shadcnuicomponents/ui/form";
import { Input } from "@/shadcnuicomponents/ui/input";
import i18n from "@/i18n";
import { get_required_exception } from "@/lib/helpers/language_validation_helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "@/shadcnuicomponents/custom/button";
import { useState } from "react";
import { toast } from "@/shadcnuicomponents/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientB2B } from "@/types/AppTypes";
import { Link } from "react-router-dom";
import { generateProjectCode } from "@/lib/helpers/general_helper";
import { CreatrProjetApi } from "@/axios/AbstractionsApi/ApiProjet";
import { ICreateProjetData } from "@/types/requests_types";

function CreateProjet({ ClientB2B }: { ClientB2B: ClientB2B[] }) {
    const queryClient = useQueryClient();

    const [isAlertOpenAddingProject, setIsAlertOpenAddingProject] = useState(false);
    const { t } = useTranslation()
    const formSchemaCreateProject = z.object({
        ProjectTitle: z.string({ required_error: get_required_exception(i18n.language, t("projet_name")) })
            .min(1, {
                message: get_required_exception(i18n.language, t("projet_name"))
            }),
        ProjectInfo: z.string({ required_error: get_required_exception(i18n.language, t("projet_info")) })
            .min(1, {
                message: get_required_exception(i18n.language, t("projet_info"))
            }),

        ProjectDure: z.coerce.number({
            required_error: get_required_exception(i18n.language, t("dure")),
        }).min(0, {
            message: get_required_exception(i18n.language, t("dure")),
        }),

        ProjectClientB2B: z
            .string({ required_error: get_required_exception(i18n.language, t("client_b2b_link")) })
            .min(0, { message: get_required_exception(i18n.language, t("client_b2b_link")) }),
    });
    const form = useForm<z.infer<typeof formSchemaCreateProject>>({
        resolver: zodResolver(formSchemaCreateProject),
        defaultValues: {
            ProjectTitle: "",
            ProjectInfo: "",
        },
    });
    const CreatrProjetMutation = useMutation({
        mutationKey: ['create-project'],
        mutationFn: (values: ICreateProjetData) => CreatrProjetApi(values),
        onSuccess: () => {
            setIsAlertOpenAddingProject(false);
            toast({
                title: t("project_created_successfully"),
                className: "bg-emerald-500",
                variant: "default",
            });
            queryClient.invalidateQueries({
                queryKey: ["projects_query"],
            });
            form.reset({
                ProjectTitle: "",
                ProjectInfo: "",
            })
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

    function onSubmit(values: z.infer<typeof formSchemaCreateProject>) {

        CreatrProjetMutation.mutate({
            client_b2b_id: values.ProjectClientB2B,
            project_name: values.ProjectTitle,
            dure: values.ProjectDure.toString(),
            codeprojet: generateProjectCode(),
            info: values.ProjectInfo,
        });

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
                    {t("buttonAddProjects")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle> {t("labelAddProjects")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="ProjectTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        {/*   <FormLabel>Name</FormLabel> */}
                                        <FormControl>
                                            <Input
                                                placeholder={t("title_name")}
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ProjectInfo"
                                render={({ field }) => (
                                    <FormItem>
                                        {/*  <FormLabel>Name</FormLabel> */}
                                        <FormControl>
                                            <Input placeholder={t("info")} {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ProjectDure"
                                render={({ field }) => (
                                    <FormItem>
                                        {/*  <FormLabel>Name</FormLabel> */}
                                        <FormControl>
                                            <Input
                                                placeholder={t("dure")}
                                                type="number"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ProjectClientB2B"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t("label_selection")} {t("client_b2b")}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={t(
                                                            "label_selection"
                                                        ).concat(t("client_b2b_name"))}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {ClientB2B.map(
                                                    (client_b2b, index) => (
                                                        <SelectItem
                                                            key={index}
                                                            value={client_b2b.id.toString()}
                                                        >
                                                            {client_b2b.client_b2b_name}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            <br />
                                            {/*   */}
                                            {ClientB2B.length ==
                                                0 ? (
                                                <>
                                                    You have no clients
                                                    <Link
                                                        to="/app/client_b2b"
                                                        className="mx-2 font-bold"
                                                    >
                                                        add new client
                                                    </Link>
                                                    .
                                                </>
                                            ) : (
                                                <> You can select a client</>
                                            )}
                                        </FormDescription>
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
                                    loading={CreatrProjetMutation.isPending}
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

export default CreateProjet


/*  {.map( */