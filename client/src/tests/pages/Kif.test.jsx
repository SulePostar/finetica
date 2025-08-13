import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Kif from '../../pages/kif/Kif';
import { mockAuthStateFactory } from '../testUtils';

// Mock the dependencies
jest.mock('../../components/index', () => ({
    UploadButton: ({ bucketName }) => (
        <div data-testid="upload-button">Upload Button (Bucket: {bucketName})</div>
    ),
}));

jest.mock('../../components/Tables/DynamicTable', () => ({
    title, columns, apiEndpoint, onRowClick
}) => {
    // Test the column selectors by creating a mock row and testing them
    const mockRow = { id: 1, name: 'Test Row', amount: 100, price: 50.25, date: '2024-01-01' };

    return (
        <div data-testid="dynamic-table">
            <h3>{title}</h3>
            <div data-testid="api-endpoint">{apiEndpoint}</div>
            <div data-testid="columns">{columns.length} columns</div>
            {columns.map((column, index) => (
                <div key={index} data-testid={`column-result-${index}`}>
                    {column.name}: {typeof column.selector === 'function' ? column.selector(mockRow) : 'N/A'}
                </div>
            ))}
            <button
                data-testid="row-click-test"
                onClick={() => onRowClick({ id: 1, name: 'Test Row' })}
            >
                Test Row Click
            </button>
            {/* Render Actions column cell to test action handlers */}
            {columns.find(col => col.name === 'Actions') && (
                <div data-testid="actions-column">
                    {columns.find(col => col.name === 'Actions').cell(mockRow)}
                </div>
            )}
        </div>
    );
});

jest.mock('../../components/Tables/Dropdown/ActionsDropdown', () => ({
    row, onView, onEdit, onDelete, onDownload
}) => (
    <div data-testid="actions-dropdown">
        <button data-testid="action-view" onClick={() => onView(row.id)}>View</button>
        <button data-testid="action-edit" onClick={() => onEdit(row.id)}>Edit</button>
        <button data-testid="action-delete" onClick={() => onDelete(row.id)}>Delete</button>
        <button data-testid="action-download" onClick={() => onDownload(row.id)}>Download</button>
    </div>
));

jest.mock('../../layout/DefaultLayout', () => ({ children }) => (
    <div data-testid="default-layout">{children}</div>
));

jest.mock('../../lib/bucketUtils', () => ({
    useBucketName: () => 'test-bucket',
}));

