import { Button } from "@/shadcnuicomponents/custom/button";
import {
    Dialog,
    DialogContent, DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/shadcnuicomponents/ui/dialog";
import { Input } from "@/shadcnuicomponents/ui/input";
import { IManager, User } from "@/types/AppTypes";
import { useState } from "react";
import { useToast } from "@/shadcnuicomponents/ui/use-toast";
import { Bell, Trash, User2 } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/shadcnuicomponents/ui/tooltip";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ErrorPage from "@/AppComponents/ErrorPage";
import Spinner from "@/AppComponents/Spinner";
import { useTranslation } from "react-i18next";
import {
    deleteConfirmationMessage, noDataMessage, objectDeletedSuccessfully
} from "@/lib/helpers/language_validation_helper";
import i18n from "@/i18n";
import EditManager from "@/AppComponents/Managers/EditManager";
import { deleteManagerApi, getManagersApi, renotifyManagerApi } from "@/axios/AbstractionsApi/ApiManager";
import GeneralPaginator from "@/AppComponents/GeneralPaginator";
import CreateManagerScreen from "@/AppComponents/Managers/CreateManagerScreen";
import UnauthorizedPage from "@/AppComponents/UnauthorizedPage";
function Manager() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [openDialogId, setOpenDialogId] = useState<number | null>(null);
    const deleteManagerMutation = useMutation({
        mutationKey: ["deleteManager"],
        mutationFn: (id: number) => deleteManagerApi(id),
        onSuccess: () => {
            setOpenDialogId(null);
            queryClient.invalidateQueries({ queryKey: ["managers"] });
            toast({
                title: objectDeletedSuccessfully(i18n.language, t("manager")),
                className: "bg-emerald-500",
            });
        },
        onError: (error: any) => {
            setOpenDialogId(null);
            queryClient.invalidateQueries({ queryKey: ["managers"] });
            toast({
                title: t("general_error"),
                description: error?.message,
                className: "bg-red-500",
            });
        },
    });
    const Delete_Manager = (id: number) => {
        deleteManagerMutation.mutate(id);
    };
    const user = queryClient.getQueryData<User>(['user_data']);

    /*     const [isFilterPage, setIsFilterPage] = useState<number>(0); */
    const [selectPage, setSelectPage] = useState(1);
    const RenotifyManagerMutation = useMutation({
        mutationKey: ["renotifyManager"],
        mutationFn: (email: string) => renotifyManagerApi(email),
        onSuccess: () => {
            toast({
                title: t("manager_notified_successfully"),
                className: "bg-emerald-500",
            });
        },
    });
    const RenotifyManager = (email: string) => {
        RenotifyManagerMutation.mutate(email);
    };
    const [valueSearch, setvalueSearch] = useState("");
    //GetManagersQuery.concat("?page=").concat(selectPage),
    const managerQuery = useQuery({
        queryKey: ["managers", selectPage, valueSearch],
        queryFn: () => getManagersApi({ page: selectPage, search: valueSearch }),
        enabled: user?.role.role_name == "ClientEsoft"
    });
    const reserSearch = () => {
        setvalueSearch("");
        setSelectPage(1)
        // setSelectPage("1");
        queryClient.invalidateQueries({
            queryKey: ["managers", selectPage],
        });
    };
    if (managerQuery.isError) {
        return <ErrorPage />;
    }
    if (!user) {
        return <ErrorPage />;
    }
    if (user.role.role_name !== "ClientEsoft") {
        return <UnauthorizedPage />;
    }
    return (
        <div className=" flex-1 h-full bg-gray-50 w-full overflow-auto">
            {managerQuery.isLoading ? (
                <div className="flex items-center justify-center flex-1 w-full h-full">
                    <Spinner />
                </div>
            ) : (
                <div className="flex flex-col w-full h-full">
                    <div className="flex flex-col justify-end w-full px-5 py-5 md:flex-row">
                        <CreateManagerScreen setSelectPage={setSelectPage} />
                    </div>
                    <hr className="my-4" />
                    <div className="w-full px-5 md:flex md:justify-between">
                        <h2 className="font-bold ">
                            {t("list_of_Managers")}
                            :<span className="mx-1">
                                {managerQuery.data?.total}
                            </span>
                        </h2>
                        <div className="md:flex">
                            <div>
                                <Input
                                    type="text"
                                    value={valueSearch} onChange={(e) => {
                                        setvalueSearch(e.target.value);
                                    }}
                                    placeholder={t("inputtxtfilter")}
                                    className="md:w-[100px] lg:w-[300px]"
                                />
                            </div>
                            <Button variant="outline" onClick={() => {
                                reserSearch();
                            }}
                                className=""
                            >
                                {t("btntxtresetfilter")}
                            </Button>
                        </div>
                    </div>
                    <hr className="my-4" />
                    <div className="flex flex-col flex-wrap items-start justify-start flex-1 w-full md:flex-row ">
                        {managerQuery.data?.data.length === 0 ? (
                            <div className="flex items-center justify-center w-full h-full">
                                <div className="text-lg text-center">
                                    {noDataMessage(i18n.language, "mnagers")}
                                </div>
                            </div>
                        ) : (
                            <section className="w-full text-gray-600 body-font">
                                <div className="w-[98%] mx-auto ">
                                    <table className="min-w-full divide-y divide-gray-200 overflow-x-auto border">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    {t("name")}
                                                </th>

                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    {t("status")}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Role
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    {t("email")}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    {t("actions")}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {managerQuery.data?.data.map((m: IManager) => (
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {m.user.name}
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {m.user.is_valid == true ? (
                                                            <span
                                                                className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                {t("statut_txt_valid")}
                                                            </span>
                                                        ) : (
                                                            <span
                                                                className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                                {t("statut_txt_not_valid")}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        Admin
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {m.user.email}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap flex items-center justify-center  text-sm font-medium">
                                                        <Link to={`/app/manager_profile/${m.user.id}`}>
                                                            <User2 className="w-8 h-5" />
                                                        </Link>
                                                        <EditManager manager={m} />
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <Button variant="outline" size="icon"
                                                                        onClick={() =>
                                                                            setOpenDialogId(m.user.id)}>
                                                                        <Trash
                                                                            className="w-4 h-4 text-red-600" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{t("delete_manager")}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button variant="outline" size="icon"
                                                                        onClick={() => {
                                                                            RenotifyManager(m.user.email);
                                                                        }}>
                                                                        <Bell className="w-4 h-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{t("notify_manager")}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                        <Dialog open={openDialogId === m.user.id} onOpenChange={() =>
                                                            setOpenDialogId(null)}>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle className="leading-6">{
                                                                        deleteConfirmationMessage(i18n.language, t("resource_name_manager"))}
                                                                        : {m.user.email}
                                                                    </DialogTitle>
                                                                </DialogHeader>
                                                                <DialogFooter>
                                                                    <Button variant="outline" onClick={() =>
                                                                        setOpenDialogId(null)}>{t("cancel")}</Button>
                                                                    <Button variant="destructive" onClick={() => {
                                                                        // Handle delete logic here
                                                                        Delete_Manager(m.user.id);
                                                                    }}>{t("delete")}</Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}
                    </div>
                    <div className="my-4">
                        {managerQuery.data && (
                            <GeneralPaginator
                                pagination={managerQuery.data}
                                onPageChange={setSelectPage}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
export default Manager;
