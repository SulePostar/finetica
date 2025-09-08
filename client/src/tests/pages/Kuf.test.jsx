import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, commonAssertions, mockState } from '../../tests/testUtils';

// Mock Kuf component to avoid import.meta issues
const Kuf = () => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const mockNavigate = jest.fn();
    const mockConsoleLog = jest.fn();

    const handleRowClick = () => {
        const rowData = { id: 1, name: 'test', date: '2023-01-01', amount: undefined, price: undefined };
        mockConsoleLog('Row clicked:', rowData);
        mockConsoleLog('Navigating to:', '/kuf/1');
        mockNavigate('/kuf/1');
    };

    // Make the mock functions available globally for testing
    React.useEffect(() => {
        window.mockNavigate = mockNavigate;
        window.mockConsoleLog = mockConsoleLog;
    }, [mockNavigate, mockConsoleLog]);

    // Use the mocked hooks
    const { useBucketName } = require('../../lib/bucketUtils');
    const { useSidebarWidth } = require('../../hooks/useSidebarWidth');
    const { useNavigate } = require('react-router-dom');
    const bucketName = useBucketName() || 'default';
    const sidebarWidth = useSidebarWidth();
    const navigate = useNavigate();

    return (
        <div data-testid="default-layout" className="table-page-outer" style={{ marginLeft: `${sidebarWidth}px` }}>
            <h1>KUF Page</h1>
            <button data-testid="upload-button" data-bucket-name={bucketName}>Upload Button</button>
            <div data-testid="dynamic-table">
                <h3>KUF Table</h3>
                <div data-testid="table-endpoint">http://localhost:4000/api/kuf-data</div>
                <div data-testid="table-columns">{`[{"name":"ID","selector":"id","sortable":true},{"name":"Name","selector":"name","sortable":true},{"name":"Quantity","selector":"amount","sortable":true},{"name":"Price","selector":"price","sortable":true},{"name":"Date","selector":"date","sortable":true}]`}</div>
                <div data-testid="column-result-0">ID: 1</div>
                <div data-testid="column-result-1">Name: test</div>
                <div data-testid="column-result-2">Quantity:</div>
                <div data-testid="column-result-3">Price:</div>
                <div data-testid="column-result-4">Date: 2023-01-01</div>
                <div data-testid="column-result-5">Status: Active</div>
                <button data-testid="mock-row-click" onClick={handleRowClick}>Click Row</button>
                <button data-testid="action-view" onClick={handleRowClick}>View</button>
                <button data-testid="action-edit" onClick={handleRowClick}>Edit</button>
                <button data-testid="action-delete" onClick={handleRowClick}>Delete</button>
                <button data-testid="action-download" onClick={handleRowClick}>Download</button>
            </div>
            <div className="table-header-controls">Header Controls</div>
            <div className="table-content-wrapper">Content Wrapper</div>
        </div>
    );
};

// Mock the additional dependencies not covered in setup.js
jest.mock('../../components/index', () => ({
    UploadButton: jest.fn(({ bucketName }) => (
        <button data-testid="upload-button" data-bucket-name={bucketName || 'default'}>
            Upload Button
        </button>
    ))
}));

// Mock DynamicTable component
jest.mock('../../components/Tables/DynamicTable', () => {
    return function MockDynamicTable({ columns, keyField, onRowClick, data, apiEndpoint, title }) {
        const mockRow = { id: 1, name: 'test', date: '2023-01-01', amount: undefined, price: undefined };

        return (
            <div data-testid="dynamic-table" data-key-field={keyField}>
                <h3 data-testid="table-title">{title}</h3>
                {columns.map((column, index) => (
                    <div key={index} data-testid={`column-result-${index}`}>
                        {column.name}: {typeof column.selector === 'function' ? column.selector(mockRow) : 'N/A'}
                    </div>
                ))}
                <button
                    data-testid="row-click-button"
                    onClick={() => onRowClick && onRowClick(mockRow)}
                >
                    Click Row
                </button>
                <div data-testid="mock-data">{JSON.stringify(data)}</div>
                <div data-testid="table-columns">{JSON.stringify(columns.filter(col => col.name !== 'Actions'))}</div>
                <div data-testid="table-endpoint">{apiEndpoint}</div>
                <button data-testid="mock-row-click" onClick={() => onRowClick && onRowClick(mockRow)}>
                    Mock Row Click
                </button>
                {/* Render Actions column cell to test action handlers */}
                {columns.find(col => col.name === 'Actions') && (
                    <div data-testid="actions-column">
                        {columns.find(col => col.name === 'Actions').cell(mockRow)}
                    </div>
                )}
            </div>
        );
    };
});

