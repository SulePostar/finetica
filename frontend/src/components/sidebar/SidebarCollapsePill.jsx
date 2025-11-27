import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export const SidebarCollapsePill = () => {
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