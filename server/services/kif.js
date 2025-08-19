const { SalesInvoice, SalesInvoiceItem, BusinessPartner } = require('../models');
const {
    analyzeDocument,
    createDocumentFromAI,
    approveDocument,
    updateDocumentData,
    getDocumentWithApprovalStatus
} = require('./aiService');
const KIF_PROMPT = require('../prompts/Kif.js');
const salesInvoiceSchema = require('../schemas/kifSchema');
const AppError = require('../utils/errorHandler');

// Transform function for sales invoice data
const transformInvoiceData = (invoice) => ({
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber || `Invoice ${invoice.id}`,
    totalAmount: parseFloat(invoice.totalAmount || 0),
    invoiceDate: invoice.invoiceDate ? invoice.invoiceDate.toISOString().split('T')[0] : null,
    invoiceType: invoice.invoiceType,
    billNumber: invoice.billNumber,
    note: invoice.note,
    customerId: invoice.customerId,
    customerName: invoice.BusinessPartner?.name || null,
    dueDate: invoice.dueDate ? invoice.dueDate.toISOString().split('T')[0] : null,
    deliveryPeriod: invoice.deliveryPeriod,
    vatCategory: invoice.vatCategory,
    vatPeriod: invoice.vatPeriod,
    approvedAt: invoice.approvedAt,
    approvedBy: invoice.approvedBy,
    createdAt: invoice.created_at,
    updatedAt: invoice.updated_at,
    items: invoice.SalesInvoiceItems || []
});

const formatInvoiceWithStatus = (invoice, isApproved = false) => ({
    ...invoice.toJSON(),
    isApproved,
    approvalStatus: isApproved ? 'approved' : 'pending'
});

const getPaginatedKifData = async ({ page = 1, perPage = 10, sortField, sortOrder = 'asc' }) => {
    try {
        const offset = (page - 1) * perPage;
        const limit = parseInt(perPage);

        let orderOptions = [];
        if (sortField) {
            orderOptions = [[sortField, sortOrder.toUpperCase()]];
        } else {
            orderOptions = [['created_at', 'DESC']];
        }

        // Get total count
        const total = await SalesInvoice.count();

        // Get paginated data with associated items and business partner
        const salesInvoices = await SalesInvoice.findAll({
            include: [
                {
                    model: SalesInvoiceItem,
                    required: false
                },
                {
                    model: BusinessPartner,
                    required: false
                }
            ],
            order: orderOptions,
            limit,
            offset
        });

        // Transform data to match the expected format
        const transformedData = salesInvoices.map(transformInvoiceData);

        return { data: transformedData, total };
    } catch (error) {
        throw new AppError('Failed to fetch KIF data', 500);
    }
};

const getKifById = async (id) => {
    try {
        const salesInvoice = await SalesInvoice.findByPk(id, {
            include: [
                {
                    model: SalesInvoiceItem,
                    required: false
                },
                {
                    model: BusinessPartner,
                    required: false
                }
            ]
        });

        if (!salesInvoice) {
            throw new AppError('Sales invoice not found', 404);
        }

        // Transform data to match the expected format
        const transformedData = transformInvoiceData(salesInvoice);

        return transformedData;
    } catch (error) {
        throw new AppError('Failed to fetch KIF by ID', 500);
    }
};

// AI Document Analysis Service for KIF
const analyzeKifDocument = async (fileBuffer, mimeType, model = "gemini-2.5-flash-lite") => {
    try {
        const extractedData = await analyzeDocument(
            fileBuffer,
            mimeType,
            salesInvoiceSchema,
            model,
            KIF_PROMPT
        );

        const invoice = await createDocumentFromAI(extractedData, 'kif');
        const formattedInvoice = formatInvoiceWithStatus(invoice, false);

        return {
            success: true,
            data: formattedInvoice
        };
    } catch (error) {
        throw new AppError('Failed to analyze KIF document', 500);
    }
};

// Approve KIF Invoice Service
const approveKifInvoice = async (invoiceId, userId) => {
    try {
        const updatedInvoice = await approveDocument(invoiceId, userId, 'kif');
        const formattedInvoice = formatInvoiceWithStatus(updatedInvoice, true);

        return {
            success: true,
            data: formattedInvoice
        };
    } catch (error) {
        throw new AppError('Failed to approve KIF invoice', 500);
    }
};

// Update KIF Invoice Service  
const updateKifInvoice = async (invoiceId, updatedData) => {
    try {
        const updatedInvoice = await updateDocumentData(invoiceId, updatedData, 'kif');
        const formattedInvoice = formatInvoiceWithStatus(updatedInvoice, false);

        return {
            success: true,
            data: formattedInvoice
        };
    } catch (error) {
        throw new AppError('Failed to update KIF invoice', 500);
    }
};

// Get KIF with Approval Status Service
const getKifWithApprovalStatus = async (invoiceId) => {
    try {
        const result = await getDocumentWithApprovalStatus(invoiceId, 'kif');

        return {
            success: true,
            data: result
        };
    } catch (error) {
        throw new AppError('Failed to fetch KIF with approval status', 500);
    }
};

module.exports = {
    getPaginatedKifData,
    getKifById,
    analyzeKifDocument,
    approveKifInvoice,
    updateKifInvoice,
    getKifWithApprovalStatus,
};
