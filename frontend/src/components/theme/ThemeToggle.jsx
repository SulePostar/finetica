import React, { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

function useTheme() {
    const [theme, setTheme] = useState("system")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const savedTheme = localStorage.getItem("theme")
        if (savedTheme) {
            setTheme(savedTheme)
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme("dark")
        }
    }, [])

    useEffect(() => {
        if (!mounted) return

        const root = window.document.documentElement
        root.classList.remove("light", "dark")

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
            root.classList.add(systemTheme)
        } else {
            root.classList.add(theme)
        }

        localStorage.setItem("theme", theme)
    }, [theme, mounted])

    return { theme, setTheme, mounted }
}

export function ThemeToggle() {
    const { theme, setTheme, mounted } = useTheme()

    // Avoid hydration mismatch by rendering nothing until mounted
    if (!mounted) return null

    // Determine if effectively dark for the toggle state
    const isDark =
        theme === "dark" ||
        (theme === "system" &&
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)

    return (
        <div className="px-2">
            <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={`relative w-16 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 ${isDark ? "bg-[#6C69FF]" : "bg-amber-400"
                    }`}
                aria-label="Toggle Theme"
            >
                {/* Background Icons (Static opacity) */}
                <div className="absolute inset-0 flex justify-between items-center px-2 text-xs font-bold text-white opacity-50">
                    <span>
                        <Moon size={12} />
                    </span>
                    <span>
                        <Sun size={12} />
                    </span>
                </div>

                {/* Sliding Knob */}
                <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${isDark ? "translate-x-8" : "translate-x-0"
                        }`}
                >
                    {isDark ? (
                        <Moon size={14} className="text-indigo-600" />
                    ) : (
                        <Sun size={14} className="text-amber-500" />
                    )}
                </div>
            </button>
        </div>
    )
}

// Add default export to support both named and default imports
export default ThemeToggle