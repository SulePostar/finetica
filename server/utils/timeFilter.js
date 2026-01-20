const { Op } = require('sequelize');

/**
 * Generates a Sequelize Where clause for time filtering.
 * @param {string|object|null} timeRange - 'all', 'last 7 days', 'last_7_days', or { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' }
 * @param {string} dateField - DB column name (e.g. 'invoice_date')
 * @returns {Object} Sequelize where clause
 */
const getTimeFilterWhereClause = (timeRange, dateField = 'created_at') => {
    if (!timeRange || timeRange === 'all') {
        return {};
    }

    const now = new Date();
    let startDate = null;
    let endDate = null;

    if (typeof timeRange === 'string') {
        const normalized = timeRange.replace(/ /g, '_').toLowerCase();
        const daysMap = {
            'last_7_days': 7,
            'last_30_days': 30,
            'last_60_days': 60,
        };

        const days = daysMap[normalized];
        if (days) {
            startDate = new Date(now);
            startDate.setDate(now.getDate() - days);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
        }
    } else if (typeof timeRange === 'object') {
        const start = timeRange.start || timeRange.from;
        const end = timeRange.end || timeRange.to;

        if (!start) {
            return {};
        }

        // Parse start date - ensure it's treated as local date, not UTC
        const startStr = typeof start === 'string' ? start : start.toISOString().split('T')[0];
        startDate = new Date(startStr + 'T00:00:00');
        if (isNaN(startDate.getTime())) {
            return {};
        }

        // Parse end date - if not provided, use start date
        if (end && end !== '') {
            const endStr = typeof end === 'string' ? end : end.toISOString().split('T')[0];
            endDate = new Date(endStr + 'T23:59:59.999');
            if (isNaN(endDate.getTime())) {
                return {};
            }
        } else {
            // If no end date, use start date as end date
            endDate = new Date(startDate);
            endDate.setHours(23, 59, 59, 999);
        }
    }

    if (!startDate || !endDate) {
        return {};
    }

    return { [dateField]: { [Op.between]: [startDate, endDate] } };
};

module.exports = { getTimeFilterWhereClause };