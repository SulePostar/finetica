import React, { useState, useEffect } from "react";
import { Check, Calendar as CalendarIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
    TIME_FILTER_OPTIONS as BASE_TIME_FILTER_OPTIONS,
    serializeCustomRange
} from "@/helpers/timeFilter";

const TIME_FILTER_OPTIONS = [
    ...BASE_TIME_FILTER_OPTIONS,            // 'All', 'Last 7 Days', ...
    { label: "Custom range", value: "custom" },
];

/**
 * TimeFilter component
 *
 * value:
 *  - string: 'all', 'last 7 days', 'last 30 days', 'last 60 days'
 *  - object: { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' }
 *
 * onChange:
 *  - dobija ISTO to (string ili { from, to })
 */
export function TimeFilter({ value, onChange }) {
    const isCustomValue = typeof value === "object" && value !== null;

    const initialSelected = isCustomValue ? "custom" : (value || "all");
    const [selectedOption, setSelectedOption] = useState(initialSelected);

    const selectedLabel =
        TIME_FILTER_OPTIONS.find((opt) => opt.value === selectedOption)?.label ||
        "Date Range";

    const [open, setOpen] = useState(false);

    const [pendingRange, setPendingRange] = useState(() => {
        if (!isCustomValue || !value?.from || !value?.to) return undefined;
        return {
            from: new Date(value.from),
            to: new Date(value.to),
        };
    });

    useEffect(() => {
        const nextSelected = isCustomValue ? "custom" : (value || "all");
        setSelectedOption(nextSelected);

        if (isCustomValue && value?.from && value?.to) {
            setPendingRange({
                from: new Date(value.from),
                to: new Date(value.to),
            });
        } else {
            setPendingRange(undefined);
        }
    }, [isCustomValue, value]);

    const handlePresetClick = (optionValue) => {
        setSelectedOption(optionValue);
        onChange(optionValue);
        setPendingRange(undefined);
        setOpen(false);
    };

    const handleCustomClick = () => {
        setSelectedOption("custom");

        // if there is no pending range, set it to today
        if (!pendingRange) {
            const today = new Date();
            setPendingRange({ from: today, to: today });
        }
    };

    const handleApply = () => {
        const serialized = serializeCustomRange(pendingRange);
        if (!serialized) return;

        onChange(serialized);
        setOpen(false);
    };

    const handleClear = () => {
        setPendingRange(undefined);
        setSelectedOption("all");
        onChange("all");
        setOpen(false);
    };

    const isCustomSelected = selectedOption === "custom";

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="default"
                    className={cn(
                        "ml-auto group relative overflow-hidden transition-all duration-200",
                        "bg-[var(--spurple)] text-white hover:bg-[var(--spurple)]/90 hover:text-white",
                        "dark:bg-[var(--spurple)] dark:text-white dark:hover:bg-[var(--spurple)]/90 dark:hover:text-white"
                    )}
                >
                    <div className="flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-2" />
                        <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-0.5 group-hover:mr-0.5 transition-all duration-200 whitespace-nowrap">
                            {selectedLabel}
                        </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-[260px] max-h-[380px] overflow-y-auto p-0"
            >
                {/* Preset + custom */}
                <div className="py-2">
                    {TIME_FILTER_OPTIONS.map((option) => {
                        const isSelected = option.value === selectedOption;

                        return (
                            <DropdownMenuItem
                                key={option.value}
                                onSelect={(event) => {
                                    if (option.value === "custom") {
                                        event.preventDefault();
                                        handleCustomClick();
                                    } else {
                                        handlePresetClick(option.value);
                                    }
                                }}
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
                </div>

                {/* Custom range dio */}
                {isCustomSelected && (
                    <div className="border-t p-3 space-y-3">
                        <Calendar
                            mode="range"
                            numberOfMonths={1}
                            selected={pendingRange}
                            className="p-0"
                            onSelect={(range) => {
                                setPendingRange(range || undefined);
                            }}
                        />

                        <div className="flex justify-between gap-2 pt-1">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleClear}
                            >
                                Clear
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleApply}
                                disabled={!pendingRange?.from || !pendingRange?.to}
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
