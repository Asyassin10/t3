import { useState } from "react";

import { buttonVariants } from "./ui/button";
import { Menu, UserRound } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { LogoIconT3 } from "./Icons";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ModeToggleLanguage } from "./language-menu-toggle";
import { User } from "@/types/AppTypes";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/axios/AbstractionsApi/ApiUser";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#features",
    label: "Features",
  },
  {
    href: "#testimonials",
    label: "Testimonials",
  },
  {
    href: "#pricing",
    label: "Pricing",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const user_data = useQuery<User>({
    queryKey: ['user_data'],
    queryFn: () => getCurrentUser()
  })
  /*   useQuery({
      queryKey: ["application_data_query"],
      queryFn: () => getApplicationDataApi()
    });
   */
  const user = user_data.data;

  const getUrl = (): string => {
    if (user?.role.role_name == "ClientEsoft") {
      return "/app/managers";
    }
    if (user?.role.role_name == "Manager") {
      return "/app/projects";
    }
    if (user?.role.role_name == "Consultant") {
      return "/app/cras";
    }
    return "";
  };
  /*   if (!user) {
      return <ErrorPage />;
    } */

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <div className="flex justify-between w-full">
        {" "}
        {/* Ajout d'un conteneur flexible */}
        <NavigationMenuItem className="flex font-bold">
          <a href="/" className="flex my-2 ml-2 text-xl font-bold">
            <LogoIconT3 />
          </a>
        </NavigationMenuItem>
        <NavigationMenu className="mx-auto">
          <NavigationMenuList className="container flex justify-between w-screen px-4 h-14 ">
            <NavigationMenuItem className="flex font-bold"></NavigationMenuItem>

            {/* mobile */}
            <span className="flex md:hidden">
              <ModeToggle />

              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger className="px-2">
                  <Menu
                    className="flex w-5 h-5 md:hidden"
                    onClick={() => setIsOpen(true)}
                  >
                    <span className="sr-only">Menu Icon</span>
                  </Menu>
                </SheetTrigger>

                <SheetContent side={"left"}>
                  <SheetHeader>
                    <SheetTitle className="text-xl font-bold">
                      Shadcn/React
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col items-center justify-center gap-2 mt-4">
                    {routeList.map(({ href, label }: RouteProps) => (
                      <a
                        key={label}
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        {label}
                      </a>
                    ))}
                    <Link
                      to="https://github.com/leoMirandaa/shadcn-landing-page.git"
                      className={`w-[110px] border ${buttonVariants({
                        variant: "secondary",
                      })}`}
                    >
                      <GitHubLogoIcon className="w-5 h-5 mr-2" />
                      Github
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </span>

            {/* desktop */}
            <nav className="gap-2 navbar">
              {routeList.map((route: RouteProps, i) => (
                <a
                  href={route.href}
                  key={i}
                  className={`text-[17px] ${buttonVariants({
                    variant: "ghost",
                  })}`}
                >
                  {route.label}
                </a>
              ))}
            </nav>

            <div className="gap-2 navbar">
              {/*    <Link
              to={"/auth/signing"}
              className={`border ${buttonVariants({ variant: "secondary" })}`}
            >
              <GitHubLogoIcon className="w-5 h-5 mr-2" />
              {t('auth_signing')}
            </Link> */}

              {user ? (
                <Link
                  to={getUrl()}
                  className={`border ${buttonVariants({
                    variant: "secondary",
                  })}`}
                >
                  <UserRound />
                  {user.name}
                </Link>
              ) : (
                <Link
                  to={"/auth/signing"}
                  className={`border ${buttonVariants({
                    variant: "secondary",
                  })}`}
                >
                  <GitHubLogoIcon className="w-5 h-5 mr-2" />
                  {t("auth_signing")}
                </Link>
              )}

              <ModeToggle />
              <ModeToggleLanguage />
            </div>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};
