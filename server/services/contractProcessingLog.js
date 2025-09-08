const { ContractProcessingLog } = require('../models');

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
    const contract = await ContractProcessingLog.findByPk(id);
    return contract;
};



module.exports = {
    findById,
    findAllInvalid
};


