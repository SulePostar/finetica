import React from 'react';
import { CCard, CCardBody, CCardHeader, CCardTitle, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';
import styles from './ItemsTable.module.css';

const ItemsTable = ({ items }) => {
    if (!items || items.length === 0) {
        return <div className={styles['items-table-no-items']}>No items found for this invoice.</div>;
    }

    // Columns for both sales and purchase invoice items
    const columns = [
        { key: 'orderNumber', label: 'Order Number' },
        { key: 'description', label: 'Description' },
        // Only sales invoice items have 'unit' and 'quantity' and 'unitPrice'
        ...(items.some(item => 'unit' in item) ? [
            { key: 'unit', label: 'Unit' },
        ] : []),
        ...(items.some(item => 'quantity' in item) ? [
            { key: 'quantity', label: 'Quantity' },
        ] : []),
        ...(items.some(item => 'unitPrice' in item) ? [
            { key: 'unitPrice', label: 'Unit Price' },
        ] : []),
        // Only purchase invoice items have 'lumpSum'
        ...(items.some(item => 'lumpSum' in item) ? [
            { key: 'lumpSum', label: 'Lump Sum' },
        ] : []),
        { key: 'netSubtotal', label: 'Net Subtotal' },
        { key: 'vatAmount', label: 'VAT Amount' },
        { key: 'grossSubtotal', label: 'Gross Subtotal' },
    ];

    return (
        <CCard className={styles['items-table-card']}>
            <CCardHeader>
                <CCardTitle className={styles['items-table-title']}>Invoice Items</CCardTitle>
            </CCardHeader>
            <CCardBody>
                <CTable striped hover responsive className={styles['items-table-table']}>
                    <CTableHead>
                        <CTableRow>
                            {columns.map(col => (
                                <CTableHeaderCell key={col.key}>{col.label}</CTableHeaderCell>
                            ))}
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {items.map((item, idx) => (
                            <CTableRow key={idx}>
                                {columns.map(col => (
                                    <CTableDataCell key={col.key}>{item[col.key]}</CTableDataCell>
                                ))}
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </CCardBody>
        </CCard>
    );
};

export default ItemsTable;
