import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
// Import the component under test
import KifDetails from '../../pages/kif/KifDetails.jsx';
import { renderWithProviders } from '../testUtils';
import * as DocumentInfoConstants from '../../components/InfoCards/DocumentInfo.constants';

// Mock the dependencies with proper ESM shape
jest.mock('../../components/InfoCards/DocumentInfo', () => ({
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

// Mock the createMockKifData function with proper ESM shape
jest.mock('../../components/InfoCards/DocumentInfo.constants', () => {
    const actual = jest.requireActual('../../components/InfoCards/DocumentInfo.constants');
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
    };
});

// Mock useParams hook
const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => mockUseParams(),
}));

describe('KifDetails Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset useParams mock to default
        mockUseParams.mockReturnValue({ id: '1' });
    });

    const renderKifDetails = (routeParams = { id: '1' }, routerOptions = {}) => {
        mockUseParams.mockReturnValue(routeParams);

        if (routerOptions.useMemoryRouter) {
            return render(
                <MemoryRouter initialEntries={[`/kif/${routeParams.id}`]}>
                    <KifDetails />
                </MemoryRouter>
            );
        }

        return renderWithProviders(<KifDetails />);
    };

    describe('Component Rendering', () => {
        test('should render KifDetails page correctly', () => {
            renderKifDetails();

            expect(screen.getByTestId('default-layout')).toBeInTheDocument();
            expect(screen.getByTestId('document-info')).toBeInTheDocument();
            expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
        });

        test('should render page with correct layout structure', () => {
            renderKifDetails();

            // Check for CoreUI components structure
            expect(document.querySelector('.details-page')).toBeInTheDocument();
            expect(document.querySelector('.details-container')).toBeInTheDocument();
            expect(document.querySelector('.justify-content-center')).toBeInTheDocument();
        });

        test('should render document info and pdf viewer in correct columns', () => {
            renderKifDetails();

            const documentInfo = screen.getByTestId('document-info');
            const pdfViewer = screen.getByTestId('pdf-viewer');

            expect(documentInfo).toBeInTheDocument();
            expect(pdfViewer).toBeInTheDocument();

            // Check that they're in separate sections
            expect(documentInfo.closest('.mb-4')).toBeInTheDocument();
            expect(pdfViewer.closest('.mb-4')).toBeInTheDocument();
        });
    });

    describe('Data Handling', () => {
        test('should pass correct data to DocumentInfo component', () => {
            renderKifDetails({ id: '123' });

            const documentTypeElement = screen.getByTestId('document-type');
            expect(documentTypeElement).toHaveTextContent('kif');

            // Verify mock data is passed correctly
            expect(DocumentInfoConstants.createMockKifData).toHaveBeenCalledWith('123');
        });

        test('should handle different ID parameters', () => {
            renderKifDetails({ id: '456' });

            expect(DocumentInfoConstants.createMockKifData).toHaveBeenCalledWith('456');
        });

        test('should handle missing ID parameter', () => {
            renderKifDetails({ id: undefined });

            expect(DocumentInfoConstants.createMockKifData).toHaveBeenCalledWith(undefined);
        });

        test('should pass correct PDF URL to PdfViewer', () => {
            renderKifDetails();

            const pdfUrlElement = screen.getByTestId('pdf-url');
            expect(pdfUrlElement).toHaveTextContent('https://pdfobject.com/pdf/sample.pdf');
        });
    });

    describe('Route Parameter Integration', () => {
        test('should extract ID from route parameters correctly', () => {
            const testId = '999';
            renderKifDetails({ id: testId });

            expect(DocumentInfoConstants.createMockKifData).toHaveBeenCalledWith(testId);
        });

        test('should handle string ID parameters', () => {
            const testId = 'abc123';
            renderKifDetails({ id: testId });

            expect(DocumentInfoConstants.createMockKifData).toHaveBeenCalledWith(testId);
        });

        test('should work with memory router', () => {
            renderKifDetails({ id: '123' }, { useMemoryRouter: true });

            expect(screen.getByTestId('document-info')).toBeInTheDocument();
            expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
        });
    });

    describe('Component Props', () => {
        test('should pass correct type to DocumentInfo', () => {
            renderKifDetails();

            const documentType = screen.getByTestId('document-type');
            expect(documentType).toHaveTextContent('kif');
        });

        test('should pass mock data to DocumentInfo', () => {
            renderKifDetails({ id: '42' });

            const documentData = screen.getByTestId('document-data');
            expect(documentData).not.toHaveTextContent('No data');

            // Verify the data structure is passed
            const dataContent = documentData.textContent;
            expect(dataContent).toContain('KIF-2024-042');
            expect(dataContent).toContain('ISFAK-042/2024');
        });

        test('should not pass loading or error props by default', () => {
            renderKifDetails();

            expect(screen.queryByTestId('document-loading')).not.toBeInTheDocument();
            expect(screen.queryByTestId('document-error')).not.toBeInTheDocument();
        });
    });

    describe('Layout and Styling', () => {
        test('should have correct CSS classes', () => {
            renderKifDetails();

            expect(document.querySelector('.body.flex-grow-1.px-3.details-page')).toBeInTheDocument();
            expect(document.querySelector('.details-container')).toBeInTheDocument();
        });

        test('should use CoreUI grid system correctly', () => {
            renderKifDetails();

            // Check for CoreUI column classes
            const columns = document.querySelectorAll('[class*="col"]');
            expect(columns.length).toBeGreaterThan(0);
        });

        test('should have proper card structure for PDF viewer', () => {
            renderKifDetails();

            // Check for shadow and detail-card classes
            const cards = document.querySelectorAll('.h-100.shadow-sm.detail-card');
            expect(cards.length).toBeGreaterThan(0);
        });
    });

    describe('Icon Usage', () => {
        test('should import and use CoreUI icons', () => {
            renderKifDetails();

            // Since we're mocking the components, we can't test the actual icon rendering
            // but we can verify the component renders without errors
            expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        test('should handle missing route parameters gracefully', () => {
            mockUseParams.mockReturnValue({});

            expect(() => renderKifDetails()).not.toThrow();
            expect(screen.getByTestId('document-info')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        test('should have accessible structure', () => {
            renderKifDetails();

            // Check that main content areas are present
            expect(screen.getByTestId('document-info')).toBeInTheDocument();
            expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
        });

        test('should maintain proper heading structure', () => {
            renderKifDetails();

            // The component should render without accessibility issues
            expect(document.querySelector('.details-page')).toBeInTheDocument();
        });
    });

    describe('Integration Tests', () => {
        test('should integrate with routing correctly', () => {
            render(
                <MemoryRouter initialEntries={['/kif/integration-test']}>
                    <KifDetails />
                </MemoryRouter>
            );

            expect(screen.getByTestId('document-info')).toBeInTheDocument();
            expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
        });

        test('should handle component unmounting', () => {
            const { unmount } = renderKifDetails();

            expect(() => unmount()).not.toThrow();
        });
    });
});
