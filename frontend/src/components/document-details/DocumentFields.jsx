import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { formatDateTime } from '@/helpers/formatDate';

export const DocumentFields = ({ document, excludeFields = ['pdfUrl', 'items', 'id'], type, actions }) => {
    const formatValue = (key, value) => {
        if (value === null || value === undefined || value === '') {
            return '—';
        }
        if (key.toLowerCase().includes('date') || key.toLowerCase().includes('at')) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                return formatDateTime(value);
            }
            return String(value);
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

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-spurple">{pageTitle}</CardTitle>
                <CardDescription>All fields from the document</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y">
                    {Object.entries(document).map(([key, value]) => {
                        if (excludeFields.includes(key)) return null;

                        return (
                            <div key={key} className="px-6 py-4 hover:bg-muted overflow-hidden">
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                    <span className="text-sm font-medium text-muted-foreground capitalize">
                                        {key.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim()}
                                    </span>
                                    <span className="text-sm text-primary sm:text-right break-all">
                                        {formatValue(key, value)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {actions && (
                    <div className="px-6 py-4 border-t">
                        {actions}
                    </div>
                )}
            </CardContent>

        </Card>
    );
};