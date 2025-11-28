import React from "react";
import { Moon, Sun } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";

export default function AppearanceCard() {
    const { theme, mounted } = useTheme();
    if (!mounted) return null;

    const isDark = theme === "dark";

    return (
        <div
            className="
                flex items-center justify-between
                p-4 rounded-xl
                bg-white dark:bg-white/10
                border border-slate-200 dark:border-white/20
            "
        >
            <div className="flex items-center gap-2">
                <div className="text-slate-600 dark:text-white">
                    {isDark ? <Moon size={16} /> : <Sun size={16} />}
                </div>

                <span className="text-sm font-medium text-slate-700 dark:text-white">
                    {isDark ? "Dark Mode" : "Light Mode"}
                </span>
            </div>

            <ThemeToggle />
        </div>
    );
}
