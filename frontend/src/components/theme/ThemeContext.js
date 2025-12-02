import { createContext } from "react";

export const ThemeProviderContext = createContext({
    theme: "system",
    setTheme: () => null,
});