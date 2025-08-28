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
    partner: {
        getById: PartnerService.getById,
        update: PartnerService.update,
    },
};

export const useDocument = (documentType, id) => {
    const [formData, setFormData] = useState({});
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

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
                documentData = response.data?.data ?? {}; // unwrap nested data
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
    }, [fetchDocument]);

    const handleAction = useCallback(
        async (isSaveOperation = false) => {
            if (!service || !id) return;
            try {
                const { data } = await service.update(id, formData);
                setFormData(data);
                if (isSaveOperation) {
                    setIsEditing(false);
                }
            } catch (err) {
                console.error('Action failed:', err?.response?.status, err?.response?.data || err.message);
            }
        },
        [id, service, formData],
    );

    const handleApprove = () => handleAction(false);
    const handleSave = () => handleAction(true);
    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
        setIsEditing(false);
        fetchDocument();
    };

    return {
        formData,
        setFormData,
        pdfUrl,
        loading,
        error,
        isEditing,
        isApproved,
        handleApprove,
        handleSave,
        handleEdit,
        handleCancel,
    };
};