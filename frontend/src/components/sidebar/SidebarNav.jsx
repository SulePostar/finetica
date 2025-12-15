import React from "react";
import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import AppearanceCard from "@/components/sidebar/AppearanceCard";
import CollapsedThemeIcon from "../theme/CollapsedThemeIcon";

export function SidebarNav({ groups }) {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <>
            {groups.map((group) => {
                if (group.custom === "appearance") {
                    return (
                        <SidebarGroup
                            key={group.label}
                            className="group-data-[collapsible=icon]:border-t border-slate-200 dark:border-white/10 group-data-[collapsible=icon]:py-4"
                        >
                            <SidebarGroupLabel className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wide mt-5 mb-2 px-3 group-data-[collapsible=icon]:hidden">
                                {group.label}
                            </SidebarGroupLabel>

                            <div className="px-3 py-2 group-data-[collapsible=icon]:hidden">
                                <AppearanceCard />
                            </div>

                            <div className="hidden group-data-[collapsible=icon]:flex justify-center">
                                <CollapsedThemeIcon />
                            </div>
                        </SidebarGroup>
                    );
                }

                return (
                    <SidebarGroup
                        key={group.label}
                        className="group-data-[collapsible=icon]:border-t border-slate-200 dark:border-white/10 group-data-[collapsible=icon]:py-4"
                    >
                        <SidebarGroupLabel className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wide mt-5 mb-2 px-3 group-data-[collapsible=icon]:hidden">
                            {group.label}
                        </SidebarGroupLabel>

                        <SidebarMenu className="space-y-2">
                            {group.items?.map((item) => {
                                const isActive = currentPath === item.url;

                                if (group.collapsible) {
                                    return (
                                        <Collapsible key={item.title} asChild>
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        tooltip={item.title}
                                                        className={cn(
                                                            "transition-all px-3 rounded-xl",
                                                            "text-slate-600 dark:text-white/80",
                                                            "hover:bg-indigo-50 hover:text-indigo-700",
                                                            "dark:hover:bg-[#6C69FF]/20 dark:hover:text-white",

                                                            isActive && [
                                                                "text-indigo-600 dark:text-indigo-200",
                                                            ]
                                                        )}
                                                    >
                                                        <item.icon className="size-6" />

                                                        <span className="group-data-[collapsible=icon]:hidden">
                                                            {item.title}
                                                        </span>

                                                        <ChevronRight className="ml-auto size-5 transition-transform duration-200 group-data-[state=open]:rotate-90 group-data-[collapsible=icon]:hidden" />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>

                                                <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out">
                                                    <SidebarMenuSub>
                                                        {group.items.map((sub) => (
                                                            <SidebarMenuSubItem key={sub.title}>
                                                                <SidebarMenuSubButton asChild>
                                                                    <a
                                                                        href={sub.url}
                                                                        className="text-slate-500 hover:text-slate-900 dark:text-white/70 dark:hover:text-white"
                                                                    >
                                                                        {sub.title}
                                                                    </a>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        ))}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    );
                                }

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={cn(
                                                "relative overflow-hidden transition-all duration-300 ease-out rounded-md border border-transparent",
                                                "w-full md:w-[220px]",
                                                "flex items-center gap-2 py-1.5 px-2",
                                                "text-slate-600 dark:text-white/80",
                                                "hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-[#6C69FF]/20 dark:hover:text-white",

                                                isActive && [
                                                    "bg-[#6C69FF]/15",
                                                    "border-l-4 border-[#6C69FF]",
                                                    "text-[#6C69FF]",
                                                    "font-semibold",
                                                ]
                                            )}
                                        >
                                            <Link to={item.url} className="flex items-center gap-4 w-full">
                                                <item.icon
                                                    className={cn(
                                                        "size-5 transition-transform duration-300",
                                                        isActive &&
                                                        "scale-110 dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                                    )}
                                                />
                                                <span className="group-data-[collapsible=icon]:hidden">
                                                    {item.title}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                );
            })}
        </>
    );
}
