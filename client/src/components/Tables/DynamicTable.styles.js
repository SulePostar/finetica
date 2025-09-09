import '../../scss/style.scss';

const makeCustomStyles = () => ({
  rows: {
    style: {
      minHeight: '60px',
      width: '100%',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      fontSize: '0.95rem',
      color: 'var(--cui-body-color)',
      backgroundColor: 'var(--cui-body-bg)',
      transition: 'background-color 0.2s ease-in-out',
    },
    highlightOnHoverStyle: {
      backgroundColor: 'var(--cui-table-hover-bg)',
      color: 'var(--cui-primary-text-emphasis)',
      transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
      cursor: 'pointer',
      outline: 'none',
    },
    stripedStyle: {
      backgroundColor: 'var(--cui-table-striped-bg)',
      color: 'var(--cui-body-color)',
    },
  },

  headCells: {
    style: {
      padding: '18px 20px',
      fontWeight: 700,
      fontSize: '1rem',
      whiteSpace: 'nowrap',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      backgroundColor: 'var(--cui-body-bg)',
      color: 'var(--cui-secondary-color, var(--cui-body-color))',
      borderBottom: '2px solid var(--cui-border-color)',
      letterSpacing: '0.5px',
    },
  },

  cells: {
    style: {
      padding: '18px 20px',
      fontSize: '0.95rem',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: 'var(--cui-body-color)',
      borderBottom: '1px solid var(--cui-border-color)',
      transition: 'color 0.2s ease',
    },
  },

  pagination: {
    style: {
      padding: '16px 24px',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      backgroundColor: 'var(--cui-body-bg)',
      color: 'var(--cui-body-color)',
      borderTop: '1px solid var(--cui-border-color)',
      fontSize: '0.9rem',
    },
    pageButtonsStyle: {
      fill: 'var(--cui-body-color)',
      transition: 'background-color 0.2s ease, fill 0.2s ease',
      borderRadius: '6px',
      padding: '6px 10px',
      '&:disabled': {
        fill: 'var(--cui-secondary-color, var(--cui-body-color))',
        opacity: 0.5,
      },
      '&:hover:not(:disabled)': {
        backgroundColor: 'var(--cui-table-hover-bg)',
        cursor: 'pointer',
      },
    },
  },
});

export default makeCustomStyles;
