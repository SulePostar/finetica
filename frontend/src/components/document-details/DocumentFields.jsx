import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { formatDateTime } from "@/helpers/formatDate";

export const DocumentFields = ({
    document,
    excludeFields = ["pdfUrl", "items", "id"],
    type,
    actions,
    editable = false,
    onChange,
}) => {
    if (!document) return null;

    const humanLabel = (key) =>
        key.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim();

    const formatTitle = (str) => {
        if (!str) return "Document";
        const formattedText = str
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        return `${formattedText} Information`;
    };

    const pageTitle = formatTitle(type);

    const formatValue = (key, value) => {
        if (value === null || value === undefined || value === "") return "—";

        if (key.toLowerCase().includes("date") || key.toLowerCase().includes("at")) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) return formatDateTime(value);
        }

        if (Array.isArray(value)) return `${value.length} item(s)`;

        if (typeof value === "object") {
            if (typeof value.name === "string") return value.name;
            if (typeof value.label === "string") return value.label;
            return JSON.stringify(value);
        }

        return String(value);
    };

    // --- EDIT HELPERS ---
    const updateField = (key, nextValue) => {
        onChange?.({ ...document, [key]: nextValue });
    };

    const isComplex = (v) => v != null && typeof v === "object"; // includes arrays

    const toInputString = (value) => {
        if (value === null || value === undefined) return "";
        if (typeof value === "string") return value;
        if (typeof value === "number" || typeof value === "boolean") return String(value);
        if (isComplex(value)) return JSON.stringify(value, null, 2);
        return String(value);
    };

    const renderEditable = (key, value) => {
        // arrays/objects -> textarea JSON
        if (isComplex(value)) {
            return (
                <textarea
                    className="w-full sm:w-80 rounded-md border px-2 py-1 text-sm bg-background min-h-[80px]"
                    value={toInputString(value)}
                    onChange={(e) => {
                        const raw = e.target.value;

                        // try parse JSON; if invalid, store raw string (so user can keep typing)
                        try {
                            const parsed = JSON.parse(raw);
                            updateField(key, parsed);
                        } catch {
                            updateField(key, raw);
                        }
                    }}
                />
            );
        }

        // primitives -> input
        // If key suggests number, use number input (optional heuristic)
        const lower = key.toLowerCase();
        const isNumberLike =
            typeof value === "number" ||
            lower.includes("amount") ||
            lower.endsWith("id");

        // If key suggests boolean, allow "true/false" select (optional)
        if (typeof value === "boolean") {
            return (
                <select
                    className="w-full sm:w-64 rounded-md border px-2 py-1 text-sm bg-background"
                    value={value ? "true" : "false"}
                    onChange={(e) => updateField(key, e.target.value === "true")}
                >
                    <option value="true">true</option>
                    <option value="false">false</option>
                </select>
            );
        }

        return (
            <input
                type={isNumberLike ? "number" : "text"}
                step={isNumberLike ? "0.01" : undefined}
                className="w-full sm:w-64 rounded-md border px-2 py-1 text-sm bg-background"
                value={toInputString(value)}
                onChange={(e) => {
                    const raw = e.target.value;

                    if (isNumberLike) {
                        if (raw === "") return updateField(key, null);
                        const n = Number(raw);
                        return updateField(key, Number.isNaN(n) ? raw : n);
                    }

                    updateField(key, raw);
                }}
            />
        );
    };

    const renderValue = (key, value) => {
        if (!editable) return formatValue(key, value);
        return renderEditable(key, value);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-spurple">{pageTitle}</CardTitle>
                <CardDescription>{editable ? "Editing enabled" : "All fields from the document"}</CardDescription>
            </CardHeader>

            <CardContent className="p-0">
                <div className="divide-y">
                    {Object.entries(document).map(([key, value]) => {
                        if (excludeFields.includes(key)) return null;

                        return (
                            <div key={key} className="px-6 py-4 hover:bg-muted overflow-hidden">
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                                    <span className="text-sm font-medium text-muted-foreground capitalize">
                                        {humanLabel(key)}
                                    </span>

                                    <span className="text-sm text-primary sm:text-right break-all">
                                        {renderValue(key, value)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {actions && <div className="px-6 py-4 border-t">{actions}</div>}
            </CardContent>
        </Card>
    );
};
