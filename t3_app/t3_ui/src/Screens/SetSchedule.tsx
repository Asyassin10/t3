import moment, { Moment } from "moment";
import { useEffect, useState } from "react";
import { daysOfWeekInFrensh } from "../types/Contant";
import { getDeyIndexOfTheWeek } from "../utils/time_utils";
import {
  Activity, Calendar,
  Day, IProject,
  JourFerier,
  Ligne,
  LigneDay, User
} from "../types/AppTypes";
/* import AppEvent from '../AppComponents/AppEvent'; */
/* import { Button, IconButton, Option, Select } from '@material-tailwind/react'; */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import api_client from "../axios/api_client";
import { Button } from "@/shadcnuicomponents/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcnuicomponents/ui/select";
import { Progress } from "@/shadcnuicomponents/ui/progress";
/* import { Textarea } from '@/shadcnuicomponents/ui/textarea';
 */ import { Separator } from "@/shadcnuicomponents/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shadcnuicomponents/ui/card";
import {
  Layout
} from "@/shadcnuicomponents/custom/layout";
import {
  GET_TIME_LIGNE_URI,
  SAVING_TIME_LIGNE_URI
} from "@/axios/routes_api";
/* import { SaveTimeSheetRequest } from '@/types/requests_types'; */
import { z } from "zod";
import { useToast } from "@/shadcnuicomponents/ui/use-toast";
import { TimeSheetResponse } from "@/types/response_types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ellipsis, Loader2, MessageSquareMore, RotateCcw, Trash2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shadcnuicomponents/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcnuicomponents/ui/form";
import { Input } from "@/shadcnuicomponents/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shadcnuicomponents/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shadcnuicomponents/ui/tooltip";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { get_max_exception_string, get_required_exception } from "@/lib/helpers/language_validation_helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { json_t3_token } from "@/state/atom";
import { useAtom } from "jotai";
import ErrorPage from "@/AppComponents/ErrorPage";
import { getProjectsNonPaginated } from "@/axios/AbstractionsApi/ApiProjet";
import { DeleteLigneApi, fetchAbsenceCountApi, fetchHolidaysApi, getCra, SendCraToValidationApiAction, setGlobalAvailableDaysCountApi, UndoSendCraToValidationApiAction, UpdateCommentOfTimeLigneApi } from "@/axios/AbstractionsApi/ApiCra";
function SetSchedule() {
  const { toast } = useToast();
  const { craId } = useParams();
  const { t } = useTranslation()
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
  const UpdateCommentTimeLigneSchema = z.object({
    comment: z.string({
      required_error: get_required_exception(i18n.language, t("comment"))
    }).min(1, {
      message: get_required_exception(i18n.language, t("comment"))
    }).max(200, {
      message: get_max_exception_string(i18n.language, t("comment"), 200)
    })
  })
  const update_comment_form = useForm<
    z.infer<typeof UpdateCommentTimeLigneSchema>
  >({
    resolver: zodResolver(UpdateCommentTimeLigneSchema),
    defaultValues: {
      comment: "",
    },
  });
  const [IsAlertDialogCommentShown, setIsAlertDialogCommentShown] =
    useState<boolean>(false);
  const UpdateCommentOfTimeLigneApiMutation = useMutation({
    mutationKey: ["UpdateCommentOfTimeLigneApi"],
    mutationFn: (data: FormData) => UpdateCommentOfTimeLigneApi(data),
    onSuccess: (res) => {
      setIsAlertDialogCommentShown(false);
      toast({
        variant: "default",
        title: t("comment_saved_successfully"),
        className: "bg-emerald-500",
      });
      update_comment_form.reset({
        comment: ""
      })
      if (res && res.comment) {
        HandleStateAfterPostComment(TimeLigneId!, res.comment);
      }
    }
  })
  function onSubmit(data: z.infer<typeof UpdateCommentTimeLigneSchema>) {
    const formData = new FormData();

    formData.append("time_ligne", TimeLigneId?.toString() || "");
    formData.append("comment", data.comment);

    UpdateCommentOfTimeLigneApiMutation.mutate(formData)

  }
  const [Calendar, setCalendar] = useState<Calendar | null>(null);
  const [NewLigne, setNewLigne] = useState<LigneDay[]>([]);
  const [Lignes, setLignes] = useState<Ligne[]>([]);
  const [NewLigneTextError, setNewLigneTextError] = useState<string>("");
  const [IsAddingANewLine, setIsAddingANewLine] = useState<boolean>(false);
  //const [ActuvuteList, setActuvuteList] = useState<Activite[]>([])
  const [ActivityList, setActivityList] = useState<Activity[]>([]);
  /*   const [Project, setProject] = useState<IProject[]>([]); */
  const [SelectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);
  const [SelectedProject, setSelectedProject] = useState<IProject | undefined>(
    undefined
  );
  /*   const [CurrentNumberOfDays, setCurrentNumberOfDays] = useState<number>(0) */
  const [ProgressCount, setProgressCount] = useState<number>(0);
  const [UNAvailableIdsDays, setUNAvailableIdsDays] = useState<number[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [CurrentDate, setCurrentDate] = useState<Moment>(moment());
  //const [CurrentLineComment, setCurrentLineComment] = useState("")
  const [CurrentAvailableDaysCount, setCurrentAvailableDaysCount] =
    useState<number>(0);
  const [GlobalAvailableDaysCount, setGlobalAvailableDaysCount] =
    useState<number>(0);
  const [CurrentAvailableDays, setCurrentAvailableDays] = useState<number[]>(
    []
  );
  /*   const [JourFerier, setJourFerier] = useState<JourFerier[]>([])
   */  //const [DaysStats, setDaysStats] = useState<LigneDay[]>([])
  const [jwt] = useAtom(json_t3_token);
  const [GET_TIME_LIGNE_URIIsLoading, setGET_TIME_LIGNE_URIIsLoading] =
    useState(false);
  const [TimeLigneId, setTimeLigneId] = useState<number | undefined>(undefined);
  const projects_query = useQuery({
    queryKey: ["projects_query_non_paginated"],
    queryFn: () => getProjectsNonPaginated()
  });
  const getCraQuery = useQuery({
    queryKey: ["getCraQuery", craId],
    queryFn: () => getCra(craId as string),
    enabled: !!craId,
  });

  const fetchHolidaysApiQuery = useQuery({
    queryKey: ["fetchHolidaysApi"],
    queryFn: () => fetchHolidaysApi()
  })

  useEffect(() => {
    const currentDate = moment(); // Get current date
    setCurrentDate(moment(currentDate));
    const firstOfMonth = moment(currentDate).startOf("month"); // First day of current month
    const endOfMonth = moment(currentDate).endOf("month"); // Last day of current month
    if (fetchHolidaysApiQuery.data) {
      setdaysOfWeekInFrensh(firstOfMonth, endOfMonth, currentDate, fetchHolidaysApiQuery.data);
    }
  }, [fetchHolidaysApiQuery.data]);

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
    currentDate: Moment,
    jour_ferier: JourFerier[]
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
      // {day.day_full_date.format("D")}
      /* if(JourFerier.includes()) */
      if (day.day_abr != "S" && day.day_abr != "D") {
        available_days_count++;
        //     {day.day_full_date.format("D")}
        available_days.push(parseInt(day.day_full_date.format("D")));
      }
      if (jour_ferier.some((jour_f) => jour_f.jourferiers_date == parseInt(day.day_full_date.format("D")))) {
        day.is_jour_ferier = true
      }
    });
    console.log(available_days_count);
    setGlobalAvailableDaysCountApi(available_days_count, null, null, craId)
    setGlobalAvailableDaysCount(available_days_count);
    //setCurrentAvailableDaysCount(available_days_count);
    setCurrentAvailableDays(available_days);
    /*  console.log("days")
     console.log(days)
     console.log("days") */
    // jour_ferier
    setCalendar({
      days: days
    });
    console.log("setting calendar state")
    console.log(Calendar?.days)
    console.log(fetchHolidaysApiQuery.data)
    console.log("setting calendar state")
    LoadLignes(currentDate, available_days_count);
  };
  const LoadLignes = (
    currentDate: Moment,
    globalAvailableDaysCount: number
  ) => {
    //export interface TimeSheetResponse {
    console.log("LoadLignes");
    setGET_TIME_LIGNE_URIIsLoading(true);
    // const lignes: Ligne[] = [...Lignes];
    const lignes: Ligne[] = [];
    const formData = new FormData();

    formData.append("year", currentDate.format("YYYY"));
    formData.append("month", currentDate.format("MM"));
    formData.append("id", String(craId));

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
          res.data.forEach((time_sheet) => {
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
          setGlobalAvailableDaysCountApi(null, available_days_count, null, craId)
          const current_progress: number = CalculateProgressPercentage(
            available_days_count,
            globalAvailableDaysCount
          )
          setProgressCount(
            current_progress
          );
          setGlobalAvailableDaysCountApi(null, null, current_progress, craId)
        }
        setGET_TIME_LIGNE_URIIsLoading(false);
      });
  };

  const Save = () => {
    if (SelectedProject && SelectedActivity) {
      const ids_of_days_fully_bocked_arr: number[] = [];
      const un_available_days: number[] = [...UNAvailableIdsDays];
      const lignes: Ligne[] = [...Lignes];
      let available_days_count: number = 0;
      let available_days_count_new_ligne: number = 0;
      // add only the fully bocked day (1) else if it is empty or start with 0. just ignore it
      NewLigne.forEach((ligne) => {
        if (ligne.value != "" && ligne.value.startsWith("0.")) {
          /*  console.log("object") */
          // ids.push(ligne.id)
          ids_of_days_fully_bocked_arr.push(ligne.app_id);
          available_days_count_new_ligne += parseFloat(
            parseFloat(ligne.value).toFixed(1)
          );
        } else if (ligne.value != "") {
          ids_of_days_fully_bocked_arr.push(ligne.app_id);
          /*   console.log(ligne.value) */
          available_days_count_new_ligne += parseFloat(
            parseFloat(ligne.value).toFixed(1)
          );
        }
      });
      lignes.forEach((ligne) => {
        ligne.ids_of_days.forEach((id_of_day) => {
          un_available_days.push(id_of_day);
        });
        ligne.days.forEach((day) => {
          if (day.value != "") {
            available_days_count += parseFloat(
              parseFloat(day.value).toFixed(1)
            );
          }
        });
      });



      api_client
        .post<TimeSheetResponse>(
          SAVING_TIME_LIGNE_URI,
          {
            project_id: SelectedProject?.id,
            activite_id: SelectedActivity?.id,
            ids_of_days: ids_of_days_fully_bocked_arr,
            count_of_days: available_days_count_new_ligne,
            ligne_date: CurrentDate?.format("YYYY-MM-DD"),
            times: NewLigne,
            //
          },
          {
            headers: {
              Authorization: "Bearer " + jwt,
            },
          }
        )
        .then((res) => {
          const ligne_object: Ligne = {
            activity_title: res.data.activite.activity_name,
            project_title: res.data.project.project_name,
            count_of_days: res.data.count_of_days,
            ids_of_days: res.data.ids_of_days,
            days: res.data.time_sheet_ligne,
            id: res.data.id,
          };
          available_days_count += available_days_count_new_ligne
          setCurrentAvailableDaysCount(available_days_count);
          const current_progress: number = CalculateProgressPercentage(
            available_days_count,
            GlobalAvailableDaysCount!
          )
          setProgressCount(
            current_progress
          );
          setGlobalAvailableDaysCountApi(null, available_days_count, current_progress, craId)
          lignes.push(ligne_object);
          toast({
            variant: "default",
            title: t("timesheet_saved_successfully"),
            className: "bg-emerald-500",
          });
        });
      const current_progress: number = CalculateProgressPercentage(
        available_days_count,
        GlobalAvailableDaysCount!
      )
      setProgressCount(
        current_progress
      );
      setGlobalAvailableDaysCountApi(null, null, current_progress, craId)
      setLignes(lignes);
      setIsAddingANewLine(false);
      setUNAvailableIdsDays(un_available_days);
      setNewLigne([]);
    } else {
      toast({
        title: t("select_project_and_activity"),
        className: "bg-red-500",
        variant: "default",
      });
    }
  };
  const HandleStateAfterPostComment = (
    time_ligne_id: number,
    comment: string
  ) => {
    // Find the ligne object with the given time_ligne_id
    const ligneIndex: number = Lignes.findIndex(
      (ligne) => ligne.id === time_ligne_id
    );
    // If ligne object is found
    if (ligneIndex !== -1) {
      // Update the comment property of the ligne object
      Lignes[ligneIndex].comment = comment;
      // Log the updated ligne object
      console.log("Updated ligne object:", Lignes[ligneIndex]);
      // Synchronize the updated state back into the Lignes array
      setLignes([...Lignes]);
    } else {
      // Log error if ligne object is not found
      console.error("No ligne object found with id:", time_ligne_id);
    }
  };

  const SendCraToValidationApiActionMutation = useMutation({
    mutationKey: ["SendCraToValidationApiAction"],
    mutationFn: () => SendCraToValidationApiAction(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getCraQuery", craId],
      });
      toast({
        title: t("timesheet_set_success"),
        className: "bg-emerald-500",
        variant: "default",
      });
    }
  })
  const UndoSendCraToValidationApiActionMutation = useMutation({
    mutationKey: ["UndoSendCraToValidationApiAction"],
    mutationFn: () => UndoSendCraToValidationApiAction(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getCraQuery", craId],
      });
      toast({
        title: t("action_reversed_successfully"),
        className: "bg-emerald-500",
        variant: "default",
      });
    }
  })
  // getCraQuery
  const SendCraToValidation = () => {
    SendCraToValidationApiActionMutation.mutate()
  };
  const UndoSendCraToValidation = () => {
    UndoSendCraToValidationApiActionMutation.mutate();
  };
  const sumColumns = (
    array: string[][],
    decimalPlaces: number = 2
  ): number[] => {
    const numRows = array.length;
    const numCols = array[0].length;
    const sums: number[] = new Array(numCols).fill(0);
    for (let col = 0; col < numCols; col++) {
      for (let row = 0; row < numRows; row++) {
        /* console.log(array[row][col]) */
        const value = parseFloat(array[row][col]);
        if (!isNaN(value)) {
          sums[col] += value;
        }
      }
      // Round the sum to the specified number of decimal places
      sums[col] = parseFloat(sums[col].toFixed(decimalPlaces));
    }
    return sums;
  };
  function subtractWithPrecision(num1: number, num2: number) {
    return Math.round((num1 - num2) * 10) / 10;
  }
  const FillInTheBlanks = () => {
    const new_ligne: LigneDay[] = [...NewLigne];
    new_ligne.forEach((new_li) => {
      if (
        new_li.value == "" &&
        new_li.is_disabled == false &&
        new_li.is_week_end == false
      ) {
        //   if (CurrentAvailableDays.includes(new_li.id + 1)) {
        new_li.value = new_li.rest_acceptable.toString();
        //     }
        console.log(new_li);
      }
    });
    setNewLigne(new_ligne);
    // setCurrentAvailableDays([])
    // setCurrentAvailableDaysCount(0)
  };
  const LoadNewLigne = (): void => {
    const Lignes_empty: LigneDay[] = [];
    let id = 0;
    if (Calendar) {
      if (Lignes.length == 0) {
        // calculate available days on mount dates of month
        Calendar?.days?.forEach((day) => {
          Lignes_empty.push({
            value: "",
            app_id: id,
            is_week_end: day.day_abr === "S" || day.day_abr === "D",
            is_disabled: isDisabled(day.day_abr, id, 0, day.is_jour_ferier),
            rest_acceptable: 1,
            is_jour_ferier: day.is_jour_ferier
          });
          id++;
        });
        //console.log(Lignes_empty)
        setNewLigne(Lignes_empty);
      } else {
        let rest_basedon_days: number[] = [];
        const summed_array: string[][] = [];
        Lignes.forEach((ligne) => {
          const summed_array_one: string[] = [];
          ligne.days.forEach((day) => {
            summed_array_one.push(day.value);
          });
          summed_array.push(summed_array_one);
        });
        /* console.log(rest_basedon_days) */
        /*  console.log(summed_array)
                 console.log(sumColumns(summed_array)) */
        rest_basedon_days = sumColumns(summed_array);
        console.log("rest_basedon_days")
        console.log(rest_basedon_days)
        console.log("rest_basedon_days")
        /* console.log(rest_basedon_days) */
        Calendar?.days?.forEach((day) => {
          Lignes_empty.push({
            value: "",
            app_id: id,
            is_week_end: day.day_abr === "S" || day.day_abr === "D",
            is_disabled: isDisabled(day.day_abr, id, rest_basedon_days[id], day.is_jour_ferier),
            rest_acceptable: subtractWithPrecision(1, rest_basedon_days[id]),
            is_jour_ferier: day.is_jour_ferier
          });
          id++;
        });
        /* console.log(Lignes_empty) */
        setNewLigne(Lignes_empty);
        /* console.log(Lignes_empty)
                setNewLigne(Lignes_empty) */
      }
    }
    /* console.log(Lignes) */
  };
  // check if the value = 1 or 0.5
  const CheckNewLine = (value: string): boolean => {
    /* // Parse the value to a number
        const numericValue = parseFloat(value);
        // Check if the numeric value is equal to 1 or 0.5
        return numericValue == 1 || numericValue == 0.5 || numericValue == 0; */
    // Parse the value to a number
    if (value == "") {
      return true;
    }
    /* console.log(value) */
    if (value.length > 3) {
      return false;
    }
    const numericValue = parseFloat(value);
    // Check if the numeric value is within the range [0.1, 1]
    return numericValue >= 0 && numericValue <= 1;
  };
  const CheckIfValueIsBiggerThenItShouldBe = (
    id: number,
    value: string
  ): boolean => {
    const new_ligne = NewLigne.find((ne) => ne.app_id == id);
    if (new_ligne) {
      if (new_ligne.rest_acceptable != 0 && new_ligne.rest_acceptable != 1) {
        console.log(value);
        if (new_ligne.rest_acceptable < parseFloat(value)) {
          return false;
        }
        return true;
      }
    }
    return true;
  };
  // this function synchronise the current_available_state whileuser typing
  const UpdateCurrentAvailableDaysOnUserInputChange = (
    id: number,
    value: string
  ): void => {
    const available_days_on_update: number[] = [...CurrentAvailableDays];
    const new_ligne: LigneDay | undefined = NewLigne.find(
      (ne) => ne.app_id == id
    );
    if (new_ligne) {
      console.log(value + " // " + id);
      if (value == "") {
        available_days_on_update.push(id + 1);
      } else {
        if (parseFloat(value) == new_ligne.rest_acceptable) {
          //alert("hhhh")
          //available_days_on_update.splice(id + 1, 1)
          const indexToRemove = available_days_on_update.indexOf(id + 1);
          if (indexToRemove !== -1) {
            available_days_on_update.splice(indexToRemove, 1);
          }
        }
      }
      setCurrentAvailableDays(available_days_on_update);
    }
  };
  const handleInputChange = (id: number, value: string) => {
    if (CheckNewLine(value) && CheckIfValueIsBiggerThenItShouldBe(id, value)) {
      setNewLigneTextError("");
      /*    */
      UpdateCurrentAvailableDaysOnUserInputChange(id, value);
      //setCurrentNumberOfDays
      setNewLigne((prevState) => {
        const updatedNewLigne = prevState.map((input) =>
          input.app_id === id ? { ...input, value: value } : input
        );
        return updatedNewLigne;
      });
    } else {
      setNewLigneTextError("- Données invalides");
    }
  };
  const isDisabled = (
    day_abr: string,
    id: number,
    rest_acceptable_value: number,
    is_jour_ferier: boolean
  ): boolean => {
    if (is_jour_ferier == true) {
      return true;
    }
    if (UNAvailableIdsDays.includes(id)) {
      return true;
    }
    if (day_abr === "S" || day_abr === "D") {
      return true;
    }
    if (rest_acceptable_value >= 1) {
      return true;
    }
    return false;
  };
  const RecalculateCraNumbers = (lignes: Ligne[]): void => {
    let available_days_count: number = 0;
    lignes.forEach((ligne) => {
      ligne.days.forEach((day) => {
        if (day.value != "") {
          available_days_count += parseFloat(
            parseFloat(day.value).toFixed(1)
          );
        }
      });
    });
    setCurrentAvailableDaysCount(available_days_count);
    const current_progress: number = CalculateProgressPercentage(
      available_days_count,
      GlobalAvailableDaysCount!
    )
    setProgressCount(
      current_progress
    );
    setGlobalAvailableDaysCountApi(null, available_days_count, current_progress, craId)
  }
  const clearAvailableDaysWhenDeletingLigne = (ligne: Ligne) => {
    setUNAvailableIdsDays(prev =>
      prev.filter(id => !ligne.ids_of_days.includes(id))
    );
  };
  const DeleteLigneApiMutation = useMutation({
    mutationKey: ["DeleteLigneApi"],
    mutationFn: (id: number) => DeleteLigneApi(id),
    onSuccess: (_data, id) => {
      const lignes_app = [...Lignes];
      const indexToDelete = lignes_app.findIndex((ligne) => ligne.id == id);
      const ligneObject = lignes_app.find((ligne) => ligne.id == id);
      if (indexToDelete !== -1) {
        lignes_app.splice(indexToDelete, 1);
      }
      if (ligneObject) {
        clearAvailableDaysWhenDeletingLigne(ligneObject)
      }
      setLignes(lignes_app);
      RecalculateCraNumbers(lignes_app)
      toast({
        variant: "default",
        title: t("time_line_deleted_successfully"),
        className: "bg-red-500 text-white",
      });
    }
  })
  const deleteTimeLigne = (id: number) => {
    DeleteLigneApiMutation.mutate(id)

  };
  const fetchAbsenceCountApiQuery = useQuery({
    queryKey: ["fetchAbsenceCountApi"],
    queryFn: () => fetchAbsenceCountApi(craId || "")
  })

  if (!user) {
    return <ErrorPage />;
  }
  return (
    <Layout>
      <div className="w-full h-full px-5 py-8">
        {/*   <pre>{JSON.stringify(Lignes, null, 2)}</pre> */}
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            <span className="mx-3">
              {t("time_sheet")} --
            </span>
            {getCraQuery.data?.status == "NOT_SENT_TO_VALIDATION_YET" && t("not_sent_to_validation_yet")}
            {getCraQuery.data?.status == "VALIDATED" && t("validated")}
            {getCraQuery.data?.status == "WAITING_TO_VALIDATION" && t("waiting_to_validation")}
          </h1>
          <div className="flex items-center space-x-2">
            {/*  <Button>Envoyer</Button> */}
            {Lignes.length > 0 &&
              getCraQuery.data?.status == "NOT_SENT_TO_VALIDATION_YET" && (
                <Button
                  className=" text-white rounded-lg "
                  onClick={() => {
                    SendCraToValidation();
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
            {Lignes.length > 0 &&
              getCraQuery.data?.status == "WAITING_TO_VALIDATION" && (
                <Button
                  className=" text-white bg-red-400 rounded-lg "
                  onClick={() => {
                    UndoSendCraToValidation();
                  }}
                >
                  {/* <FileEditIcon className="text-white" /> */}
                  {/*  <FontAwesomeIcon
                      icon={faPaperPlane}
                      className=""
                      color="white"
                    /> */}
                  <RotateCcw />
                </Button>
              )}
          </div>
        </div>
        <div className=" p-8">
          <header className="flex w-full justify-between items-center mb-4">
            <div className="w-1/4">
              <h1 className="text-xl font-semibold">
                {CurrentDate?.format("MMMM-YYYY")} - {user.name}  <span className="text-red-400">{NewLigneTextError}</span>
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
                / {GlobalAvailableDaysCount} {t("business_days")}
              </span>
              <span className="text-sm mx-3">
                {CurrentAvailableDaysCount} / {GlobalAvailableDaysCount} {t("days")}
                {t("filled")}
              </span>
              {IsAddingANewLine && (
                <Button
                  onClick={() => {
                    Save();
                  }}
                  className="mx-4"
                >
                  {/* save */}
                  <FontAwesomeIcon icon={faBookmark} color="white" />
                </Button>
              )}
            </div>
          </header>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3 bg-white p-4 rounded-md shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">{t("activities")}</h2>
                {IsAddingANewLine == false && ProgressCount < 100 && getCraQuery.data?.status == "NOT_SENT_TO_VALIDATION_YET" ? (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsAddingANewLine(true);
                      LoadNewLigne();
                    }}
                  >
                    +
                  </Button>
                ) : null}
                {IsAddingANewLine == true && ProgressCount < 100 && getCraQuery.data?.status == "NOT_SENT_TO_VALIDATION_YET" ? (
                  <Button
                    size={"icon"}
                    variant="secondary"
                    onClick={() => {
                      setIsAddingANewLine(false);
                    }}
                  >
                    <X />
                  </Button>
                ) : null}
              </div>
              <div className="mb-4">
                {IsAddingANewLine && (
                  <div className="w-full">
                    <div className="flex items-center justify-center">
                      <Select
                        onValueChange={(e) => {
                          const project: IProject | undefined = projects_query.data?.find(
                            (pr) => pr.id == parseInt(e as string)
                          );
                          if (project) {
                            setSelectedProject(project);
                            setActivityList(project.activities || []);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full outline-none">
                          <SelectValue placeholder={t("select_project")} />
                        </SelectTrigger>
                        <SelectContent>
                          {projects_query.data?.map((item) => (
                            <SelectItem value={item.id.toString()}>
                              {item.project_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-center my-2">
                      <Select
                        onValueChange={(e) => {
                          const activity: Activity | undefined =
                            ActivityList.find(
                              (ac) => ac.id == parseInt(e as string)
                            );
                          if (activity) {
                            setSelectedActivity(activity);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full outline-none">
                          <SelectValue placeholder={t("select_activity")} />
                        </SelectTrigger>
                        <SelectContent>
                          {ActivityList.map((item) => (
                            <SelectItem value={item.id.toString()}>
                              {item.activity_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                {/*  <Select>
                                        <SelectTrigger id="activity">
                                            <SelectValue placeholder="Refonte du SI - MISI01412 - APPLE" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem value="option1">Option 1</SelectItem>
                                            <SelectItem value="option2">Option 2</SelectItem>
                                        </SelectContent>
                                    </Select> */}
              </div>
              {IsAddingANewLine && (
                <div className="mb-4">
                  <Button
                    className="w-full"
                    variant="default"
                    onClick={() => {
                      FillInTheBlanks();
                    }}
                  >
                    {t("fill")}
                  </Button>
                </div>
              )}
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
                              {ligne.activity_title} - {t("count_of_days")} :{ligne.count_of_days} -
                              {/*    id: {ligne.id} j */}
                            </p>
                            <p className="text-sm flex">
                              {t("comment")} : {ligne.comment ? ligne.comment : t("no_comment")}
                            </p>
                            {/* <Button variant={"default"} >+</Button> */}
                          </div>
                        </div>
                        <div className="w-1/4 flex justify-end">
                          {getCraQuery.data?.status == "NOT_SENT_TO_VALIDATION_YET" && (
                            <Popover>
                              <PopoverTrigger>
                                <Button variant={"outline"}>
                                  <Ellipsis />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-fit">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Button
                                        variant="outline"
                                        className="mx-2"
                                        size="icon"
                                        onClick={() => {
                                          setTimeLigneId(ligne.id);
                                          setIsAlertDialogCommentShown(true);
                                        }}
                                      >
                                        <MessageSquareMore className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{t("add_comment_to_timeline")}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                          if (ligne.id) {
                                            deleteTimeLigne(ligne.id);
                                          }
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{t("delete_timeline")}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </PopoverContent>
                            </Popover>
                          )}
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
                    {/*  {  parseInt(day.day_full_date.format("D"))} */}
                    {day.is_jour_ferier == true ? <>
                      <div className="w-full text-center bg-gray-300">
                        {day.day_abr}
                        <br />
                        {/*  {day.day_full_date.format("MMMM Do YYYY")} */}
                        {day.day_full_date.format("D")}
                      </div>
                    </> : <>
                      {day.day_abr === "S" || day.day_abr === "D" ? (
                        <div className="w-full text-center bg-gray-300 ">
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
                    </>}
                  </div>
                ))}
                {/* <div className="flex items-center space-x-2">
                                         <CalendarIcon className="text-gray-600" />
                                        <span className="text-sm font-medium">9,52 %</span>
                                    </div>
                                     <div>
                                        <span className="text-sm">2 / 21 jours ouvrés</span>
                                    </div> */}
              </div>
              {IsAddingANewLine && (
                <div className="flex justify-between items-center py-4 mb-6 ">
                  {NewLigne?.map((item) => (
                    <input
                      type="text"
                      disabled={item.is_disabled}
                      value={item.value}
                      placeholder=""
                      onChange={(e) =>
                        handleInputChange(item.app_id, e.target.value)
                      }
                      className={`w-1/2 py-1 mx-1 border-2 outline-none  border-gray-600 rounded-md  text-center h-1/3 ${item.is_disabled ? "bg-gray-200" : "bg-white"
                        }`}
                    />
                  ))}
                </div>
              )}
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
              {/*       <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1 bg-gray-50 p-4 rounded-md">
                                        <h3 className="text-sm font-medium mb-2">Absence</h3>
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-sm">CP</p>
                                            <p className="text-sm">2 j</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-medium">TOTAL</p>
                                            <p className="text-sm">2 j</p>
                                        </div>
                                    </div>
                                    <div className="col-span-1 bg-gray-50 p-4 rounded-md">
                                        <h3 className="text-sm font-medium mb-2">Interne</h3>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-medium">TOTAL</p>
                                            <p className="text-sm">0 j</p>
                                        </div>
                                    </div>
                                    <div className="col-span-1" />
                                </div> */}
              {/*   {IsAddingANewLine && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium mb-2" htmlFor="comments">
                                            Commentaires
                                        </label>
                                        <Textarea
                                            value={CurrentLineComment}
                                            onChange={(e) => { setCurrentLineComment(e.target.value) }}
                                            className="w-full h-24 p-2 border rounded-md"
                                            id="comments"
                                            placeholder="Rédigez vos commentaires"
                                        />
                                    </div>
                                )} */}
              {/*    {IsAddingANewLine && ( */}
              <AlertDialog open={IsAlertDialogCommentShown}>
                {/*   <AlertDialogTrigger>Open</AlertDialogTrigger> */}
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("create_comment")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      <Form {...update_comment_form}>
                        <form
                          onSubmit={update_comment_form.handleSubmit(onSubmit)}
                        >
                          <FormField
                            control={update_comment_form.control}
                            name="comment"
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel>{t("comment")}</FormLabel>
                                <FormControl>
                                  <Input
                                    /* value={CommentTimeLigne} onChange={(e) => { setCommentTimeLigne(e.target.value) }} */ placeholder="comment"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end">
                            <Button className="mt-2" /* loading={isLoading} */>
                              {t("create_comment")}
                            </Button>
                          </div>
                        </form>
                      </Form>
                      {/*  This action cannot be undone. This will permanently delete your account
                                            and remove your data from our servers. */}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  {/*   <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction>Continue</AlertDialogAction>
                                    </AlertDialogFooter> */}
                </AlertDialogContent>
              </AlertDialog>
              {/*  )} */}
              {/* <div className="mt-4">
                                    <label className="block text-sm font-medium mb-2" htmlFor="documents">
                                        Documents signés et pièces jointes
                                    </label>
                                    <div className="p-4 border-dashed border-2 border-gray-300 rounded-md flex justify-center items-center">
                                        <UploadIcon className="text-gray-600" />
                                    </div>
                                </div> */}
            </div>
          </div>
        </div>
        <div className=" px-8 pb-6">
          <div className="bg-white p-4 shadow rounded-lg">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/*     <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Exceptional Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p>Production</p>
                    <p>Total 0d</p>
                  </div>
                </CardContent>
              </Card> */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>{t("absence")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {fetchAbsenceCountApiQuery.data?.length == 0 && <>
                    <div className="flex items-center justify-between">
                      <p>
                        {t("no_absences")}
                      </p>
                    </div>
                  </>}
                  {fetchAbsenceCountApiQuery.data?.slice(0, 2).map((abs) => (
                    <div className="flex items-center justify-between">
                      <p>{abs.reason}</p>
                      <p>{abs.nombre_des_jours} J</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              {/*  <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Internal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p>Total 0d</p>
                  </div>
                </CardContent>
              </Card> */}
            </div>
            {/*     <div className="grid grid-cols-3 gap-4">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>
                    Signed Documents and Attachments {NewLigneTextError}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-32 border-dashed border-2 border-gray-300 rounded-lg">
                    <Button variant="outline">Upload</Button>
                  </div>
                </CardContent>
              </Card>
            </div> */}
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default SetSchedule;
