import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { formatDateTime } from '@/helpers/formatDate';

export const DocumentFields = ({ document, excludeFields = ['pdfUrl', 'items', 'id'] }) => {
    const formatValue = (key, value) => {
        // Handle null/undefined
        if (value === null || value === undefined || value === '') {
            return '—';
        }
        if (key.toLowerCase().includes('date') || key.toLowerCase().includes('at')) {
            // Validate if it's actually a valid date
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                return formatDateTime(value);
            }
            // If not a valid date, return the original value
            return String(value);
        }
        // Handle arrays
        if (Array.isArray(value)) {
            return `${value.length} item(s)`;
        }
        // Handle objects
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        // Convert to string
        return String(value);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-spurple">Document Information</CardTitle>
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
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                    <span className="text-sm text-primary sm:text-right break-all">
                                        {formatValue(key, value)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};