import { useEffect, useState } from "react";

export function useTheme() {
    const [theme, setTheme] = useState("light");
    const [mounted, setMounted] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "light" || saved === "dark") {
            setTheme(saved);
        }
        setMounted(true);
    }, []);

    // Apply theme class to HTML
    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);

        localStorage.setItem("theme", theme);
    }, [theme, mounted]);

    return { theme, setTheme, mounted };
}