import { useMemo } from 'react';
import {
    DOCUMENT_FIELD_CONFIGS,
    formatValue
} from '../../../utilis/constants/InvoicesData';
import DocInfoCard from '../DocInfoCard/DocInfoCard';
import { CFormInput, CFormLabel, CBadge } from '@coreui/react';
import './DocumentInfo.css';

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

    // Helper function to get nested property values
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    };

    const formattedFields = useMemo(() => {
        if (!data) return [];
        return fields.map(({ label, key }) => ({
            key,
            label,
            value: getNestedValue(data, key) ?? ''
        }));
    }, [data, fields]);

    const getCardTitle = (type) => {
        switch (type) {
            case 'contract': return 'Contract Information';
            case 'kif': return 'KIF (Sales Invoice) Information';
            case 'kuf': return 'KUF (Purchase Invoice) Information';
            default: return 'Document Information';
        }
    };

    const cardTitle = getCardTitle(type);

    if (loading) {
        return (
            <DocInfoCard
                title={cardTitle}
                message="Loading document information..."
                ariaProps={{ 'aria-busy': 'true', role: 'status' }}
            />
        );
    }

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

    if (!data || formattedFields.length === 0) {
        return (
            <DocInfoCard title={cardTitle}>
                <div className="text-muted p-4">No document information available</div>
                {actions && <div className="mt-4 d-flex gap-3">{actions}</div>}
            </DocInfoCard>
        );
    }

    return (
        <DocInfoCard title={cardTitle}>
            <div
                className="document-info-list d-flex flex-column gap-2 fs-6 rounded shadow-sm border-start border-4 px-3 py-4 mb-3"
                role="list"
                aria-label="Document details"
            >
                {formattedFields.map(({ key, label, value }) => (
                    <div
                        key={key}
                        className="info-row d-flex align-items-center justify-content-between p-2 rounded gap-2"
                        role="listitem"
                        tabIndex="0"
                        aria-label={`${label}: ${value}`}
                    >
                        <CFormLabel className="fw-bold mb-0" id={`label-${key}`}>
                            {label}:
                        </CFormLabel>

                        {editable ? (
                            <CFormInput
                                value={value}
                                onChange={(e) =>
                                    onChange((prev) => ({ ...prev, [key]: e.target.value }))
                                }
                                className="info-input"
                                aria-labelledby={`label-${key}`}
                            />
                        ) : (
                            <CBadge
                                className="info-value"
                                aria-labelledby={`label-${key}`}
                                title={formatValue(value, key, data.currency)}
                            >
                                {formatValue(value, key, data.currency)}
                            </CBadge>
                        )}
                    </div>
                ))}
            </div>

            {actions && <div className="mt-4 d-flex gap-3">{actions}</div>}
        </DocInfoCard>
    );
};

export default DocumentInfo;