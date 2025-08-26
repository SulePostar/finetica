const { ContractProcessingLog } = require('../models')

const getUnprocessedFiles = async () => {
    const unprocessedFiles = await ContractProcessingLog.findAll({
        where: {
            is_processed: false
        }
    });
    return unprocessedFiles;
};

module.exports = {
    getUnprocessedFiles
};