import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme/useTheme";

export default function CollapsedThemeIcon() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
            {isDark ? (
                <Moon className="size-5 text-white" />
            ) : (
                <Sun className="size-5 text-slate-600" />
            )}
        </button>
    );
}