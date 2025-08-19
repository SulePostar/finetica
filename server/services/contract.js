const { Contract } = require('../models');
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
    console.log("Paged Data:", pagedData);

    return { data: pagedData, total };
};

const approveContractById = async (id, contractData, userId) => {
    console.log("Radi")
    const contract = await Contract.findByPk(id);
    if (!contract) {
        throw new AppError('Contract not found', 404);
    }

    await contract.update({
        ...contractData,
        approvedAt: new Date(),
        approvedBy: userId,
    });
    return {
        id: contract.id,
        partnerId: contract.partnerId,
        contractNumber: contract.contractNumber,
        contractType: contract.contractType,
        description: contract.description,
        startDate: contract.startDate,
        endDate: contract.endDate,
        isActive: contract.isActive,
        paymentTerms: contract.paymentTerms,
        currency: contract.currency,
        amount: contract.amount,
        signedAt: contract.signedAt,
    }
};

module.exports = {
    getPaginatedContractData,
    approveContractById,
};