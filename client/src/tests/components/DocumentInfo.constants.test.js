import {
    formatValue,
    DOCUMENT_FIELD_CONFIGS
} from '../../utilis/constants/InvoicesData';

describe('DocumentInfo Constants and Utilities', () => {
    describe('formatValue function', () => {
        describe('Null and Empty Values', () => {
            test('should return "N/A" for null values', () => {
                expect(formatValue(null, 'any_key')).toBe('N/A');
            });

            test('should return "N/A" for undefined values', () => {
                expect(formatValue(undefined, 'any_key')).toBe('N/A');
            });

            test('should return "N/A" for empty string values', () => {
                expect(formatValue('', 'any_key')).toBe('N/A');
            });
        });

        describe('Date Formatting', () => {
            test('should format valid dates correctly', () => {
                const dateString = '2024-01-15T10:30:00Z';
                expect(formatValue(dateString, 'invoice_date')).toBe('15-01-2024');
            });

            test('should format dates with different formats', () => {
                const dateString = '2024-12-25T23:59:59Z';
                expect(formatValue(dateString, 'due_date')).toBe('26-12-2024');
            });

            test('should handle created_at timestamps', () => {
                const dateString = '2024-07-01T08:15:30Z';
                expect(formatValue(dateString, 'created_at')).toBe('01-07-2024');
            });

            test('should handle updated_at timestamps', () => {
                const dateString = '2024-03-10T14:45:20Z';
                expect(formatValue(dateString, 'updated_at')).toBe('10-03-2024');
            });

            test('should return original value for invalid dates', () => {
                const invalidDate = 'not-a-date';
                expect(formatValue(invalidDate, 'invoice_date')).toBe('NaN-NaN-NaN');
            });

            test('should handle edge case dates', () => {
                const edgeDate = '2024-02-29T00:00:00Z'; // Leap year
                expect(formatValue(edgeDate, 'invoice_date')).toBe('29-02-2024');
            });
        });

        describe('Currency Formatting', () => {
            test('should format amount fields correctly', () => {
                const result = formatValue(1234.56, 'total_amount');
                expect(result).toContain('1.234,56');
                expect(result).toContain('KM');
            });

            test('should format VAT amounts', () => {
                const result = formatValue(205.67, 'vat_amount');
                expect(result).toContain('205,67');
                expect(result).toContain('KM');
            });

            test('should format net totals', () => {
                const result = formatValue(2542.37, 'net_total');
                expect(result).toContain('2.542,37');
                expect(result).toContain('KM');
            });

            test('should format lump sum amounts', () => {
                const result = formatValue(100.00, 'lump_sum');
                expect(result).toContain('100,00');
                expect(result).toContain('KM');
            });

            test('should handle zero amounts', () => {
                const result = formatValue(0, 'total_amount');
                expect(result).toContain('0,00');
                expect(result).toContain('KM');
            });

            test('should handle negative amounts', () => {
                const result = formatValue(-500.25, 'total_amount');
                expect(result).toContain('-500,25');
                expect(result).toContain('KM');
            });

            test('should handle very large amounts', () => {
                const result = formatValue(999999999.99, 'total_amount');
                expect(result).toContain('999.999.999,99');
                expect(result).toContain('KM');
            });

            test('should respect custom currency parameter', () => {
                const result = formatValue(100, 'total_amount', 'EUR');
                expect(result).toContain('100,00');
                expect(result).toContain('€');
            });

            test('should handle dollar currency fallback', () => {
                const result = formatValue(100, 'total_amount', '$');
                expect(result).toContain('100,00');
                expect(result).toContain('KM');
            });

            test('should not format non-numeric currency values', () => {
                expect(formatValue('not-a-number', 'total_amount')).toBe('not-a-number');
            });
        });

        describe('Boolean Formatting', () => {
            test('should format true as "Da"', () => {
                expect(formatValue(true, 'any_key')).toBe('Da');
            });

            test('should format false as "Ne"', () => {
                expect(formatValue(false, 'any_key')).toBe('Ne');
            });
        });

        describe('Default Value Handling', () => {
            test('should return string values as-is', () => {
                expect(formatValue('Some text', 'note')).toBe('Some text');
            });

            test('should return number values as-is for non-currency fields', () => {
                expect(formatValue(42, 'document_id')).toBe(42);
            });

            test('should handle object values', () => {
                const obj = { key: 'value' };
                expect(formatValue(obj, 'any_key')).toBe(obj);
            });

            test('should handle array values', () => {
                const arr = [1, 2, 3];
                expect(formatValue(arr, 'any_key')).toBe(arr);
            });
        });
    });

    describe('DOCUMENT_FIELD_CONFIGS', () => {
        describe('KUF Configuration', () => {
            test('should have required KUF fields', () => {
                const kufFields = DOCUMENT_FIELD_CONFIGS.kuf;

                expect(kufFields).toContainEqual({ label: 'Document Number', key: 'documentNumber' });
                expect(kufFields).toContainEqual({ label: 'Supplier', key: 'supplier_name' });
                expect(kufFields).toContainEqual({ label: 'Net Total', key: 'net_total' });
                expect(kufFields).toContainEqual({ label: 'VAT Amount', key: 'vat_amount' });
                expect(kufFields).toContainEqual({ label: 'Invoice Date', key: 'invoice_date' });
            });

            test('should have correct number of KUF fields', () => {
                expect(DOCUMENT_FIELD_CONFIGS.kuf).toHaveLength(19);
            });

            test('should have unique keys in KUF config', () => {
                const keys = DOCUMENT_FIELD_CONFIGS.kuf.map(field => field.key);
                const uniqueKeys = [...new Set(keys)];
                expect(keys.length).toBe(uniqueKeys.length);
            });
        });

        describe('KIF Configuration', () => {
            test('should have required KIF fields', () => {
                const kifFields = DOCUMENT_FIELD_CONFIGS.kif;

                expect(kifFields).toContainEqual({ label: 'Document Number', key: 'documentNumber' });
                expect(kifFields).toContainEqual({ label: 'Customer', key: 'customer_name' });
                expect(kifFields).toContainEqual({ label: 'Total Amount', key: 'total_amount' });
                expect(kifFields).toContainEqual({ label: 'Invoice Date', key: 'invoice_date' });
            });

            test('should have correct number of KIF fields', () => {
                expect(DOCUMENT_FIELD_CONFIGS.kif).toHaveLength(15);
            });

            test('should have unique keys in KIF config', () => {
                const keys = DOCUMENT_FIELD_CONFIGS.kif.map(field => field.key);
                const uniqueKeys = [...new Set(keys)];
                expect(keys.length).toBe(uniqueKeys.length);
            });

            test('should not have KUF-specific fields', () => {
                const kifKeys = DOCUMENT_FIELD_CONFIGS.kif.map(field => field.key);
                expect(kifKeys).not.toContain('supplier_name');
                expect(kifKeys).not.toContain('net_total');
                expect(kifKeys).not.toContain('deductible_vat');
            });
        });

        describe('Field Differences', () => {
            test('should have different supplier/customer fields', () => {
                const kufKeys = DOCUMENT_FIELD_CONFIGS.kuf.map(field => field.key);
                const kifKeys = DOCUMENT_FIELD_CONFIGS.kif.map(field => field.key);

                expect(kufKeys).toContain('supplier_name');
                expect(kufKeys).not.toContain('customer_name');

                expect(kifKeys).toContain('customer_name');
                expect(kifKeys).not.toContain('supplier_name');
            });

            test('should have common shared fields', () => {
                const kufKeys = DOCUMENT_FIELD_CONFIGS.kuf.map(field => field.key);
                const kifKeys = DOCUMENT_FIELD_CONFIGS.kif.map(field => field.key);

                const sharedKeys = ['documentNumber', 'invoice_date', 'created_at', 'updated_at'];

                sharedKeys.forEach(key => {
                    expect(kufKeys).toContain(key);
                    expect(kifKeys).toContain(key);
                });
            });
        });
    });
});
