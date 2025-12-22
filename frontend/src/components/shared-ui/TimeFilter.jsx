import React from "react";
import { Check, Calendar } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TIME_FILTER_OPTIONS = [
    { label: "All time", value: "all" },
    { label: "Last 7 days", value: "7" },
    { label: "Last 30 days", value: "30" },
    { label: "Last 60 days", value: "60" },
];

export function TimeFilter({ value, onChange }) {
    const selectedOption = TIME_FILTER_OPTIONS.find(opt => opt.value === value);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="default"
                    className={cn(
                        "ml-auto group relative overflow-hidden transition-all duration-200",
                        "bg-[var(--spurple)] text-white hover:bg-[var(--spurple)]/90 hover:text-white",
                        "dark:bg-[var(--spurple)] dark:text-white dark:hover:bg-[var(--spurple)]/90 dark:hover:text-white"
                    )}       >
                    <div className="flex items-center justify-center">
                        <Calendar className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-2" />
                        <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-0.5 group-hover:mr-0.5 group-hover:gap-0.2 transition-all duration-200 whitespace-nowrap">
                            {selectedOption ? selectedOption.label : "Date Range"}
                        </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[200px] max-h-[300px] overflow-y-auto">
                {TIME_FILTER_OPTIONS.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "cursor-pointer font-normal select-none flex items-center",
                            option.value === value && "bg-accent text-accent-foreground font-medium"
                        )}
                    >
                        <span className="mr-2 flex h-3.5 w-3.5 items-center justify-center">
                            {option.value === value && <Check className="h-4 w-4" />}
                        </span>
                        <span>{option.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}