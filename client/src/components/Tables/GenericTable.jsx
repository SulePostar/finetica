import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import customStyles from "./TableStyles";


const GenericTable = ({ title, columns, fetchData }) => {
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchData({ page, perPage, sortField, sortOrder });
      setData(result.data);
      setTotalRows(result.total);
    } catch (error) {
      console.error("Greška pri učitavanju podataka:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [page, perPage, sortField, sortOrder]);

  return (
    <div
      style={{
        margin: "40px auto",
        maxWidth: "95%",
        backgroundColor: "#fff",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(91, 60, 196, 0.1)",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          fontSize: "28px",
          fontWeight: "700",
          color: "#5B3CC4",
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        {title}
      </h2>

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
        onChangePage={(page) => setPage(page)}
        onSort={(column, direction) => {
          setSortField(column.sortField || column.selector);
          setSortOrder(direction);
        }}
        sortServer
        striped
        highlightOnHover
        responsive
        customStyles={customStyles}
      />
    </div>
  );
};

export default GenericTable;
