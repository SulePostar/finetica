import { useMemo } from 'react';
import {
    DOCUMENT_FIELD_CONFIGS,
    formatValue
} from '../../utilis/constants/InvoicesData';
import DocInfoCard from './DocInfoCard';
import '../../components/InfoCards/DocumentInfo.css';

/**
 * DocumentInfo Component
 * 
 * A reusable component for displaying document information for KUF (Purchase Invoices), 
 * KIF (Sales Invoices), and Contracts based on the database schema.
 * 
 * @param {Object} data - The document data object
 * @param {string} type - The document type: 'kuf' for purchase invoices, 'kif' for sales invoices, 'contract' for contracts
 */
const DocumentInfo = ({ data, type }) => {
    // Memoize field configuration to prevent unnecessary re-renders
    const fields = useMemo(() => {
        return DOCUMENT_FIELD_CONFIGS[type];
    }, [type]);

    // Memoize filtered and formatted data
    const formattedFields = useMemo(() => {
        return fields
            .map(({ label, key }) => {
                const value = data[key];
                if (value === undefined || value === null || value === '') return null;

                return {
                    key,
                    label,
                    value: formatValue(value, key, data.currency)
                };
            })
            .filter(Boolean);
    }, [data, fields]);

    // Memoize card title to prevent unnecessary re-computation
    const cardTitle = useMemo(() => {
        const titles = {
            contract: 'Contract Information',
            kif: 'KIF (Sales Invoice) Information',
            kuf: 'KUF (Purchase Invoice) Information'
        };
        return titles[type] || 'Document Information';
    }, [type]);

    // Handle empty state
    if (formattedFields.length === 0) {
        return (
            <DocInfoCard
                title={cardTitle}
                message="No document information available"
            />
        );
    }

    // Main content state
    return (
        <DocInfoCard title={cardTitle}>
            <div className="document-info-list" role="list" aria-label="Document details">
                {formattedFields.map(({ key, label, value }) => (
                    <div
                        key={key}
                        className="info-row"
                        role="listitem"
                        tabIndex="0"
                        aria-label={`${label}: ${value}`}
                    >
                        <span className="info-label" id={`label-${key}`}>
                            {label}:
                        </span>
                        <span
                            className="info-value"
                            aria-labelledby={`label-${key}`}
                            title={value}
                        >
                            {value}
                        </span>
                    </div>
                ))}
            </div>
        </DocInfoCard>
    );
};

export default DocumentInfo;