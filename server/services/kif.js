const { SalesInvoice, SalesInvoiceItem, BusinessPartner } = require('../models');

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
        console.error('Error fetching KIF data:', error);
        throw error;
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
            throw new Error('Sales invoice not found');
        }

        // Transform data to match the expected format
        const transformedData = transformInvoiceData(salesInvoice);

        return transformedData;
    } catch (error) {
        console.error('Error fetching KIF by ID:', error);
        throw error;
    }
};

module.exports = {
    getPaginatedKifData,
    getKifById,
};
