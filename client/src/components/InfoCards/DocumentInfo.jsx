import { useMemo } from 'react';
import PropTypes from 'prop-types';
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
 * @param {boolean} loading - Loading state
 * @param {Error} error - Error state
 */
const DocumentInfo = ({ data, type = 'kuf', loading = false, error = null }) => {
    // Memoize field configuration to prevent unnecessary re-renders
    const fields = useMemo(() => {
        return DOCUMENT_FIELD_CONFIGS[type] || DOCUMENT_FIELD_CONFIGS.kuf;
    }, [type]);

    // Memoize filtered and formatted data
    const formattedFields = useMemo(() => {
        if (!data) return [];

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

    // Determine card title based on type
    const getCardTitle = (type) => {
        switch (type) {
            case 'contract':
                return 'Contract Information';
            case 'kif':
                return 'KIF (Sales Invoice) Information';
            case 'kuf':
                return 'KUF (Purchase Invoice) Information';
            default:
                return 'Document Information';
        }
    };

    const cardTitle = getCardTitle(type);

    // Handle loading state
    if (loading) {
        return (
            <DocInfoCard
                title={cardTitle}
                message="Loading document information..."
                ariaProps={{ 'aria-busy': 'true', role: 'status' }}
            />
        );
    }

    // Handle error state
    if (error) {
        return (
            <DocInfoCard
                title="Error Loading Document"
                message={error.message || 'Failed to load document information'}
                isError={true}
                ariaProps={{ role: 'alert' }}
            />
        );
    }

    // Handle empty state
    if (!data || formattedFields.length === 0) {
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
