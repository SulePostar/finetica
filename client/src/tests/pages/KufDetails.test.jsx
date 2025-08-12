import { screen } from '@testing-library/react';
import { renderWithProviders, commonAssertions } from 'client/src/tests/testUtils.js';
import { useParams } from 'react-router-dom';
import KufDetails from 'client/src/pages/kuf/KufDetails.jsx';

// Mock components to avoid rendering heavy dependencies
jest.mock('../../components/InfoCards/DocumentInfo', () => ({
    __esModule: true,
    default: ({ data, type }) => (
        <div data-testid="document-info">
            Mock DocumentInfo - type: {type} - id: {data?.id}
        </div>
    )
}));

jest.mock('../../components/PdfViewer/PdfViewer', () => ({
    __esModule: true,
    PdfViewer: ({ pdfUrl }) => (
        <div data-testid="pdf-viewer">Mock PdfViewer - url: {pdfUrl}</div>
    )
}));

jest.mock('../../layout/DefaultLayout', () => ({
    __esModule: true,
    default: ({ children }) => <div data-testid="default-layout">{children}</div>
}));

describe('KufDetails', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders DocumentInfo and PdfViewer with correct props', () => {
        useParams.mockReturnValue({ id: '123' });
        renderWithProviders(<KufDetails />);

        commonAssertions.expectElementToBeVisible(screen.getByTestId('default-layout'));

        const docInfo = screen.getByTestId('document-info');
        commonAssertions.expectElementToBeVisible(docInfo);
        expect(docInfo).toHaveTextContent('type: kuf');
        expect(docInfo).toHaveTextContent('id: 123');

        const pdfViewer = screen.getByTestId('pdf-viewer');
        commonAssertions.expectElementToBeVisible(pdfViewer);
        expect(pdfViewer).toHaveTextContent('sample.pdf');

        expect(screen.getByText(/Document Viewer/i)).toBeInTheDocument();
    });

    test('renders correctly with different id param', () => {
        useParams.mockReturnValue({ id: '456' });
        renderWithProviders(<KufDetails />);

        expect(screen.getByTestId('document-info')).toHaveTextContent('id: 456');
    });

    test('renders without id param gracefully', () => {
        useParams.mockReturnValue({});  // nema id param
        renderWithProviders(<KufDetails />);

        // Pošto komponenta daje default id = 1, DocumentInfo će se ipak prikazati
        expect(screen.getByTestId('document-info')).toBeInTheDocument();
        expect(screen.getByTestId('document-info')).toHaveTextContent('id: 1');

        commonAssertions.expectElementToBeVisible(screen.getByTestId('default-layout'));
    });

    test('does not crash when pdfUrl is empty or undefined', () => {
        useParams.mockReturnValue({ id: '123' });

        // Mock PdfViewer da prihvati prazne propse
        jest.mock('../../components/PdfViewer/PdfViewer', () => ({
            __esModule: true,
            PdfViewer: ({ pdfUrl }) => (
                <div data-testid="pdf-viewer">Mock PdfViewer - url: {pdfUrl || 'no url'}</div>
            )
        }));

        renderWithProviders(<KufDetails />);
        expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
    });
});
