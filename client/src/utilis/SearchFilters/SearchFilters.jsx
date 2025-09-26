import { CFormInput, CFormSelect } from '@coreui/react';
import AppButton from '../../components/AppButton/AppButton';
import './SearchFilters.css';

const SearchFilters = ({
  searchTerm,
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  onRefresh,
  searchPlaceholder = "Search...",
  refreshLabel = "Clear Filters",
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
        <div key={filter.name} style={{ width: filter.width || '190px' }}>
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
          <AppButton
            onClick={onRefresh}
            size="md"
            variant='no-hover'
          >
            {refreshLabel}
          </AppButton>

        </div>
      )}
    </div>
  );
};

export default SearchFilters;
