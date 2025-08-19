const {
    getPaginatedKifData,
    getKifById,
    processKifDocument,
    approveKifDocument,
    updateKifDocumentData
} = require('../services/kif');
const AppError = require('../utils/errorHandler');

const getKifData = async (req, res, next) => {
    try {
        const { page, perPage, sortField, sortOrder } = req.query;

        const result = await getPaginatedKifData({
            page: parseInt(page) || 1,
            perPage: parseInt(perPage) || 10,
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

        if (!id) {
            return next(new AppError('ID parameter is required', 400));
        }

        const result = await getKifById(parseInt(id));
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const processKifInvoice = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new AppError("Missing 'file' in form-data", 400));
        }

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
    processKifInvoice,
    approveKifInvoice,
    updateKifInvoice
};
