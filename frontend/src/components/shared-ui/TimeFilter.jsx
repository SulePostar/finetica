import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const TIME_FILTER_OPTIONS = [
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
                    className="font-normal select-none cursor-default"
                >
                    {selectedOption ? selectedOption.label : "Date Range"}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[180px]">
                {TIME_FILTER_OPTIONS.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className="cursor-pointer font-normal select-none"
                    >
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}