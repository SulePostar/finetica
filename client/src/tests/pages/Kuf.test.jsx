import { screen, fireEvent, waitFor } from '@testing-library/react';
import Kuf from '../../pages/kuf/Kuf.jsx';
import { renderWithProviders, commonAssertions, mockState } from '../../tests/testUtils';

// Mock the additional dependencies not covered in setup.js
jest.mock('../../components/index', () => ({
    UploadButton: jest.fn(({ bucketName }) => (
        <button data-testid="upload-button" data-bucket-name={bucketName || 'default'}>
            Upload Button
        </button>
    ))
}));

jest.mock('../../components/Tables/DynamicTable', () => {
    return jest.fn(({ title, columns, apiEndpoint, onRowClick }) => (
        <div data-testid="dynamic-table">
            <h3>{title}</h3>
            <div data-testid="table-endpoint">{apiEndpoint}</div>
            <div data-testid="table-columns">{JSON.stringify(columns.map(col => ({ name: col.name, sortable: col.sortable })))}</div>
            <button
                data-testid="mock-row-click"
                onClick={() => onRowClick({ id: 123, name: 'Test Item' })}
            >
                Click Row
            </button>
        </div>
    ));
});

jest.mock('../../layout/DefaultLayout', () => {
    return jest.fn(({ children }) => (
        <div data-testid="default-layout">
            {children}
        </div>
    ));
});

jest.mock('../../lib/bucketUtils', () => ({
    useBucketName: jest.fn(() => 'test-bucket-name')
}));

