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

export function SidebarNav({ groups }) {
    return (
        <>
            {groups.map((group) => (
                <SidebarGroup
                    key={group.label}
                    className="group-data-[collapsible=icon]:border-t border/10 group-data-[collapsible=icon]:backdrop-blur-sm group-data-[collapsible=icon]:py-4"
                >
                    <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-5 mb-2 px-3 group-data-[collapsible=icon]:hidden">
                        {group.label}
                    </SidebarGroupLabel>

                    <SidebarMenu className="space-y-1.5">
                        {group.items.map((item) =>
                            group.collapsible ? (
                                <Collapsible key={item.title} asChild>
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item.title}>
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
                                                            <a href={sub.url}>{sub.title}</a>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ) : (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <a href={item.url}>
                                            <item.icon className="size-5" />
                                            <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        )}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}