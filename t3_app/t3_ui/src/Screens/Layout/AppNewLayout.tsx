
import { Outlet } from "react-router-dom"
import { useState } from "react"
import { TopHeader } from "./DashboardComponents/TopHeader"
import { getCurrentUser } from "@/axios/AbstractionsApi/ApiUser"
import { useQuery } from "@tanstack/react-query"
import { User } from "@/types/AppTypes"
import { getApplicationDataApi } from "@/axios/AbstractionsApi/ApiApplicationSetting"

function AppNewLayout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const user_data = useQuery<User>({
        queryKey: ['user_data'],
        queryFn: () => getCurrentUser()
    })
    useQuery({
        queryKey: ["application_data_query"],
        queryFn: () => getApplicationDataApi()
    });
    return (
        <div className="flex flex-col h-screen bg-background text-foreground">
            {user_data.data && (

                <TopHeader
                    user={user_data.data}
                    mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
            )}

            {user_data.data && (
                <main className="flex-1 overflow-hidden flex">
                    <Outlet />
                </main>
            )}
        </div>
    )
}

export default AppNewLayout


