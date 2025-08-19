const { getPaginatedKifData, getKifById } = require('../services/kif');
const {
    analyzeDocument,
    createDocumentFromAI,
    approveDocument,
    updateDocumentData,
    getDocumentWithApprovalStatus
} = require('../services/aiService');
const KIF_PROMPT = require('../prompts/Kif.js');
const salesInvoiceSchema = require('../schemas/kifSchema');

const getKifData = async (req, res) => {
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
        console.error('Error in getKifData controller:', error);
        res.status(500).json({
            error: 'Failed to fetch KIF data',
            message: error.message
        });
    }
};

const getKifDataById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: 'ID parameter is required'
            });
        }

        const result = await getKifById(parseInt(id));
        res.json(result);
    } catch (error) {
        console.error('Error in getKifDataById controller:', error);
        if (error.message === 'Sales invoice not found') {
            res.status(404).json({
                error: 'KIF record not found',
                message: error.message
            });
        } else {
            res.status(500).json({
                error: 'Failed to fetch KIF data',
                message: error.message
            });
        }
    }
};

const analyzeKifDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Missing 'file' in form-data." });
        }

        // Get model from request body or use default
        const { model = "gemini-2.5-flash-lite" } = req.body;

        const extractedData = await analyzeDocument(
            req.file.buffer,
            req.file.mimetype,
            salesInvoiceSchema,
            model,
            KIF_PROMPT
        );

        // Create sales invoice in database (not approved by default)
        const invoice = await createDocumentFromAI(extractedData, 'kif');

        res.json({
            success: true,
            data: {
                ...invoice.toJSON(),
                isApproved: false,
                approvalStatus: 'pending'
            }
        });
    } catch (error) {
        console.error('Sales Invoice Analysis Error:', error);
        res.status(500).json({
            error: error.message || 'Failed to analyze sales invoice',
            success: false
        });
    }
};

const approveKifInvoice = async (req, res) => {
    try {
        const invoiceId = req.params.id;
        const userId = req.user.userId;

        const updatedInvoice = await approveDocument(invoiceId, userId, 'kif');

        res.json({
            success: true,
            data: {
                ...updatedInvoice.toJSON(),
                isApproved: true,
                approvalStatus: 'approved'
            }
        });
    } catch (error) {
        console.error('Sales Invoice Approval Error:', error);
        res.status(500).json({
            error: error.message || 'Failed to approve sales invoice',
            success: false
        });
    }
};

const updateKifInvoice = async (req, res) => {
    try {
        const invoiceId = req.params.id;
        const updatedData = req.body;

        const updatedInvoice = await updateDocumentData(invoiceId, updatedData, 'kif');

        res.json({
            success: true,
            data: {
                ...updatedInvoice.toJSON(),
                isApproved: false,
                approvalStatus: 'pending'
            }
        });
    } catch (error) {
        console.error('Sales Invoice Update Error:', error);
        res.status(500).json({
            error: error.message || 'Failed to update sales invoice',
            success: false
        });
    }
};

const getKifWithApprovalStatus = async (req, res) => {
    try {
        const invoiceId = req.params.id;
        const invoice = await getDocumentWithApprovalStatus(invoiceId, 'kif');

        res.json({
            success: true,
            data: invoice
        });
    } catch (error) {
        console.error('Sales Invoice Fetch Error:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch sales invoice',
            success: false
        });
    }
};

module.exports = {
    getKifData,
    getKifDataById,
    analyzeKifDocument,
    approveKifInvoice,
    updateKifInvoice,
    getKifWithApprovalStatus,
};
