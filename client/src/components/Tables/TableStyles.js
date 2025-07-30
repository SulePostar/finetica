const customStyles = {
  tableWrapper: {
    style: {
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 10px 25px rgba(91, 60, 196, 0.08)",
      border: "1px solid #E2E8F0",
      width: "1000px"
    },
  },
  table: {
    style: {
      background: "linear-gradient(to right, #dbd9e3ff, #a294ebff)",
      fontFamily: "'Segoe UI', sans-serif",
    },
  },
  head: {
    style: {
      backgroundColor: "#F7FAFC",
      color: "#5B3CC4",
      fontSize: "16px",
      fontWeight: "700",
      textTransform: "uppercase",
      padding: "16px",
    },
  },
  headCells: {
    style: {
      backgroundColor: "#FFFFFF",
      color: "#5B3CC4",
      fontSize: "14px",
      fontWeight: "600",
      borderBottom: "2px solid #E2E8F0",
    },
  },
  rows: {
    style: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#2D3748",
      minHeight: "48px",
      borderBottom: "1px solid #D1D5DB",
    },
    stripedStyle: {
      backgroundColor: "#F5F3FC", // svjetlo ljubičasta
    },
    highlightOnHoverStyle: {
      backgroundColor: "#E9D8FD", // hover boja
      color: "#2D3748",
      cursor: "pointer",
    },
  },
  pagination: {
    style: {
      backgroundColor: "#FFFFFF",
      color: "#2D3748",
      fontSize: "13px",
      padding: "12px",
      borderTop: "1px solid #E2E8F0",
    },
    pageButtonsStyle: {
      borderRadius: "6px",
      cursor: "pointer",
      transition: "0.3s",
      color: "#5B3CC4",
      fill: "#5B3CC4",
      "&:hover": {
        backgroundColor: "#553C9A",
        color: "#FFFFFF",
        fill: "#FFFFFF",
      },
      "&:disabled": {
        cursor: "not-allowed",
        color: "#A0AEC0",
      },
    },
  },
};

export default customStyles;
