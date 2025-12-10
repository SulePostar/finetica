import * as React from "react";
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
} from "lucide-react";

import { SidebarNav } from "@/components/sidebar/SidebarNav";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";

import { SidebarCollapsePill } from "./SidebarCollapsePill";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarUserInfo } from "./SidebarUserInfo";
import { CollapsedUserAvatar } from "./CollapsedUserAvatar";

import { Link } from "react-router-dom";

const SIDEBAR_NAVIGATION = [
    {
        label: "Overview",
        items: [
            { title: "Dashboard", url: "/", icon: LayoutDashboard },
            { title: "Bank Transactions", url: "/bank-statements", icon: CreditCard },
            { title: "Contracts", url: "/contracts", icon: FileSignature },
            { title: "KIF", url: "/kif", icon: Tag },
            { title: "KUF", url: "/kuf", icon: Tag },
            { title: "Partners", url: "/partners", icon: Briefcase },
        ],
    },
    {
        label: "Issues",
        items: [{ title: "Invalid PDFs", url: "/invalid-pdfs", icon: AlertTriangle }],
    },
    {
        label: "Administration",
        items: [
            { title: "Users", url: "/users", icon: Users },
            { title: "Roles & Statuses", url: "/roles-statuses", icon: Shield },
        ],
    },
    {
        label: "Support",
        items: [
            { title: "Help", url: "/help", icon: HelpCircle },
            { title: "Log Out", url: "/logout", icon: LogOut },
        ],
    },
    {
        label: "System Settings",
        custom: "appearance",
    }
];

const USER = {
    name: "John Doe",
    email: "john@example.com",
    initials: "JD",
};

export function AppSidebar(props) {
    return (
        <Sidebar
            collapsible="icon"
            variant="sidebar"
            className="transition-all duration-300 ease-in-out bg-[#6C69FF] border-r border-white/10 backdrop-blur-xl"
            {...props}
        >
            <SidebarRail />

            <div className="relative flex flex-1 flex-col min-h-0">
                <SidebarCollapsePill />

                <SidebarHeader>
                    <SidebarLogo />
                </SidebarHeader>

                <SidebarContent
                    className="pt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                >
                    <SidebarNav groups={SIDEBAR_NAVIGATION} />
                </SidebarContent>
                <SidebarFooter>
                    <div className="flex items-center justify-between px-3 py-4 group-data-[collapsible=icon]:hidden pointer-events-auto">
                        <Link to="/profile" className="block w-full cursor-pointer">
                            <SidebarUserInfo user={USER} />
                        </Link>
                    </div>

                    <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center py-4 pointer-events-auto">
                        <Link to="/profile" className="cursor-pointer">
                            <CollapsedUserAvatar initials={USER.initials} />
                        </Link>
                    </div>
                </SidebarFooter>
            </div>
        </Sidebar>
    );
}
