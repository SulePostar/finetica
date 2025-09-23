// SearchFilters.jsx
import React from 'react';
import { CFormInput, CFormSelect, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilReload } from '@coreui/icons';
import './SearchFilters.css';

const SearchFilters = ({
  searchTerm,
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  onRefresh,
  searchPlaceholder = "Search...",
  refreshLabel = "Refresh",
}) => {
  return (
    <div className="d-flex gap-3 align-items-center w-100 flex-wrap">
      {/* Search Input */}
      <div className="flex-grow-1" style={{ minWidth: '200px' }}>
        <CFormInput
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mb-0"
        />
      </div>

      {/* Dynamic Filters */}
      {filters.map((filter) => (
        <div key={filter.name} style={{ width: filter.width || '200px' }}>
          <CFormSelect
            value={filterValues[filter.name] || ""}
            onChange={(e) => onFilterChange(filter.name, e.target.value)}
            className="mb-0"
          >
            <option value="">{filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </CFormSelect>
        </div>
      ))}

      {/* Refresh Button */}
      {onRefresh && (
        <div>
          <CButton
            onClick={onRefresh}
            size="m"
            className='btn-refreshed'
          >
            <CIcon icon={cilReload} className="me-1" />
            {refreshLabel}
          </CButton>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
