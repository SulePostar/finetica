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

export function SidebarNav({ groups }) {
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

    return (
        <>
            {groups.map((group) => (
                <SidebarGroup
                    key={group.label}
                    className="group-data-[collapsible=icon]:border-t border-white/10 group-data-[collapsible=icon]:py-4"
                >
                    <SidebarGroupLabel className="text-xs font-semibold text-white/50 uppercase tracking-wide mt-5 mb-2 px-3 group-data-[collapsible=icon]:hidden">
                        {group.label}
                    </SidebarGroupLabel>

                    <SidebarMenu className="space-y-2">
                        {group.items.map((item) => {
                            const isActive = currentPath === item.url;

                            return group.collapsible ? (
                                <Collapsible key={item.title} asChild>
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                tooltip={item.title}
                                                className="hover:bg-white/10 transition-colors text-white/80 hover:text-white px-3"
                                            >
                                                <item.icon className="size-6" />
                                                <span className="group-data-[collapsible=icon]:hidden">
                                                    {item.title}
                                                </span>
                                                <ChevronRight
                                                    className="ml-auto size-5 transition-transform duration-200 group-data-[state=open]:rotate-90 group-data-[collapsible=icon]:hidden"
                                                />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                            <SidebarMenuSub>
                                                {group.items.map((sub) => (
                                                    <SidebarMenuSubItem key={sub.title}>
                                                        <SidebarMenuSubButton asChild>
                                                            <a href={sub.url} className="text-white/70 hover:text-white">
                                                                {sub.title}
                                                            </a>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ) : (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        className={cn(
                                            "relative overflow-hidden transition-all duration-300 ease-out rounded-l-lg my border border-transparent",
                                            "w-[95%]",
                                            "text-white/80",

                                            isActive && [
                                                "bg-[#6C69FF]/15",
                                                "border-[#6C69FF]",
                                                "text-white font-medium",
                                                "translate-x-1 group-data-[collapsible=icon]:translate-x-0",
                                            ]
                                        )}
                                    >
                                        <a
                                            href={item.url}
                                            className="flex items-center gap-4 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full"
                                        >
                                            <item.icon
                                                className={cn(
                                                    "size-5 transition-transform duration-300",
                                                    isActive
                                                        ? "text-indigo-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] scale-110"
                                                        : ""
                                                )}
                                            />
                                            <span className="group-data-[collapsible=icon]:hidden">
                                                {item.title}
                                            </span>

                                            {isActive && (
                                                <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-indigo-300 to-transparent opacity-50 blur-[2px] group-data-[collapsible=icon]:hidden" />
                                            )}
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}