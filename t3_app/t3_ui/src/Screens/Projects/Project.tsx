import ErrorPage from "@/AppComponents/ErrorPage";
import GeneralPaginator from "@/AppComponents/GeneralPaginator";
import CreateProjet from "@/AppComponents/Projects/CreateProjet";
import Spinner from "@/AppComponents/Spinner";
import { getAllClientB2BApiQuery } from "@/axios/AbstractionsApi/ApiClientB2b";
import { SaveFactureApi } from "@/axios/AbstractionsApi/ApiFacture";
import { getManagersApiNonPaginated } from "@/axios/AbstractionsApi/ApiManager";
import { AssignProjectToManager, createActiviteApi, deleteProjetAPi, getAllProjects, getAllProjectsStatus } from "@/axios/AbstractionsApi/ApiProjet";
import { getAssignedUsersApi } from "@/axios/AbstractionsApi/ApiUser";
import i18n from "@/i18n";
import { get_max_exception_string, get_required_exception } from "@/lib/helpers/language_validation_helper";
import { loadMonths, loadYears } from "@/lib/helpers/time_helpers";
import GenerateFactureProject from "@/shadcnuicomponents/component/GenerateFactureProject";
import { Button } from "@/shadcnuicomponents/custom/button";
import { Badge } from "@/shadcnuicomponents/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcnuicomponents/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcnuicomponents/ui/table";
//ClientB2B, IManager
import { useToast } from "@/shadcnuicomponents/ui/use-toast";
import { User } from "@/types/AppTypes";
import { ICreateActivity } from "@/types/requests_types";
import {
  enabler_get_all_project_status,
  enabler_get_assigned_users_query,
  get_all_client_b2b_queryEnables,
  managerQueryEnables,
} from "@/utils/react-query/enablers";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileTextIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import moment from "moment";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { z } from "zod";



