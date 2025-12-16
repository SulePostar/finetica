import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import {
    DOCUMENT_FIELD_CONFIGS,
    formatValue,
    getNestedValue,
    getCardTitle
} from '@/helpers/documentConstants';

const DocumentInfo = ({
    data,
    type = 'kuf',
    loading = false,
    error = null,
    actions = null,
    editable = false,
    onChange = () => { }
}) => {
    const fields = useMemo(() => DOCUMENT_FIELD_CONFIGS[type] || DOCUMENT_FIELD_CONFIGS.kuf, [type]);

    const formattedFields = useMemo(() => {
        if (!data) return [];
        const result = fields.map(({ label, key }) => ({
            key,
            label,
            value: getNestedValue(data, key) ?? ''
        }));
        console.log('Formatted fields:', result);
        return result;
    }, [data, fields]);

    const cardTitle = getCardTitle(type);

    if (loading) {
        return (
            <Card className="h-full shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {cardTitle}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4 text-muted-foreground">
                        Loading document information...
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="h-full shadow-sm border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        Error Loading Document
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4 text-destructive">
                        {error.message || 'Failed to load document information'}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data || formattedFields.length === 0) {
        return (
            <Card className="h-full shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {cardTitle}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-muted-foreground py-4">No document information available</div>
                    {actions && <div className="mt-4 flex gap-3">{actions}</div>}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-spurple">
                    {cardTitle}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 mb-4">
                    {formattedFields.length === 0 && <p>No fields to display</p>}
                    {formattedFields.map(({ key, label, value }) => {
                        console.log(`Rendering field ${key}:`, value);
                        return (
                            <div
                                key={key}
                                className="flex flex-col gap-1 p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                            >
                                <Label
                                    htmlFor={`field-${key}`}
                                    className="font-semibold text-sm text-muted-foreground"
                                >
                                    {label}
                                </Label>

                                {editable ? (
                                    <Input
                                        id={`field-${key}`}
                                        value={value}
                                        onChange={(e) =>
                                            onChange((prev) => ({ ...prev, [key]: e.target.value }))
                                        }
                                        className="w-full"
                                    />
                                ) : (
                                    <div className="text-sm font-medium">
                                        {formatValue(value, key, data.currency)}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {actions && <div className="mt-4 flex flex-wrap gap-3">{actions}</div>}
            </CardContent>
        </Card>
    );
};

export default DocumentInfo;
