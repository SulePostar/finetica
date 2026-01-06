const {
    BankTransactionProcessingLog,
    ContractProcessingLog,
    KufProcessingLog,
    KifProcessingLog
} = require('../models');

class InvalidPdfsService {
    async getInvalidCounts() {
        const [bankCount, contractCount, kufCount, kifCount] = await Promise.all([
            BankTransactionProcessingLog.count({ where: { isValid: false } }),
            ContractProcessingLog.count({ where: { isValid: false } }),
            KufProcessingLog.count({ where: { isValid: false } }),
            KifProcessingLog.count({ where: { isValid: false } })
        ]);

        const total = bankCount + contractCount + kufCount + kifCount;

        return {
            statusCode: 200,
            message: 'Invalid PDF counts fetched successfully',
            data: {
                total,
                breakdown: {
                    bankTransactions: bankCount,
                    contracts: contractCount,
                    kuf: kufCount,
                    kif: kifCount
                }
            }
        };
    }
}

module.exports = new InvalidPdfsService();