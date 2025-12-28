/* 
export default Concultant
 */
import ErrorPage from "@/AppComponents/ErrorPage";
import GeneralPaginator from "@/AppComponents/GeneralPaginator";
import Spinner from "@/AppComponents/Spinner";
import UnauthorizedPage from "@/AppComponents/UnauthorizedPage";
import { AssignConsultantToProjetApi, createConsultantApi, getAllConcultantApi, getAllConcultantApiNonPaginated } from "@/axios/AbstractionsApi/ApiConsultant";
import { getProjectsNonPaginated } from "@/axios/AbstractionsApi/ApiProjet";
import i18n from "@/i18n";
import { get_max_exception_string, noDataMessage } from "@/lib/helpers/language_validation_helper";
import ConditionalRoleContent from "@/Router/ConditionalRoleContent";
import { Button } from "@/shadcnuicomponents/custom/button";
import { Badge } from "@/shadcnuicomponents/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/shadcnuicomponents/ui/card";
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
import { useToast } from "@/shadcnuicomponents/ui/use-toast";
import { User } from "@/types/AppTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
function Concultant() {
  const { t } = useTranslation()
  const SchemaAssignProjectToConcultant = z.object({
    ConcultantId: z
      .string({
        required_error: t("validation.string.empty", { field: t("consultant") })
      })
      .min(0, {
        message: t("validation.string.empty", { field: t("consultant") })
      }),
    ProjectId: z
      .string({
        required_error: t("validation.string.empty", { field: t("project") })
      })
      .min(0, {
        message: t("validation.string.empty", { field: t("project") })
      }),
    price_per_day: z
      .string({
        required_error: t("validation.string.empty", { field: t("age") })
      })
      .refine((value) => !isNaN(parseInt(value)) && Number(value) >= 0, {
        message: t("validation.string.empty", { field: t("age") })
      })
      .transform((value) => Number(value)),
  });
  const SchemaCreateConcultant = z.object({
    email: z
      .string({
        required_error: t("validation.string.empty", { field: t("email") })
      })
      .min(1, { message: t("validation_trans_email_required") })
      .max(200, { message: get_max_exception_string(i18n.language, t("email"), 200) })
      .email({ message: t("validation_trans_email_invalid") }),
    name: z
      .string({
        required_error: t("validation.string.empty", { field: t("name") })
      })
      .max(200, { message: get_max_exception_string(i18n.language, t("name"), 200) })
      .min(1, {
        message: t("validation.string.empty", { field: t("name") })
      }),
    professionality: z
      .string({
        required_error: t("validation.string.empty", { field: t("name") })
      })
      .max(200, { message: get_max_exception_string(i18n.language, t("professionality"), 200) })
      .min(1, {
        message: t("validation.string.empty", { field: t("name") })
      }),
  });
  const [IsAlertOpen, setIsAlertOpen] = useState(false);
  const [valueSearch, setvalueSearch] = useState("");
  const [
    IsAlertOpenAssignProjectToConcultant,
    setIsAlertOpenAssignProjectToConcultant,
  ] = useState(false);
  const [selectPage, setSelectPage] = useState(1);
  const concultant_query = useQuery({
    queryKey: ["concultant_query", selectPage, valueSearch],
    queryFn: () => getAllConcultantApi(selectPage, valueSearch)
  });
  const concultant_query_non_paginated = useQuery({
    queryKey: ["concultant_query_non_paginated", selectPage, valueSearch],
    queryFn: () => getAllConcultantApiNonPaginated(selectPage, valueSearch)
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const formSchemaAssignProjectToConcultant = useForm<
    z.infer<typeof SchemaAssignProjectToConcultant>
  >({
    resolver: zodResolver(SchemaAssignProjectToConcultant),
  });
  const AssignConsultantToProjetApiMutation = useMutation({
    mutationKey: ["AssignConsultantToProjetApi"],
    mutationFn: (data: FormData) => AssignConsultantToProjetApi(data),
    onSuccess: () => {
      setIsAlertOpenAssignProjectToConcultant(false);
      toast({
        title: t("consultant_assigned_successfully"),
        className: "bg-emerald-500",
        variant: "default",
      });
      queryClient.invalidateQueries({
        queryKey: ["concultant_query"],
      });
    },
    onError: () => {
      setIsAlertOpenAssignProjectToConcultant(false);
      toast({
        title: t("general_error"),
        className: "bg-red-500",
        variant: "default",
      });
    }
  })
  function onSubmitAssignProjectToConcultant(
    values: z.infer<typeof SchemaAssignProjectToConcultant>
  ) {
    console.log(values);
    const formData = new FormData();
    formData.append("consultant_id", String(values.ConcultantId));
    formData.append("project_id", String(values.ProjectId));
    formData.append("price_per_day", String(values.price_per_day));
    AssignConsultantToProjetApiMutation.mutate(formData);
  }
  const projects_query = useQuery({
    queryKey: ["projects_query_non_paginated"],
    queryFn: () => getProjectsNonPaginated()
  });
  const formSchemaCreateConcultant = useForm<
    z.infer<typeof SchemaCreateConcultant>
  >({
    resolver: zodResolver(SchemaCreateConcultant),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  const createConsultantApiMutation = useMutation({
    mutationKey: ["createConsultantApi"],
    mutationFn: (data: FormData) => createConsultantApi(data),
    onSuccess: () => {
      setIsAlertOpen(false);
      toast({
        title: t("consultant_created_successfully"),
        className: "bg-emerald-500",
        variant: "default",
      });
      formSchemaCreateConcultant.reset();
      setSelectPage(1)
      queryClient.invalidateQueries({
        queryKey: ["concultant_query"],
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
  })
  function onSubmit(values: z.infer<typeof SchemaCreateConcultant>) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("professionality", values.professionality);
    createConsultantApiMutation.mutate(formData);
  }
  const reserSearch = () => {
    setvalueSearch("");
    setSelectPage(1);
    queryClient.invalidateQueries({
      queryKey: ["concultant_query"],
    });
  };

  const user = queryClient.getQueryData<User>(['user_data']);
  if (!user) {
    return <ErrorPage />;
  }
  const allowedRoles = ["ClientEsoft", "Manager", "Admin"];

  // only allow ClientEsoft / Manager / Admin
  if (!allowedRoles.includes(user.role.role_name)) {
    return <UnauthorizedPage />;
  }

  return (
    <div className=" flex-1 h-full bg-gray-50 w-full overflow-auto">
      <div className="flex flex-col w-full">
        <div className="flex flex-col justify-end w-full px-5 py-5 md:flex-row">
          <ConditionalRoleContent user_role={user.role.role_name} allowed_roles={["ClientEsoft"]}>
            <Dialog
              open={IsAlertOpen}
              onOpenChange={() => setIsAlertOpen(!IsAlertOpen)}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAlertOpen(true);
                  }}
                  className="mx-2 my-2 md:my-0"
                >
                  {t("buttonAddConsultants")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle> {t("labelAddConsultants")} </DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Form {...formSchemaCreateConcultant}>
                    <form
                      onSubmit={formSchemaCreateConcultant.handleSubmit(
                        onSubmit
                      )}
                      className="space-y-8"
                    >
                      <FormField
                        control={formSchemaCreateConcultant.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("name")} & {t("first_name")} :
                            </FormLabel>
                            <FormControl>
                              <Input placeholder={t("name")} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formSchemaCreateConcultant.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel> {t("email")} </FormLabel>
                            <FormControl>
                              <Input placeholder={t("email")} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formSchemaCreateConcultant.control}
                        name="professionality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel> {t("professionality")} </FormLabel>
                            <FormControl>
                              <Input placeholder={t("professionality")} {...field} />
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
                            setIsAlertOpen(false);
                            formSchemaCreateConcultant.reset();
                          }}
                        >
                          {t("btn_cancel_txt")}
                        </Button>
                        <Button
                          type="submit"
                          loading={createConsultantApiMutation.isPending}
                        >
                          {t("btn_submit_txt")}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          </ConditionalRoleContent>
          <ConditionalRoleContent user_role={user.role.role_name} allowed_roles={["ClientEsoft", "Manager"]}>
            <Dialog
              open={IsAlertOpenAssignProjectToConcultant}
              onOpenChange={() =>
                setIsAlertOpenAssignProjectToConcultant(
                  !IsAlertOpenAssignProjectToConcultant
                )
              }
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAlertOpenAssignProjectToConcultant(true);
                  }}
                  className="mx-2 my-2 md:my-0"
                >
                  {t("button_assign_project")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t("assign_project")}</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Form {...formSchemaAssignProjectToConcultant}>
                    <form
                      onSubmit={formSchemaAssignProjectToConcultant.handleSubmit(
                        onSubmitAssignProjectToConcultant
                      )}
                      className="space-y-8"
                    >
                      <FormField
                        control={formSchemaAssignProjectToConcultant.control}
                        name="ConcultantId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("label_selection")} Consultant
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Consultant" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {concultant_query_non_paginated.data &&
                                  concultant_query_non_paginated.data.map(
                                    (concultant, index) => (
                                      <SelectItem
                                        key={index}
                                        value={concultant.id.toString()}
                                      >
                                        {concultant.user &&
                                          concultant.user.name}
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
                        control={formSchemaAssignProjectToConcultant.control}
                        name="price_per_day"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel>le prix par jour</FormLabel>
                            <FormControl>
                              <Input placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formSchemaAssignProjectToConcultant.control}
                        name="ProjectId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("label_selection")} {t("projet_name")}
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t("projet_name")}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {projects_query.data?.map(
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
                      <DialogFooter>
                        <Button
                          type="button"
                          variant={"destructive"}
                          onClick={() => {
                            setIsAlertOpenAssignProjectToConcultant(false);
                          }}
                        >
                          {t("btn_cancel_txt")}
                        </Button>
                        <Button
                          type="submit"
                          loading={AssignConsultantToProjetApiMutation.isPending}
                        >
                          {t("btn_submit_txt")}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          </ConditionalRoleContent>
        </div>
        <hr className="m-4" />
        <div className="flex items-center justify-between px-5">
          <h2 className="font-bold">
            {t("list_of_consultants")}
            :<span className="mx-2">
              {concultant_query.data?.total}
            </span>
          </h2>
          <div className="md:flex">
            <div>
              <Input
                type="text"
                value={valueSearch}
                onChange={(e) => {
                  setvalueSearch(e.target.value);
                }}
                placeholder={t("inputtxtfilter")}
                className="md:w-[100px] lg:w-[300px]"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                reserSearch();
              }}
              className="ml-4"
            >
              {t("btntxtresetfilter")}
            </Button>
          </div>
        </div>
        <hr className="my-4" />
      </div>
      {concultant_query.isLoading ? (
        <div className="flex items-center justify-center w-full h-5/6">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col w-full ">

          <div className="flex flex-col flex-wrap items-start justify-start flex-1 w-full md:flex-row ">
            {concultant_query.data?.data.length == 0 ?
              <>
                <div className="flex items-center justify-center w-full h-full">
                  <div className="text-lg text-center">
                    {noDataMessage(i18n.language, "consultants")}
                  </div>
                </div>
              </> :
              <>
                {concultant_query.data?.data.map((concultant) => (
                  <Card className="w-full m-2 md:w-1/4 md:my-0 mt-custom">
                    <CardHeader>
                      {/*  <CardTitle>
                        <p className="mt-2 mr-2">
                          <span className="font-bold">{concultant.professionality} :</span>
                          <span>
                            {concultant.user && concultant.user.email}
                          </span>
                        </p>
                      </CardTitle> */}
                      <CardDescription>
                        <p className="text-lg text-black">
                          {concultant.user && concultant.user.name}
                        </p>
                        <br />
                        <p className="text-lg text-black">
                          {concultant.user && concultant.user.email}
                        </p>
                        <br />
                        {t("list_of_projets_affected")} projets
                        <Badge variant="secondary" className="mx-2">
                          {concultant.projects_count}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between">
                      {/* <Button variant="outline">Cancel</Button> */}
                      {/*  <Link to={`/client_b2b_profile/${client_b2b.id}`}>
                                            <Button>Détails</Button>
                                        </Link> */}
                      {/*     <Button>Détails</Button> */}
                    </CardFooter>
                  </Card>
                ))}
              </>
            }
          </div>

        </div>
      )}
      <div className="my-4">
        {concultant_query.data && (
          <GeneralPaginator
            pagination={concultant_query.data}
            onPageChange={setSelectPage}
          />
        )}
      </div>
    </div>
  );
}
export default Concultant;
