import * as React from "react"
import {
    LayoutDashboard,
    File,
    Settings2,
} from "lucide-react"
import symphonyLogo from "@/assets/images/symphonylogo.png"

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

// This is sample data.
const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "#",
            icon: LayoutDashboard,
            isActive: true,
        },
        {
            title: "Invoices",
            url: "#",
            icon: File,
            items: [
                {
                    title: "KIF",
                    url: "#",
                },
                {
                    title: "KUF",
                    url: "#",
                },
            ],
        },
        {
            title: "Bank Statements",
            url: "#",
            icon: LayoutDashboard,
        },
        {
            title: "Management",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "Users",
                    url: "#",
                },
                {
                    title: "Roles & Permissions",
                    url: "#",
                }
            ],
        },
    ],
}

export function AppSidebar({ ...props }) {
    return (
        <Sidebar collapsible="icon" variant="sidebar" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <img src={symphonyLogo} alt="Symphony Logo" className="object-cover rounded" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-medium">Symphony</span>
                                    <span className="">Finetica</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarNav items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
