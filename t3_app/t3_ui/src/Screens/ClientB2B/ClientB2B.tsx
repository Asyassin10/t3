import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcnuicomponents/ui/table";
import { z } from "zod";
import { useToast } from "@/shadcnuicomponents/ui/use-toast";
import { useForm } from "react-hook-form";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcnuicomponents/ui/form";
import { Input } from "@/shadcnuicomponents/ui/input";
import { Button } from "@/shadcnuicomponents/custom/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import UpdateClientB2b from "@/AppComponents/ClientB2b/UpdateClientB2b";
import { useTranslation } from "react-i18next";
import ClientCommercialData from "./ClientCommercialData";
import { createClientApi, deleteClientApi, getAllClientsApi } from "@/axios/AbstractionsApi/ApiClientB2b";
import GeneralPaginator from "@/AppComponents/GeneralPaginator";


function ClientB2BScreen() {
  const { t } = useTranslation()

  const createClientB2bSchema = z.object({
    name: z.string({
      required_error: t("validation.string.empty", { field: t("name") })
    }).min(1, {
      message: t("validation.string.too_small", { field: t("name"), min: 1 })

    })
      .max(200, {
        message: t("validation.string.too_big", { field: t("too_big") })
      })
  });
  const [IsAlertOpen, setIsAlertOpen] = useState(false);

  const [selectPage, setSelectPage] = useState(1);
  const [valueSearch, setvalueSearch] = useState("");
  const client_b2b_query = useQuery({
    queryKey: ["client_b2b_query", selectPage, valueSearch],
    queryFn: () => getAllClientsApi(selectPage, valueSearch)
  });


  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);
  const form = useForm<z.infer<typeof createClientB2bSchema>>({
    resolver: zodResolver(createClientB2bSchema),
    defaultValues: {
      name: "",
    },
  });
  const createClientApiMutation = useMutation({
    mutationKey: ["createClientApi"],
    mutationFn: (name: string) => createClientApi(name)
    , onSuccess: () => {
      toast({
        title: t("manager_created_successfully"),
        className: "bg-emerald-500",
        variant: "default",
      });

      setSelectPage(1);
      setIsAlertOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["client_b2b_query", selectPage],
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
  function onSubmit(values: z.infer<typeof createClientB2bSchema>) {

    createClientApiMutation.mutate(values.name)
  }
  const reserSearch = () => {
    setvalueSearch("");
    queryClient.invalidateQueries({
      queryKey: ["client_b2b_query"],
    });
  };

  const deleteClientApiMutation = useMutation({
    mutationKey: ["deleteClientApi"],
    mutationFn: (id: string) => deleteClientApi(id),
    onSuccess: () => {
      setOpenDialogId(null);
      queryClient.invalidateQueries({
        queryKey: ["client_b2b_query", selectPage],
      });

      toast({
        title: t("client_deleted_successfully"),
        description: t("client_related_projects_and_activities_deleted"),
        className: "bg-emerald-500",
        variant: "default",
      });
    },
    onError: () => {
      setOpenDialogId(null)
      queryClient.invalidateQueries({
        queryKey: ["client_b2b_query", selectPage],
      });
      toast({
        title: t("general_error"),
        className: "bg-red-500",
        variant: "default",
      });
    }
  })
  const DeleteclientB2b = (id: number) => {
    deleteClientApiMutation.mutate(id.toString())
  };

  return (
    <>
      <div className=" flex-1 h-full bg-gray-50 w-full overflow-auto">

        {/*     {client_b2b_query.isLoading ? (
          <div className="flex items-center justify-center w-full h-5/6">
            <Spinner />
          </div>
        ) : (
        )} */}
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-col justify-end w-full px-5 py-5 md:flex-row">
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
                >
                  {t("buttonAddClientB2B")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle> {t("labelAddClientB2B")}</DialogTitle>
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
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel> {t("name")}</FormLabel>
                            <FormControl>
                              <Input placeholder={t("name")} {...field} />
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
                          }}
                        >
                          {t("btn_cancel_txt")}
                        </Button>
                        <Button
                          type="submit"
                          loading={createClientApiMutation.isPending}
                        >
                          {t("btn_submit_txt")}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <hr className="m-4" />
          <div className="flex items-center justify-between px-5 m-4">
            <h2 className="font-bold">{t("list_of_client_b_to_b")}: <span className="mx-2">
              {client_b2b_query.data?.total}
            </span></h2>

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
                className=""
              >
                {t("btntxtresetfilter")}
              </Button>
            </div>
          </div>

          <hr className="m-4" />
          <div className="flex px-6 flex-col flex-wrap items-start justify-start flex-1 w-full md:flex-row ">


            <Table className="border">
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">name</TableHead>

                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {client_b2b_query.data?.data.map((client_b2b) => (
                  <TableRow>
                    <TableCell className="font-medium">
                      {client_b2b.client_b2b_name}
                    </TableCell>

                    <TableCell className="text-center">
                      <Button
                        onClick={() =>
                          setOpenDialogId(client_b2b.id)}
                        variant="destructive"
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        {t("delete_client")}
                      </Button>
                      <UpdateClientB2b clientB2b={client_b2b} />
                      <ClientCommercialData client={client_b2b} />
                      <Dialog open={openDialogId === client_b2b.id} onOpenChange={() => setOpenDialogId(null)}>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle> {t("delete_client")} : {client_b2b.client_b2b_name}</DialogTitle>
                            <DialogDescription>
                              <br />
                              {t("if_you_delete_client")} <b> {client_b2b.client_b2b_name} </b>,{t("client_projects_will_be_deleted")} <br /> {t("are_you_sure_to_continue")}
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => {
                              setIsAlertOpen(false);
                            }}>{t("btn_cancel_txt")}</Button>
                            <Button variant="destructive" onClick={() => DeleteclientB2b(client_b2b.id)} loading={deleteClientApiMutation.isPending}>{t("delete_client")}</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="w-full my-4">
            {client_b2b_query.data && (
              <GeneralPaginator
                pagination={client_b2b_query.data}
                onPageChange={setSelectPage}
              />
            )}

          </div>

        </div>
      </div>
    </>
  );
}

export default ClientB2BScreen;
