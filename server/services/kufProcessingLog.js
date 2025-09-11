const { KufProcessingLog } = require('../models');
const supabaseService = require('../utils/supabase/supabaseService');

const KUF_BUCKET = 'kuf';

const findAllInvalid = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const result = await KufProcessingLog.findAndCountAll({
        where: { isValid: false },
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        order: [['createdAt', 'DESC']],
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
    const log = await KufProcessingLog.findByPk(id);
    if (!log) return null;
    const pdfUrl = await supabaseService.getSignedUrl(KUF_BUCKET, log.filename);
    return { ...log.toJSON(), pdfUrl };
};

module.exports = { findAllInvalid, findById };