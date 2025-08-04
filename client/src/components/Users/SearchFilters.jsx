import React from 'react';
import { CCol, CFormInput, CFormSelect, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilReload } from '@coreui/icons';

const SearchFilters = ({
  searchTerm,
  onSearchChange,
  filterRole,
  onFilterRoleChange,
  onRefresh,
}) => {
  return (
    <>
      <CCol md={6}>
        <CFormInput
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mb-2"
        />
      </CCol>
      <CCol md={3}>
        <CFormSelect
          value={filterRole}
          onChange={(e) => onFilterRoleChange(e.target.value)}
          className="mb-2"
        >
          <option value="">All Roles</option>
          <option value="1">Guest</option>
          <option value="2">User</option>
          <option value="3">Admin</option>
        </CFormSelect>
      </CCol>
      <CCol md={3}>
        <CButton color="primary" onClick={onRefresh}>
          <CIcon icon={cilReload} className="me-1" />
          Refresh
        </CButton>
      </CCol>
    </>
  );
};

export default SearchFilters;