// Mock CSS import
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

            const outerDiv = container.querySelector('.kuf-table-outer');
            expect(outerDiv).toBeInTheDocument();

            // Check for Bootstrap classes
            expect(container.querySelector('.w-100')).toBeInTheDocument();
            expect(container.querySelector('.d-flex')).toBeInTheDocument();
            expect(container.querySelector('.justify-content-end')).toBeInTheDocument();
            expect(container.querySelector('.justify-content-center')).toBeInTheDocument();
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
        });

        test('passes correct columns configuration to DynamicTable', () => {
            renderWithProviders(<Kuf />);

            const columnsElement = screen.getByTestId('table-columns');
            const columnsData = JSON.parse(columnsElement.textContent);

            expect(columnsData).toHaveLength(5);
            expect(columnsData[0]).toEqual({
                name: 'ID',
                sortable: true
            });
            expect(columnsData[1]).toEqual({
                name: 'Name',
                sortable: true
            });
            expect(columnsData[2]).toEqual({
                name: 'Quantity',
                sortable: true
            });
            expect(columnsData[3]).toEqual({
                name: 'Price',
                sortable: true
            });
            expect(columnsData[4]).toEqual({
                name: 'Date',
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
    });

    describe('Navigation and Row Click Handling', () => {
        test('handles row click navigation correctly', async () => {
            renderWithProviders(<Kuf />);

            const rowClickButton = screen.getByTestId('mock-row-click');
            fireEvent.click(rowClickButton);

            await waitFor(() => {
                expect(mockConsoleLog).toHaveBeenCalledWith('Row clicked:', { id: 123, name: 'Test Item' });
                expect(mockConsoleLog).toHaveBeenCalledWith('Navigating to:', '/kuf/123');
                expect(mockNavigate).toHaveBeenCalledWith('/kuf/123');
            });
        });

        test('handles row click with different row data', async () => {
            const DynamicTableMock = require('../../components/Tables/DynamicTable');

            DynamicTableMock.mockImplementationOnce(({ onRowClick }) => (
                <div data-testid="dynamic-table">
                    <button
                        data-testid="custom-row-click"
                        onClick={() => onRowClick({ id: 456, name: 'Another Item', price: 199.99 })}
                    >
                        Click Row
                    </button>
                </div>
            ));

            renderWithProviders(<Kuf />);

            const rowClickButton = screen.getByTestId('custom-row-click');
            fireEvent.click(rowClickButton);

            await waitFor(() => {
                expect(mockConsoleLog).toHaveBeenCalledWith('Row clicked:', { id: 456, name: 'Another Item', price: 199.99 });
                expect(mockConsoleLog).toHaveBeenCalledWith('Navigating to:', '/kuf/456');
                expect(mockNavigate).toHaveBeenCalledWith('/kuf/456');
            });
        });

        test('handles navigation with edge case row IDs', async () => {
            const DynamicTableMock = require('../../components/Tables/DynamicTable');

            // Test with string ID
            DynamicTableMock.mockImplementationOnce(({ onRowClick }) => (
                <div data-testid="dynamic-table">
                    <button
                        data-testid="string-id-click"
                        onClick={() => onRowClick({ id: 'abc-123', name: 'String ID Item' })}
                    >
                        Click Row
                    </button>
                </div>
            ));

            renderWithProviders(<Kuf />);

            fireEvent.click(screen.getByTestId('string-id-click'));

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/kuf/abc-123');
            });
        });
    });

    describe('Sidebar Integration and Responsive Layout', () => {
        test('applies correct margin when sidebar is shown', () => {
            const initialState = {
                ...mockState,
                ui: { sidebarShow: true }
            };

            const { container } = renderWithProviders(<Kuf />, { initialState });

            const outerDiv = container.querySelector('.kuf-table-outer');
            expect(outerDiv).toHaveStyle({
                marginLeft: '250px',
                transition: 'margin-left 0.3s'
            });
        });

        test('applies no margin when sidebar is hidden', () => {
            const initialState = {
                ...mockState,
                ui: { sidebarShow: false }
            };

            const { container } = renderWithProviders(<Kuf />, { initialState });

            const outerDiv = container.querySelector('.kuf-table-outer');
            expect(outerDiv).toHaveStyle({
                marginLeft: '0px',
                transition: 'margin-left 0.3s'
            });
        });

        test('handles undefined sidebar state gracefully', () => {
            const initialState = {
                ...mockState,
                ui: {}
            };

            const { container } = renderWithProviders(<Kuf />, { initialState });

            const outerDiv = container.querySelector('.kuf-table-outer');
            expect(outerDiv).toHaveStyle({
                marginLeft: '0px'
            });
        });

        test('applies all layout styles correctly', () => {
            const { container } = renderWithProviders(<Kuf />);

            const outerDiv = container.querySelector('.kuf-table-outer');
            expect(outerDiv).toHaveStyle({
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0'
            });
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
            const DynamicTableMock = require('../../components/Tables/DynamicTable');

            // Test with minimal row data
            DynamicTableMock.mockImplementationOnce(({ onRowClick }) => (
                <div data-testid="dynamic-table">
                    <button
                        data-testid="minimal-row-click"
                        onClick={() => onRowClick({ id: null })}
                    >
                        Click Row
                    </button>
                </div>
            ));

            renderWithProviders(<Kuf />);

            const rowClickButton = screen.getByTestId('minimal-row-click');
            fireEvent.click(rowClickButton);

            await waitFor(() => {
                expect(mockConsoleLog).toHaveBeenCalledWith('Row clicked:', { id: null });
                expect(mockConsoleLog).toHaveBeenCalledWith('Navigating to:', '/kuf/null');
                expect(mockNavigate).toHaveBeenCalledWith('/kuf/null');
            });
        });
    });

    describe('Component Lifecycle and Re-renders', () => {
        test('re-renders correctly when state changes', () => {
            const initialState = {
                ...mockState,
                ui: { sidebarShow: false }
            };

            const { rerender, container } = renderWithProviders(<Kuf />, { initialState });

            let outerDiv = container.querySelector('.kuf-table-outer');
            expect(outerDiv).toHaveStyle({ marginLeft: '0px' });

            // Change state and re-render
            const newState = {
                ...initialState,
                ui: { sidebarShow: true }
            };

            // Mock the selector for the new state
            const { useSelector } = require('react-redux');
            useSelector.mockImplementation((selector) => selector(newState));

            rerender(<Kuf />);

            outerDiv = container.querySelector('.kuf-table-outer');
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

            const { useSelector } = require('react-redux');
            expect(useSelector).toHaveBeenCalled();
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

            // Check for Bootstrap utility classes
            expect(container.querySelector('.w-100')).toBeInTheDocument();
            expect(container.querySelector('.d-flex')).toBeInTheDocument();
            expect(container.querySelector('.justify-content-end')).toBeInTheDocument();
            expect(container.querySelector('.align-items-center')).toBeInTheDocument();
            expect(container.querySelector('.mb-3')).toBeInTheDocument();
            expect(container.querySelector('.justify-content-center')).toBeInTheDocument();
            expect(container.querySelector('.flex-grow-1')).toBeInTheDocument();
        });

        test('applies custom CSS class', () => {
            const { container } = renderWithProviders(<Kuf />);

            const outerDiv = container.querySelector('.kuf-table-outer');
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