import React, { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"

export function ThemeToggle() {
    const { theme, setTheme, mounted } = useTheme()

    if (!mounted) return null

    const isDark =
        theme === "dark" ||
        (theme === "system" &&
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)

    return (
        <div className="px-2">
            <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={`relative w-16 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 ${isDark ? "bg-[#6C69FF]" : "bg-slate-300"
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

export default ThemeToggle