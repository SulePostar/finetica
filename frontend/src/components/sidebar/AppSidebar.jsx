import * as React from "react";
import {useAuth} from '@/context/AuthContext.jsx';
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
            { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
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


export function AppSidebar(props) {

    const { user, loading } = useAuth();

    if (loading) {
        return <Sidebar {...props} className="bg-spurple" />;
    }

  const isAdmin = user?.roleName === 'admin';

  const filteredNavigation = React.useMemo(() => {
    return SIDEBAR_NAVIGATION.filter(group => {
      if (group.label === "Administration" && !isAdmin) {
        return false;
      }
      return true;
    });
  }, [isAdmin]);

  if (!user) {
    return null;
  }

    const profilePath = `/profile/${user.id}`;

    const currentUser = {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        initials: user.initials || `${user.firstName?.[0]}${user.lastName?.[0]}`.toUpperCase(),
        profileImage: user.profileImage
    };

    return (
        <Sidebar
            collapsible="icon"
            variant="sidebar"
            className="
                fixed top-0 left-0 z-50 w-[var(--sidebar-width)]
                transition-all duration-300 ease-in-out 
                bg-spurple
                border-r border-white/10 
                backdrop-blur-xl
                flex flex-col"
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
                    <SidebarNav groups={filteredNavigation} />
                </SidebarContent>
                <SidebarFooter>
                    <div className="flex items-center justify-between px-3 py-4 group-data-[collapsible=icon]:hidden pointer-events-auto">
                        <Link to={profilePath} className="block w-full cursor-pointer">
                            <SidebarUserInfo user={currentUser} />
                        </Link>
                    </div>

                    <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center py-4 pointer-events-auto">
                        <Link to={profilePath} className="cursor-pointer">
                            <CollapsedUserAvatar initials={currentUser.initials} />
                        </Link>
                    </div>
                </SidebarFooter>
            </div>
        </Sidebar>
    );
}