function Project() {
  const { t } = useTranslation();



  const queryClient = useQueryClient();

  const user = queryClient.getQueryData<User>(['user_data']);
  const SchemaAssignProjectToManager = z.object({
    ManagerId: z
      .string({
        required_error: t("validation.string.empty", { field: t("manager") })
      })
      .min(0, { message: t("validation.string.empty", { field: t("manager") }) }),
    project_manager_price_per_day: z
      .string({
        required_error: t("validation.string.empty", { field: t("client_b2b") })
      })
      .min(0, { message: t("validation.string.empty", { field: t("client_b2b") }) }),
    ProjectId: z
      .string({
        required_error: t("validation.string.empty", { field: t("project") })
      })
      .min(0, { message: t("validation.string.empty", { field: t("project") }) }),
  });



  const createActiviteSchema = z.object({
    id: z.number().optional().nullable(),
    activity_name: z
      .string({
        required_error: get_required_exception(i18n.language, t("name"))
      })
      .min(1, {
        message: get_required_exception(i18n.language, t("name"))
      })
      .max(200, { message: get_max_exception_string(i18n.language, t("name"), 200) }),
    ProjectId: z
      .string({
        required_error: get_required_exception(i18n.language, t("project"))
      })
      .min(0, {
        message: get_required_exception(i18n.language, t("project"))
      }),
  });








  const [isAlertOpenAddingActivity, setIsAlertOpenAddingActivity] =
    useState(false);
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);
/*   const [isLoadingAddingActivity, setisLoadingAddingActivity] = useState(false);
 */  const [
    isAlertOpenAssigningProjectToManager,
    setIsAlertOpenAssigningProjectToManager,
  ] = useState(false);
  /*   const [
      isLoadingAssigningProjectToManager,
      setisLoadingAssigningProjectToManager,
    ] = useState(false); */
  const [selectPage, setSelectPage] = useState(1);

  const managerQuery = useQuery({
    queryKey: ["managers"],
    queryFn: () => getManagersApiNonPaginated(),
    enabled: managerQueryEnables(),
  });


  const formcreateActiviteSchema = useForm<
    z.infer<typeof createActiviteSchema>
  >({
    resolver: zodResolver(createActiviteSchema),
  });
  const formSchemaAssignProjectToManager = useForm<
    z.infer<typeof SchemaAssignProjectToManager>
  >({
    resolver: zodResolver(SchemaAssignProjectToManager),
  });


  const createActiviteApiMutation = useMutation({
    mutationKey: ["createActiviteApi"],
    mutationFn: ({ activity_name, project_id }: ICreateActivity) => createActiviteApi(activity_name, project_id),
    onSuccess: () => {
      setIsAlertOpenAddingActivity(false);
      toast({
        title: t("activity_added_successfully"),
        className: "bg-emerald-500",
        variant: "default",
      });
      queryClient.invalidateQueries({
        queryKey: ["projects_query"],
      });
      formcreateActiviteSchema.reset({
        activity_name: "",
      });
    },
    onError: () => {
      setIsAlertOpenAddingActivity(false);
      toast({
        title: t("general_error"),
        className: "bg-red-500",
        variant: "default",
      });
    }
  });
  function onSubmitCreationActivity(
    values: z.infer<typeof createActiviteSchema>
  ) {
    createActiviteApiMutation.mutate({
      activity_name: values.activity_name,
      project_id: parseInt(values.ProjectId)
    })

  }
  const AssignProjectToManagerMutation = useMutation({
    mutationKey: ["AssignProjectToManager"],
    mutationFn: (data: FormData) => AssignProjectToManager(data),
    onSuccess: () => {
      setIsAlertOpenAssigningProjectToManager(false);
      toast({
        title: t("manager_assigned_to_project_success"),
        className: "bg-emerald-500",
        variant: "default",
      });
      queryClient.invalidateQueries({
        queryKey: ["projects_query"],
      });
    },
    onError: () => {
      setIsAlertOpenAssigningProjectToManager(false);
      toast({
        title: t("general_error"),
        className: "bg-red-500",
        variant: "default",
      });
    }
  })
  function onSubmitAssignProjectToManager(
    values: z.infer<typeof SchemaAssignProjectToManager>
  ) {

    const formData = new FormData();

    formData.append(
      "project_manager_price_per_day",
      values.project_manager_price_per_day?.toString() ?? ""
    );

    formData.append(
      "manager_id",
      values.ManagerId?.toString() ?? ""
    );

    formData.append(
      "project_id",
      values.ProjectId?.toString() ?? ""
    );
    AssignProjectToManagerMutation.mutate(formData)

  }
  const SaveFactureApiMutation = useMutation({
    mutationKey: ["SaveFactureApi"],
    mutationFn: (data: FormData) => SaveFactureApi(data),
    onSuccess: (res) => {
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
      toast({
        title: t("general_error"),
        className: "bg-red-500",
        variant: "default",
      });
    }
  })
  const generateFactureBasedOnTheCurrentMonth = (project_id: number) => {
    const formData = new FormData();

    formData.append("project_id", project_id.toString());
    formData.append("month", (moment().month() + 1).toString());
    formData.append("year", moment().year().toString());
    SaveFactureApiMutation.mutate(formData)
  }
  const deleteProjetAPiMutation = useMutation({
    mutationKey: ["deleteProjetAPi"],
    mutationFn: (id: number) => deleteProjetAPi(id),
    onSuccess: () => {
      setOpenDialogId(null);
      queryClient.invalidateQueries({
        queryKey: ["projects_query"],
      });
      toast({
        title: t("project_deleted_successfully"),
        description: "Le manager a été supprimé avec succès",
        className: "bg-emerald-500",
        variant: "default",
      });
    },
    onError: () => {
      setOpenDialogId(null)

      queryClient.invalidateQueries({
        queryKey: ["projects_query"],
      });
      toast({
        title: t("general_error"),
        className: "bg-red-500",
        variant: "default",
      });
    }
  })
  const [selectedMonth, setselectedMonth] = useState<string | undefined>(
    undefined
  );
  const [selectedYear, setselectedYear] = useState<string | undefined>(
    undefined
  );
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [clientB2b, setClientB2b] = useState<string | undefined>(undefined);
  const Delete_Project = (id: number) => {
    deleteProjetAPiMutation.mutate(id)

  };
  const projects_query = useQuery({
    queryKey: ["projects_query", selectPage, selectedMonth, selectedYear, userId, status, clientB2b],
    queryFn: () => getAllProjects(selectPage, selectedMonth, selectedYear, userId, status, clientB2b)
  });

  const get_all_client_b2b_query = useQuery({
    queryKey: ["get_all_client_b2b_query"],
    queryFn: () => getAllClientB2BApiQuery(),
    enabled: get_all_client_b2b_queryEnables(),
  });
  const get_all_project_status = useQuery({
    queryKey: ["get_all_project_status"],
    queryFn: () => getAllProjectsStatus(),
    enabled: enabler_get_all_project_status(),
  });
  const { toast } = useToast();

  const years = loadYears(5);
  const months = loadMonths();


  const get_assigned_users_query = useQuery({
    queryKey: ["get_assigned_users_query"],
    queryFn: () => getAssignedUsersApi(),
    enabled: enabler_get_assigned_users_query(),
  });




  const resetFilter = () => {
    setSelectPage(1);

    setselectedMonth("");
    setselectedYear("");
    setClientB2b("");
    setStatus("");
    setUserId("");
    queryClient.invalidateQueries({
      queryKey: ["projects_query"],
    });
  };

  if (!user) {
    return <ErrorPage />;
  }

  return (
    <div className=" flex-1 h-full bg-gray-50 w-full overflow-auto">

      {projects_query.isLoading && get_all_client_b2b_query.isLoading ? (
        <div className="flex items-center justify-center w-full h-5/6">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-col justify-end w-full px-5 py-5 md:flex-row">
            {user.role.role_name == "Admin" ||
              user.role.role_name == "ClientEsoft" ? (
              <>
                <GenerateFactureProject months={months} years={years} projects={projects_query.data?.data ?? []} />
                <CreateProjet ClientB2B={get_all_client_b2b_query.data?.data || []} />
                <Dialog
                  open={isAlertOpenAssigningProjectToManager}
                  onOpenChange={() =>
                    setIsAlertOpenAssigningProjectToManager(
                      !isAlertOpenAssigningProjectToManager
                    )
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAlertOpenAssigningProjectToManager(true);
                      }}
                      className="mx-2 my-2 md:my-0"
                    >
                      {t("button_assign_project_to_manager")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        {t("assign_project_to_manager")}
                      </DialogTitle>
                      <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Form {...formSchemaAssignProjectToManager}>
                        <form
                          onSubmit={formSchemaAssignProjectToManager.handleSubmit(
                            onSubmitAssignProjectToManager
                          )}
                          className="space-y-8"
                        >
                          <FormField
                            control={formSchemaAssignProjectToManager.control}
                            name="ProjectId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t("label_selection")} {t("projet")}
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={t("title_name")}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {projects_query.data &&
                                      projects_query.data.data &&
                                      projects_query.data.data.map(
                                        (project, index) => (
                                          <SelectItem
                                            key={index}
                                            value={project.id.toString()}
                                          >
                                            {project.project_name}
                                          </SelectItem>
                                        )
                                      )}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  {/*  <Link href="/examples/forms">email settings</Link>. */}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formSchemaAssignProjectToManager.control}
                            name="project_manager_price_per_day"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel> price per day</FormLabel>
                                <FormControl>
                                  <Input placeholder="20" {...field} />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formSchemaAssignProjectToManager.control}
                            name="ManagerId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t("label_selection")} {t("manager")}
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={t("manager")}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {managerQuery.data?.map(
                                      (manager, index) => (
                                        <SelectItem
                                          key={index}
                                          value={manager.id.toString()}
                                        >
                                          {manager.user.name}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  {/*  <Link href="/examples/forms">email settings</Link>. */}
                                  {managerQuery.data?.length == 0 ? (
                                    <>
                                      {t("no_managers")}
                                      <Link
                                        to="/app/managers"
                                        className="mx-2 font-bold"
                                      >
                                        {t("add_new_manager")}
                                      </Link>
                                      .
                                    </>
                                  ) : (
                                    <> {t("select_a_manager")}</>
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
                                setIsAlertOpenAssigningProjectToManager(
                                  false
                                );
                              }}
                            >
                              {t("btn_cancel_txt")}
                            </Button>
                            <Button
                              type="submit"
                              loading={AssignProjectToManagerMutation.isPending}
                            >
                              {t("btn_submit_txt")}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={isAlertOpenAddingActivity}
                  onOpenChange={() =>
                    setIsAlertOpenAddingActivity(!isAlertOpenAddingActivity)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAlertOpenAddingActivity(true);
                      }}
                      className="mx-2 my-2 md:my-0"
                    >
                      {t("buttonAddActivites")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle> {t("labelAddActivites")}</DialogTitle>
                      <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Form {...formcreateActiviteSchema}>
                        <form
                          onSubmit={formcreateActiviteSchema.handleSubmit(
                            onSubmitCreationActivity
                          )}
                          className="space-y-8"
                        >
                          <FormField
                            control={formcreateActiviteSchema.control}
                            name="ProjectId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t("label_selection")} {t("project")}
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={t("title_name")}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {projects_query.data &&
                                      projects_query.data?.data.map(
                                        (project, index) => (
                                          <SelectItem
                                            key={index}
                                            value={project.id.toString()}
                                          >
                                            {project.project_name}
                                          </SelectItem>
                                        )
                                      )}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  {/*  <Link href="/examples/forms">email settings</Link>. */}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formcreateActiviteSchema.control}
                            name="activity_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel> {t("activity_name")}</FormLabel>
                                <FormControl>
                                  <Input placeholder=" " {...field} />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button
                              type="button"
                              variant={"destructive"}
                              onClick={() => {
                                setIsAlertOpenAddingActivity(false);
                              }}
                            >
                              {t("btn_cancel_txt")}
                            </Button>
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
              </>
            ) : null}
            {user.role.role_name == "Manager" && (
              <Dialog
                open={isAlertOpenAddingActivity}
                onOpenChange={() =>
                  setIsAlertOpenAddingActivity(!isAlertOpenAddingActivity)
                }
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAlertOpenAddingActivity(true);
                    }}
                    className="mx-2 my-2 md:my-0"
                  >
                    {t("buttonAddActivites")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle> {t("labelAddActivites")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Form {...formcreateActiviteSchema}>
                      <form
                        onSubmit={formcreateActiviteSchema.handleSubmit(
                          onSubmitCreationActivity
                        )}
                        className="space-y-8"
                      >
                        <FormField
                          control={formcreateActiviteSchema.control}
                          name="ProjectId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("label_selection")} {t("project")}
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={t("title_name")}
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {projects_query.data?.data.map(
                                    (project, index) => (
                                      <SelectItem
                                        key={index}
                                        value={project.id.toString()}
                                      >
                                        {project.project_name}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                {/*  <Link href="/examples/forms">email settings</Link>. */}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formcreateActiviteSchema.control}
                          name="activity_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel> {t("activity_name")}</FormLabel>
                              <FormControl>
                                <Input placeholder=" " {...field} />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button
                            type="button"
                            variant={"destructive"}
                            onClick={() => {
                              setIsAlertOpenAddingActivity(false);
                            }}
                          >
                            {t("btn_cancel_txt")}
                          </Button>
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
            )}
          </div>
          <hr className="m-1" />
          <div className="flex flex-col items-center w-full px-5 space-y-4 md:flex-row md:justify-between">
            <h2 className="w-full m-1 font-bold md:w-1/4">
              {t("list_of_projets")}
              <span className="mx-2">
                {projects_query.data?.data.length}
              </span>
            </h2>
            <div className="flex flex-col w-full md:w-3/4 md:flex-row md:justify-end">
              <div className="w-full mx-2 my-2 md:w-1/6 md:my-0 ">
                <Select
                  value={selectedYear}
                  onValueChange={(e) => {
                    //  field.onChange
                    setselectedYear(e);
                  }}
                //  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectedyear")} />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year, index) => (
                      <SelectItem value={year.toString()} key={index}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full mx-2 my-2 md:w-1/6 md:my-0 ">
                <Select
                  value={status}
                  onValueChange={(e) => {
                    //  field.onChange
                    // setselectedYear(e)
                    setStatus(e);
                  }}
                //  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    {get_all_project_status.data?.status.map(
                      (statu, index) => (
                        <SelectItem key={index} value={statu}>
                          {/*  {statu} */}
                          {statu == "PENDING" && t("statut_txt_pending")}
                          {statu == "VALID" && t("statut_txt_valid")}
                          {statu == "NOT_VALID" && t("statut_txt_not_valid")}
                          {statu == "InProgress" && t("progress")}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full mx-2 my-2 md:w-1/6 md:my-0 ">
                <Select
                  onValueChange={(e) => {
                    //  field.onChange
                    setselectedMonth(e);
                  }}
                  value={selectedMonth}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectedmouth")} />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem value={month.month_number.toString()} key={index}>
                        {month.month_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full mx-2 my-2 md:w-1/6 md:my-0 ">
                <Select
                  value={userId}
                  onValueChange={(e) => {
                    setUserId(e);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectUser")} />
                  </SelectTrigger>
                  <SelectContent>
                    {get_assigned_users_query.data?.map((user, index) => (
                      <SelectItem key={index} value={user.id.toString()}>
                        {user.name} - {user.role.role_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {user.role.role_name == "ClientEsoft" && (
                <div className="w-full mx-2 my-2 md:w-1/6 md:my-0 ">
                  <Select
                    onValueChange={(e) => {
                      setClientB2b(e);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectClient")} />
                    </SelectTrigger>
                    <SelectContent>
                      {get_all_client_b2b_query.data?.data.map((client, index) => (
                        <SelectItem key={index} value={client.id.toString()}>
                          {client.client_b2b_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="w-full mx-2 my-2 md:w-1/4 md:my-0 ">

                <Button
                  variant="outline"
                  onClick={() => {
                    resetFilter();
                  }}
                  className="mx-2"
                >
                  {t("btntxtresetfilter")}
                </Button>
              </div>
            </div>
          </div>
          <hr className="m-4" />
          <div className="flex mt-8 bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    {t("title_name")}
                  </TableHead>
                  <TableHead>{t("client_b2b_name")}</TableHead>
                  <TableHead>{t("dure")}</TableHead>
                  <TableHead>{t("codeprojet")}</TableHead>
                  <TableHead>{t("info")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("activity_name")}</TableHead>
                  <TableHead>{t("manager")}</TableHead>
                  {user.role.role_name != "Consultant" && (
                    <>
                      <TableHead>Consultants</TableHead>
                      <TableHead>actions</TableHead>
                    </>
                  )}
                  {/*  {user.role.role_name == "Manager" && (
                      <TableHead>Actions</TableHead>
                    )} */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects_query.data?.data.map((project, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {project.project_name} / {project.id}
                    </TableCell>
                    <TableCell>
                      {project.project_b_to_b?.client_b2b_name}
                    </TableCell>
                    <TableCell>
                      {project.dure} {t("month")}
                    </TableCell>
                    <TableCell>{project.codeprojet}</TableCell>
                    <TableCell>{project.info}</TableCell>
                    <TableCell>
                      {project.status == "PENDING" ? (
                        <p className="text-orange-500">
                          {t("statut_txt_pending")}
                        </p>
                      ) : project.status == "VALID" ? (
                        <p className="text-emerald-500">
                          {t("statut_txt_valid")}
                        </p>
                      ) : project.status == "NOT_VALID" ? (
                        <p className="text-red-500">
                          {t("statut_txt_not_valid")}
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <div className="flex">
                        {project.activities?.map((act, index) => (
                          <Badge key={index}>{act.activity_name}</Badge>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell>
                      {project.manager?.user.name ?? "---"}
                    </TableCell>
                    {user.role.role_name != "Consultant" && (
                      <>
                        <TableCell>
                          {project.consultants.map((con, index) => (
                            <>
                              <Badge key={index}>{con.user.name}</Badge>
                            </>
                          ))}
                        </TableCell>
                        <TableCell>
                          {user.role.role_name == "Manager" || user.role.role_name == "ClientEsoft" && (
                            <Button variant={"secondary"} size="icon"
                              onClick={() => {
                                generateFactureBasedOnTheCurrentMonth(project.id)
                              }}
                            >
                              <FileTextIcon className="w-4 h-4 text-black-600" />
                            </Button>
                          )}
                          <Button variant="secondary" size="icon" className="ml-2" onClick={() =>
                            setOpenDialogId(project.id)} >
                            <Trash className="w-4 h-4 text-red-600" />
                          </Button>
                        </TableCell>
                        {/* Dialog for delete confirmation */}
                        <Dialog open={openDialogId === project.id} onOpenChange={() =>
                          setOpenDialogId(null)}>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{t("project_delete_confirmation")}
                                {" "}{project.project_name}</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                              {t("confirm_delete_project")}
                            </DialogDescription>
                            <DialogFooter>
                              <Button variant="outline" onClick={() =>
                                setOpenDialogId(null)}>{t("btn_cancel_txt")}</Button>
                              <Button loading={deleteProjetAPiMutation.isPending} variant="destructive" onClick={() => Delete_Project(project.id)}>Supprimer</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="my-4">
            {projects_query.data && (
              <GeneralPaginator
                pagination={projects_query.data}
                onPageChange={setSelectPage}
              />
            )}

          </div>

        </div>
      )}
    </div>
  );
}

export default Project;
