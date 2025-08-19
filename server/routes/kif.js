const express = require('express');
const router = express.Router();
const { getKifData } = require('../controllers/kif');
const {
    upload,
    analyzeDocument,
    createDocumentFromAI,
    approveDocument,
    updateDocumentData,
    getDocumentWithApprovalStatus
} = require('../services/aiService');
const KIF_PROMPT = require('../prompts/Kif.js');
const salesInvoiceSchema = require('../schemas/kifSchema');
const isAuthenticated = require('../middleware/isAuthenticated');

// Existing route
router.get('/kif-data', getKifData);

// AI Sales Invoice Processing Routes
router.post('/analyze', isAuthenticated, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Missing 'file' in form-data." });
        }

        // Get model and schema from request body or use defaults
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
});

// Approve a sales invoice
router.put('/:id/approve', isAuthenticated, async (req, res) => {
    try {
        const invoiceId = req.params.id;
        const updatedInvoice = await approveDocument(invoiceId, req.user.id, 'kif');

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
});

// Update sales invoice data (for editing before approval)
router.put('/:id/edit', isAuthenticated, async (req, res) => {
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
});

// Get sales invoice with approval status
router.get('/:id', isAuthenticated, async (req, res) => {
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
});

module.exports = router;
