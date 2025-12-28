
import { useEffect, useState } from "react"
/* import Link from "next/link" */
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, LayoutDashboard, Search, Menu } from "lucide-react"

import { Button } from "@/shadcnuicomponents/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuTrigger
} from "@/shadcnuicomponents/ui/dropdown-menu"
import { Input } from "@/shadcnuicomponents/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/shadcnuicomponents/ui/sheet"
/* import { cn } from "@/lib/utils" */
import { cn } from "@/lib/shadcnuiutils"
import { Link } from "react-router-dom"
import { LogoIconT3 } from "@/shadcnuicomponents/Icons"
import { useTranslation } from "react-i18next"


// Sample navigation data

export function ModernHeader() {
    const { t } = useTranslation();

    const navigationItems = [
        {
            title: "Application",
            items: [
                { title: t("nav_absence.label"), href: "/app/absences", description: t("nav_absence.description") },
                { title: t("nav_managers.label"), href: "/app/managers", description: t("nav_managers.description") },
                { title: t("nav_cra.label"), href: "/app/cras", description: t("nav_cra.description") },
                { title: t("nav_projects.label"), href: "/app/projects", description: t("nav_projects.description") },
                { title: t("nav_factures.label"), href: "/app/factures", description: t("nav_factures.description") },
                { title: t("nav_client.label"), href: "/app/client_b2b", description: t("nav_client.description") },
                { title: t("nav_consultants.label"), href: "/app/concultants", description: t("nav_consultants.description") },
                { title: t("nav_activites.label"), href: "/app/activites", description: t("nav_activites.description") },
            ],
        },

    ]
    const [scrolled, setScrolled] = useState(false)


    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300",
                scrolled ? "bg-background/80 backdrop-blur-lg shadow-sm" : "bg-background",
            )}
        >
            <div className="container flex h-20 items-center justify-between">
                {/* Logo and App Name */}
                <div className="flex items-center gap-3 ">
                    <div className="flex items-center justify-center h-10 rounded-xl  ">
                        {/*  <LayoutDashboard className="h-5 w-5" /> */}
                        <LogoIconT3 />
                    </div>

                    <span className="text-xl font-bold tracking-tight">T3</span>
                </div>

                {/* Mobile Menu */}
                <div className="flex md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="ghost">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <div className="flex flex-col gap-6 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
                                        <LayoutDashboard className="h-5 w-5" />
                                    </div>
                                    <span className="text-xl font-bold">Horizon</span>
                                </div>

                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search..." className="pl-9" />
                                </div>

                                <div className="flex flex-col gap-4">
                                    {navigationItems.map((item) => (
                                        <div key={item.title} className="flex flex-col gap-2">
                                            <h3 className="text-sm font-medium text-muted-foreground">{item.title} </h3>
                                            <div className="flex flex-col gap-1">
                                                {item.items.map((subItem) => (
                                                    <Link
                                                        key={subItem.title}
                                                        to={subItem.href}
                                                        className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                                                    >
                                                        {subItem.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-1">
                    {navigationItems.map((item) => (
                        <NavItem key={item.title} item={item} />
                    ))}
                </nav>

                {/* Right Section - Search, Notifications, Profile */}
                <div className="hidden md:flex items-center gap-2">
                    {/* <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="w-[180px] pl-9 h-9 rounded-full bg-muted/50 border-none focus-visible:ring-primary"
                        />
                    </div>

                    <NotificationsDropdown /> */}
                    {/*   <ProfileDropdown /> */}
                </div>
            </div>

            {/* Mobile Search - Animated */}
            <AnimatePresence>
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="md:hidden container overflow-hidden"
                >
                    <div className="py-2 px-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search..." className="pl-9" autoFocus />
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </header>
    )
}

// Navigation item with dropdown
function NavItem({ item }: { item: { title: string; items: { title: string; href: string; description: string }[] } }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors"
                >
                    {item.title}
                    <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="center"
                className="w-[220px] p-2 rounded-xl backdrop-blur-sm animate-in fade-in-80 zoom-in-95"
            >
                {item.items.map((subItem) => (
                    <DropdownMenuItem
                        key={subItem.title}
                        asChild
                        className="flex flex-col items-start rounded-lg p-2 focus:bg-accent"
                    >
                        <Link to={subItem.href} className="w-full cursor-pointer">
                            <span className="font-medium">{subItem.title}</span>
                            <span className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{subItem.description}</span>
                        </Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

/* // Notifications dropdown component
function NotificationsDropdown() {
    const notifications = [
        { id: 1, title: "New message", description: "You have a new message from Alex", time: "2m ago" },
        { id: 2, title: "Project update", description: "Dashboard project was updated", time: "1h ago" },
        { id: 3, title: "New comment", description: "Sarah commented on your post", time: "3h ago" },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                        {notifications.length}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[320px] p-2 rounded-xl">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Notifications</h3>
                        <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
                            Mark all as read
                        </Button>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-2 rounded-lg focus:bg-accent">
                        <div className="flex w-full justify-between">
                            <span className="font-medium">{notification.title}</span>
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                        <span className="text-xs text-muted-foreground mt-0.5">{notification.description}</span>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-lg cursor-pointer justify-center font-medium">
                    <Link to="#">View all notifications</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
 */
// Profile dropdown component

