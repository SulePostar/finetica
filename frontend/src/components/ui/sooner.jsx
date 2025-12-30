"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
    return (
        <SonnerToaster
            position="top-center"
            theme="system"
            icons={{
                success: <span style={{ color: '#22c55e' }}>✓</span>,
            }}
            toastOptions={{
                unstyled: false,
                duration: 2500,
                style: {
                    background: 'var(--card)',
                    color: 'var(--primary)',
                    minHeight: '60px',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: '1px solid var(--border)',
                },
                className: 'shadow-lg',
            }}
        />
    );
}
