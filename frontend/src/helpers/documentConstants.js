/**
 * Field configuration for different document types
 */
export const DOCUMENT_FIELD_CONFIGS = {
    kuf: [
        { label: 'Invoice Number', key: 'invoiceNumber' },
        { label: 'Invoice Type', key: 'invoiceType' },
        { label: 'Bill Number', key: 'billNumber' },
        { label: 'Supplier ID', key: 'supplierId' },
        { label: 'Supplier', key: 'BusinessPartner.name' },
        { label: 'Invoice Date', key: 'invoiceDate' },
        { label: 'Due Date', key: 'dueDate' },
        { label: 'Received Date', key: 'receivedDate' },
        { label: 'Net Total', key: 'netTotal' },
        { label: 'VAT Amount', key: 'vatAmount' },
        { label: 'Deductible VAT', key: 'deductibleVat' },
        { label: 'Non-deductible VAT', key: 'nonDeductibleVat' },
        { label: 'Lump Sum', key: 'lumpSum' },
        { label: 'VAT Period', key: 'vatPeriod' },
        { label: 'VAT Exempt Region', key: 'vatExemptRegion' },
        { label: 'Note', key: 'note' },
        { label: 'Filename', key: 'filename' },
        { label: 'Created', key: 'created_at' },
        { label: 'Updated', key: 'updated_at' },
    ],
    kif: [
        { label: 'Invoice Number', key: 'invoiceNumber' },
        { label: 'Invoice Type', key: 'invoiceType' },
        { label: 'Bill Number', key: 'billNumber' },
        { label: 'Customer ID', key: 'customerId' },
        { label: 'Customer', key: 'BusinessPartner.name' },
        { label: 'Invoice Date', key: 'invoiceDate' },
        { label: 'Due Date', key: 'dueDate' },
        { label: 'Delivery Period', key: 'deliveryPeriod' },
        { label: 'Total Amount', key: 'totalAmount' },
        { label: 'VAT Category', key: 'vatCategory' },
        { label: 'VAT Period', key: 'vatPeriod' },
        { label: 'Note', key: 'note' },
        { label: 'Filename', key: 'fileName' },
        { label: 'Created', key: 'created_at' },
        { label: 'Updated', key: 'updated_at' },
    ],
    contract: [
        { label: 'File Name', key: 'filename' },
        { label: 'Partner ID', key: 'partnerId' },
        { label: 'Contract Number', key: 'contractNumber' },
        { label: 'Contract Type', key: 'contractType' },
        { label: 'Description', key: 'description' },
        { label: 'Start Date', key: 'startDate' },
        { label: 'End Date', key: 'endDate' },
        { label: 'Status', key: 'isActive' },
        { label: 'Payment Terms', key: 'paymentTerms' },
        { label: 'Currency', key: 'currency' },
        { label: 'Amount', key: 'amount' },
        { label: 'Signed At', key: 'signedAt' },
        { label: 'Created', key: 'createdAt' },
        { label: 'Updated', key: 'updatedAt' },
    ],
    'bank-transactions': [
        { label: 'Date', key: 'date' },
        { label: 'Amount', key: 'amount' },
        { label: 'Direction', key: 'direction' },
        { label: 'Account Number', key: 'accountNumber' },
        { label: 'Partner ID', key: 'BusinessPartner.id' },
        { label: 'Partner Name', key: 'BusinessPartner.name' },
        { label: 'Category', key: 'TransactionCategory.name' },
        { label: 'Created at', key: 'created_at' },
        { label: 'Updated at', key: 'updated_at' },
        { label: 'Approved at', key: 'approved_at' },
        { label: 'Approved by', key: 'approved_by' }
    ],
    partner: [
        { label: 'Name', key: 'name' },
        { label: 'Short Name', key: 'shortName' },
        { label: 'Country Code', key: 'countryCode' },
        { label: 'VAT Number', key: 'vatNumber' },
        { label: 'Tax ID', key: 'taxId' },
        { label: 'Registration Number', key: 'registrationNumber' },
        { label: 'VAT Registered', key: 'isVatRegistered' },
        { label: 'Address', key: 'address' },
        { label: 'City', key: 'city' },
        { label: 'Postal Code', key: 'postalCode' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' },
        { label: 'IBAN', key: 'iban' },
        { label: 'Bank Name', key: 'bankName' },
        { label: 'SWIFT Code', key: 'swiftCode' },
        { label: 'Default Currency', key: 'defaultCurrency' },
        { label: 'Language Code', key: 'languageCode' },
        { label: 'Payment Terms', key: 'paymentTerms' },
        { label: 'Status', key: 'isActive' },
        { label: 'Note', key: 'note' },
    ]
};

/**
 * Formats values based on their type and context
 */
export const formatValue = (value, key, currency = 'BAM') => {
    if (value === null || value === undefined || value === '') return '-';

    // Format date values
    if (key.includes('Date') || key.includes('At') || key.includes('_at') || key === 'createdAt' || key === 'updatedAt') {
        try {
            const date = new Date(value);
            if (isNaN(date.getTime())) return value;
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch {
            return value;
        }
    }

    // Format currency values
    if (
        key.includes('amount') ||
        key.includes('total') ||
        key.includes('Total') ||
        key.includes('sum') ||
        key.includes('Sum') ||
        key.includes('vat') ||
        key.includes('Vat') ||
        key.includes('VAT')
    ) {
        if (typeof value === 'number') {
            return new Intl.NumberFormat('bs-BA', {
                style: 'currency',
                currency: currency === '$' ? 'BAM' : currency,
                minimumFractionDigits: 2,
            }).format(value);
        }
    }

    // Format boolean values
    if (typeof value === 'boolean') {
        return value ? 'Active' : 'Inactive';
    }

    return value;
};

/**
 * Get nested property values from object
 */
export const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Get card title based on document type
 */
export const getCardTitle = (type) => {
    switch (type) {
        case 'contract': return 'Contract Information';
        case 'kif': return 'KIF Information';
        case 'kuf': return 'KUF Information';
        case 'bank-transactions': return 'Bank Transaction Information';
        case 'partner': return 'Business Partner Information';
        default: return 'Document Information';
    }
};
