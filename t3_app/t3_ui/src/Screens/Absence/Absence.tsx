import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shadcnuicomponents/ui/empty";
import i18n from "@/i18n";
import {
  ObjectNonValidWithSuccess,
  ObjectPendingWithSuccess,
  ObjectValidatedWithSuccess
} from "@/lib/helpers/language_http_messages_hekper";
import { Button } from "@/shadcnuicomponents/custom/button";
import {
  Card, CardFooter
} from "@/shadcnuicomponents/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcnuicomponents/ui/select";
import { useToast } from "@/shadcnuicomponents/ui/use-toast";
import {
  IAbsence,
  IAbsenceStatus, User
} from "@/types/AppTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { enabler_get_assigned_users_query } from "@/utils/react-query/enablers";
import { loadMonths, loadYears } from "@/lib/helpers/time_helpers";
import { getAbsences, getAllAbsenceStatus, updateAbsenceAPi } from "@/axios/AbstractionsApi/ApiAbsence";
import { IUpdateAbsenceStatus } from "@/types/requests_types";
import { getAssignedUsersApi } from "@/axios/AbstractionsApi/ApiUser";
import GeneralPaginator from "@/AppComponents/GeneralPaginator";
import CreateAbsenceRequest from "@/AppComponents/Absence/CreateAbsenceRequest";
import ErrorPage from "@/AppComponents/ErrorPage";
import { AlertCircle, CalendarDays, CheckCircle2, Clock, RefreshCw, Table, User as UserIcon, XCircle } from "lucide-react";
import { Badge } from "@/shadcnuicomponents/ui/badge";
import { getStatusLabel } from "@/lib/helpers/general_helper";
function Absence() {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>(['user_data']);
  const { t } = useTranslation();
  const [selectPage, setSelectPage] = useState(1);
  const [selectedMonth, setselectedMonth] = useState<string | undefined>(
    undefined
  );
  const [selectedYear, setselectedYear] = useState<string | undefined>(
    undefined
  );
  const [Status, setStatus] = useState<string | undefined>(undefined);
  const [UserId, setUserId] = useState<string | undefined>(undefined);
  const absenceQuery = useQuery({
    queryKey: ["absences", selectPage, selectedMonth, selectedYear, Status, UserId],
    queryFn: () => getAbsences(selectPage, selectedMonth, selectedYear, Status, UserId)
  });
  const updateAbsenceMutation = useMutation({
    mutationKey: ["updateAbsence"],
    mutationFn: (data: IUpdateAbsenceStatus) => updateAbsenceAPi(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["absences"],
      });
      if (res.status == "VALID") {
        toast({
          title: ObjectValidatedWithSuccess(
            i18n.language,
            t("alpha_type_absence_full")
          ),
          className: "bg-emerald-500",
          variant: "default",
        });
      }
      if (res.status == "PENDING") {
        toast({
          title: ObjectPendingWithSuccess(
            i18n.language,
            t("alpha_type_absence_full")
          ),
          className: "bg-emerald-500",
          variant: "default",
        });
      }
      if (res.status == "NOT_VALID") {
        toast({
          title: ObjectNonValidWithSuccess(
            i18n.language,
            t("alpha_type_absence_full")
          ),
          className: "bg-emerald-500",
          variant: "default",
        });
      }
    }
  })
  const updateAbsence = (absenceId: number, status: IAbsenceStatus) => {
    const data: { id: number; status: IAbsenceStatus } = {
      id: absenceId,
      status: status,
    };
    updateAbsenceMutation.mutate(data)
  };
  const { toast } = useToast();
  const get_all_absence_status_query = useQuery({
    queryKey: ["get_all_absence_status_query"],
    queryFn: () => getAllAbsenceStatus()
  });
  const get_assigned_users_query = useQuery({
    queryKey: ["get_assigned_users_query"],
    queryFn: () => getAssignedUsersApi(),
    enabled: enabler_get_assigned_users_query(),
  });
  const years = loadYears(5);
  const months = loadMonths();
  const resetFilter = () => {
    setSelectPage(1);
    setselectedMonth("");
    setselectedYear("");
    setStatus("");
    setUserId("");
    queryClient.invalidateQueries({
      queryKey: ["absences"],
    });
  };
  if (!user) {
    return <ErrorPage />;
  }

  const canDoActionOnAbsenceRequest = (absenceRequest: IAbsence, user: User): boolean => {
    if (user.role.role_name == "ClientEsoft") {
      return true;
    }
    if (user.id == absenceRequest.user_id) {
      return false;
    }
    return false;
  }

  const getStatusVariant = (status: IAbsenceStatus) => {
    switch (status) {
      case "VALID":
        return "success"

      case "PENDING":
        return "warning"

      case "NOT_VALID":
        return "destructive"

      default:
        return "secondary"
    }
  }

  return (
    <div className=" flex-1 h-full bg-gray-50 w-full p-6 lg:p-8 overflow-auto">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ">
        <div className="relative">
          <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent blur-2xl" />
          <div className="relative">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
              {t("list_of_absences")}
            </h1>
            <p className="mt-2 text-pretty text-sm text-muted-foreground lg:text-base">
              {t("manage_absence_requests")}
            </p>
          </div>
        </div>
        <CreateAbsenceRequest setSelectPage={setSelectPage} />
      </div>

      <Card className="mb-8 border-border/40 bg-gradient-to-br from-card/80 via-card/60 to-card/80 p-5  backdrop-blur-xl rounded-xl shadow-none ">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Select
            value={selectedYear}
            onValueChange={(e) => {
              setselectedYear(e);
            }}
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
          <Select
            value={Status}
            onValueChange={(e) => {
              setStatus(e);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              {get_all_absence_status_query.data?.status.map(
                (statu, index) => (
                  <SelectItem key={index} value={statu}>
                    {statu == "PENDING" ? (
                      <p className="text-orange-500">
                        {t("statut_txt_pending")}
                      </p>
                    ) : statu == "VALID" ? (
                      <p className="text-emerald-500">
                        {t("statut_txt_valid")}
                      </p>
                    ) : statu == "NOT_VALID" ? (
                      <p className="text-red-500">
                        {t("statut_txt_not_valid")}
                      </p>
                    ) : (
                      <p className="text-red-500">
                        {t("statut_txt_cancelled")}
                      </p>
                    )}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
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
          <Select
            value={UserId}
            onValueChange={(e) => {
              setUserId(e);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectUser")} />
            </SelectTrigger>
            <SelectContent>
              {get_assigned_users_query.data?.map((concultant, index) => (
                <SelectItem key={index} value={concultant.id.toString()}>
                  {concultant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="gap-2 border-border/50 bg-background/80 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-background"
            onClick={() => {
              resetFilter();
            }}
          >
            <RefreshCw className="h-4 w-4" />
            {t("btntxtresetfilter")}
          </Button>
        </div>
      </Card>
      {absenceQuery.data?.data.length == 0 ? <>

        <Empty className="">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Table />
            </EmptyMedia>
            <EmptyTitle>    {t("no_absences")}</EmptyTitle>
            <EmptyDescription>
              ---
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <CreateAbsenceRequest setSelectPage={setSelectPage} />
          </EmptyContent>
        </Empty>
      </> : <>
        <Card className="overflow-hidden border-border/40 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("reason")}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("user")}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("date_debut")}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("date_fin")}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("dure")}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("status")}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {absenceQuery.data?.data.map((absence, index) => (
                  <tr
                    key={absence.id}
                    className="group transition-all duration-200 hover:bg-muted/20"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: "fadeIn 0.5s ease-out forwards",
                    }}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-1 rounded-full bg-primary/20 transition-all duration-300 group-hover:w-1.5 group-hover:bg-primary" />
                        <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                          {absence.reason}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-primary/10 p-1.5 transition-all group-hover:bg-primary/20 group-hover:scale-110">
                          <UserIcon className="h-3.5 w-3.5 text-primary" />
                        </div>
                        {absence.user?.id === user.id ? (

                          <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">

                            {t("me")}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                            {absence.user?.name}
                          </span>

                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                        <span className="text-sm text-muted-foreground">
                          {i18n.language === "fr"
                            ? moment(absence.date_debut)
                              .locale(i18n.language)
                              .format("dddd, D MMMM YYYY")
                            : moment(absence.date_debut)
                              .locale(i18n.language)
                              .format("dddd,YYYY-MM-DD")}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                        <span className="text-sm text-muted-foreground">
                          {i18n.language === "fr"
                            ? moment(absence.date_fin)
                              .locale("fr")
                              .format("dddd, D MMMM YYYY")
                            : moment(absence.date_fin)
                              .locale("en")
                              .format("dddd, YYYY-MM-DD")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-accent-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          {absence.nombre_des_jours} {t("days")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge
                        variant={getStatusVariant(absence.status) as any}
                        className="shadow-sm transition-all  group-hover:scale-105 group-hover:shadow-md"
                      >
                        {absence.status === "VALID" && <CheckCircle2 className="h-3 w-3" />}
                        {absence.status === "PENDING" && <AlertCircle className="h-3 w-3" />}
                        {absence.status === "NOT_VALID" && <XCircle className="h-3 w-3" />}
                        <span className="mx-1">
                          {getStatusLabel(absence.status)}
                        </span>
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        {canDoActionOnAbsenceRequest(absence, user) && (
                          <>
                            {absence.status === "PENDING" && (
                              <CardFooter className="flex justify-between">
                                {(user.role.role_name === "Manager" || user.role.role_name === "ClientEsoft") && (
                                  <>
                                    <Button
                                      className="bg-emerald-500"
                                      onClick={() => {
                                        updateAbsence(absence.id, "VALID");
                                      }}
                                    >
                                      {t("validate")}
                                    </Button>
                                    <Button
                                      className="mx-3 bg-red-500"
                                      onClick={() => {
                                        updateAbsence(absence.id, "NOT_VALID");
                                      }}
                                    >
                                      {t("rejecting")}
                                    </Button>
                                  </>
                                )}
                              </CardFooter>
                            )}

                            {absence.status === "VALID" && (
                              <CardFooter className="flex justify-between">
                                {(user.role.role_name === "Manager" || user.role.role_name === "ClientEsoft") && (
                                  <Button
                                    className="bg-emerald-500"
                                    onClick={() => {
                                      updateAbsence(absence.id, "PENDING");
                                    }}
                                  >
                                    {t("cancel")}
                                  </Button>
                                )}
                              </CardFooter>
                            )}

                            {absence.status === "NOT_VALID" && (
                              <CardFooter className="flex justify-between">
                                {(user.role.role_name === "Manager" || user.role.role_name === "ClientEsoft") && (
                                  <>
                                    <Button
                                      className="bg-emerald-500"
                                      onClick={() => {
                                        updateAbsence(absence.id, "PENDING");
                                      }}
                                    >
                                      {t("cancel")}
                                    </Button>
                                  </>
                                )}
                              </CardFooter>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}


              </tbody>

            </table>
          </div>
          <div className="my-4">
            {absenceQuery.data && (
              <GeneralPaginator
                pagination={absenceQuery.data}
                onPageChange={setSelectPage}
              />
            )}
          </div>
        </Card>
      </>}


    </div >
  );
}
export default Absence;
