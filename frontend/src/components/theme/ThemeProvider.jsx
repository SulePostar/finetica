import { useEffect, useState } from "react";
import { ThemeProviderContext } from "./ThemeContext";

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
    ...props
}) {
    const [theme, setTheme] = useState(
        () => localStorage.getItem(storageKey) || defaultTheme
    );

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(theme);
    }, [theme]);

    const value = {
        theme,
        setTheme: (newTheme) => {
            localStorage.setItem(storageKey, newTheme);
            setTheme(newTheme);
        },
    };

    return (
        <ThemeProviderContext.Provider value={value} {...props}>
            {children}
        </ThemeProviderContext.Provider>
    );
}