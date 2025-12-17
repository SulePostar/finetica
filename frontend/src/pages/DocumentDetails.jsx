import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentFetcher } from '@/hooks/use-document';
const DocumentDetails = () => {
    // 1. Uzimamo ID i TIP iz URL-a (npr. /documents/kuf/123)
    const { type, id } = useParams();
    const navigate = useNavigate();
    // 2. Pozivamo naš pametni hook
    // Ovo automatski hendla loading, caching i fetching
    const {
        data: document,
        isLoading,
        isError,
        error
    } = useDocumentFetcher(type, id);
    // 3. Renderovanje stanja
    if (isLoading) {
        return <div className="p-10 text-center">Učitavanje dokumenta...</div>;
    }
    if (isError) {
        return (
            <div className="p-10 text-red-500">
                Došlo je do greške: {error.message}
            </div>
        );
    }
    if (!document) {
        return <div>Dokument nije pronađen.</div>;
    }
    // 4. Prikaz podataka
    // Ovde možeš imati generički prikaz ili specifične sekcije
    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold uppercase">
                    {type} Detalji
                </h1>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Nazad
                </button>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
                {/* Primer prikaza zajedničkih polja */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-gray-500 block">ID Dokumenta:</span>
                        <span className="font-medium">{document.id}</span>
                    </div>
                    {/* Uslovni prikaz zavisno od tipa polja koja postoje u objektu */}
                    {document.invoiceNumber && (
                        <div>
                            <span className="text-gray-500 block">Broj Fakture:</span>
                            <span className="font-medium">{document.invoiceNumber}</span>
                        </div>
                    )}
                    {document.partnerName && (
                        <div>
                            <span className="text-gray-500 block">Partner:</span>
                            <span className="font-medium">{document.partnerName}</span>
                        </div>
                    )}
                    {document.amount && (
                        <div>
                            <span className="text-gray-500 block">Iznos:</span>
                            <span className="font-medium">{document.amount} KM</span>
                        </div>
                    )}
                </div>
                {/* Ovde možeš dump-ovati sve podatke dok razvijaš da vidiš šta imaš */}
                {/* <pre className="mt-6 bg-gray-50 p-4 text-xs">{JSON.stringify(document, null, 2)}</pre> */}
            </div>
        </div>
    );
};
export default DocumentDetails;









