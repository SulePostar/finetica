const generateMockData = (total = 25) => {
    return Array.from({ length: total }, (_, i) => ({
        id: i + 1,
        name: `Article ${i + 1}`,
        amount: Math.floor(Math.random() * 10),
        price: parseFloat((Math.random() * 10).toFixed(2)),
        date: `2025-01-${((i % 30) + 1).toString().padStart(2, '0')}`,
        vatNumber: `VAT-${1000 + i + 1}`,
        taxableAmount: parseFloat((Math.random() * 1000).toFixed(2)),
        vatAmount: parseFloat((Math.random() * 200).toFixed(2)),
        totalAmount: parseFloat((Math.random() * 1200).toFixed(2)),
        currency: "EUR",
    }));
};

const getPaginatedBankTransactionData = ({ page = 1, perPage = 10, sortField, sortOrder = 'asc' }) => {
    const total = 25;
    const fullData = generateMockData(total);

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

const getBankTransactionDocumentById = (id) => {
    const fullData = generateMockData(25);
    return fullData.find((doc) => doc.id === parseInt(id)) || null;
};

module.exports = {
    getPaginatedBankTransactionData,
    getBankTransactionDocumentById,
};
