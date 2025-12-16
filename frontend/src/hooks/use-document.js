import { useCallback, useEffect, useMemo, useState } from 'react';
import { getKufById, approveKuf } from '@/api/Kuf';
import { getKifsById, approveKif } from '@/api/Kif';
import { getContractById, approveContract } from '@/api/contracts';
import { getBankTransactionById, approveBankTransaction } from '@/api/BankTransactions';

const documentServiceMap = {
    kif: {
        getById: getKifsById,
        approve: approveKif
    },
    kuf: {
        getById: getKufById,
        approve: approveKuf
    },
    contract: {
        getById: getContractById,
        approve: approveContract
    },
    'bank-transactions': {
        getById: getBankTransactionById,
        approve: approveBankTransaction
    },
    partner: {
        getById: (id) => {
            console.warn('Partner getById not implemented');
            return Promise.resolve({ data: {} });
        },
        approve: (id, payload) => {
            console.warn('Partner approve not implemented');
            return Promise.resolve({ data: payload });
        }
    }
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

            // Handle different response structures
            let documentData = response?.data?.data || response?.data || response;

            setFormData(documentData);

            // Use pdfUrl directly from the backend response
            if (documentData?.pdfUrl) {
                setPdfUrl(documentData.pdfUrl);
            } else {
                setPdfUrl(null);
            }
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
    }, [fetchDocument]);

    useEffect(() => {
        setIsSaved(false);
    }, [id]);

    const handleAction = useCallback(
        async (isSaveOperation = false) => {
            if (!service || !id) return;
            try {
                const response = await service.approve({ id, ...formData });
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
                    setIsSaved(true);

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
        [id, service, formData, documentType, onSaveCallback]
    );

    const handleApprove = () => handleAction(false);

    const handleSave = async () => {
        try {
            await handleAction(true);
            setIsSaved(true);

            if (documentType === 'partner') {
                window.dispatchEvent(new CustomEvent('partner-saved', { detail: id }));
            }
        } catch (error) {
            console.error('Save failed:', error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setIsSaved(false);
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