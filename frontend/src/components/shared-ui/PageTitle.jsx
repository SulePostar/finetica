import React from "react";

const PageTitle = ({ text, subtitle, compact = false, className = "" }) => {
    const spacing = compact ? "pt-2 pb-3" : "pt-10 pb-6";

    return (
        <div className={`${spacing} ${className}`}>
            <h1 className="text-3xl font-semibold tracking-tight text-heading">
                {text}
            </h1>
            {subtitle && (
                <p className="mt-1 text-muted-foreground">
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default PageTitle;
