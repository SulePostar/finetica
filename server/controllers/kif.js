const {
    getKifs,
    getKifById,
    createKif,
    processKif,
    approveKif,
} = require('../services/kif');

const getKifData = async (req, res, next) => {
    try {
        const { page, perPage, sortField, sortOrder } = req.query;

        const result = await getKifs({
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

const getKif = async (req, res, next) => {
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

        const result = await createKif(invoiceData, userId);

        res.json(result)
    } catch (error) {
        next(error);
    }
};

const processKifInvoice = async (req, res, next) => {
    try {
        const { model } = req.body;
        const result = await processKif(req.file.buffer, req.file.mimetype, model);

        res.json(result);
    } catch (error) {
        next(error);
    }
};

const approveKifInvoice = async (req, res, next) => {
    try {
        const { id: invoiceId } = req.params;
        const { userId } = req.user;
        const updatedData = req.body;

        const result = await approveKif(invoiceId, updatedData, userId);

        res.json(result)
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getKifData,
    getKif,
    createKifInvoice,
    processKifInvoice,
    approveKifInvoice,
};
