const { ContractProcessingLog } = require('../models');
const supabaseService = require('../utils/supabase/supabaseService');

const CONTRACTS_BUCKET = 'contracts';

const findAllInvalid = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const result = await ContractProcessingLog.findAndCountAll({
        where: {
            isValid: false
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
    });

    return {
        data: result.rows,
        totalCount: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: parseInt(page),
        hasNextPage: page < Math.ceil(result.count / limit),
        hasPreviousPage: page > 1
    };
};

const findById = async (id) => {
    const contractProcessingLog = await ContractProcessingLog.findByPk(id);
    const pdfUrl = await supabaseService.getSignedUrl(CONTRACTS_BUCKET, contractProcessingLog.filename);

    return { ...contractProcessingLog.toJSON(), pdfUrl };
};



module.exports = {
    findById,
    findAllInvalid
};


