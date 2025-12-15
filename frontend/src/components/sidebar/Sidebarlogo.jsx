import symphonyLogo from "@/assets/images/symphonylogo.png";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export const SidebarLogo = () => (
    <SidebarMenu>
        <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Finetica Home">
                <a href="/dashboard" className="flex items-center gap-3 no-underline">
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
