const generateMockData = (total = 25) => {
    return Array.from({ length: total }, (_, i) => ({
        id: i + 1,
        name: `Article ${i + 1}`,
        amount: Math.floor(Math.random() * 100),
        price: parseFloat((Math.random() * 100).toFixed(2)),
        date: `2025-07-${((i % 30) + 1).toString().padStart(2, '0')}`,
    }));
};

const getPaginatedKifData = ({ page = 1, perPage = 10, sortField, sortOrder = 'asc' }) => {
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

module.exports = {
    getPaginatedKifData,
};
