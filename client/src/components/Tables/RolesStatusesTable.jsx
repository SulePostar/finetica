import React, { useState } from 'react';
import { capitalizeFirst } from '../../helpers/capitalizeFirstLetter';
import {
    CCard,
    CCardHeader,
    CCardBody,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CButton,
    CForm,
    CFormInput,
} from '@coreui/react';

const RolesStatusesTable = ({ title, data, nameKey, onAdd, onDelete }) => {
    const [newValue, setNewValue] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newValue.trim()) {
            onAdd({ [nameKey]: newValue });
            setNewValue("");
        }
    };

    return (
        <CCard className="shadow-sm">
            <CCardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{title}</h5>
                <CForm onSubmit={handleSubmit} className="d-flex gap-2">
                    <CFormInput
                        size="sm"
                        placeholder={`Add ${capitalizeFirst(title)}`}
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                    />
                    <CButton type="submit" color="primary" size="sm">
                        Add
                    </CButton>
                </CForm>
            </CCardHeader>
            <CCardBody>
                <CTable striped hover responsive>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                            <CTableHeaderCell scope="col">{title}</CTableHeaderCell>
                            <CTableHeaderCell scope="col" className="text-end">
                                Actions
                            </CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {data?.length > 0 ? (
                            data.map((item) => (
                                <CTableRow key={item.id}>
                                    <CTableDataCell>{item.id}</CTableDataCell>
                                    <CTableDataCell>{capitalizeFirst(item[nameKey])}</CTableDataCell>
                                    <CTableDataCell className="text-end">
                                        <CButton
                                            color="danger"
                                            size="sm"
                                            onClick={() => onDelete(item.id)}
                                        >
                                            Delete
                                        </CButton>
                                    </CTableDataCell>
                                </CTableRow>
                            ))
                        ) : (
                            <CTableRow>
                                <CTableDataCell colSpan={3} className="text-center text-muted">
                                    No {title.toLowerCase()} found
                                </CTableDataCell>
                            </CTableRow>
                        )}
                    </CTableBody>
                </CTable>
            </CCardBody>
        </CCard>
    );
};

export default RolesStatusesTable;
