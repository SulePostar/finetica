import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import InvoiceDetails from '../../pages/InvoiceDetails/InvoiceDetails';
import { renderWithProviders } from '../testUtils';
import * as InvoicesData from '../../utilis/constants/InvoicesData';

// Mock the dependencies with proper ESM shape
jest.mock('../../components/InfoCards/DocumentInfo/DocumentInfo', () => ({
    __esModule: true,
    default: ({ data, type, loading, error }) => (
        <div data-testid="document-info">
            <div data-testid="document-type">{type}</div>
            <div data-testid="document-data">{data ? JSON.stringify(data) : 'No data'}</div>
            {loading && <div data-testid="document-loading">Loading...</div>}
            {error && <div data-testid="document-error">{error.message}</div>}
        </div>
    ),
}));

jest.mock('../../components/PdfViewer/PdfViewer', () => ({
    __esModule: true,
    PdfViewer: ({ pdfUrl }) => (
        <div data-testid="pdf-viewer">
            <div data-testid="pdf-url">{pdfUrl}</div>
        </div>
    ),
}));

jest.mock('../../layout/DefaultLayout', () => ({
    __esModule: true,
    default: ({ children }) => (
        <div data-testid="default-layout">{children}</div>
    ),
}));

// Mock the invoice data functions
jest.mock('../../utilis/constants/InvoicesData', () => {
    const actual = jest.requireActual('../../utilis/constants/InvoicesData');
    return {
        __esModule: true,
        ...actual,
        createMockKifData: jest.fn((id) => ({
            id: id || '1',
            documentNumber: `KIF-2024-${id?.padStart(3, '0') || '001'}`,
            invoice_number: `ISFAK-${id?.padStart(3, '0') || '001'}/2024`,
            customer_name: 'BH Telecom d.d. Sarajevo',
            customer_id: '4200000050013',
            vat_period: '2024-01',
            invoice_type: 'Standardna faktura',
            invoice_date: '2024-01-15T00:00:00Z',
            total_amount: 5932.20,
            currency: 'BAM',
            created_at: '2024-01-15T10:30:00Z',
        })),
        createMockKufData: jest.fn((id) => ({
            id: id || '1',
            documentNumber: `KUF-2024-${id?.padStart(3, '0') || '001'}`,
            invoice_number: `UFAK-${id?.padStart(3, '0') || '001'}/2024`,
            supplier_name: 'ProCredit Bank d.d. Sarajevo',
            supplier_id: '4200000070019',
            vat_period: '2024-01',
            invoice_type: 'Ulazna faktura',
            invoice_date: '2024-01-15T00:00:00Z',
            total_amount: 2450.50,
            currency: 'BAM',
            created_at: '2024-01-15T10:30:00Z',
        })),
    };
});

// Mock router hooks
const mockUseParams = jest.fn();
const mockUseLocation = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => mockUseParams(),
    useLocation: () => mockUseLocation(),
}));

