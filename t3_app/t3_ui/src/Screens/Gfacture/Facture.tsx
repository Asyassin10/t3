import Spinner from "@/AppComponents/Spinner";
import { loadMonths, loadYears } from "@/lib/helpers/time_helpers";
import { Button } from "@/shadcnuicomponents/custom/button";
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
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
  FormDescription,
  Form,
} from "@/shadcnuicomponents/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcnuicomponents/ui/select";
import { User } from "@/types/AppTypes";
import { ValidationErrorRequest } from "@/types/http_types";
import { get_all_client_b2b_queryEnables } from "@/utils/react-query/enablers";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcnuicomponents/ui/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { toast } from "@/shadcnuicomponents/ui/use-toast";
import { useTranslation } from "react-i18next";
import { getAllClientB2BApiQuery } from "@/axios/AbstractionsApi/ApiClientB2b";
import { GeneratePdfParams, SaveFactureDTO } from "@/types/requests_types";
import { deletePdfApi, generatePdfApi, getAllFactures, saveFacturesOfClientsApi } from "@/axios/AbstractionsApi/ApiFacture";
import GeneralPaginator from "@/AppComponents/GeneralPaginator";
import FactureOptions from "@/AppComponents/Factures/FactureOptions";

function Facture() {
  const queryClient = useQueryClient();

  const user = queryClient.getQueryData<User>(['user_data']);
  const { t } = useTranslation()
  const formSchemaCreateFacture = z.object({
    year: z
      .string({
        required_error: t("validation.string.empty", { field: t("year") })
      })
      .min(0, {
        message: t("validation.string.empty", { field: t("year") })
      }),
    mounth: z
      .string({
        required_error: t("validation.string.empty", { field: t("month") })
      })
      .min(0, {
        message: t("validation.string.empty", { field: t("month") })
      }),
    clientB2B: z
      .string({
        required_error: t("validation.string.empty", { field: t("client_b2b") })
      })
      .min(0, {
        message: t("validation.string.empty", { field: t("client_b2b") })
      }),
  });
  const [isAlertOpenAddingfacture, setisAlertOpenAddingfacture] =
    useState(false);
  const [selectPage, setSelectPage] = useState(1);

  const [selectedMonth, setselectedMonth] = useState<string | undefined>(
    undefined
  );
  const [clientB2b, setClientB2b] = useState<string | undefined>(undefined);
  const [selectedYear, setselectedYear] = useState<string | undefined>(
    undefined
  );
/*   const [isLoadingAddingFacture, setisLoadingAddingFacture] = useState(false);
 */  const years = loadYears(5);
  const months = loadMonths();

  const facture_query = useQuery({
    queryKey: ["facture_query", selectPage, selectedMonth, selectedYear, clientB2b],
    queryFn: () => getAllFactures(selectPage, selectedMonth, clientB2b, selectedYear)
  });
  const form = useForm<z.infer<typeof formSchemaCreateFacture>>({
    resolver: zodResolver(formSchemaCreateFacture),
  });

  const get_all_client_b2b_query = useQuery({
    queryKey: ["get_all_client_b2b_query"],
    queryFn: () => getAllClientB2BApiQuery(),
    enabled: get_all_client_b2b_queryEnables(),
  });

  const saveFactureFirAllClients = useMutation({
    mutationKey: ["saveFacturesOfClients"],
    mutationFn: (payload: SaveFactureDTO) => saveFacturesOfClientsApi(payload),

    onSuccess: (data, variables) => {
      setisAlertOpenAddingfacture(false);

      // Invalidate factures list
      queryClient.invalidateQueries({ queryKey: ["facture_query"] });

      // Download the PDF zip
      const pdfUrl = data.full_path;
      const link = document.createElement("a");
      link.target = "_blank";
      link.href = pdfUrl;
      link.download = `pdf_zip_${variables.year}${variables.month}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    onError: (err: AxiosError<ValidationErrorRequest>) => {
      setisAlertOpenAddingfacture(false);

      if (err.response?.data.message === "no_projects") {
        toast({
          title: t("no_projects_for_this_client"),
          className: "bg-red-500",
        });
      }

      console.error(err);
    },
  });

  function onSubmit(values: z.infer<typeof formSchemaCreateFacture>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    saveFactureFirAllClients.mutate({
      year: values.year,
      month: values.mounth,
      client_id: values.clientB2B,
    });

  }

  const currentDate = moment(); // This creates a moment object representing the current date and time
  /*   const [IsActionDownloadDisabled, setIsActionDownloadDisabled] = useState(false)
   */
  const imprimerFactureMutation = useMutation({
    mutationKey: ["generatePdf"],
    mutationFn: (params: GeneratePdfParams) => generatePdfApi(params),

    onSuccess: async (data) => {
      if (data.message === "client_missed") {
        toast({
          title: t("invoice_has_no_client"),
          className: "bg-red-500",
        });
        return;
      }

      if (data.full_path) {
        const pdfUrl = data.full_path;

        // Download PDF
        const link = document.createElement("a");
        link.target = "_blank";
        link.href = pdfUrl;
        link.download = `invoice_${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Delete PDF after download
        await deletePdfApi(pdfUrl);
      }
    },

    onError: (err: any) => {
      toast({
        title: t("general_error"),
        className: "bg-red-500",
      });
      console.error(err);
    },
  });


  const imprimerFacture = async (id: number) => {
    imprimerFactureMutation.mutate({
      id,
      month: currentDate.month() + 1,
      year: currentDate.year(),
    });
  };

  /*   const filter_facture_query = useQuery({
      queryKey: ["filter_facture_query", isFilterPage],
      queryFn: async () => {
        const searchParams = {
          ...(selectedMonth && { selectedMonth }),
          ...(selectedYear && { selectedYear }),
  
          ...(clientB2b && { clientB2b }),
        };
  
        const response = await api_client.post<QueryObjectFatures>(
          "/time_sheet/filter_project" + "/" + isFilterPage,
          searchParams,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
  
        return response.data;
      },
      enabled: isFilter,
    }); */

  const resetFilter = () => {
    setSelectPage(1);

    setselectedMonth("");
    setselectedYear("");
    setClientB2b("");

    queryClient.invalidateQueries({
      queryKey: ["facture_query"],
    });
  };

  /* const [ClientB2bPost, setClientB2bPost] = useState<number | undefined>(undefined) */
  return (
    <div className=" flex-1 h-full bg-gray-50 w-full overflow-auto">

      {facture_query.isLoading && get_all_client_b2b_query.isLoading ? (
        <div className="flex items-center justify-center w-full h-5/6">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-col justify-end w-full px-5 py-5 md:flex-row">
            {user?.role.role_name == "Admin" ||
              user?.role.role_name == "ClientEsoft" ||
              user?.role.role_name == "Manager" ? (
              <>
                <Dialog
                  open={isAlertOpenAddingfacture}
                  onOpenChange={() =>
                    setisAlertOpenAddingfacture(!isAlertOpenAddingfacture)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setisAlertOpenAddingfacture(true);
                      }}
                      className="mx-2 my-2 md:my-0"
                    >
                      {t("buttonAddFacture")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle> {t("buttonAddFacture")}</DialogTitle>
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
                            name="clientB2B"
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
                                    {get_all_client_b2b_query.data?.data.map(
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
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="year"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("selectedyear")}</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={t("selectedyear")}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {years.map((year, index) => (
                                      <SelectItem
                                        key={index}
                                        value={year.toString()}
                                      >
                                        {year}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  <br />
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="mounth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("selectedmouth")}</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={t("label_selection")}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {months.map((month, index) => (
                                      <SelectItem
                                        key={index}
                                        value={month.month_number.toString()}
                                      >
                                        {month.month_name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  <br />
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
                                setisAlertOpenAddingfacture(false);
                              }}
                              className="mx-2 my-2 md:my-0"
                            >
                              {t("btn_cancel_txt")}
                            </Button>
                            <Button
                              type="submit"
                              loading={saveFactureFirAllClients.isPending}
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
          </div>
          <hr className="m-1" />
          <div className="flex flex-col items-center w-full space-y-4 md:flex-row md:justify-between">
            <h2 className="w-full m-1 font-bold md:w-1/6">
              {t("list_of_factures")}
              <span className="mx-2">{facture_query.data?.data.length}</span>
            </h2>
            <div className="flex flex-col items-center w-full md:w-5/6 md:flex-row md:justify-end">
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

              {user?.role.role_name == "ClientEsoft" && (
                <div className="w-full mx-2 my-2 md:w-1/6 md:my-0 ">
                  <Select
                    onValueChange={(e) => {
                      setClientB2b(e);
                    }}
                    value={clientB2b}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectClient")} />
                    </SelectTrigger>
                    <SelectContent>
                      {get_all_client_b2b_query.data?.data.map(
                        (client, index) => (
                          <SelectItem key={index} value={client.id.toString()}>
                            {client.client_b2b_name}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="w-full mx-2 my-2 md:w-1/6 md:my-0 ">

                <Button
                  variant="outline"
                  onClick={() => {
                    resetFilter();
                  }}
                  className=""
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
                    {t("facture_numero")}
                  </TableHead>
                  <TableHead>{t("date_facture")}</TableHead>
                  <TableHead>{t("year")}</TableHead>
                  <TableHead>{t("mounth")}</TableHead>
                  <TableHead>{t("note")}</TableHead>
                  <TableHead>{t("invoice.paid_at_header")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facture_query.data?.data.map((facture, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {facture.numero_facture}
                    </TableCell>
                    <TableCell>{facture.date_facture}</TableCell>
                    <TableCell>{facture.year}</TableCell>
                    <TableCell>{facture.month}</TableCell>
                    <TableCell>{facture.note || "--"}</TableCell>
                    <TableCell>
                      {facture.paid_at == null
                        ? t("invoice.not_paid")
                        : t("invoice.paid_at", { date: moment(facture.paid_at).format("YYYY-MM-DD") })}
                    </TableCell>
                    <TableCell>
                      <div className="flex">
                        <Button
                          type="button"
                          disabled={imprimerFactureMutation.isPending}
                          variant="outline"
                          onClick={() => {
                            imprimerFacture(facture.id);
                          }}
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </Button>
                        <FactureOptions facture={facture} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="my-4">
            {facture_query.data && (
              <GeneralPaginator
                pagination={facture_query.data}
                onPageChange={setSelectPage}
              />
            )}

          </div>
        </div>
      )
      }
    </div >
  );
}

export default Facture;
