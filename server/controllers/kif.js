const { get } = require('../routes/kif');
const {
    getKifs,
    getKifById,
    createKif,
    processKif,
    approveKif,
    getKifItemsById,
    getKifInvoiceTypes: getKifInvoiceTypesService,
    updateKifItem: updateKifItemService,
} = require('../services/kif');

const getKifData = async (req, res, next) => {
    try {
        const { page, perPage, sortField, sortOrder, invoiceType } = req.query;

        // Get timeRange safely from query
        let parsedTimeRange = 'all';
        const rawTimeRange = req.query.timeRange;

        console.log('Raw query.timeRange:', rawTimeRange); // for debugging

        if (rawTimeRange) {
            // If frontend sends a JSON string for custom range
            if (typeof rawTimeRange === 'string' && rawTimeRange.startsWith('{') && rawTimeRange.endsWith('}')) {
                try {
                    parsedTimeRange = JSON.parse(rawTimeRange);
                } catch (err) {
                    parsedTimeRange = 'all'; // fallback if JSON is invalid
                }
            } else {
                // Otherwise, quick filter like 'last_7_days', 'last_30_days', etc.
                parsedTimeRange = rawTimeRange;
            }
        }

        const result = await getKifs({
            page: parseInt(page) || 1,
            perPage: parseInt(perPage) || 10,
            sortField,
            sortOrder,
            invoiceType,
            timeRange: parsedTimeRange, // pass to service
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


const getKifItems = async (req, res, next) => {
    try {
        const { id } = req.params;

        const items = await getKifItemsById(parseInt(id));
        const result = { data: items, total: items.length };
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch KIF items' });
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

const getKifInvoiceTypes = async (req, res, next) => {
    try {
        const result = await getKifInvoiceTypesService();
        res.json(result);
    } catch (error) {
        next(error);
    }
};

// Update a single KIF item
const updateKifItem = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const updateData = req.body;
        const item = await updateKifItemService(itemId, updateData);
        res.json(item);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getKifData,
    getKif,
    createKifInvoice,
    processKifInvoice,
    approveKifInvoice,
    getKifItems,
    getKifInvoiceTypes,
    updateKifItem,
};