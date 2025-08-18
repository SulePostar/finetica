import { useMemo } from 'react';
import { CCard, CCardHeader, CCardBody, CCardTitle } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilFile } from '@coreui/icons';
import {
    DOCUMENT_FIELD_CONFIGS,
    formatValue
} from '../../utilis/constants/InvoicesData';
import '../../components/InfoCards/DocumentInfo.css';

/**
 * DocumentInfo Component
 * 
 * A reusable component for displaying document information for both KUF (Purchase Invoices) 
 * and KIF (Sales Invoices) based on the database schema.
 * 
 * @param {Object} data - The document data object
 * @param {string} type - The document type: 'kuf' for purchase invoices, 'kif' for sales invoices
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

    const CardHeader = () => (
        <CCardHeader>
            <CCardTitle className="mb-0">
                <CIcon icon={cilFile} className="me-2" aria-hidden="true" />
                Document Information
            </CCardTitle>
        </CCardHeader>
    );

    const renderContent = () => {
        if (formattedFields.length === 0) {
            return (
                <div className="text-center p-4">
                    <div className="text-muted mb-3">
                        <CIcon icon={cilFile} size="xl" />
                    </div>
                    <p className="text-muted">No document information available</p>
                </div>
            );
        }

        return (
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
        );
    };

    return (
        <CCard className="h-100 shadow-sm detail-card">
            <CardHeader />
            <CCardBody>
                {renderContent()}
            </CCardBody>
        </CCard>
    );
};

export default DocumentInfo;