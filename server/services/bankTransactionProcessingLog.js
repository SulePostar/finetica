const { BankTransactionProcessingLog } = require('../models');
const supabaseService = require('../utils/supabase/supabaseService');

const BANK_TRANSACTIONS_BUCKET = 'transactions';

const findAllInvalid = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const result = await BankTransactionProcessingLog.findAndCountAll({
        where: { isValid: false },
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        order: [['created_at', 'DESC']],
    });

    return {
        data: result.rows,
        totalCount: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: parseInt(page, 10),
        hasNextPage: page < Math.ceil(result.count / limit),
        hasPreviousPage: page > 1,
    };
};

const findById = async (id) => {
    const log = await BankTransactionProcessingLog.findByPk(id);
    if (!log) return null;

    let pdfUrl = null;
    try {
        pdfUrl = await supabaseService.getSignedUrl(BANK_TRANSACTIONS_BUCKET, log.filename);
    } catch (error) {
        console.log(`Warning: Could not get PDF URL for ${log.filename}:`, error.message);
        // If the file doesn't exist in storage, we still return the log without pdfUrl
    }

    return { ...log.toJSON(), pdfUrl };
};

module.exports = { findAllInvalid, findById };