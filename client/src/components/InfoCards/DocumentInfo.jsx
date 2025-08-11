import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { CCard, CCardHeader, CCardBody, CCardTitle } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilFile } from '@coreui/icons';
import {
    DOCUMENT_FIELD_CONFIGS,
    DocumentDataPropTypes,
    formatValue
} from './DocumentInfo.constants';

/**
 * DocumentInfo Component
 * 
 * A reusable component for displaying document information for both KUF (Purchase Invoices) 
 * and KIF (Sales Invoices) based on the database schema.
 * 
 * @param {Object} data - The document data object
 * @param {string} type - The document type: 'kuf' for purchase invoices, 'kif' for sales invoices
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

    if (loading) {
        return (
            <CCard className="h-100 shadow-sm detail-card" aria-busy="true">
                <CCardHeader>
                    <CCardTitle className="mb-0">
                        <CIcon icon={cilFile} className="me-2" aria-hidden="true" />
                        Document Information
                    </CCardTitle>
                </CCardHeader>
                <CCardBody>
                    <div className="text-center p-4" role="status" aria-label="Loading document information">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted">Loading document information...</p>
                    </div>
                </CCardBody>
            </CCard>
        );
    }

    if (error) {
        return (
            <CCard className="h-100 shadow-sm detail-card border-danger">
                <CCardHeader>
                    <CCardTitle className="mb-0 text-danger">
                        <CIcon icon={cilFile} className="me-2" aria-hidden="true" />
                        Document Information
                    </CCardTitle>
                </CCardHeader>
                <CCardBody>
                    <div className="text-center p-4" role="alert">
                        <div className="text-danger mb-3">
                            <CIcon icon={cilFile} size="xl" />
                        </div>
                        <h6 className="text-danger">Error Loading Document</h6>
                        <p className="text-muted small">{error.message || 'Failed to load document information'}</p>
                    </div>
                </CCardBody>
            </CCard>
        );
    }

    if (!data || formattedFields.length === 0) {
        return (
            <CCard className="h-100 shadow-sm detail-card">
                <CCardHeader>
                    <CCardTitle className="mb-0">
                        <CIcon icon={cilFile} className="me-2" aria-hidden="true" />
                        Document Information
                    </CCardTitle>
                </CCardHeader>
                <CCardBody>
                    <div className="text-center p-4">
                        <div className="text-muted mb-3">
                            <CIcon icon={cilFile} size="xl" />
                        </div>
                        <p className="text-muted">No document information available</p>
                    </div>
                </CCardBody>
            </CCard>
        );
    }

    return (
        <CCard className="h-100 shadow-sm detail-card">
            <CCardHeader>
                <CCardTitle className="mb-0">
                    <CIcon icon={cilFile} className="me-2" aria-hidden="true" />
                    Document Information
                </CCardTitle>
            </CCardHeader>
            <CCardBody>
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
            </CCardBody>
        </CCard>
    );
};

DocumentInfo.propTypes = {
    data: DocumentDataPropTypes,
    type: PropTypes.oneOf(['kuf', 'kif']),
    loading: PropTypes.bool,
    error: PropTypes.instanceOf(Error)
};

DocumentInfo.defaultProps = {
    data: null,
    type: 'kuf',
    loading: false,
    error: null
};

export default DocumentInfo;
