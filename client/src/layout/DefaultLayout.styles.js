const makeLayoutStyles = () => ({
    container: {
        className: 'd-flex min-vh-100 p-0',
    },

    sidebarCol: {
        className: 'p-0 bg-light dark:bg-dark',
        style: {
            width: '240px',
            minWidth: '240px',
            maxWidth: '240px',
        },
    },

    mainCol: {
        className: 'd-flex flex-column p-0 flex-grow-1 bg-white dark:bg-dark',
    },

    mainContent: {
        className: 'p-3 flex-grow-1',
    },
});

export default makeLayoutStyles;
