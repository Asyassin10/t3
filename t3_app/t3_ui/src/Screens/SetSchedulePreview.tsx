import moment, { Moment } from "moment";

import { useEffect, useState } from "react";
import { daysOfWeekInFrensh } from "../types/Contant";
import { getDeyIndexOfTheWeek } from "../utils/time_utils";
import { IAbsence, CRA, Calendar, Day, Ligne, User } from "../types/AppTypes";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import api_client from "../axios/api_client";
import { Button } from "@/shadcnuicomponents/ui/button";

import { Progress } from "@/shadcnuicomponents/ui/progress";
import { Separator } from "@/shadcnuicomponents/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shadcnuicomponents/ui/card";
import {
  GET_ABSENCE_OF_DATE_MONTH_AND_YEAR,
  GET_TIME_LIGNE_URI,
} from "@/axios/routes_api";

import { useToast } from "@/shadcnuicomponents/ui/use-toast";
import { TimeSheetResponse } from "@/types/response_types";

import { Loader2 } from "lucide-react";

import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { json_t3_token } from "@/state/atom";
import ErrorPage from "@/AppComponents/ErrorPage";

function SetSchedulePreview() {
  const { t } = useTranslation()
  const { toast } = useToast();
  const { craId } = useParams();
  const queryClient = useQueryClient();

  const user = queryClient.getQueryData<User>(['user_data']);
  /*  const [FirstOfMonth, setFirstOfMonth] = useState<Moment | null>(null);
     const [EndOfMonth, setEndOfMonth] = useState<Moment | null>(null); */
  // const [Days, setDays] = useState<Day[] | null>(null);
  /* const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard'
    }) */
  /* const [email, setEmail] = useState('email')
    const [password, setPassword] = useState('pwd')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)
    const submitForm = async event => {
        event.preventDefault()
        login({ email, password, setErrors, setStatus })
    } */
  // test form validation

  const [Calendar, setCalendar] = useState<Calendar | null>(null);
  const [Lignes, setLignes] = useState<Ligne[]>([]);
  //const [ActuvuteList, setActuvuteList] = useState<Activite[]>([])

  const [ProgressCount, setProgressCount] = useState<number>(0);
  const [CurrentDate, setCurrentDate] = useState<Moment>(moment());
  //const [CurrentLineComment, setCurrentLineComment] = useState("")
  const [CurrentAvailableDaysCount, setCurrentAvailableDaysCount] =
    useState<number>(0);
  const [GlobalAvailableDaysCount, setGlobalAvailableDaysCount] =
    useState<number>(0);

  //const [DaysStats, setDaysStats] = useState<LigneDay[]>([])
  const [jwt] = useAtom(json_t3_token);

  const [GET_TIME_LIGNE_URIIsLoading, setGET_TIME_LIGNE_URIIsLoading] =
    useState(false);
  const [CRA, setCRA] = useState<CRA | undefined>(undefined);
  const [Absences, setAbsences] = useState<IAbsence[]>([]);
  const LoadDefaultData = () => {
    /* const { t, i18n } = useTranslation(); */
    /* setProject([...TypeActivite, "CNB"])
        const category_list: ActiviteCategory[] = [...ActiviteCategoryList];
        const new_cat: ActiviteCategory[] = category_list.filter(category_list => category_list.project_title == TypeActivite[1]);
        setCatgeoryList(new_cat); */
    /* api_client
      .get<IProject[]>("/projects/get_projects", {
        headers: {
          Authorization: "Bearer " + jwt,
        },
      })
      .then((res) => {
        //    setProject(res.data.filter((proj) => proj.activities?.length > 0));
        setProject(res.data.filter((proj) => proj.activities?.length ?? 0 > 0));
      }); */
    api_client
      .post<CRA>(
        "/time_sheet/get_cra",
        {
          id: craId,
        },
        {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        }
      )
      .then((res) => {
        setCRA(res.data);
      });
  };

  useEffect(() => {
    const currentDate = moment(); // Get current date
    fetchAbsenceCount(currentDate);
    setCurrentDate(moment(currentDate));
    const firstOfMonth = moment(currentDate).startOf("month"); // First day of current month
    const endOfMonth = moment(currentDate).endOf("month"); // Last day of current month
    /*         const valid_ids = [];
     */ /* Calendar?.days?.forEach((day)=>{
valid_ids.push(day.)
}) */
    /*   for (let i = 0; i < moment(currentDate).daysInMonth(); i++) {
              // const element = array[i];
              valid_ids.push(i)
  
          }
          setAvailableIdsDays(valid_ids) */

    /*   setFirstOfMonth(firstOfMonth);
          setEndOfMonth(endOfMonth); */
    setdaysOfWeekInFrensh(firstOfMonth, endOfMonth, currentDate);

    //const activite_category: ActiviteCategory[] = []

    /*   TypeActivite.forEach(element => {
              activite_list.push({title:element})
          }); */
    /* Project.forEach((element) => {

        }) */
    LoadDefaultData();
    //setProject
  }, []);
  // 21 => 100
  // progress => X
  const CalculateProgressPercentage = (
    progress: number,
    available_days_vount: number
  ): number => {
    // Ensure progress is within bounds
    progress = Math.max(0, Math.min(100, progress));

    // Calculate percentage
    const percentage = (progress / available_days_vount) * 100;

    // Parse percentage as integer
    return parseInt(percentage.toFixed(0));
  };

  const setdaysOfWeekInFrensh = (
    firstOfMonth: Moment,
    endOfMonth: Moment,
    currentDate: Moment
  ) => {
    console.log("setdaysOfWeekInFrensh");
    const days: Day[] = [];
    const index_of_firstOfMonth = getDeyIndexOfTheWeek(firstOfMonth);
    const index_of_endOfMonth = getDeyIndexOfTheWeek(endOfMonth);
    let down_counter_first_of_month: number = 6;
    let start_counter_middle = 6 - (index_of_firstOfMonth - 1);
    // add the first week
    for (let i = 0; i < 7; i++) {
      if (i < index_of_firstOfMonth) {
        /*  days.push({
                     day_abr: daysOfWeekInFrensh[i].slice(0, 2),
                     day_name: daysOfWeekInFrensh[i],
                     day_full_date: moment(firstOfMonth).add(i - index_of_firstOfMonth, "day"),
                     is_after_month: false,
                     is_before_month: true,
                     is_in_month: false
                 }); */
      } else {
        days.push({
          day_abr: daysOfWeekInFrensh[i].slice(0, 1),
          day_name: daysOfWeekInFrensh[i],
          day_full_date: moment(firstOfMonth).add(
            6 - down_counter_first_of_month,
            "d"
          ),
          is_after_month: false,
          is_before_month: false,
          is_in_month: true,
          is_jour_ferier: false

        });
        down_counter_first_of_month--;
      }
    } // add weeks
    for (let index = 0; index <= 2; index++) {
      for (let i = 0; i < daysOfWeekInFrensh.length; i++) {
        days.push({
          day_abr: daysOfWeekInFrensh[i].slice(0, 1),
          day_name: daysOfWeekInFrensh[i],
          day_full_date: moment(firstOfMonth).add(start_counter_middle, "d"),
          is_after_month: false,
          is_before_month: false,
          is_in_month: true,
          is_jour_ferier: false

        });
        start_counter_middle++;
      }
    }
    // add the last week
    for (let i = 0; i < 7; i++) {
      if (i < index_of_endOfMonth + 1) {
        days.push({
          day_abr: daysOfWeekInFrensh[i].slice(0, 1),
          day_name: daysOfWeekInFrensh[i],
          day_full_date: moment(endOfMonth).add(i - index_of_endOfMonth, "day"),
          is_after_month: false,
          is_before_month: false,
          is_in_month: true,
          is_jour_ferier: false

        });
      }
    }
    //   {day.day_abr === 'Sa' || day.day_abr === 'Su' ? (
    let available_days_count: number = 0;
    const available_days: number[] = [];
    days.forEach((day) => {
      if (day.day_abr != "S" && day.day_abr != "D") {
        available_days_count++;
        //     {day.day_full_date.format("D")}
        available_days.push(parseInt(day.day_full_date.format("D")));
      }
    });
    console.log(available_days_count);

    setGlobalAvailableDaysCount(available_days_count);
    setCalendar({
      days: days,
      Event: [
        {
          day_end: moment(firstOfMonth).add(5, "day"),
          day_start: moment(firstOfMonth).add(8, "day"),
          title: "hhhh",
        },
      ],
    });
    LoadLignes(currentDate, available_days_count);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /*  const createEvent = () => {
         const event_day_start = 2;
         const event_day_end = 5;
 
     } */
  const LoadLignes = (
    currentDate: Moment,
    globalAvailableDaysCount: number
  ) => {
    //export interface TimeSheetResponse {
    console.log("LoadLignes");
    setGET_TIME_LIGNE_URIIsLoading(true);
    // const lignes: Ligne[] = [...Lignes];




    const lignes: Ligne[] = [];
    api_client
      .post<TimeSheetResponse[]>(
        GET_TIME_LIGNE_URI,
        {
          year: currentDate.format("YYYY"),
          month: currentDate.format("MM"),
          id: craId,
        },
        {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        }
      )
      .then((res) => {
        // Ensure res.data is an array and not null/undefined
        if (Array.isArray(res.data) && res.data.length > 0) {
          let available_days_count: number = 0;
          // let available_global_days_count: number = 0;
          setCRA(res.data[0].cra);

          res.data.forEach((time_sheet) => {
            //console.log(time_sheet.comment)
            //console.log(time_sheet.time_sheet_ligne)
            //console.log(time_sheet.times)
            /* // Ensure time_sheet.activite and time_sheet.project are not null/undefined
                    if (time_sheet.activite && time_sheet.project) {
                       
                    } */
            /* if (time_sheet.day_abr != 'S' && time_sheet.day_abr != 'D') {
                        available_days_count++;
                    } */
            time_sheet.time_sheet_ligne.forEach((time) => {
              if (time.value != "") {
                available_days_count += parseFloat(
                  parseFloat(time.value).toFixed(1)
                );
              }
            });
            lignes.push({
              activity_title: time_sheet.activite.activity_name,
              project_title: time_sheet.project.project_name,
              count_of_days: time_sheet.count_of_days,
              ids_of_days: time_sheet.ids_of_days,
              days: time_sheet.time_sheet_ligne,
              id: time_sheet.id,
              comment: time_sheet.comment,
            });
          });
          setLignes(lignes);
          setCurrentAvailableDaysCount(available_days_count);

          // alert(available_days_count)
          //alert(GlobalAvailableDaysCount)
          //   console.log("GlobalAvailableDaysCount " + globalAvailableDaysCount)
          /*   if (available_days_count != 0) {
                } */
          setProgressCount(
            CalculateProgressPercentage(
              available_days_count,
              globalAvailableDaysCount
            )
          );
        }
        setGET_TIME_LIGNE_URIIsLoading(false);
      });
  };

  const ValidateCra = () => {
    api_client
      .post<CRA>(
        "/time_sheet/validate_cra",
        {
          id: craId,
        },
        {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        }
      )
      .then((res) => {
        setCRA(res.data);
        toast({
          title: t("cra_validated"),
          className: "bg-emerald-500",
          variant: "default",
        });
      });
  };

  const fetchAbsenceCount = (currentdate: Moment) => {
    api_client
      .post<IAbsence[]>(
        GET_ABSENCE_OF_DATE_MONTH_AND_YEAR,
        {
          month: currentdate.format("MM"),
          year: currentdate.format("YYYY"),
          id: craId,
        },
        {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        }
      )
      .then((res) => {
        setAbsences(res.data);
      });
  };
  if (!user) {
    return <ErrorPage />;
  }

  return (
    <>
      <div className="w-full h-full">

        <div className="space-y-4 mt-8 mx-8">
          <div className="flex items-center justify-between space-y-2">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Time Sheet -- {CRA?.status}
            </h1>

            <div className="flex items-center space-x-2">
              {/*  <Button>Envoyer</Button> */}
              {Lignes.length > 0 && CRA?.status == "WAITING_TO_VALIDATION" && (
                <Button
                  className=" text-white rounded-lg bg-emerald-500"
                  onClick={() => {
                    ValidateCra();
                  }}
                >
                  {/* <FileEditIcon className="text-white" /> */}
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    className=""
                    color="white"
                  />
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className=" p-8">
          <header className="flex w-full justify-between items-center mb-4">
            <div className="w-1/4">
              <h1 className="text-xl font-semibold">
                {CurrentDate?.format("MMMM-YYYY")} - {user.name}
              </h1>
            </div>
            <div className="w-3/4 flex items-center justify-end  ">
              <p className="">{ProgressCount} %</p>
              <Progress
                value={ProgressCount}
                className="w-1/2 mr-10 ml-5 bg-white"
              />
              <span className="text-sm">
                {GlobalAvailableDaysCount
                  ? GlobalAvailableDaysCount - CurrentAvailableDaysCount
                  : 0}
                / {GlobalAvailableDaysCount} jours ouvrés
              </span>
            </div>
          </header>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3 bg-white p-4 rounded-md shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Les Activité</h2>
              </div>
              <div className="mb-4"></div>

              {GET_TIME_LIGNE_URIIsLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-10 w-10  animate-spin" />
                </div>
              ) : (
                <>
                  {Lignes.map((ligne) => (
                    <>
                      <div className="flex mb-4">
                        <div className="w-3/4">
                          <h3 className="text-sm font-medium mb-2">
                            {ligne.project_title}
                          </h3>
                          <div className="">
                            <p className="text-sm">
                              {ligne.activity_title} - {ligne.count_of_days} -
                              id: {ligne.id} j
                            </p>
                            <p className="text-sm flex">
                              {ligne.comment ? ligne.comment : "no comment"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Separator className="my-4" />
                    </>
                  ))}
                </>
              )}
            </div>
            <div className="col-span-9 bg-white p-4 rounded-md shadow">
              <div className="flex justify-between items-center mb-4">
                {Calendar?.days?.map((day) => (
                  <div className="w-full">
                    {/* {day.slice(0, 2)} */}
                    {day.day_abr === "S" || day.day_abr === "D" ? (
                      <div className="w-full text-center bg-gray-100">
                        {day.day_abr}
                        <br />
                        {/*  {day.day_full_date.format("MMMM Do YYYY")} */}
                        {day.day_full_date.format("D")}
                      </div>
                    ) : (
                      <div className="w-full text-center">
                        {day.day_abr}
                        <br />
                        {/*   {day.day_full_date.format("MMMM Do YYYY")} */}
                        {day.day_full_date.format("D")}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {GET_TIME_LIGNE_URIIsLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-10 w-10  animate-spin" />
                </div>
              ) : (
                <>
                  {Lignes.map((ligne) => (
                    <>
                      <div className="flex justify-between items-center  ">
                        {ligne.days.map((day) => (
                          <input
                            type="text"
                            value={day.value}
                            disabled={true}
                            placeholder=""
                            className="w-1/2 pt-5 pb-5  outline-none  text-center h-1/4"
                          />
                        ))}
                      </div>
                      <Separator className="my-4" />
                    </>
                  ))}
                </>
              )}

              {/*      <div className="flex justify-between items-center my-4">
                                </div> */}
              <div className="grid grid-cols-31 gap-1 mb-4" />
            </div>
          </div>
        </div>
        <div className=" px-8 pb-6">
          <div className="bg-white p-4 shadow rounded-lg">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Exceptional Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p>Production</p>
                    <p>Total 0d</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Absence</CardTitle>
                </CardHeader>
                <CardContent>
                  {Absences.slice(0, 2).map((abs) => (
                    <div className="flex items-center justify-between">
                      <p>{abs.reason}</p>
                      <p>{abs.nombre_des_jours} J</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Internal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p>Total 0d</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle></CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-32 border-dashed border-2 border-gray-300 rounded-lg">
                    <Button variant="outline">Upload</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* <Toaster /> */}
    </>
  );
}
/* function Component({ currentdate }: { currentdate: Moment | undefined }) {
    return (
      
    )
} */

/* function CalendarIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
    )
}


function PrinterIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect width="12" height="8" x="6" y="14" />
        </svg>
    )
}


function SettingsIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}


function UploadIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    )
}
function DownloadIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
    )
}



function FileEditIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
        </svg>
    )
}
 */

export default SetSchedulePreview;
