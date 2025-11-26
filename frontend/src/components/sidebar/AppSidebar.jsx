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

const SIDEBAR_NAVIGATION = [
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

const USER = {
    name: "John Doe",
    email: "john@example.com",
    initials: "JD",
};

// Extracted collapse pill component
const SidebarCollapsePill = () => {
    const { state, toggleSidebar } = useSidebar();
    const isCollapsed = state === "collapsed";
    const Icon = isCollapsed ? ChevronRight : ChevronLeft;

    return (
        <button
            onClick={toggleSidebar}
            type="button"
            className="
        absolute top-1/2 left-full z-50
        -translate-y-1/2 -translate-x-1/2
        flex items-center justify-center
        h-10 w-10 rounded-full
        bg-[#6C69FF]
        transition-all duration-300
        hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-white/50
      "
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
            <Icon className="h-5 w-5 text-white" />
        </button>
    );
};

// Extracted logo component
const SidebarLogo = () => (
    <SidebarMenu>
        <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Finetica Home">
                <a href="/" className="flex items-center gap-3 no-underline">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-background/20 dark:bg-foreground/10">
                        <img
                            src={symphonyLogo}
                            alt="Symphony Logo"
                            className="object-cover rounded"
                        />
                    </div>
                    <div className="flex flex-col gap-0 leading-none group-data-[collapsible=icon]:hidden">
                        <span className="font-semibold text-lg text-foreground dark:text-white">
                            Finetica
                        </span>
                    </div>
                </a>
            </SidebarMenuButton>
        </SidebarMenuItem>
    </SidebarMenu>
);

// Extracted user info component
const UserInfo = () => (
    <div className="flex items-center gap-3">
        <div className="bg-[#6C69FF] text-white flex size-10 rounded-full items-center justify-center font-semibold">
            {USER.initials}
        </div>
        <div className="flex flex-col leading-tight text-sm">
            <span className="font-medium text-foreground">{USER.name}</span>
            <span className="text-muted-foreground">{USER.email}</span>
        </div>
    </div>
);

// Collapsed user avatar component
const CollapsedUserAvatar = () => (
    <div className="bg-[#6C69FF] text-white flex size-10 rounded-full items-center justify-center font-semibold">
        {USER.initials}
    </div>
);

export function AppSidebar(props) {
    return (
        <Sidebar
            collapsible="icon"
            variant="sidebar"
            className="
        transition-all duration-300 ease-in-out
        bg-[#6C69FF]
        border-r border-white/10 
        backdrop-blur-xl
      "
            {...props}
        >
            <SidebarRail />

            <div className="relative flex flex-1 flex-col">
                <SidebarCollapsePill />

                <SidebarHeader>
                    <SidebarLogo />
                </SidebarHeader>

                <SidebarContent className="pt-4">
                    <SidebarNav groups={SIDEBAR_NAVIGATION} />
                </SidebarContent>

                <SidebarFooter>
                    {/* Expanded state */}
                    <div className="flex items-center justify-between px-3 py-4 group-data-[collapsible=icon]:hidden">
                        <UserInfo />
                        <ThemeToggle />
                    </div>

                    {/* Collapsed state */}
                    <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center py-4">
                        <CollapsedUserAvatar />
                    </div>
                </SidebarFooter>
            </div>
        </Sidebar>
    );
}