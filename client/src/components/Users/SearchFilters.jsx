import React from 'react';
import { CFormInput, CFormSelect, CButton } from '@coreui/react';
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
    <div className="d-flex gap-3 align-items-center w-100">
      <div className="flex-grow-1">
        <CFormInput
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mb-0"
        />
      </div>
      <div style={{ width: '200px' }}>
        <CFormSelect
          value={filterRole}
          onChange={(e) => onFilterRoleChange(e.target.value)}
          className="mb-0"
        >
          <option value="">All Roles</option>
          <option value="1">Guest</option>
          <option value="2">User</option>
          <option value="3">Admin</option>
        </CFormSelect>
      </div>
      <div style={{ width: '120px' }}>
        <CButton color="primary" onClick={onRefresh} size="sm">
          <CIcon icon={cilReload} className="me-1" />
          Refresh
        </CButton>
      </div>
    </div>
  );
};

export default SearchFilters;
