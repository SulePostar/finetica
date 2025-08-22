const {
    getKufData,
    getKufDataById,
    createKufManually,
    processKufDocument,
    approveKufDocument,
    updateKufDocument,
} = require('../services/kuf');

const getKuf = async (req, res, next) => {
    try {
        const { page, perPage, sortField, sortOrder } = req.query;

        const result = await getKufData({
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

const getKufById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await getKufDataById(parseInt(id));
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const createKuf = async (req, res, next) => {
    try {
        const invoiceData = req.body;
        const userId = req.user.userId;

        const result = await createKufManually(invoiceData, userId);

        res.json(result)
    } catch (error) {
        next(error);
    }
};

const processKuf = async (req, res, next) => {
    try {
        const { model } = req.body;
        const result = await processKufDocument(req.file.buffer, req.file.mimetype, model);

        res.json(result);
    } catch (error) {
        next(error);
    }
};

const approveKuf = async (req, res, next) => {
    try {
        const { id: invoiceId } = req.params;
        const { userId } = req.user;

        const result = await approveKufDocument(invoiceId, userId);

        res.json(result)
    } catch (error) {
        next(error);
    }
};

const updateKuf = async (req, res, next) => {
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
    getKuf,
    getKufById,
    createKuf,
    processKuf,
    approveKuf,
    updateKuf
};
