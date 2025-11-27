import React from "react";

const PageTitle = ({ text, subtitle }) => {
    return (
        <div className="pb-4 border-b border-border">
            <h1 className="text-3xl font-semibold tracking-tight text-heading">
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
