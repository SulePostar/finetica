import { useTheme } from "@/components/theme/useTheme";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`
                relative w-13 h-6 rounded-full p-1
                transition-colors duration-300
                ${isDark ? "bg-slate-300" : "bg-[#6C69FF]"}
            `}
        >
            <div
                className={`
                    w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300
                    ${isDark ? "translate-x-7" : "translate-x-0"}
                `}
            />
        </button>
    );
}

export default ThemeToggle;