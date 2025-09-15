const activityLogService = require('../services/activityLogService');

/**
 * Get activity logs with filtering and pagination
 */
const getActivityLogs = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 20,
            sortBy = 'created_at',
            sortOrder = 'DESC',
            userId,
            action,
            entity,
            status,
            startDate,
            endDate,
            search,
        } = req.query;

        const result = await activityLogService.getActivityLogs({
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy,
            sortOrder,
            userId: userId ? parseInt(userId) : undefined,
            action,
            entity,
            status,
            startDate,
            endDate,
            search,
        });

        res.json({
            success: true,
            data: result.logs,
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Export activity logs to CSV
 */
const exportActivityLogs = async (req, res, next) => {
    try {
        const {
            userId,
            action,
            entity,
            status,
            startDate,
            endDate,
            search,
        } = req.query;

        const csvContent = await activityLogService.exportToCSV({
            userId: userId ? parseInt(userId) : undefined,
            action,
            entity,
            status,
            startDate,
            endDate,
            search,
        });

        // Set headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="activity-logs.csv"');

        res.send(csvContent);
    } catch (error) {
        next(error);
    }
};

/**
 * Get activity statistics for dashboard
 */
const getActivityStats = async (req, res, next) => {
    try {
        const stats = await activityLogService.getActivityStats();

        res.json(stats);
    } catch (error) {
        next(error);
    }
};

const logActivity = async (req, res, next) => {
    try {
        const activity = await activityLogService.logActivity(req.body);
        res.json(activity);
    } catch (error) {
        next(error);
    }
};
module.exports = {
    getActivityLogs,
    exportActivityLogs,
    getActivityStats,
    logActivity,
};