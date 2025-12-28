import { useEffect, useState } from "react"
import { Menu, X, Bell, Settings } from "lucide-react"
import { cn } from "@/lib/shadcnuiutils"
import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import ProfileDropdown from "./profile-dropdown"
import { useQuery } from "@tanstack/react-query"
import { getAssignedModules } from "@/axios/AbstractionsApi/ApiModule"
import { AssignedModule } from "@/types/http_types"
import { User } from "@/types/AppTypes"
import GlobalSearch from "./GlobalSearch"

interface TopHeaderProps {
    mobileMenuOpen: boolean
    setMobileMenuOpen: (open: boolean) => void
    user: User
}

export function TopHeader({ mobileMenuOpen, setMobileMenuOpen, user }: TopHeaderProps) {
    /*     const [activeTab, setActiveTab] = useState("project") */
    const modules_data = useQuery<AssignedModule[]>({
        queryKey: ['modules_data'],
        queryFn: () => getAssignedModules()
    })
    const [appDropdownOpen, setAppDropdownOpen] = useState(false)
    const { t } = useTranslation()
    const navTabs = [
        {
            title: t("nav_absence.label"),
            href: "/app/absences",
            description: t("nav_absence.description"),
            supportedRoles: ["ClientEsoft", "Manager", "Consultant"],
            isAccessible: modules_data.data?.find(mod => mod.assigned_module_name == "ABS") ? true : false,
        },
        {
            title: t("nav_managers.label"),
            href: "/app/managers",
            description: t("nav_managers.description"),
            supportedRoles: ["ClientEsoft"],
            isAccessible: true
        },
        {
            title: t("nav_cra.label"),
            href: "/app/cras",
            description: t("nav_cra.description"),
            supportedRoles: ["Consultant", "Manager", "ClientEsoft"],
            isAccessible: modules_data.data?.find(mod => mod.assigned_module_name == "CRA") ? true : false,
        },
        {
            title: t("nav_projects.label"),
            href: "/app/projects",
            description: t("nav_projects.description"),
            supportedRoles: ["ClientEsoft", "Manager", "Consultant"],
            isAccessible: true
        },
        {
            title: t("nav_factures.label"),
            href: "/app/factures",
            description: t("nav_factures.description"),
            supportedRoles: ["ClientEsoft", "Admin"],
            isAccessible: modules_data.data?.find(mod => mod.assigned_module_name == "GFACT") ? true : false,
        },
        {
            title: t("nav_client.label"),
            href: "/app/client_b2b",
            description: t("nav_client.description"),
            supportedRoles: ["ClientEsoft"],
            isAccessible: true
        },
        {
            title: t("nav_consultants.label"),
            href: "/app/concultants",
            description: t("nav_consultants.description"),
            supportedRoles: ["ClientEsoft", "Manager"],
            isAccessible: true
        },
        {
            title: t("nav_activites.label"),
            href: "/app/activites",
            description: t("nav_activites.description"),
            supportedRoles: ["ClientEsoft", "Manager", "Consultant"],
            isAccessible: true
        },
    ]
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<string>("");
    useEffect(() => {
        const currentPath = location.pathname;
        const found = navTabs.find(tab =>
            currentPath.startsWith(tab.href.replace(/s$/, "")) // remove last "s"
        );
        setActiveTab(found?.href || "");
    }, [location.pathname]);


    return (
        <>
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-background border-b border-border">
                <div className="px-4 lg:px-8 py-3 flex items-center justify-between">
                    {/* Left Section - Logo and App Selector */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center font-bold text-primary-foreground text-sm">
                                T3
                            </div>
                            <span className="font-semibold text-foreground hidden sm:inline">T3</span>
                        </div>

                    </div>

                    {/* Right Section - Search and Actions */}
                    <div className="flex items-center gap-3 lg:gap-4">
                        {/* Search Bar - Desktop Only */}
                        <GlobalSearch />
                        {/* Action Buttons */}
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground hidden sm:block">
                            <Bell size={18} />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground hidden sm:block">
                            <Settings size={18} />
                        </button>
                        <ProfileDropdown />

                    </div>
                </div>

                <div className="border-t border-border overflow-x-auto">
                    <div className="px-4 lg:px-8 flex items-center gap-8">
                        {navTabs
                            .filter((link) => link.supportedRoles.includes(user.role.role_name))
                            .filter((link) => link.isAccessible == true)
                            .map((tab) => (
                                <Link to={tab.href}
                                    key={tab.href}
                                    /*    onClick={() => setActiveTab(tab.id)} */
                                    className={cn(
                                        "py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2",
                                        activeTab == tab.href
                                            ? "text-foreground border-primary"
                                            : "text-muted-foreground border-transparent hover:text-foreground hover:border-border",
                                    )}
                                >
                                    {tab.title}
                                </Link>
                            ))}
                    </div>
                </div>
            </header>

            {appDropdownOpen && <div className="fixed inset-0 z-30" onClick={() => setAppDropdownOpen(false)} />}
        </>
    )
}
