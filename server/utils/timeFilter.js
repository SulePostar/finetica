const { Op } = require('sequelize');

/**
 * Generates a Sequelize Where clause for time filtering.
 * @param {string|object} timeRange - 'last 7 days', 'last_7_days', or { from:..., to:... }
 * @param {string} dateField - DB column name (e.g. 'invoice_date')
 */
const getTimeFilterWhereClause = (timeRange, dateField = 'created_at') => {
    if (timeRange === null || timeRange === 'all') {
        console.log('No time filter applied.');
        return {};
    }

    console.log('Generating time filter for:', timeRange);

    let startDate = null;
    let endDate = null;

    if (typeof timeRange === 'string') {
        const normalized = timeRange.replace(/ /g, '_').toLowerCase();

        endDate = new Date();
        // endDate.setHours(23, 59, 59, 999);
        switch (normalized) {
            case 'last_7_days':
                startDate = endDate.setDate(new Date().getDate() - 7);
                break;
            case 'last_30_days':
                startDate = endDate.setDate(new Date().getDate() - 30);
                break;
            case 'last_60_days':
                startDate = endDate.setDate(new Date().getDate() - 60);
                break;
        }
    }
    else if (typeof timeRange === 'object') {
        const start = timeRange.start || timeRange.from;
        const end = timeRange.end || timeRange.to;

        if (start) {
            startDate = new Date(start);
            endDate = end ? new Date(end) : new Date(start);

            endDate.setHours(23, 59, 59, 999);
        }
    }

    console.log('Time Filter - startDate:', startDate, 'endDate:', endDate);

    return { [dateField]: { [Op.between]: [startDate, endDate] } };


    return {};
};

module.exports = { getTimeFilterWhereClause };