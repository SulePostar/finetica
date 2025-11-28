import React from "react";
import { ChevronRight } from "lucide-react";
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

export function SidebarNav({ groups }) {
    const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";

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
                                                            "transition-all px-3 rounded-md",
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
                                            tooltip={item.title}
                                            className={cn(
                                                "relative overflow-hidden transition-all duration-300 ease-out rounded border border-transparent",
                                                "w-[95%]",
                                                "flex items-center gap-4 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full",
                                                "text-slate-600 dark:text-white/80",
                                                "hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-[#6C69FF]/20 dark:hover:text-white transition-all",
                                                "hover:scale-[1.02]",

                                                isActive && [
                                                    "bg-indigo-50 text-indigo-600 border-indigo-200",
                                                    "dark:bg-[#6C69FF]/15 dark:border-[#6C69FF] dark:text-white",
                                                    "font-medium",
                                                    "translate-x-1 group-data-[collapsible=icon]:translate-x-0",
                                                ]
                                            )}
                                        >

                                            <a href={item.url} className="flex items-center gap-4 w-full">
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
                                            </a>
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