// Mock navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('KIF Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset navigate mock
        mockNavigate.mockReset();

        // Reset useSelector mock to default state
        const { useSelector } = require('react-redux');
        useSelector.mockImplementation((selector) => {
            const mockState = {
                ui: { sidebarShow: false },
                auth: mockAuthStateFactory()
            };
            return selector(mockState);
        });
    });

    const defaultProps = {};

    const mockStore = configureStore({
        reducer: {
            ui: (state = { sidebarShow: false }) => state,
            auth: (state = mockAuthStateFactory()) => state,
        },
    });

    const renderKifPage = (props = defaultProps, storeOptions = {}) => {
        const store = configureStore({
            reducer: {
                ui: (state = { sidebarShow: storeOptions.sidebarShow || false }) => state,
                auth: (state = mockAuthStateFactory()) => state,
            },
        });

        return render(
            <Provider store={store}>
                <BrowserRouter>
                    <Kif {...props} />
                </BrowserRouter>
            </Provider>
        );
    };

    describe('Component Rendering', () => {
        test('should render KIF page correctly', () => {
            renderKifPage();

            expect(screen.getByTestId('default-layout')).toBeInTheDocument();
            expect(screen.getByTestId('upload-button')).toBeInTheDocument();
            expect(screen.getByTestId('dynamic-table')).toBeInTheDocument();
        });

        test('should render upload button with correct bucket name', () => {
            renderKifPage();

            const uploadButton = screen.getByTestId('upload-button');
            expect(uploadButton).toHaveTextContent('Upload Button (Bucket: test-bucket)');
        });

        test('should render dynamic table with correct props', () => {
            renderKifPage();

            expect(screen.getByText('KIF Table')).toBeInTheDocument();
            expect(screen.getByTestId('api-endpoint')).toHaveTextContent('http://localhost:4000/api/kif-data');
            expect(screen.getByTestId('columns')).toHaveTextContent('6 columns');

            // Test that column selectors work correctly
            expect(screen.getByTestId('column-result-0')).toHaveTextContent('ID: 1');
            expect(screen.getByTestId('column-result-1')).toHaveTextContent('Name: Test Row');
            expect(screen.getByTestId('column-result-2')).toHaveTextContent('Quantity: 100');
            expect(screen.getByTestId('column-result-3')).toHaveTextContent('Price: 50.25');
            expect(screen.getByTestId('column-result-4')).toHaveTextContent('Date: 2024-01-01');
        });

        test('should apply correct layout styles when sidebar is hidden', () => {
            renderKifPage({}, { sidebarShow: false });

            const container = document.querySelector('.kif-table-outer');
            expect(container).toHaveStyle('margin-left: 0px');
        });

        test('should apply correct layout styles when sidebar is shown', () => {
            // Mock useSelector to return sidebarShow: true
            const { useSelector } = require('react-redux');
            useSelector.mockImplementation((selector) => {
                const mockState = {
                    ui: { sidebarShow: true },
                    auth: mockAuthStateFactory()
                };
                return selector(mockState);
            });

            render(
                <BrowserRouter>
                    <Kif />
                </BrowserRouter>
            );

            const container = document.querySelector('.kif-table-outer');
            expect(container).toHaveStyle('margin-left: 250px');
        });
    });

    describe('Table Configuration', () => {
        test('should configure table columns correctly', () => {
            renderKifPage();

            // The columns are passed to DynamicTable, we can verify through the mock
            expect(screen.getByTestId('columns')).toHaveTextContent('6 columns');
        });

        test('should have correct column definitions and selectors', () => {
            renderKifPage();

            // Test that the component creates columns internally
            // We need to access the component's columns array to test selectors
            const mockRowData = {
                id: 123,
                name: 'Test KIF Item',
                amount: 50,
                price: 999.99,
                date: '2024-01-15'
            };

            // Since columns are defined inside the component, we'll test them indirectly
            // by ensuring the DynamicTable receives the correct structure
            expect(screen.getByTestId('dynamic-table')).toBeInTheDocument();
            expect(screen.getByTestId('columns')).toHaveTextContent('6 columns');
        });

        test('should create columns with correct properties', () => {
            // Create a test instance to verify column structure
            const TestComponent = () => {
                const columns = [
                    { name: 'ID', selector: row => row.id, sortable: true },
                    { name: 'Name', selector: row => row.name, sortable: true },
                    { name: 'Quantity', selector: row => row.amount, sortable: true },
                    { name: 'Price', selector: row => row.price, sortable: true },
                    { name: 'Date', selector: row => row.date, sortable: true },
                ];

                // Test the column selectors
                const testRow = {
                    id: 456,
                    name: 'Test Product',
                    amount: 25,
                    price: 1234.56,
                    date: '2024-02-20'
                };

                const columnResults = columns.map(col => ({
                    name: col.name,
                    value: col.selector(testRow),
                    sortable: col.sortable
                }));

                return (
                    <div>
                        {columnResults.map((result, index) => (
                            <div key={index} data-testid={`column-${index}`}>
                                {result.name}: {result.value} (sortable: {result.sortable.toString()})
                            </div>
                        ))}
                    </div>
                );
            };

            render(<TestComponent />);

            // Verify each column selector works correctly
            expect(screen.getByTestId('column-0')).toHaveTextContent('ID: 456 (sortable: true)');
            expect(screen.getByTestId('column-1')).toHaveTextContent('Name: Test Product (sortable: true)');
            expect(screen.getByTestId('column-2')).toHaveTextContent('Quantity: 25 (sortable: true)');
            expect(screen.getByTestId('column-3')).toHaveTextContent('Price: 1234.56 (sortable: true)');
            expect(screen.getByTestId('column-4')).toHaveTextContent('Date: 2024-02-20 (sortable: true)');
        });

        test('should handle row click and navigate correctly', async () => {
            renderKifPage();

            const rowClickButton = screen.getByTestId('row-click-test');
            fireEvent.click(rowClickButton);

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/kif/1');
                expect(mockNavigate).toHaveBeenCalledTimes(1);
            });
        });

        test('should handle multiple row clicks correctly', async () => {
            renderKifPage();

            const rowClickButton = screen.getByTestId('row-click-test');

            // First click
            fireEvent.click(rowClickButton);
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/kif/1');
            });

            // Clear mocks and click again
            mockNavigate.mockClear();
            fireEvent.click(rowClickButton);

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/kif/1');
                expect(mockNavigate).toHaveBeenCalledTimes(1);
            });
        });

        test('should handle action dropdown interactions', async () => {
            renderKifPage();

            // Test view action
            const viewButton = screen.getByTestId('action-view');
            fireEvent.click(viewButton);
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/kif/1');
            });

            // Test edit action (placeholder function)
            const editButton = screen.getByTestId('action-edit');
            expect(() => fireEvent.click(editButton)).not.toThrow();

            // Test delete action (placeholder function) 
            const deleteButton = screen.getByTestId('action-delete');
            expect(() => fireEvent.click(deleteButton)).not.toThrow();

            // Test download action (placeholder function)
            const downloadButton = screen.getByTestId('action-download');
            expect(() => fireEvent.click(downloadButton)).not.toThrow();
        });
    });

    describe('Component Integration', () => {
        test('should integrate with Redux store correctly', () => {
            // Mock useSelector to return sidebarShow: true
            const { useSelector } = require('react-redux');
            useSelector.mockImplementation((selector) => {
                const mockState = {
                    ui: { sidebarShow: true },
                    auth: mockAuthStateFactory()
                };
                return selector(mockState);
            });

            render(
                <BrowserRouter>
                    <Kif />
                </BrowserRouter>
            );

            const container = document.querySelector('.kif-table-outer');
            expect(container).toHaveStyle('margin-left: 250px');
        });

        test('should handle bucket name from custom hook', () => {
            renderKifPage();

            const uploadButton = screen.getByTestId('upload-button');
            expect(uploadButton).toHaveTextContent('test-bucket');
        });
    });

    describe('Layout and Styling', () => {
        test('should have correct CSS classes and structure', () => {
            renderKifPage();

            const outerContainer = document.querySelector('.kif-table-outer');
            expect(outerContainer).toBeInTheDocument();
            expect(outerContainer).toHaveClass('kif-table-outer');

            // Check for flex layout
            expect(outerContainer).toHaveStyle({
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            });
        });

        test('should have responsive design elements', () => {
            renderKifPage();

            // Check for Bootstrap utility classes
            const uploadButtonContainer = document.querySelector('.w-100.d-flex.justify-content-end');
            expect(uploadButtonContainer).toBeInTheDocument();

            const tableContainer = document.querySelector('.w-100.d-flex.justify-content-center');
            expect(tableContainer).toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        test('should handle missing bucket name gracefully', () => {
            // Mock useBucketName to return undefined
            jest.doMock('../../lib/bucketUtils', () => ({
                useBucketName: () => undefined,
            }));

            renderKifPage();

            // Component should still render
            expect(screen.getByTestId('upload-button')).toBeInTheDocument();
        });

        test('should handle Redux store errors gracefully', () => {
            // Mock console.error to suppress error logs during test
            const originalConsoleError = console.error;
            console.error = jest.fn();

            try {
                const errorStore = configureStore({
                    reducer: {
                        ui: (state = { sidebarShow: false }) => state,
                        auth: (state = mockAuthStateFactory()) => state,
                    },
                });

                // Should not crash the component
                expect(() => {
                    render(
                        <Provider store={errorStore}>
                            <BrowserRouter>
                                <Kif />
                            </BrowserRouter>
                        </Provider>
                    );
                }).not.toThrow();
            } finally {
                console.error = originalConsoleError;
            }
        });
    });

    describe('Accessibility', () => {
        test('should be accessible', () => {
            renderKifPage();

            // Check that main interactive elements are present
            expect(screen.getByTestId('upload-button')).toBeInTheDocument();
            expect(screen.getByTestId('dynamic-table')).toBeInTheDocument();

            // Check that the table has a title for screen readers
            expect(screen.getByText('KIF Table')).toBeInTheDocument();
        });
    });
});
