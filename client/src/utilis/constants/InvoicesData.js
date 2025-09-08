/**
 * Field configuration for different document types
 */
export const DOCUMENT_FIELD_CONFIGS = {
  kuf: [
    { label: 'Invoice Number', key: 'invoiceNumber' },
    { label: 'Bill Number', key: 'billNumber' },
    { label: 'Supplier', key: 'supplierName' },
    { label: 'Supplier ID', key: 'supplierId' },
    { label: 'bank-transactions Period', key: 'vatPeriod' },
    { label: 'Invoice Type', key: 'invoiceType' },
    { label: 'Invoice Date', key: 'invoiceDate' },
    { label: 'Due Date', key: 'dueDate' },
    { label: 'Received Date', key: 'receivedDate' },
    { label: 'Net Total', key: 'netTotal' },
    { label: 'Lump Sum', key: 'lumpSum' },
    { label: 'bank-transactions Amount', key: 'vatAmount' },
    { label: 'Deductible bank-transactions', key: 'deductibleVat' },
    { label: 'Non-deductible bank-transactions', key: 'nonDeductibleVat' },
    { label: 'bank-transactions Exempt Region', key: 'vatExemptRegion' },
    { label: 'Note', key: 'note' },
    { label: 'Created', key: 'created_at' },
    { label: 'Updated', key: 'updated_at' },
  ],
  kif: [
    { label: 'Invoice Number', key: 'invoiceNumber' },
    { label: 'Bill Number', key: 'billNumber' },
    { label: 'Customer', key: 'customerName' },
    { label: 'Customer ID', key: 'customerId' },
    { label: 'bank-transactions Period', key: 'vatPeriod' },
    { label: 'Invoice Type', key: 'invoiceType' },
    { label: 'Invoice Date', key: 'invoiceDate' },
    { label: 'Due Date', key: 'dueDate' },
    { label: 'Delivery Period', key: 'deliveryPeriod' },
    { label: 'Total Amount', key: 'totalAmount' },
    { label: 'bank-transactions Category', key: 'vatCategory' },
    { label: 'Note', key: 'note' },
    { label: 'Created', key: 'created_at' },
    { label: 'Updated', key: 'updated_at' },
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
  "bank-transactions": [
    { label: 'ID', key: 'id' },
    { label: 'Date', key: 'date' },
    { label: 'Amount', key: 'amount' },
    { label: 'Direction', key: 'direction' },
    { label: 'Account Number', key: 'accountNumber' },
    // { label: 'Description', key: 'description' },
    { label: 'Invoice ID', key: 'invoiceId' },
    { label: 'Partner ID', key: 'BusinessPartner.id' },
    { label: 'Partner Name', key: 'BusinessPartner.name' },
    { label: 'Category ID', key: 'TransactionCategory.id' },
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
  if (value === null || value === undefined || value === '') return '/';
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
    key.includes('bank-transactions') ||
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
  invoiceNumber: 'ISFAK-001/2024',
  billNumber: 'IRN-2024-001',
  customerName: 'BH Telecom d.d. Sarajevo',
  customerId: '4200000050013',
  vatPeriod: '2024-01',
  invoiceType: 'Standardna faktura',
  invoiceDate: '2024-01-15T00:00:00Z',
  dueDate: '2024-02-15T00:00:00Z',
  deliveryPeriod: '2024-01-20T00:00:00Z',
  totalAmount: 5932.2,
  vatCategory: 'Standardna stopa (17%)',
  note: 'Usluge telekomunikacija za period januar 2024. godine.',
  currency: 'BAM',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T14:45:00Z',
});
export const createMockVatData = (id = '1') => ({
  id,
  name: 'Product A',
  amount: 10,
  price: 25.5,
  date: '2025-08-10',
  document_number: `bank-transactions-${id}`,
  total_price: 25.5 * 10,
  status: 'pending',
  created_at: '2025-08-11',
  updated_at: '2025-08-12',
});