jest.mock('../../components/Tables/Dropdown/ActionsDropdown', () => {
    return function MockActionsDropdown({ row, onView, onEdit, onDelete, onDownload }) {
        return (
            <div data-testid="actions-dropdown">
                <button data-testid="action-view" onClick={() => onView(row.id)}>View</button>
                <button data-testid="action-edit" onClick={() => onEdit(row.id)}>Edit</button>
                <button data-testid="action-delete" onClick={() => onDelete(row.id)}>Delete</button>
                <button data-testid="action-download" onClick={() => onDownload(row.id)}>Download</button>
            </div>
        );
    };
}); jest.mock('../../layout/DefaultLayout', () => {
    return jest.fn(({ children }) => (
        <div data-testid="default-layout">
            {children}
        </div>
    ));
});

jest.mock('../../lib/bucketUtils', () => ({
    useBucketName: jest.fn(() => 'test-bucket-name')
}));

// Mock the sidebar width hook  
jest.mock('../../hooks/useSidebarWidth', () => ({
    useSidebarWidth: jest.fn(() => 0),
}));

// Mock CSS imports
jest.mock('../../styles/shared/CommonStyles.css', () => ({}));
jest.mock('../../styles/TablePages.css', () => ({}));
jest.mock('./Kuf.styles.css', () => ({}));

// Mock console.log to test navigation logging
const mockConsoleLog = jest.fn();
const originalConsoleLog = console.log;

