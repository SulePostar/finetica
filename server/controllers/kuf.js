const {
    getPaginatedKufData,
    getKufById,
    createKufManually,
    processKufDocument,
    approveKufDocument,
    updateKufDocumentData
} = require('../services/kuf');

const getKufData = async (req, res, next) => {
    try {
        const { page, perPage, sortField, sortOrder } = req.query;

        const result = await getPaginatedKufData({
            page: parseInt(page),
            perPage: parseInt(perPage),
            sortField,
            sortOrder,
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getKufDataById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await getKufById(parseInt(id));
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const createKufInvoice = async (req, res, next) => {
    try {
        const invoiceData = req.body;
        const userId = req.user.userId;

        const result = await createKufManually(invoiceData, userId);

        res.json(result)
    } catch (error) {
        next(error);
    }
};

const processKufInvoice = async (req, res, next) => {
    try {
        const { model } = req.body;
        const result = await processKufDocument(req.file.buffer, req.file.mimetype, model);

        res.json(result);
    } catch (error) {
        next(error);
    }
};

const approveKufInvoice = async (req, res, next) => {
    try {
        const { id: invoiceId } = req.params;
        const { userId } = req.user;

        const result = await approveKufDocument(invoiceId, userId);

        res.json(result)
    } catch (error) {
        next(error);
    }
};

const updateKufInvoice = async (req, res, next) => {
    try {
        const { id: invoiceId } = req.params;
        const updatedData = req.body;

        const result = await updateKufDocumentData(invoiceId, updatedData);

        res.json(result)
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getKufData,
    getKufDataById,
    createKufInvoice,
    processKufInvoice,
    approveKufInvoice,
    updateKufInvoice
};
