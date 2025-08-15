const db = require('../models');
const AppError = require('../utils/errorHandler');

const generateMockContracts = (total = 25) => {
    const contractTypes = ['Service', 'License', 'Supply', 'Consulting'];
    const paymentTerms = ['Net 30', 'Net 60', 'Advance', 'Upon Delivery'];
    const currencies = ['EUR', 'USD', 'BAM', 'GBP'];

    return Array.from({ length: total }, (_, i) => ({
        id: i + 1,
        partner_id: 1000 + i,
        contract_number: `CN-${2025}${String(i + 1).padStart(3, '0')}`,
        contract_type: contractTypes[i % contractTypes.length],
        description: `${contractTypes[i % contractTypes.length]} contract #${i + 1}`,
        start_date: `2025-01-${((i % 28) + 1).toString().padStart(2, '0')}`,
        end_date: `2025-12-${((i % 28) + 1).toString().padStart(2, '0')}`,
        is_active: i % 3 !== 0,
        payment_terms: paymentTerms[i % paymentTerms.length],
        currency: currencies[i % currencies.length],
        amount: parseFloat((Math.random() * 100000 + 1000).toFixed(2)),
        signed_at: `2025-01-${((i % 28) + 1).toString().padStart(2, '0')}`,
        created_at: `2024-12-${((i % 28) + 1).toString().padStart(2, '0')}`,
        updated_at: `2025-01-${((i % 28) + 1).toString().padStart(2, '0')}`,
    }));
};

const getPaginatedContractData = ({ page = 1, perPage = 10, sortField, sortOrder = 'asc' }) => {
    const total = 25;
    const fullData = generateMockContracts(total);

    if (sortField) {
        fullData.sort((a, b) =>
            sortOrder === 'asc'
                ? a[sortField] > b[sortField] ? 1 : -1
                : a[sortField] < b[sortField] ? 1 : -1
        );
    }

    const start = (page - 1) * perPage;
    const pagedData = fullData.slice(start, start + parseInt(perPage));

    return { data: pagedData, total };
};

/**
 * Create a new contract in the database
 * @param {Object} contractData - The contract data
 * @returns {Promise<Object>} - The created contract
 */
const createContract = async (contractData) => {
    try {
        // Get the Contract model
        const Contract = db.Contract;

        // Map the request data to database model fields
        const mappedData = {
            partnerId: contractData.partnerId,
            contractNumber: contractData.contractNumber,
            contractType: contractData.contractType,
            description: contractData.description,
            startDate: contractData.startDate,
            endDate: contractData.endDate,
            isActive: contractData.isActive !== undefined ? contractData.isActive : true,
            paymentTerms: contractData.paymentTerms,
            currency: contractData.currency,
            amount: contractData.amount,
            signedAt: contractData.signedAt
        };

        // Create the contract in the database
        const contract = await Contract.create(mappedData);

        return contract;
    } catch (error) {
        throw new AppError(`Failed to create contract: ${error.message}`, 500);
    }
};

module.exports = {
    getPaginatedContractData,
    createContract,
};