import React, { useState } from 'react';
import PageTitle from './PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Custom reusable component to render TanStack Query and other errors in a consistent format.
 * 
 * @error: error object from the query, display error
 * @onRetry: OPTIONAL callback button (e.g., refetch, retry, action)
 * @title: OPTIONAL title string display
 * @showDetails: OPTIONAL boolean button to toggle error details
 */

const IsError = ({ error, onRetry, title = 'Something went wrong', showDetails = false }) => {
    const [open, setOpen] = useState(false);

    if (!error) return null;

    const status = error?.response?.status || error?.status || null;

    const message =
        error?.response?.data?.message ??
        error?.response?.data ??
        error?.message ??
        String(error);

    const details =
        error?.response?.data ??
        (typeof error === "object" ? error : String(error));

    return (
        <Card className="my-4 border-destructive/30">
            <CardHeader className="flex items-start justify-between gap-4 p-4">
                <div>
                    <PageTitle text={title} />
                    <div className="mt-2 text-sm text-destructive-foreground">
                        {status ? <Badge variant="destructive" className="mr-2">{status}</Badge> : null}
                        <span className="text-sm text-muted-foreground">{typeof message === 'string' ? message : JSON.stringify(message)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {onRetry ? (
                        <Button size="sm" variant="default" onClick={onRetry}>
                            Retry
                        </Button>
                    ) : null}

                    {showDetails ? (
                        <Button size="sm" variant="outline" onClick={() => setOpen(v => !v)}>
                            {open ? 'Hide details' : 'Show details'}
                        </Button>
                    ) : null}
                </div>
            </CardHeader>

            {showDetails && open ? (
                <CardContent>
                    <pre className="text-sm overflow-auto max-h-80 bg-muted/5 p-3 rounded">{typeof details === 'string' ? details : JSON.stringify(details, null, 2)}</pre>
                </CardContent>
            ) : null}
        </Card>
    );
};

export default IsError;
