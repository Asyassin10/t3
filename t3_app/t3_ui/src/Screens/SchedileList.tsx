
import GeneralPaginator from "@/AppComponents/GeneralPaginator";
import Spinner from "@/AppComponents/Spinner";
import { does_it_have_data_in_the_current_time_query_api, getMyCrasApi, initCraApi } from "@/axios/AbstractionsApi/ApiCra";
import { loadYears, loadMonths } from "@/lib/helpers/time_helpers";
import { Button } from "@/shadcnuicomponents/ui/button";
import {
  CardHeader,
  CardTitle,
  Card,
  CardContent,
} from "@/shadcnuicomponents/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcnuicomponents/ui/select";
import { CRA, User } from "@/types/AppTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
function SchedileList() {
  const { t } = useTranslation()

  const navigate = useNavigate();
  const years = loadYears(5);
  const months = loadMonths();
  const [selectedMonth, setselectedMonth] = useState<string | undefined>(
    undefined
  );
  const [selectedYear, setselectedYear] = useState<string | undefined>(
    undefined
  );

  const queryClient = useQueryClient();

  const user = queryClient.getQueryData<User>(['user_data']);
  const [selectPage, setSelectPage] = useState(1);
  const does_it_have_data_in_the_current_time_query = useQuery({
    queryKey: ["does_it_have_data_in_the_current_time_query"],
    queryFn: () => does_it_have_data_in_the_current_time_query_api()
  });
  const currentDate = moment();
  const cras_query = useQuery({
    queryKey: ["cras_query", selectPage, selectedMonth, selectedYear],
    queryFn: () => getMyCrasApi(selectPage, selectedMonth, selectedYear)
  });


  const initCraApiMutation = useMutation({
    mutationKey: ["initCraApi"],
    mutationFn: () => initCraApi(),
    onSuccess: (data) => {
      navigate(`/app/cra/${data.id}`);

    }
  })
  const initCra = () => {
    initCraApiMutation.mutate()
  };

  const resetFilter = () => {
    setSelectPage(1);
    setselectedMonth("");
    setselectedYear("");

  };


  return (
    <>
      <div className="w-full h-full bg-white">
        {cras_query.isLoading ? (
          <div className="flex items-center justify-center w-full h-5/6">
            <Spinner />
          </div>
        ) : (
          <div className="w-full ">
            <div className="flex flex-col items-center w-full space-y-4 md:flex-row md:justify-between">
              <h2 className="w-full px-5 font-bold md:w-1/4">
                {t("my_times")}
              </h2>
              <div className="flex flex-col w-full md:w-3/4 md:flex-row md:justify-end">
                <div className="w-full mx-2 my-2 md:w-1/6 md:my-0 ">
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
            <hr className="my-4" />
            <div className="flex items-center justify-start w-full">
              {cras_query.data?.data.map((cra: CRA) => (
                <Card className="w-1/4 mx-2">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">
                      {cra.status == "WAITING_TO_VALIDATION" ? (
                        <span className="text-orange-400">
                          {t("waiting_to_validation")}
                        </span>
                      ) : cra.status == "VALIDATED" ? (
                        <span className="text-emerald-500">
                          {t("validated")}
                        </span>
                      ) : (
                        <span className="text-red-500">
                          {t("not_sent_to_validation_yet")}
                        </span>
                      )}
                      <p>{cra.user?.id == user?.id ? t("my_timesheet") : cra.user?.name}</p>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-xl text-muted-foreground">
                        {moment(cra.created_at).format("YYYY-MM")}
                      </p>

                    </div>
                    <Button
                      onClick={() => {
                        /*  initCra(); */
                        {
                          cra.user?.id == user?.id
                            ? navigate(`/app/cra/${cra.id}`)
                            : navigate(`/app/cra/preview/${cra.id}`);
                        }
                      }}
                    >
                      {t("go_to_timesheet")}
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {does_it_have_data_in_the_current_time_query.data?.state ==
                false && (
                  <Card className="w-full mx-2 md:w-1/4">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-sm font-medium">
                        {/*   {m.user.is_valid == true ? <span className='text-emerald-500'> Active</span> : <span className='text-red-500'>Not Active</span>} */}
                        <span className="text-red-500">
                          {t("not_sent_to_validation_yet")}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <p className="text-xl text-muted-foreground">
                          {currentDate.format("YYYY-MM")}
                        </p>

                      </div>
                      <Button
                        onClick={() => {
                          initCra();
                        }}
                      >
                        {t("initialize_timesheet_of_this_month")}
                      </Button>
                    </CardContent>
                  </Card>
                )}
            </div>
            <div className="my-4">
              {cras_query.data && (
                <GeneralPaginator
                  pagination={cras_query.data}
                  onPageChange={setSelectPage}
                />
              )}

            </div>

          </div>
        )}
      </div>
    </>
  );
}

export default SchedileList;
