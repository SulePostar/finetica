import * as React from "react"
import symphonyLogo from "@/assets/images/symphonylogo.png"

import {
    LayoutDashboard,
    FileText,
    AlertTriangle,
    Users,
    HelpCircle,
    LogOut,
    FileSignature,
    Tag,
    Briefcase,
    Shield,
} from "lucide-react"

import { SidebarNav } from "@/components/sidebar/SidebarNav"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import { ThemeToggle } from "../theme/ThemeToggle"

const sidebarNavigation = [
    {
        label: "Overview",
        items: [
            { title: "Dashboard", url: "/", icon: LayoutDashboard },
            { title: "Bank Statements", url: "/bank-statements", icon: FileText },
            { title: "Contracts", url: "/contracts", icon: FileSignature },
            { title: "KIF", url: "/kif", icon: Tag },
            { title: "KUF", url: "/kuf", icon: Tag },
            { title: "Partners", url: "/partners", icon: Briefcase },
        ]
    },

    {
        label: "Issues",
        items: [
            { title: "PDF Issues", url: "/pdf-issues", icon: AlertTriangle }
        ]
    },

    {
        label: "Administration",
        items: [
            { title: "Users", url: "/users", icon: Users },
            { title: "Roles & Permissions", url: "/roles-permissions", icon: Shield }
        ]
    },

    {
        label: "Support",
        items: [
            { title: "Help", url: "/help", icon: HelpCircle },
            { title: "Log Out", url: "/logout", icon: LogOut }
        ]
    }
]

export function AppSidebar({ ...props }) {
    return (
        <Sidebar collapsible="icon" variant="sidebar" className="transition-all duration-300 ease-in-out" {...props}>

            {/* Logo */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Finetica Home">
                            <a href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <img src={symphonyLogo} alt="Symphony Logo" className="object-cover rounded" />
                                </div>

                                <div className="flex flex-col gap-0 leading-none group-data-[collapsible=icon]:hidden">
                                    <span className="font-semibold text-lg">Finetica</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent>
                <SidebarNav groups={sidebarNavigation} />
            </SidebarContent>

            {/* Footer User */}
            <SidebarFooter>
                <div className="flex items-center justify-between px-3 py-4 group-data-[collapsible=icon]:hidden">

                    {/* Left side - user info */}
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-600 text-white flex size-10 rounded-full items-center justify-center font-semibold">
                            JD
                        </div>

                        <div className="flex flex-col leading-tight text-sm">
                            <span className="font-medium">John Doe</span>
                            <span className="text-gray-500">john@example.com</span>
                        </div>
                    </div>

                    {/* Right side - theme toggle */}
                    <ThemeToggle />
                </div>
            </SidebarFooter>


            <SidebarRail />
        </Sidebar>
    );
}