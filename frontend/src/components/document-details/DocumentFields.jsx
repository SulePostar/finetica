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
import { formatCurrency } from '@/helpers/formatCurrency';
import { formatTimePeriod } from '@/helpers/formatTimePeriod';
import { formatDateTime } from '@/helpers/formatDate';

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
    excludeFields = ["pdfUrl", "items", "id", "direction"],
    type,
    actions,
    editable = false,
    onChange,
}) => {
    if (!document) return null;
    const formatValue = (key, value) => {
        if (value === null || value === undefined || value === '') {
            return '—';
        }
        if (key === 'approvedBy' && document.User) {
            return `${document.User.firstName} ${document.User.lastName}`;
        }

        if (key.toLowerCase().includes('period')) {
            return formatTimePeriod(value);
        }

        if (key.toLowerCase().includes('date') || key.toLowerCase().endsWith('at')) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                return formatDateTime(value);
            }
            return String(value);
        }
        const isNumeric = !isNaN(parseFloat(value)) && isFinite(value);

        if (isNumeric) {
            const lowerKey = key.toLowerCase();
            if (lowerKey.includes('number') || lowerKey.includes('id') || lowerKey.includes('code')) {
                return String(value);
            }

            return formatCurrency(value);
        }
        if (Array.isArray(value)) {
            return `${value.length} item(s)`;
        }
        if (typeof value === 'object') {
            if (typeof value.name === 'string') {
                return value.name;
            }

            if (typeof value.label === 'string') {
                return value.label;
            }

            return JSON.stringify(value);
        }
        return String(value);
    };
    const formatTitle = (str) => {
        if (!str) return 'Document';
        const formattedText = str
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return `${formattedText} Information`;
    };

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
                                value={formatValue(key, value)}
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
