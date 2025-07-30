const makeCustomStyles = () => ({
  rows: {
    style: {
      minHeight: '48px',
      color: 'var(--cui-body-color)',
      backgroundColor: 'var(--cui-body-bg)',
      width: '100%',
    },
    highlightOnHoverStyle: {
      backgroundColor: 'var(--cui-primary-bg-subtle)',
      color: 'var(--cui-primary-text-emphasis)',
      transitionDuration: '0.15s',
      outline: 'none',
    },
    stripedStyle: {
      backgroundColor: 'var(--cui-table-striped-bg)',
      color: 'var(--cui-body-color)',
    },
  },
  headCells: {
    style: {
      paddingTop: '12px',
      paddingBottom: '12px',
      fontWeight: 600,
      backgroundColor: 'var(--cui-body-bg)',
      color: 'var(--cui-secondary-color, var(--cui-body-color))',
      borderBottomWidth: '2px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'var(--cui-border-color)',
      whiteSpace: 'nowrap',
    },
  },
  cells: {
    style: {
      paddingTop: '12px',
      paddingBottom: '12px',
      borderBottomColor: 'var(--cui-border-color)',
      color: 'var(--cui-body-color)',
    },
  },
  pagination: {
    style: {
      borderTop: '1px solid var(--cui-border-color)',
      padding: '8px 16px',
      backgroundColor: 'var(--cui-body-bg)',
      color: 'var(--cui-body-color)',
    },
    pageButtonsStyle: {
      fill: 'var(--cui-body-color)',
      '&:disabled': { fill: 'var(--cui-secondary-color, var(--cui-body-color))' },
      '&:hover:not(:disabled)': {
        backgroundColor: 'var(--cui-table-hover-bg)',
      },
    },
  },
});

export default makeCustomStyles;
