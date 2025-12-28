import { LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User as UserType } from "@/types/AppTypes";
import { useAtom } from "jotai";
import { json_t3_modules_atom, json_t3_token, json_t3_user } from "@/state/atom";
import { useTranslation } from "react-i18next";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/shadcnuicomponents/ui/dropdown-menu";
import { Button } from "@/shadcnuicomponents/custom/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcnuicomponents/ui/avatar";
import api_client from "@/axios/api_client";
import { useQueryClient } from "@tanstack/react-query";
import ConditionalRoleContent from "@/Router/ConditionalRoleContent";
import ErrorPage from "@/AppComponents/ErrorPage";
export default function ProfileDropdown() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const user = queryClient.getQueryData<UserType>(['user_data']);
    const [user_state, setT3User] = useAtom(json_t3_user);
    const [token, setT3Token] = useAtom(json_t3_token);
    const [modules, setT3Modules] = useAtom(json_t3_modules_atom);
    const { t } = useTranslation()
    if (!user) {
        return <ErrorPage />;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full overflow-hidden border border-border/40 p-0">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Profile" />
                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-purple-600/80 text-primary-foreground">
                            JD
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
                <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-10 w-10 border-2 border-background">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Profile" />
                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-purple-600/80 text-primary-foreground">
                            JD
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/app/profile")} className="rounded-lg cursor-pointer focus:bg-accent">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <ConditionalRoleContent user_role={user.role.role_name} allowed_roles={["ClientEsoft"]}>
                    <DropdownMenuItem onClick={() => navigate("/app/settings-clientEsoft")} className="rounded-lg cursor-pointer focus:bg-accent">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </ConditionalRoleContent>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                    api_client.post('/logout', {}, {
                        headers: {
                            Authorization: "Bearer " + token,
                        }
                    }).then(() => {
                        localStorage.removeItem('t3_user');
                        localStorage.removeItem('t3_token');
                        localStorage.removeItem('t3_modules');
                        setT3Modules(modules);
                        setT3User(user_state);
                        setT3Token(token);
                        navigate("/auth/signing", { replace: true });

                    })

                }} className="rounded-lg cursor-pointer focus:bg-accent text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("log_out")}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}