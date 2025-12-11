import { useTheme } from "@/components/theme/useTheme";
import { Moon, Sun } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function AppearanceCard() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className="flex items-center justify-between rounded-xl">
            <div className="flex items-center gap-2 text-slate-600 dark:text-white/80">
                {isDark ? <Moon size={16} /> : <Sun size={16} />}
                <span className="text-sm font-medium text-slate-600 dark:text-white/80">
                    {isDark ? "Dark Mode" : "Light Mode"}
                </span>
            </div>
            <ThemeToggle />
        </div>
    );
}