import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
    humanLabel,
    formatTitle,
    formatValue,
    toInputString,
    inferFieldKind,
    parseNumberInput,
    tryParseJson,
} from "@/helpers/documentFields";

const FieldEditor = ({ fieldKey, value, onUpdate }) => {
    const kind = inferFieldKind(fieldKey, value);

    if (kind === "json") {
        return (
            <textarea
                className="w-full sm:w-80 rounded-md border px-2 py-1 text-sm bg-background min-h-[80px]"
                value={toInputString(value)}
                onChange={(e) => {
                    const raw = e.target.value;
                    const parsed = tryParseJson(raw);
                    onUpdate(fieldKey, parsed.value);
                }}
            />
        );
    }

    if (kind === "boolean") {
        return (
            <select
                className="w-full sm:w-64 rounded-md border px-2 py-1 text-sm bg-background"
                value={value ? "true" : "false"}
                onChange={(e) => onUpdate(fieldKey, e.target.value === "true")}
            >
                <option value="true">true</option>
                <option value="false">false</option>
            </select>
        );
    }

    return (
        <input
            type={kind === "number" ? "number" : "text"}
            step={kind === "number" ? "0.01" : undefined}
            className="w-full sm:w-64 rounded-md border px-2 py-1 text-sm bg-background"
            value={toInputString(value)}
            onChange={(e) => {
                const raw = e.target.value;
                onUpdate(fieldKey, kind === "number" ? parseNumberInput(raw) : raw);
            }}
        />
    );
};

const FieldRow = ({ fieldKey, value, editable, onUpdate }) => {
    return (
        <div className="px-6 py-4 hover:bg-muted overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                <span className="text-sm font-medium text-muted-foreground capitalize">
                    {humanLabel(fieldKey)}
                </span>

                <span className="text-sm text-primary sm:text-right break-all">
                    {editable ? (
                        <FieldEditor fieldKey={fieldKey} value={value} onUpdate={onUpdate} />
                    ) : (
                        formatValue(fieldKey, value)
                    )}
                </span>
            </div>
        </div>
    );
};

export const DocumentFields = ({
    document,
    excludeFields = ["pdfUrl", "items", "id"],
    type,
    actions,
    editable = false,
    onChange,
}) => {
    if (!document) return null;

    const pageTitle = formatTitle(type);

    const updateField = (key, nextValue) => {
        onChange?.({ ...document, [key]: nextValue });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-spurple">{pageTitle}</CardTitle>
                <CardDescription>
                    {editable ? "Editing enabled" : "All fields from the document"}
                </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
                <div className="divide-y">
                    {Object.entries(document).map(([key, value]) => {
                        if (excludeFields.includes(key)) return null;

                        return (
                            <FieldRow
                                key={key}
                                fieldKey={key}
                                value={value}
                                editable={editable}
                                onUpdate={updateField}
                            />
                        );
                    })}
                </div>

                {actions && <div className="px-6 py-4 border-t">{actions}</div>}
            </CardContent>
        </Card>
    );
};
