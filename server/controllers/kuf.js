const {
    getKufs,
    getKufById,
    createKuf,
    processKuf,
    approveKuf,
} = require('../services/kuf');

const getKufData = async (req, res, next) => {
    try {
        const { page, perPage, sortField, sortOrder } = req.query;

        const result = await getKufs({
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

const getKuf = async (req, res, next) => {
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

        const result = await createKuf(invoiceData, userId);

        res.json(result)
    } catch (error) {
        next(error);
    }
};

const processKufInvoice = async (req, res, next) => {
    try {
        const { model } = req.body;
        const result = await processKuf(req.file.buffer, req.file.mimetype, model);

        res.json(result);
    } catch (error) {
        next(error);
    }
};

const approveKufInvoice = async (req, res, next) => {
    try {
        const { id: invoiceId } = req.params;
        const { userId } = req.user;
        const updatedData = req.body;

        const result = await approveKuf(invoiceId, updatedData, userId);

        res.json(result)
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getKufData,
    getKuf,
    createKufInvoice,
    processKufInvoice,
    approveKufInvoice,
};