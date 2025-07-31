import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import makeCustomStyles from './DataTable.styles';

const Table = ({ title, columns, fetchData }) => {
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const customStyles = useMemo(() => makeCustomStyles(), []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchData({ page, perPage, sortField, sortOrder });
      setData(result.data);
      setTotalRows(result.total);
    } catch (error) {
      console.error('Greška pri učitavanju podataka:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [page, perPage, sortField, sortOrder]);

  const cardStyle = useMemo(
    () => ({
      margin: '20px 200px ',
      maxWidth: '100%',
      background: 'var(--cui-card-bg, var(--cui-body-bg))',
      color: 'var(--cui-body-color)',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      border: '1px solid var(--cui-border-color)',
    }),
    []
  );

  const titleStyle = useMemo(
    () => ({
      marginBottom: '20px',
      fontSize: '28px',
      fontWeight: 700,
      color: 'var(--cui-primary)',
      fontFamily: "'Segoe UI', sans-serif",
    }),
    []
  );

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>{title}</h2>

      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={(newPerPage) => {
          setPerPage(newPerPage);
          setPage(1);
        }}
        onChangePage={(p) => setPage(p)}
        onSort={(column, direction) => {
          setSortField(column.sortField || column.selector);
          setSortOrder(direction);
        }}
        sortServer
        highlightOnHover
        responsive
        customStyles={customStyles}
      />
    </div>
  );
};

export default Table;
