const express = require('express');
const router = express.Router();

router.get('/vat-data', (req, res) => {
    const total = 25;
    const { page = 1, perPage = 10, sortField, sortOrder = 'asc' } = req.query;

    const fullData = Array.from({ length: total }, (_, i) => ({
        id: i + 1,
        name: `Article ${i + 1}`,
        amount: Math.floor(Math.random() * 10),
        price: parseFloat((Math.random() * 10).toFixed(2)),
        date: `2025-01-${((i % 30) + 1).toString().padStart(2, '0')}`,
    }));

    if (sortField) {
        fullData.sort((a, b) => (
            sortOrder === 'asc'
                ? a[sortField] > b[sortField] ? 1 : -1
                : a[sortField] < b[sortField] ? 1 : -1
        ));
    }

    const start = (page - 1) * perPage;
    const pagedData = fullData.slice(start, start + parseInt(perPage));

    res.json({ data: pagedData, total });
});

module.exports = router;