import { useEffect, useState } from "react";

const queries = {
    xs: "(min-width: 400px)",
    sm: "(min-width: 640px)",
    md: "(min-width: 768px)",
    lg: "(min-width: 1024px)",
    xl: "(min-width: 1280px)",
};

export function useTailwindBreakpoint() {
    const getCurrent = () => {
        if (window.matchMedia(queries.xl).matches) return "xl";
        if (window.matchMedia(queries.lg).matches) return "lg";
        if (window.matchMedia(queries.md).matches) return "md";
        if (window.matchMedia(queries.sm).matches) return "sm";
        if (window.matchMedia(queries.xs).matches) return "xs";
        return "default";
    };

    const [breakpoint, setBreakpoint] = useState(getCurrent);

    useEffect(() => {
        const mqs = Object.values(queries).map((q) => window.matchMedia(q));

        const listener = () => setBreakpoint(getCurrent());

        mqs.forEach((mq) => mq.addEventListener("change", listener));

        return () => {
            mqs.forEach((mq) => mq.removeEventListener("change", listener));
        };
    }, []);

    return breakpoint;
}