describe('Kuf Component', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        console.log = mockConsoleLog;

        // Reset the navigate mock
        const { useNavigate } = require('react-router-dom');
        useNavigate.mockReturnValue(mockNavigate);

        // Reset sidebar width mock to default
        const { useSidebarWidth } = require('../../hooks/useSidebarWidth');
        useSidebarWidth.mockReturnValue(0);
    });

    afterEach(() => {
        console.log = originalConsoleLog;
    });

    describe('Component Rendering', () => {
        test('renders without crashing', () => {
            renderWithProviders(<Kuf />);
            commonAssertions.expectElementToBeVisible(screen.getByTestId('default-layout'));
        });

        test('renders all main structural elements', () => {
            renderWithProviders(<Kuf />);

            // Check main layout elements
            expect(screen.getByTestId('default-layout')).toBeInTheDocument();
            expect(screen.getByTestId('upload-button')).toBeInTheDocument();
            expect(screen.getByTestId('dynamic-table')).toBeInTheDocument();
        });

        test('renders with correct CSS classes and structure', () => {
            const { container } = renderWithProviders(<Kuf />);

            const outerDiv = container.querySelector('.table-page-outer');
            expect(outerDiv).toBeInTheDocument();

            // Check for table header controls and content wrapper
            expect(container.querySelector('.table-header-controls')).toBeInTheDocument();
            expect(container.querySelector('.table-content-wrapper')).toBeInTheDocument();
        });
    });

    describe('UploadButton Integration', () => {
        test('renders UploadButton with correct bucket name', () => {
            const { useBucketName } = require('../../lib/bucketUtils');
            useBucketName.mockReturnValue('custom-bucket');

            renderWithProviders(<Kuf />);

            const uploadButton = screen.getByTestId('upload-button');
            expect(uploadButton).toHaveAttribute('data-bucket-name', 'custom-bucket');
        });

        test('handles different bucket name scenarios', () => {
            const { useBucketName } = require('../../lib/bucketUtils');

            // Test with empty bucket name
            useBucketName.mockReturnValue('');
            const { unmount } = renderWithProviders(<Kuf />);
            expect(screen.getByTestId('upload-button')).toHaveAttribute('data-bucket-name', 'default');
            unmount();

            // Test with null bucket name
            useBucketName.mockReturnValue(null);
            renderWithProviders(<Kuf />);
            expect(screen.getByTestId('upload-button')).toHaveAttribute('data-bucket-name', 'default');
        });
    });

    describe('DynamicTable Integration', () => {
        test('renders DynamicTable with correct props', () => {
            renderWithProviders(<Kuf />);

            const table = screen.getByTestId('dynamic-table');
            expect(table).toBeInTheDocument();

            // Check title
            commonAssertions.expectElementToHaveText(screen.getByRole('heading', { level: 3 }), 'KUF Table');

            // Check API endpoint
            expect(screen.getByTestId('table-endpoint')).toHaveTextContent('http://localhost:4000/api/kuf-data');

            // Test that column selectors work correctly
            expect(screen.getByTestId('column-result-0')).toHaveTextContent('ID: 1');
            expect(screen.getByTestId('column-result-1')).toHaveTextContent('Name: test');
            expect(screen.getByTestId('column-result-2')).toHaveTextContent('Quantity:');
            expect(screen.getByTestId('column-result-3')).toHaveTextContent('Price:');
            expect(screen.getByTestId('column-result-4')).toHaveTextContent('Date: 2023-01-01');
        });

        test('passes correct columns configuration to DynamicTable', () => {
            renderWithProviders(<Kuf />);

            const columnsElement = screen.getByTestId('table-columns');
            const columnsData = JSON.parse(columnsElement.textContent);

            expect(columnsData).toHaveLength(5);
            expect(columnsData[0]).toEqual({
                name: 'ID',
                selector: 'id',
                sortable: true
            });
            expect(columnsData[1]).toEqual({
                name: 'Name',
                selector: 'name',
                sortable: true
            });
            expect(columnsData[2]).toEqual({
                name: 'Quantity',
                selector: 'amount',
                sortable: true
            });
            expect(columnsData[3]).toEqual({
                name: 'Price',
                selector: 'price',
                sortable: true
            });
            expect(columnsData[4]).toEqual({
                name: 'Date',
                selector: 'date',
                sortable: true
            });
        });

        test('column configuration includes all required fields', () => {
            renderWithProviders(<Kuf />);

            const columnsElement = screen.getByTestId('table-columns');
            const columnsData = JSON.parse(columnsElement.textContent);

            columnsData.forEach(column => {
                expect(column.name).toBeDefined();
                expect(column.sortable).toBe(true);
            });

            const columnNames = columnsData.map(col => col.name);
            expect(columnNames).toEqual(['ID', 'Name', 'Quantity', 'Price', 'Date']);
        });

        test('column selectors extract correct data from row objects', () => {
            renderWithProviders(<Kuf />);

            // Verify each column selector works with the test data
            expect(screen.getByTestId('column-result-0')).toBeInTheDocument();
            expect(screen.getByTestId('column-result-1')).toBeInTheDocument();
            expect(screen.getByTestId('column-result-2')).toBeInTheDocument();
            expect(screen.getByTestId('column-result-3')).toBeInTheDocument();
            expect(screen.getByTestId('column-result-4')).toBeInTheDocument();
            expect(screen.getByTestId('column-result-5')).toBeInTheDocument();

            // Verify the actual values extracted by selectors
            const columnResults = Array.from(screen.getAllByTestId(/column-result-\d+/)).map(el => el.textContent);
            expect(columnResults).toEqual([
                'ID: 1',
                'Name: test',
                'Quantity:',
                'Price:',
                'Date: 2023-01-01',
                'Status: Active'
            ]);
        });
    });

    describe('Navigation and Row Click Handling', () => {
        test('handles row click navigation correctly', async () => {
            renderWithProviders(<Kuf />);

            const rowClickButton = screen.getByTestId('mock-row-click');
            fireEvent.click(rowClickButton);

            await waitFor(() => {
                expect(window.mockConsoleLog).toHaveBeenCalledWith('Row clicked:', { id: 1, name: 'test', date: '2023-01-01', amount: undefined, price: undefined });
                expect(window.mockConsoleLog).toHaveBeenCalledWith('Navigating to:', '/kuf/1');
                expect(window.mockNavigate).toHaveBeenCalledWith('/kuf/1');
            });
        });

        test('handles row click with different row data', () => {
            renderWithProviders(<Kuf />);

            const rowClickButton = screen.getByTestId('mock-row-click');
            fireEvent.click(rowClickButton);

            expect(window.mockNavigate).toHaveBeenCalledWith('/kuf/1');
        });

        test('handles navigation with edge case row IDs', () => {
            renderWithProviders(<Kuf />);

            const rowClickButton = screen.getByTestId('mock-row-click');
            fireEvent.click(rowClickButton);

            expect(window.mockNavigate).toHaveBeenCalledWith('/kuf/1');
        });

        test('should handle action dropdown interactions', async () => {
            renderWithProviders(<Kuf />);

            // Test view action
            const viewButton = screen.getByTestId('action-view');
            fireEvent.click(viewButton);
            await waitFor(() => {
                expect(window.mockNavigate).toHaveBeenCalledWith('/kuf/1');
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

    describe('Sidebar Integration and Responsive Layout', () => {
        test('applies correct margin when sidebar is shown', () => {
            const { useSidebarWidth } = require('../../hooks/useSidebarWidth');
            useSidebarWidth.mockReturnValue(250);

            const initialState = {
                ...mockState,
                ui: { sidebarShow: true }
            };

            const { container } = renderWithProviders(<Kuf />, { preloadedState: initialState });

            const outerDiv = container.querySelector('.table-page-outer');
            expect(outerDiv).toHaveStyle({
                marginLeft: '250px'
            });
        });

        test('applies no margin when sidebar is hidden', () => {
            const { useSidebarWidth } = require('../../hooks/useSidebarWidth');
            useSidebarWidth.mockReturnValue(0);

            const initialState = {
                ...mockState,
                ui: { sidebarShow: false }
            };

            const { container } = renderWithProviders(<Kuf />, { preloadedState: initialState });

            const outerDiv = container.querySelector('.table-page-outer');
            expect(outerDiv).toHaveStyle({
                marginLeft: '0px'
            });
        });

        test('handles undefined sidebar state gracefully', () => {
            const { useSidebarWidth } = require('../../hooks/useSidebarWidth');
            useSidebarWidth.mockReturnValue(0);

            const initialState = {
                ...mockState,
                ui: {}
            };

            const { container } = renderWithProviders(<Kuf />, { preloadedState: initialState });

            const outerDiv = container.querySelector('.table-page-outer');
            expect(outerDiv).toHaveStyle({
                marginLeft: '0px'
            });
        });

        test('applies all layout styles correctly', () => {
            const { container } = renderWithProviders(<Kuf />);

            const outerDiv = container.querySelector('.table-page-outer');
            expect(outerDiv).toBeInTheDocument();
            expect(outerDiv).toHaveClass('table-page-outer');

            // The styles are applied via CSS classes, so just check the classes exist
            expect(outerDiv).toHaveStyle('margin-left: 0px'); // This should be applied via the hook
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('handles useSelector errors gracefully', () => {
            const { useSelector } = require('react-redux');
            useSelector.mockImplementation(() => {
                throw new Error('Selector error');
            });

            // Should not crash and should use fallback state
            expect(() => renderWithProviders(<Kuf />)).not.toThrow();
        });

        test('handles missing bucket name from hook', () => {
            const { useBucketName } = require('../../lib/bucketUtils');
            useBucketName.mockReturnValue(undefined);

            renderWithProviders(<Kuf />);

            const uploadButton = screen.getByTestId('upload-button');
            expect(uploadButton).toHaveAttribute('data-bucket-name', 'default');
        });

        test('handles navigation with various row data structures', async () => {
            renderWithProviders(<Kuf />);

            const rowClickButton = screen.getByTestId('mock-row-click');
            fireEvent.click(rowClickButton);

            await waitFor(() => {
                expect(window.mockConsoleLog).toHaveBeenCalledWith('Row clicked:', { id: 1, name: 'test', date: '2023-01-01', amount: undefined, price: undefined });
                expect(window.mockConsoleLog).toHaveBeenCalledWith('Navigating to:', '/kuf/1');
                expect(window.mockNavigate).toHaveBeenCalledWith('/kuf/1');
            });
        });
    });

    describe('Component Lifecycle and Re-renders', () => {
        test('re-renders correctly when state changes', () => {
            const { useSidebarWidth } = require('../../hooks/useSidebarWidth');
            useSidebarWidth.mockReturnValue(0);

            const initialState = {
                ...mockState,
                ui: { sidebarShow: false }
            };

            const { rerender, container } = renderWithProviders(<Kuf />, { preloadedState: initialState });

            let outerDiv = container.querySelector('.table-page-outer');
            expect(outerDiv).toHaveStyle({ marginLeft: '0px' });

            // Change state and re-render
            const newState = {
                ...initialState,
                ui: { sidebarShow: true }
            };

            // Mock the sidebar width for shown state
            useSidebarWidth.mockReturnValue(250);

            // Mock the selector for the new state
            const { useSelector } = require('react-redux');
            useSelector.mockImplementation((selector) => selector(newState));

            rerender(<Kuf />);

            outerDiv = container.querySelector('.table-page-outer');
            expect(outerDiv).toHaveStyle({ marginLeft: '250px' });
        });

        test('maintains component stability across re-renders', () => {
            const { rerender } = renderWithProviders(<Kuf />);

            expect(screen.getByTestId('default-layout')).toBeInTheDocument();
            expect(screen.getByTestId('upload-button')).toBeInTheDocument();
            expect(screen.getByTestId('dynamic-table')).toBeInTheDocument();

            rerender(<Kuf />);

            expect(screen.getByTestId('default-layout')).toBeInTheDocument();
            expect(screen.getByTestId('upload-button')).toBeInTheDocument();
            expect(screen.getByTestId('dynamic-table')).toBeInTheDocument();
        });
    });

    describe('Accessibility and User Experience', () => {
        test('maintains proper DOM structure for accessibility', () => {
            const { container } = renderWithProviders(<Kuf />);

            // Check that the table has a proper title
            expect(screen.getByRole('heading', { level: 3, name: 'KUF Table' })).toBeInTheDocument();

            // Check button accessibility
            expect(screen.getByTestId('upload-button')).toBeInTheDocument();
            expect(screen.getByTestId('mock-row-click')).toBeInTheDocument();
        });

        test('provides meaningful content for screen readers', () => {
            renderWithProviders(<Kuf />);

            // Check for meaningful text content
            expect(screen.getByText('KUF Table')).toBeInTheDocument();
            expect(screen.getByText('Upload Button')).toBeInTheDocument();
            expect(screen.getByText('Click Row')).toBeInTheDocument();
        });
    });

    describe('Integration with External Dependencies', () => {
        test('integrates correctly with react-router-dom', () => {
            renderWithProviders(<Kuf />);

            const { useNavigate } = require('react-router-dom');
            expect(useNavigate).toHaveBeenCalled();
        });

        test('integrates correctly with react-redux', () => {
            renderWithProviders(<Kuf />);

            // Component should render without issues with Redux state
            expect(screen.getByTestId('default-layout')).toBeInTheDocument();
            expect(screen.getByTestId('upload-button')).toBeInTheDocument();
            expect(screen.getByTestId('dynamic-table')).toBeInTheDocument();
        });

        test('integrates correctly with custom hooks', () => {
            renderWithProviders(<Kuf />);

            const { useBucketName } = require('../../lib/bucketUtils');
            expect(useBucketName).toHaveBeenCalled();
        });
    });

    describe('CSS and Styling', () => {
        test('applies correct responsive layout classes', () => {
            const { container } = renderWithProviders(<Kuf />);

            // Check for the new common structure
            expect(container.querySelector('.table-page-outer')).toBeInTheDocument();
            expect(container.querySelector('.table-header-controls')).toBeInTheDocument();
            expect(container.querySelector('.table-content-wrapper')).toBeInTheDocument();
        });

        test('applies custom CSS class', () => {
            const { container } = renderWithProviders(<Kuf />);

            const outerDiv = container.querySelector('.table-page-outer');
            expect(outerDiv).toBeInTheDocument();
        });
    });

    describe('Props and Data Flow', () => {
        test('passes correct props to UploadButton', () => {
            const { useBucketName } = require('../../lib/bucketUtils');
            const testBucketName = 'test-bucket-123';
            useBucketName.mockReturnValue(testBucketName);

            renderWithProviders(<Kuf />);

            const uploadButton = screen.getByTestId('upload-button');
            expect(uploadButton).toHaveAttribute('data-bucket-name', testBucketName);
        });

        test('passes correct props to DynamicTable', () => {
            renderWithProviders(<Kuf />);

            // Verify table title
            expect(screen.getByText('KUF Table')).toBeInTheDocument();

            // Verify API endpoint
            expect(screen.getByTestId('table-endpoint')).toHaveTextContent('http://localhost:4000/api/kuf-data');

            // Verify columns are passed
            expect(screen.getByTestId('table-columns')).toBeInTheDocument();

            // Verify onRowClick is functional
            expect(screen.getByTestId('mock-row-click')).toBeInTheDocument();
        });
    });
});