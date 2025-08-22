/**
 * Field configuration for different document types
 */
export const DOCUMENT_FIELD_CONFIGS = {
  kuf: [
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
    { label: 'Updated', key: 'updated_at' },
  ],
  kif: [
    { label: 'Document Number', key: 'documentNumber' },
    { label: 'Invoice Number', key: 'invoiceNumber' },
    { label: 'Bill Number', key: 'billNumber' },
    { label: 'Customer', key: 'businessPartner.name' },
    { label: 'Customer ID', key: 'customerId' },
    { label: 'VAT Period', key: 'vatPeriod' },
    { label: 'Invoice Type', key: 'invoiceType' },
    { label: 'Invoice Date', key: 'invoiceDate' },
    { label: 'Due Date', key: 'dueDate' },
    { label: 'Delivery Period', key: 'deliveryPeriod' },
    { label: 'Total Amount', key: 'totalAmount' },
    { label: 'VAT Category', key: 'vatCategory' },
    { label: 'Note', key: 'note' },
    { label: 'Created', key: 'createdAt' },
    { label: 'Updated', key: 'updatedAt' },
  ],
  contract: [
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
  vat: [
    { label: 'ID', key: 'id' },
    { label: 'Product Name', key: 'name' },
    { label: 'Amount', key: 'amount' },
    { label: 'Price', key: 'price' },
    { label: 'Date', key: 'date' },
    { label: 'Document Number', key: 'documentNumber' },
    { label: 'Total Price', key: 'totalPrice' },
  ],
};

/**
 * Formats values based on their type and context
 */
export const formatValue = (value, key, currency = 'BAM') => {
  if (value === null || value === undefined || value === '') return '/';

  if (key.includes('Date') || key.includes('At')) {
    try {
      const date = new Date(value);
      return date.toLocaleDateString();
    } catch {
      return value;
    }
  }

  // Format currency values
  if (
    key.includes('amount') ||
    key.includes('total') ||
    key.includes('vat') ||
    key.includes('sum')
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
 * Mock data generators for testing
 */
export const createMockKufData = (id = '1') => ({
  id,
  documentNumber: 'KUF-2024-001',
  invoice_number: 'FAK-001/2024',
  bill_number: 'RN-2024-001',
  supplier_name: 'Elektroprivreda BiH d.d. Sarajevo',
  supplier_id: '4200000050006',
  vat_period: '2024-01',
  invoice_type: 'Standardna faktura',
  invoice_date: '2024-01-15T00:00:00Z',
  due_date: '2024-02-15T00:00:00Z',
  received_date: '2024-01-16T00:00:00Z',
  net_total: 2542.37,
  lump_sum: 254.24,
  vat_amount: 508.47,
  deductible_vat: 508.47,
  non_deductible_vat: 0.0,
  vat_exempt_region: 'Ne',
  note: 'Faktura za električnu energiju za period januar 2024. godine.',
  currency: 'BAM',
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-15T14:45:00Z',
});

export const createMockKifData = (id = '1') => ({
  id,
  documentNumber: 'KIF-2024-001',
  invoice_number: 'ISFAK-001/2024',
  bill_number: 'IRN-2024-001',
  customer_name: 'BH Telecom d.d. Sarajevo',
  customer_id: '4200000050013',
  vat_period: '2024-01',
  invoice_type: 'Standardna faktura',
  invoice_date: '2024-01-15T00:00:00Z',
  due_date: '2024-02-15T00:00:00Z',
  delivery_period: '2024-01-20T00:00:00Z',
  total_amount: 5932.2,
  vat_category: 'Standardna stopa (17%)',
  note: 'Usluge telekomunikacija za period januar 2024. godine.',
  currency: 'BAM',
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-15T14:45:00Z',
});

export const createMockVatData = (id = '1') => ({
  id,
  name: 'Product A',
  amount: 10,
  price: 25.5,
  date: '2025-08-10',
  document_number: `VAT-${id}`,
  total_price: 25.5 * 10,
  status: 'pending',
  created_at: '2025-08-11',
  updated_at: '2025-08-12',
});
