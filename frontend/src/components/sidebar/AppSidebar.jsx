import * as React from "react";
import symphonyLogo from "@/assets/images/symphonylogo.png";

import {
    LayoutDashboard,
    CreditCard,
    AlertTriangle,
    Users,
    HelpCircle,
    LogOut,
    FileSignature,
    Tag,
    Briefcase,
    Shield,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { SidebarNav } from "@/components/sidebar/SidebarNav";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

import { ThemeToggle } from "../theme/ThemeToggle";

const sidebarNavigation = [
    {
        label: "Overview",
        items: [
            { title: "Dashboard", url: "/", icon: LayoutDashboard },
            { title: "Bank Statements", url: "/bank-statements", icon: CreditCard },
            { title: "Contracts", url: "/contracts", icon: FileSignature },
            { title: "KIF", url: "/kif", icon: Tag },
            { title: "KUF", url: "/kuf", icon: Tag },
            { title: "Partners", url: "/partners", icon: Briefcase },
        ],
    },

    {
        label: "Issues",
        items: [{ title: "PDF Issues", url: "/pdf-issues", icon: AlertTriangle }],
    },

    {
        label: "Administration",
        items: [
            { title: "Users", url: "/users", icon: Users },
            { title: "Roles & Permissions", url: "/roles-permissions", icon: Shield },
        ],
    },

    {
        label: "Support",
        items: [
            { title: "Help", url: "/help", icon: HelpCircle },
            { title: "Log Out", url: "/logout", icon: LogOut },
        ],
    },
];

const SidebarCollapsePill = () => {
    const { state, toggleSidebar } = useSidebar()
    const isCollapsed = state === "collapsed"

    return (
        <button
            onClick={toggleSidebar}
            type="button"
            className="
                absolute top-1/2 left-full z-50
                -translate-y-1/2 -translate-x-1/2
                flex items-center justify-center
                h-10 w-10 rounded-full

                bg-gradient-to-br from-[#6B2BFF] to-[#9E4DFF]

                transition-all duration-300
                hover:scale-[1.08]
            "
        >
            {isCollapsed ? (
                <ChevronRight className="h-5 w-5 text-white" />
            ) : (
                <ChevronLeft className="h-5 w-5 text-white" />
            )}
        </button>
    )
}


export function AppSidebar({ ...props }) {
    return (
        <Sidebar
            collapsible="icon"
            variant="sidebar"
            className="
            transition-all duration-300 ease-in-out
            bg-gradient-to-b from-[#5A1AFF]/90 to-[#8C33FF]/90 
            border-r border-white/10 
            backdrop-blur-xl"
            {...props}
        >
            {/* Rail (thin area s desne strane) */}
            <SidebarRail />

            {/* Svi sadržaji + pill u jednom relative wrapperu (u sidebar-inner) */}
            <div className="relative flex flex-1 flex-col">
                {/* Polukružna strelica – centrirana po visini cijelog sidebara */}
                <SidebarCollapsePill />

                {/* Logo */}
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="Finetica Home">
                                <a href="/">
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-white/10">
                                        <img
                                            src={symphonyLogo}
                                            alt="Symphony Logo"
                                            className="object-cover rounded"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-0 leading-none group-data-[collapsible=icon]:hidden">
                                        <span className="font-semibold text-lg text-white">
                                            Finetica
                                        </span>
                                    </div>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                {/* Navigation */}
                <SidebarContent className="pt-4">
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
                                <span className="font-medium text-white">John Doe</span>
                                <span className="text-gray-400">john@example.com</span>
                            </div>
                        </div>

                        {/* Right side - theme toggle */}
                        <ThemeToggle />
                    </div>
                </SidebarFooter>
            </div>
        </Sidebar>
    );
}
