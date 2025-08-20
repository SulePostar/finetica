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
        { label: 'Updated', key: 'updated_at' }
    ],
    kif: [
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
    ],
    contract: [
        { label: 'Partner ID', key: 'partner_id' },
        { label: 'Contract Number', key: 'contract_number' },
        { label: 'Contract Type', key: 'contract_type' },
        { label: 'Description', key: 'description' },
        { label: 'Start Date', key: 'start_date' },
        { label: 'End Date', key: 'end_date' },
        { label: 'Status', key: 'is_active' },
        { label: 'Payment Terms', key: 'payment_terms' },
        { label: 'Currency', key: 'currency' },
        { label: 'Amount', key: 'amount' },
        { label: 'Signed At', key: 'signed_at' },
        { label: 'Created', key: 'created_at' },
        { label: 'Updated', key: 'updated_at' }
    ]
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
    { label: 'Updated', key: 'updated_at' },
  ],
  contract: [
    { label: 'Partner ID', key: 'partner_id' },
    { label: 'Contract Number', key: 'contract_number' },
    { label: 'Contract Type', key: 'contract_type' },
    { label: 'Description', key: 'description' },
    { label: 'Start Date', key: 'start_date' },
    { label: 'End Date', key: 'end_date' },
    { label: 'Status', key: 'is_active' },
    { label: 'Payment Terms', key: 'payment_terms' },
    { label: 'Currency', key: 'currency' },
    { label: 'Amount', key: 'amount' },
    { label: 'Signed At', key: 'signed_at' },
    { label: 'Created', key: 'created_at' },
    { label: 'Updated', key: 'updated_at' },
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
  if (value === null || value === undefined || value === '') return 'N/A';

  // Format dates
  if (key.includes('date') || key.includes('_at')) {
    try {
      const date = new Date(value);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
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
  amount: '10',
  price: '25.5',
  date: '2025-08-10',
  documentNumber: `VAT-${id}`,
  totalPrice: `${25.5 * 10}`,
});

export const createMockContractData = (id = '1') => {
  const contractTypes = ['Service', 'License', 'Supply', 'Consulting'];
  const paymentTerms = ['Net 30', 'Net 60', 'Advance', 'Upon Delivery'];
  const currencies = ['EUR', 'USD', 'BAM', 'GBP'];

  const index = parseInt(id) - 1 || 0;

  return {
    id,
    partner_id: 1000 + index,
    contract_number: `CN-${2025}${String(index + 1).padStart(3, '0')}`,
    contract_type: contractTypes[index % contractTypes.length],
    description: `${
      contractTypes[index % contractTypes.length]
    } contract for business operations and service delivery with detailed terms and conditions.`,
    start_date: `2025-01-${((index % 28) + 1).toString().padStart(2, '0')}`,
    end_date: `2025-12-${((index % 28) + 1).toString().padStart(2, '0')}`,
    is_active: index % 3 !== 0,
    payment_terms: paymentTerms[index % paymentTerms.length],
    currency: currencies[index % currencies.length],
    amount: parseFloat((Math.random() * 100000 + 1000).toFixed(2)),
    signed_at: `2025-01-${((index % 28) + 1).toString().padStart(2, '0')}T10:00:00Z`,
    created_at: `2024-12-${((index % 28) + 1).toString().padStart(2, '0')}T09:00:00Z`,
    updated_at: `2025-01-${((index % 28) + 1).toString().padStart(2, '0')}T11:00:00Z`,
  };
};
