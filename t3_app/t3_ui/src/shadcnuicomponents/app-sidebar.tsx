

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  LucideIcon,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/shadcnuicomponents/nav-main"
import { NavProjects } from "@/shadcnuicomponents/nav-projects"
import { NavUser } from "@/shadcnuicomponents/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/shadcnuicomponents/ui/sidebar"
import { useAtom } from "jotai"
import { json_t3_modules_atom, json_t3_user } from "@/state/atom"
import { ApplicationName } from "@/types/Contant"



export interface INavData {
  title: string;
  icon: LucideIcon;
  isAccessible: boolean;
  isActiveCollapsed: boolean;
  supportedRoles: string[];
  items: {
    title: string;
    url: string;
  }[]
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [user] = useAtom(json_t3_user);

  const data = {
    user: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: ApplicationName,
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "projects",
        url: "projects",
        icon: SquareTerminal,
        isActive: true,
        supportedRoles: ["ClientEsoft", "Manager", "Consultant"],
        items: [
          {
            title: "list",
            url: "projects",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
      // ----------------------------------------------------------------
      {
        title: "Playground",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "History",
            url: "#",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
      {
        title: "Models",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  }
  const [modules] = useAtom(json_t3_modules_atom);

  const topNavData: INavData[] = [
    {
      title: "projects",
      icon: SquareTerminal,
      isActiveCollapsed: true,
      supportedRoles: ["ClientEsoft", "Manager", "Consultant"],
      isAccessible: true,
      items: [
        {
          title: "list",
          url: "projects",
        }
      ],
    },
    {
      title: "managers",
      icon: SquareTerminal,
      isActiveCollapsed: false,
      supportedRoles: ["ClientEsoft"],
      items: [
        {
          title: "list",
          url: "managers",
        }
      ],
      isAccessible: true
    },
    {
      title: "factures",
      icon: SquareTerminal,
      isActiveCollapsed: false,
      supportedRoles: ["ClientEsoft", "Manager", "Admin"],
      items: [
        {
          title: "list",
          url: "factures",
        }
      ],
      isAccessible: modules?.find(mod => mod.assigned_module_name == "GFACT") ? true : false
    },
    {
      title: "clients",
      icon: SquareTerminal,
      isActiveCollapsed: false,
      supportedRoles: ["ClientEsoft"],
      items: [
        {
          title: "list",
          url: "client_b2b",
        }
      ],
      isAccessible: true
    },
    {
      title: "consultant",
      icon: SquareTerminal,
      isActiveCollapsed: false,
      supportedRoles: ["ClientEsoft"],
      items: [
        {
          title: "list",
          url: "concultants",
        }
      ],
      isAccessible: true
    },
    {
      title: "mes temps",
      icon: SquareTerminal,
      isActiveCollapsed: false,
      supportedRoles: ["Consultant", "Manager", "ClientEsoft"],
      isAccessible: modules?.find(mod => mod.assigned_module_name == "CRA") ? true : false,
      items: [
        {
          title: "list",
          url: "cras",
        }
      ],
    },
    {
      title: "absences",
      icon: SquareTerminal,
      isActiveCollapsed: false,
      supportedRoles: ["ClientEsoft", "Manager", "Consultant"],
      isAccessible: modules?.find(mod => mod.assigned_module_name == "ABS") ? true : false,
      items: [
        {
          title: "list",
          url: "absences",
        }
      ],
    },

  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/*   <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={topNavData} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
