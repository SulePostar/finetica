const {
    BankTransactionProcessingLog,
    ContractProcessingLog,
    KufProcessingLog,
    KifProcessingLog
} = require('../models');
const AppError = require('../utils/errorHandler');

class InvalidPdfsService {
    async getInvalidCounts() {
        try {
            const [bankCount, contractCount, kufCount, kifCount] = await Promise.all([
                BankTransactionProcessingLog.count({ where: { isValid: false } }),
                ContractProcessingLog.count({ where: { isValid: false } }),
                KufProcessingLog.count({ where: { isValid: false } }),
                KifProcessingLog.count({ where: { isValid: false } })
            ]);

            const total = bankCount + contractCount + kufCount + kifCount;

            return {
                total,
                breakdown: {
                    bankTransactions: bankCount,
                    contracts: contractCount,
                    kuf: kufCount,
                    kif: kifCount
                }
            };
        }
        catch (error) {
            console.error('Invalid PDFs service error:', error);
            throw new AppError('Failed to fetch invalid PDF counts', 500);
        }
    }
}

module.exports = new InvalidPdfsService();