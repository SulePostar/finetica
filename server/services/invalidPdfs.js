const {
    BankTransactionProcessingLog,
    ContractProcessingLog,
    KufProcessingLog,
    KifProcessingLog
} = require('../models');
const AppError = require('../utils/errorHandler');
const Logger = require('../utils/logger');
const NodeCache = require('node-cache');

// Cache for 60 seconds
const cache = new NodeCache({ stdTTL: 60 });

/**
 * Get count of invalid PDFs across all document types
 * Uses Promise.allSettled for robust error handling and caching for performance
 * @returns {Promise<{total: number, breakdown: {bankTransactions: number, contracts: number, kuf: number, kif: number}}>}
 */
class InvalidPdfsService {
    async getInvalidCounts() {
        const cacheKey = 'invalid-pdfs-count';
        const cached = cache.get(cacheKey);

        if (cached) {
            Logger.debug('Returning cached invalid PDFs count');
            return cached;
        }

        try {
            const results = await Promise.allSettled([
                BankTransactionProcessingLog.count({ where: { isValid: false } }),
                ContractProcessingLog.count({ where: { isValid: false } }),
                KufProcessingLog.count({ where: { isValid: false } }),
                KifProcessingLog.count({ where: { isValid: false } })
            ]);

            const [bankResult, contractResult, kufResult, kifResult] = results;

            // Handle fulfilled and rejected promises gracefully
            const bankCount = bankResult.status === 'fulfilled' ? bankResult.value : 0;
            const contractCount = contractResult.status === 'fulfilled' ? contractResult.value : 0;
            const kufCount = kufResult.status === 'fulfilled' ? kufResult.value : 0;
            const kifCount = kifResult.status === 'fulfilled' ? kifResult.value : 0;

            // Log any failures
            if (bankResult.status === 'rejected') {
                Logger.warn('Failed to fetch bank transaction invalid count:', bankResult.reason?.message);
            }
            if (contractResult.status === 'rejected') {
                Logger.warn('Failed to fetch contract invalid count:', contractResult.reason?.message);
            }
            if (kufResult.status === 'rejected') {
                Logger.warn('Failed to fetch KUF invalid count:', kufResult.reason?.message);
            }
            if (kifResult.status === 'rejected') {
                Logger.warn('Failed to fetch KIF invalid count:', kifResult.reason?.message);
            }

            const total = bankCount + contractCount + kufCount + kifCount;

            const result = {
                total,
                breakdown: {
                    bankTransactions: bankCount,
                    contracts: contractCount,
                    kuf: kufCount,
                    kif: kifCount
                }
            };

            // Cache the result
            cache.set(cacheKey, result);
            return result;
        }
        catch (error) {
            Logger.error(`Invalid PDFs service error: ${error.message}`);
            throw new AppError('Failed to fetch invalid PDF counts', 500);
        }
    }
}

module.exports = new InvalidPdfsService();