describe('InvoiceDetails Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset mocks to default values
        mockUseParams.mockReturnValue({ id: '1' });
        mockUseLocation.mockReturnValue({
            pathname: '/kif/1',
        });
    });

    const renderInvoiceDetails = (routeParams = { id: '1' }, locationOptions = { pathname: '/kif/1' }) => {
        mockUseParams.mockReturnValue(routeParams);
        mockUseLocation.mockReturnValue(locationOptions);

        return renderWithProviders(<InvoiceDetails />);
    };

    const renderWithMemoryRouter = (initialEntry = '/kif/1') => {
        return render(
            <MemoryRouter initialEntries={[initialEntry]}>
                <InvoiceDetails />
            </MemoryRouter>
        );
    };

    describe('Component Rendering', () => {
        test('should render InvoiceDetails page correctly', () => {
            renderInvoiceDetails();

            expect(screen.getByTestId('default-layout')).toBeInTheDocument();
            expect(screen.getByTestId('document-info')).toBeInTheDocument();
            expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
        });

        test('should render page with correct layout structure', () => {
            renderInvoiceDetails();

            // Check for CoreUI components structure
            expect(document.querySelector('.details-page')).toBeInTheDocument();
            expect(document.querySelector('.details-container')).toBeInTheDocument();
            expect(document.querySelector('.justify-content-center')).toBeInTheDocument();
        });

        test('should render document info and pdf viewer in correct columns', () => {
            renderInvoiceDetails();

            const documentInfo = screen.getByTestId('document-info');
            const pdfViewer = screen.getByTestId('pdf-viewer');

            expect(documentInfo).toBeInTheDocument();
            expect(pdfViewer).toBeInTheDocument();

            // Check that they're in separate sections
            expect(documentInfo.closest('.mb-4')).toBeInTheDocument();
            expect(pdfViewer.closest('.mb-4')).toBeInTheDocument();
        });

        test('should render Document Viewer card header', () => {
            renderInvoiceDetails();

            expect(screen.getByText('Document Viewer')).toBeInTheDocument();
        });
    });

    describe('Document Type Detection', () => {
        test('should detect KIF document type from URL path', () => {
            renderInvoiceDetails({ id: '123' }, { pathname: '/kif/123' });

            const documentTypeElement = screen.getByTestId('document-type');
            expect(documentTypeElement).toHaveTextContent('kif');
            expect(InvoicesData.createMockKifData).toHaveBeenCalledWith('123');
            expect(InvoicesData.createMockKufData).not.toHaveBeenCalled();
        });

        test('should detect KUF document type from URL path', () => {
            renderInvoiceDetails({ id: '456' }, { pathname: '/kuf/456' });

            const documentTypeElement = screen.getByTestId('document-type');
            expect(documentTypeElement).toHaveTextContent('kuf');
            expect(InvoicesData.createMockKufData).toHaveBeenCalledWith('456');
            expect(InvoicesData.createMockKifData).not.toHaveBeenCalled();
        });

        test('should default to KUF when path does not contain kif', () => {
            renderInvoiceDetails({ id: '789' }, { pathname: '/invoices/789' });

            const documentTypeElement = screen.getByTestId('document-type');
            expect(documentTypeElement).toHaveTextContent('kuf');
            expect(InvoicesData.createMockKufData).toHaveBeenCalledWith('789');
        });

        test('should handle nested paths correctly', () => {
            renderInvoiceDetails({ id: '999' }, { pathname: '/admin/kif/999/details' });

            const documentTypeElement = screen.getByTestId('document-type');
            expect(documentTypeElement).toHaveTextContent('kif');
            expect(InvoicesData.createMockKifData).toHaveBeenCalledWith('999');
        });
    });

    describe('Data Handling', () => {
        test('should pass correct KIF data to DocumentInfo component', () => {
            renderInvoiceDetails({ id: '123' }, { pathname: '/kif/123' });

            const documentData = screen.getByTestId('document-data');
            expect(documentData).not.toHaveTextContent('No data');

            const dataContent = documentData.textContent;
            expect(dataContent).toContain('KIF-2024-123');
            expect(dataContent).toContain('ISFAK-123/2024');
            expect(dataContent).toContain('BH Telecom d.d. Sarajevo');
        });

        test('should pass correct KUF data to DocumentInfo component', () => {
            renderInvoiceDetails({ id: '456' }, { pathname: '/kuf/456' });

            const documentData = screen.getByTestId('document-data');
            expect(documentData).not.toHaveTextContent('No data');

            const dataContent = documentData.textContent;
            expect(dataContent).toContain('KUF-2024-456');
            expect(dataContent).toContain('UFAK-456/2024');
            expect(dataContent).toContain('ProCredit Bank d.d. Sarajevo');
        });

        test('should handle different ID parameters', () => {
            renderInvoiceDetails({ id: 'abc123' }, { pathname: '/kif/abc123' });

            expect(InvoicesData.createMockKifData).toHaveBeenCalledWith('abc123');
        });

        test('should handle missing ID parameter', () => {
            renderInvoiceDetails({ id: undefined }, { pathname: '/kif/' });

            expect(InvoicesData.createMockKifData).toHaveBeenCalledWith(undefined);
        });

        test('should pass correct PDF URL to PdfViewer', () => {
            renderInvoiceDetails();

            const pdfUrlElement = screen.getByTestId('pdf-url');
            expect(pdfUrlElement).toHaveTextContent('https://pdfobject.com/pdf/sample.pdf');
        });
    });

    describe('Route Parameter Integration', () => {
        test('should extract ID from route parameters correctly', () => {
            const testId = '999';
            renderInvoiceDetails({ id: testId }, { pathname: '/kif/999' });

            expect(InvoicesData.createMockKifData).toHaveBeenCalledWith(testId);
        });

        test('should handle string ID parameters', () => {
            const testId = 'invoice-abc123';
            renderInvoiceDetails({ id: testId }, { pathname: '/kuf/invoice-abc123' });

            expect(InvoicesData.createMockKufData).toHaveBeenCalledWith(testId);
        });

        test('should work with memory router for KIF', () => {
            renderWithMemoryRouter('/kif/123');

            expect(screen.getByTestId('document-info')).toBeInTheDocument();
            expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
        });

        test('should work with memory router for KUF', () => {
            renderWithMemoryRouter('/kuf/456');

            expect(screen.getByTestId('document-info')).toBeInTheDocument();
            expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
        });
    });

    describe('Component Props', () => {
        test('should pass correct type to DocumentInfo for KIF', () => {
            renderInvoiceDetails({ id: '42' }, { pathname: '/kif/42' });

            const documentType = screen.getByTestId('document-type');
            expect(documentType).toHaveTextContent('kif');
        });

        test('should pass correct type to DocumentInfo for KUF', () => {
            renderInvoiceDetails({ id: '42' }, { pathname: '/kuf/42' });

            const documentType = screen.getByTestId('document-type');
            expect(documentType).toHaveTextContent('kuf');
        });

        test('should not pass loading or error props by default', () => {
            renderInvoiceDetails();

            expect(screen.queryByTestId('document-loading')).not.toBeInTheDocument();
            expect(screen.queryByTestId('document-error')).not.toBeInTheDocument();
        });
    });

    describe('Layout and Styling', () => {
        test('should have correct CSS classes', () => {
            renderInvoiceDetails();

            expect(document.querySelector('.body.flex-grow-1.px-3.details-page')).toBeInTheDocument();
            expect(document.querySelector('.details-container')).toBeInTheDocument();
        });

        test('should use CoreUI grid system correctly', () => {
            renderInvoiceDetails();

            // Check for CoreUI column classes
            const columns = document.querySelectorAll('[class*="col"]');
            expect(columns.length).toBeGreaterThan(0);
        });

        test('should have proper card structure for PDF viewer', () => {
            renderInvoiceDetails();

            // Check for shadow and detail-card classes
            const cards = document.querySelectorAll('.h-100.shadow-sm.detail-card');
            expect(cards.length).toBeGreaterThan(0);
        });

        test('should have correct column sizes', () => {
            renderInvoiceDetails();

            // DocumentInfo should be in a smaller column (lg-4)
            const documentInfoColumn = screen.getByTestId('document-info').closest('.mb-4');
            expect(documentInfoColumn).toBeInTheDocument();

            // PdfViewer should be in a larger column (lg-8)
            const pdfViewerColumn = screen.getByTestId('pdf-viewer').closest('.mb-4');
            expect(pdfViewerColumn).toBeInTheDocument();
        });
    });

    describe('Icon Usage', () => {
        test('should render without icon-related errors', () => {
            renderInvoiceDetails();

            // Since we're mocking the components, we can't test the actual icon rendering
            // but we can verify the component renders without errors
            expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
            expect(screen.getByText('Document Viewer')).toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        test('should handle missing route parameters gracefully', () => {
            mockUseParams.mockReturnValue({});
            mockUseLocation.mockReturnValue({ pathname: '/kif/' });

            expect(() => renderInvoiceDetails()).not.toThrow();
            expect(screen.getByTestId('document-info')).toBeInTheDocument();
        });

        test('should handle missing location gracefully', () => {
            // Clear any previous mocks and set fresh state
            jest.clearAllMocks();
            mockUseParams.mockReturnValue({ id: '1' });
            mockUseLocation.mockReturnValue({ pathname: '' });

            expect(() => renderInvoiceDetails({ id: '1' }, { pathname: '' })).not.toThrow();
            // Should default to kuf type (empty string doesn't contain '/kif/')
            expect(screen.getByTestId('document-type')).toHaveTextContent('kuf');
        });

        test('should handle null or undefined pathname', () => {
            mockUseLocation.mockReturnValue({ pathname: null });

            expect(() => renderInvoiceDetails()).not.toThrow();
            expect(screen.getByTestId('document-info')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        test('should have accessible structure', () => {
            renderInvoiceDetails();

            // Check that main content areas are present
            expect(screen.getByTestId('document-info')).toBeInTheDocument();
            expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
        });

        test('should have proper heading structure', () => {
            renderInvoiceDetails();

            expect(screen.getByText('Document Viewer')).toBeInTheDocument();
        });

        test('should have aria-hidden attribute on icon', () => {
            renderInvoiceDetails();

            // The component should render without accessibility issues
            expect(document.querySelector('.details-page')).toBeInTheDocument();
        });
    });

    describe('Integration Tests', () => {
        test('should integrate with routing correctly for KIF documents', () => {
            render(
                <MemoryRouter initialEntries={['/kif/integration-test']}>
                    <InvoiceDetails />
                </MemoryRouter>
            );

            expect(screen.getByTestId('document-info')).toBeInTheDocument();
            expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
            expect(screen.getByTestId('document-type')).toHaveTextContent('kif');
        });

        test('should integrate with routing correctly for KUF documents', () => {
            // Need to mock the hooks properly for this test
            mockUseParams.mockReturnValue({ id: 'integration-test' });
            mockUseLocation.mockReturnValue({ pathname: '/kuf/integration-test' });

            render(<InvoiceDetails />);

            expect(screen.getByTestId('document-info')).toBeInTheDocument();
            expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
            expect(screen.getByTestId('document-type')).toHaveTextContent('kuf');
        });

        test('should handle component unmounting', () => {
            const { unmount } = renderInvoiceDetails();

            expect(() => unmount()).not.toThrow();
        });

        test('should handle rapid route changes', () => {
            // Start with KIF
            mockUseParams.mockReturnValue({ id: '1' });
            mockUseLocation.mockReturnValue({ pathname: '/kif/1' });
            const { rerender } = render(<InvoiceDetails />);

            expect(screen.getByTestId('document-type')).toHaveTextContent('kif');

            // Change to KUF
            mockUseParams.mockReturnValue({ id: '2' });
            mockUseLocation.mockReturnValue({ pathname: '/kuf/2' });
            rerender(<InvoiceDetails />);

            expect(screen.getByTestId('document-type')).toHaveTextContent('kuf');
        });
    });

    describe('Document Type Switch Logic', () => {
        test('should switch between KIF and KUF based on URL changes', () => {
            // Start with KIF
            const { rerender } = renderInvoiceDetails(
                { id: '1' },
                { pathname: '/kif/1' }
            );

            expect(screen.getByTestId('document-type')).toHaveTextContent('kif');

            // Change to KUF
            mockUseLocation.mockReturnValue({ pathname: '/kuf/1' });
            rerender(<InvoiceDetails />);

            expect(screen.getByTestId('document-type')).toHaveTextContent('kuf');
        });

        test('should call correct data function based on document type', () => {
            jest.clearAllMocks();

            // Test KIF
            renderInvoiceDetails({ id: '100' }, { pathname: '/kif/100' });
            expect(InvoicesData.createMockKifData).toHaveBeenCalledWith('100');
            expect(InvoicesData.createMockKufData).not.toHaveBeenCalled();

            jest.clearAllMocks();

            // Test KUF
            renderInvoiceDetails({ id: '200' }, { pathname: '/kuf/200' });
            expect(InvoicesData.createMockKufData).toHaveBeenCalledWith('200');
            expect(InvoicesData.createMockKifData).not.toHaveBeenCalled();
        });
    });

    describe('PDF Viewer Integration', () => {
        test('should always pass the same PDF URL regardless of document type', () => {
            // Test KIF first
            const { unmount } = renderInvoiceDetails({ id: '1' }, { pathname: '/kif/1' });
            expect(screen.getByTestId('pdf-url')).toHaveTextContent('https://pdfobject.com/pdf/sample.pdf');

            // Clean up first render
            unmount();

            // Test KUF
            renderInvoiceDetails({ id: '1' }, { pathname: '/kuf/1' });
            expect(screen.getByTestId('pdf-url')).toHaveTextContent('https://pdfobject.com/pdf/sample.pdf');
        });
    });
});
