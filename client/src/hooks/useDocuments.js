import { useCallback, useEffect, useMemo, useState } from 'react';
import BankTransactionsService from '../services/bankTransactions';
import ContractService from '../services/contract';
import KifService from '../services/kif';
import KufService from '../services/kuf';
import PartnerService from '../services/businessPartner';

const documentServiceMap = {
    kif: {
        getById: KifService.getById,
        update: KifService.approve,
    },
    kuf: {
        getById: KufService.getKufById,
        update: KufService.approveKuf,
    },
    contract: {
        getById: ContractService.getById,
        update: ContractService.approve,
    },
    'bank-transactions': {
        getById: BankTransactionsService.getById,
        update: BankTransactionsService.approve,
    },
    'transactions/bank-transaction-data': {
        getById: BankTransactionsService.getById,
        update: BankTransactionsService.approve,
    },
    partner: {
        getById: PartnerService.getById,
        update: PartnerService.update,
    },
};

export const useDocument = (documentType, id, onSaveCallback) => {
    const [formData, setFormData] = useState({});
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const service = useMemo(() => documentServiceMap[documentType], [documentType]);

    const isApproved = useMemo(
        () => Boolean(formData?.approvedAt || formData?.approvedBy || formData?.status === 'approved'),
        [formData],
    );

    const fetchDocument = useCallback(async () => {
        if (!id || !service) {
            setError('Invalid document type or ID.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await service.getById(id);
            let documentData = response.data; // default for most services
            if (documentType === 'partner') {
                documentData = response.data?.data ?? response.data ?? {}; // handle different response structures
            }
            setFormData(documentData);
            setPdfUrl(documentData.pdfUrl || 'https://pdfobject.com/pdf/sample.pdf');
        } catch (err) {
            const msg = err?.response?.data?.message || err.message || 'Failed to load document';
            setError(msg);
            console.error(`GET /${documentType}/:id failed:`, msg);
        } finally {
            setLoading(false);
        }
    }, [id, service, documentType]);

    useEffect(() => {
        fetchDocument();
    }, [id]);

    useEffect(() => {
        setIsSaved(false);
    }, [id]);

    const handleAction = useCallback(
        async (isSaveOperation = false) => {
            if (!service || !id) return;
            try {
                const response = await service.update(id, formData);
                let updated = response.data?.data ?? response.data;

                if (documentType === 'partner') {
                    if (!updated || Object.keys(updated).length === 0) {
                        const refetchResponse = await service.getById(id);
                        updated = refetchResponse.data?.data ?? refetchResponse.data;
                    }
                }

                setFormData(updated);
                if (isSaveOperation) {
                    setIsEditing(false);
                    setIsSaved(true); // Set saved state here

                    // Call the save callback if provided
                    if (onSaveCallback) {
                        onSaveCallback(id);
                    }
                }
                return updated;
            } catch (err) {
                console.error('Action failed:', err?.response?.status, err?.response?.data || err.message);
                throw err;
            }
        },
        [id, service, formData, documentType, onSaveCallback] // Add onSaveCallback to dependencies
    );

    const handleApprove = () => handleAction(false);

    const handleSave = async () => {
        try {
            await handleAction(true);
            setIsSaved(true);

            // Trigger an event for parent table - make sure this is working
            if (documentType === 'partner') {
                window.dispatchEvent(new CustomEvent('partner-saved', { detail: id }));
            }
        } catch (error) {
            console.error('Save failed:', error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setIsSaved(false); // Reset saved state on cancel
        fetchDocument();
    };

    const handleEdit = () => setIsEditing(true);

    return {
        formData,
        setFormData,
        pdfUrl,
        loading,
        error,
        isEditing,
        isApproved,
        isSaved,
        setIsSaved,
        handleApprove,
        handleSave,
        handleEdit,
        handleCancel,
    };
};