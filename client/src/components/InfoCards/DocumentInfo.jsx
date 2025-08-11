import { CCard, CCardHeader, CCardBody, CCardTitle } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilFile } from '@coreui/icons';

/**
 * DocumentInfo Component
 * 
 * A reusable component for displaying document information for both KUF (Purchase Invoices) 
 * and KIF (Sales Invoices) based on the database schema.
 * 
 * @param {Object} data - The document data object
 * @param {string} type - The document type: 'kuf' for purchase invoices, 'kif' for sales invoices
 */
const DocumentInfo = ({ data, type = 'kuf' }) => {
    // Define fields based on document type (from database schema)
    const getFields = () => {
        if (type === 'kuf') {
            // Purchase Invoice fields (purchase_invoices table)
            return [
                { label: 'Document Number', key: 'documentNumber' },
                { label: 'Invoice Number', key: 'invoice_number' },
                { label: 'Bill Number', key: 'bill_number' },
                { label: 'Supplier', key: 'supplier_name' },
                { label: 'Supplier ID', key: 'supplier_id' },
                { label: 'VAT Period', key: 'vat_period' },
                { label: 'Invoice Type', key: 'invoice_type' },
                { label: 'Invoice Date', key: 'invoice_date' },
                { label: 'Due Date', key: 'due_date' },
                { label: 'Received Date', key: 'received_date' },
                { label: 'Net Total', key: 'net_total' },
                { label: 'Lump Sum', key: 'lump_sum' },
                { label: 'VAT Amount', key: 'vat_amount' },
                { label: 'Deductible VAT', key: 'deductible_vat' },
                { label: 'Non-deductible VAT', key: 'non_deductible_vat' },
                { label: 'VAT Exempt Region', key: 'vat_exempt_region' },
                { label: 'Note', key: 'note' },
                { label: 'Created', key: 'created_at' },
                { label: 'Updated', key: 'updated_at' }
            ];
        } else {
            // Sales Invoice fields (sales_invoices table)
            return [
                { label: 'Document Number', key: 'documentNumber' },
                { label: 'Invoice Number', key: 'invoice_number' },
                { label: 'Bill Number', key: 'bill_number' },
                { label: 'Customer', key: 'customer_name' },
                { label: 'Customer ID', key: 'customer_id' },
                { label: 'VAT Period', key: 'vat_period' },
                { label: 'Invoice Type', key: 'invoice_type' },
                { label: 'Invoice Date', key: 'invoice_date' },
                { label: 'Due Date', key: 'due_date' },
                { label: 'Delivery Period', key: 'delivery_period' },
                { label: 'Total Amount', key: 'total_amount' },
                { label: 'VAT Category', key: 'vat_category' },
                { label: 'Note', key: 'note' },
                { label: 'Created', key: 'created_at' },
                { label: 'Updated', key: 'updated_at' }
            ];
        }
    };

    const formatValue = (value, key) => {
        if (!value && value !== 0) return 'N/A';

        // Format dates
        if (key.includes('date') || key.includes('_at')) {
            try {
                return new Date(value).toLocaleString();
            } catch {
                return value;
            }
        }

        // Format currency values
        if (key.includes('amount') || key.includes('total') || key.includes('vat') || key.includes('sum')) {
            if (typeof value === 'number') {
                return `${value.toLocaleString()} ${data.currency || '$'}`;
            }
        }

        // Format boolean values
        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        }

        return value;
    };

    const fields = getFields();

    return (
        <CCard className="h-100 shadow-sm detail-card">
            <CCardHeader>
                <CCardTitle className="mb-0">
                    <CIcon icon={cilFile} className="me-2" />
                    Document Information
                </CCardTitle>
            </CCardHeader>
            <CCardBody>
                <div className="document-info-list">
                    {fields.map(({ label, key }) => {
                        const value = data[key];
                        if (value === undefined || value === null || value === '') return null;

                        return (
                            <div key={key} className="info-row">
                                <span className="info-label">{label}:</span>
                                <span className="info-value">{formatValue(value, key)}</span>
                            </div>
                        );
                    })}
                </div>
            </CCardBody>
        </CCard>
    );
};

export default DocumentInfo;
