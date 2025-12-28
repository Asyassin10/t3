import { Button } from "@/shadcnuicomponents/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shadcnuicomponents/ui/card"
import { Badge } from "@/shadcnuicomponents/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/shadcnuicomponents/ui/avatar"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/shadcnuicomponents/ui/table"
import { User } from "@/types/AppTypes"
import { Link, useParams } from "react-router-dom"
import moment from "moment"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Spinner from "@/AppComponents/Spinner"
import { useTranslation } from "react-i18next"
import { getManagerProfileData } from "@/axios/AbstractionsApi/ApiManager"
import ErrorPage from "@/AppComponents/ErrorPage"


function ManagerProfile() {
    const queryClient = useQueryClient();

    const user = queryClient.getQueryData<User>(['user_data']);
    const { maangerId } = useParams();
    const currentDate = moment();
    const { t } = useTranslation();


    const manager_profile_Query = useQuery({
        queryKey: ["manager_profile_Query", maangerId],
        queryFn: () => {
            const formData = new FormData();
            formData.append("manager_id", String(maangerId));
            formData.append("year", currentDate.format("YYYY"));
            formData.append("month", currentDate.format("MM"));

            return getManagerProfileData(formData);
        }
    });
    if (manager_profile_Query.isLoading) {
        return <div className="flex items-center justify-center w-full h-screen">
            <Spinner />
        </div>
    }
    if (!user) {
        return <ErrorPage />;
    }
    return (
        <>

            <div className="flex flex-col w-full min-h-screen bg-muted/40">
                <div className="mt-4 ml-6">
                    <Button variant="outline"> <Link to="/app/managers" className="flex items-center ">Managers</Link> </Button>
                </div>
                <main className="grid items-start flex-1 gap-4 p-4 my-10 sm:px-6 sm:py-0 md:gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manager Details</CardTitle>
                            <CardDescription>View and manage manager information.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                    <div className="grid gap-1">
                                        <div className="text-sm font-medium">Name</div>
                                        <div>{manager_profile_Query.data?.user.name}</div>
                                    </div>
                                    <div className="grid gap-1">
                                        <div className="text-sm font-medium">Email</div>
                                        <div>{manager_profile_Query.data?.user.email}</div>
                                    </div>
                                    <div className="grid gap-1">
                                        <div className="text-sm font-medium">Status</div>
                                        <div>
                                            <Badge variant={`${manager_profile_Query.data?.user.is_active ? 'secondary' : 'destructive'}`}>{
                                                manager_profile_Query.data?.user.is_active ? t("active") : t("non_active")
                                            }</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Absences</CardTitle>
                            <CardDescription>View manager absences.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Reason</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {manager_profile_Query.data?.absences.map((abs) => (
                                        <TableRow>
                                            <TableCell>{abs.date_debut}</TableCell>
                                            <TableCell>{abs.type_absence.label_type_absence}</TableCell>
                                            <TableCell>{abs.reason}</TableCell>
                                        </TableRow>
                                    ))}

                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Consultants</CardTitle>
                            {/*   <CardDescription>View manager consultants.</CardDescription> */}
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {manager_profile_Query.data?.consultants.map((c) => (

                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src="/placeholder-user.jpg" />
                                            <AvatarFallback>C1</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{c.user.name}</div>
                                            <div className="text-sm text-muted-foreground">{c.professionality}</div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Projects</CardTitle>
                            <CardDescription>View manager projects.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {manager_profile_Query.data?.projects.map((pro) => (

                                    <div className="flex items-center gap-4">
                                        <Badge variant="outline">
                                            {pro.project_name}
                                        </Badge>
                                        <div className="text-sm text-muted-foreground">
                                            {pro.info}
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </CardContent>
                    </Card>
                </main>


            </div>

        </>
    );
}

export default ManagerProfile
