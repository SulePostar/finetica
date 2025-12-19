import React from "react";
import { Check } from "lucide-react";
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
                    size="sm"
                    className="font-normal select-none"
                >
                    {selectedOption ? selectedOption.label : "Date Range"}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[180px]">
                {TIME_FILTER_OPTIONS.map((option) => {
                    const isSelected = option.value === value;

                    return (
                        <DropdownMenuItem
                            key={option.value}
                            onClick={() => onChange(option.value)}
                            className={cn(
                                "cursor-pointer font-normal select-none flex items-center",
                                isSelected && "bg-accent text-accent-foreground font-medium"
                            )}
                        >
                            <span className="mr-2 flex h-3.5 w-3.5 items-center justify-center">
                                {isSelected && <Check className="h-4 w-4" />}
                            </span>

                            <span>{option.label}</span>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}