import React from "react";
import { cn } from "@/lib/utils";

const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl"
};

const variantClasses = {
    default: "pb-4 border-b border-border",
    minimal: "pb-2",
    card: "pb-3 border-b border-border bg-card p-4 rounded-lg"
};

const PageTitle = ({
    text,
    subtitle,
    size = "lg",
    variant = "default",
    className
}) => {
    return (
        <div className={cn(variantClasses[variant], className)}>
            <h1 className={cn(
                sizeClasses[size],
                "font-semibold tracking-tight text-heading"
            )}>
                {text}
            </h1>
            {subtitle && (
                <p className="text-muted-foreground mt-1">
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default PageTitle;
