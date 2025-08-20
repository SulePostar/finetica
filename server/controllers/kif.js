const {
    getPaginatedKifData,
    getKifById,
    createKifManually,
    processKifDocument,
    approveKifDocument,
    updateKifDocumentData
} = require('../services/kif');

const getKifData = async (req, res, next) => {
    try {
        const { page, perPage, sortField, sortOrder } = req.query;

        const result = await getPaginatedKifData({
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

const getKifDataById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await getKifById(parseInt(id));
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const createKifInvoice = async (req, res, next) => {
    try {
        const invoiceData = req.body;
        const userId = req.user.userId;

        const result = await createKifManually(invoiceData, userId);

        res.json(result)
    } catch (error) {
        next(error);
    }
};

const processKifInvoice = async (req, res, next) => {
    try {
        const { model } = req.body;
        const result = await processKifDocument(req.file.buffer, req.file.mimetype, model);

        res.json(result);
    } catch (error) {
        next(error);
    }
};

const approveKifInvoice = async (req, res, next) => {
    try {
        const { id: invoiceId } = req.params;
        const { userId } = req.user;

        const result = await approveKifDocument(invoiceId, userId);

        res.json(result)
    } catch (error) {
        next(error);
    }
};

const updateKifInvoice = async (req, res, next) => {
    try {
        const { id: invoiceId } = req.params;
        const updatedData = req.body;

        const result = await updateKifDocumentData(invoiceId, updatedData);

        res.json(result)
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getKifData,
    getKifDataById,
    createKifInvoice,
    processKifInvoice,
    approveKifInvoice,
    updateKifInvoice
};
