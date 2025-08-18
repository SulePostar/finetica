const { ActivityLog, User } = require('../models');

/**
 * Centralized activity logging service
 * Records user actions for audit and monitoring purposes
 */
class ActivityLogService {
    /**
     * Log an activity performed by a user
     * @param {Object} logData - The log data
     * @param {number} logData.userId - ID of the user performing the action
     * @param {string} logData.action - Action performed (e.g., 'login', 'create', 'update', 'delete')
     * @param {string} [logData.entity] - Entity type (e.g., 'User', 'Contract', 'Invoice')
     * @param {number} [logData.entityId] - ID of the affected entity
     * @param {Object} [logData.details] - Additional details about the action
     * @param {string} [logData.ipAddress] - IP address of the user
     * @param {string} [logData.userAgent] - User agent string
     * @param {string} [logData.status] - Status of the action ('success', 'failure', 'pending')
     * @returns {Promise<ActivityLog>} The created log entry
     */
    async logActivity(logData) {
        try {
            const {
                userId,
                action,
                entity = null,
                entityId = null,
                details = {},
                ipAddress = null,
                userAgent = null,
                status = 'success',
            } = logData;

            // Validate required fields
            if (!userId || !action) {
                throw new Error('userId and action are required');
            }

            // Create the log entry
            const logEntry = await ActivityLog.create({
                userId,
                action,
                entity,
                entityId,
                details,
                ipAddress,
                userAgent,
                status,
                createdAt: new Date(),
            });

            return logEntry;
        } catch (error) {
            // Log the error but don't fail the main operation
            console.error('Failed to log activity:', error);
            return null;
        }
    }

    /**
     * Get activity logs with filtering, pagination, and sorting
     * @param {Object} options - Query options
     * @param {number} [options.page=1] - Page number
     * @param {number} [options.limit=20] - Items per page
     * @param {string} [options.sortBy='created_at'] - Field to sort by
     * @param {string} [options.sortOrder='DESC'] - Sort order ('ASC' or 'DESC')
     * @param {string} [options.userId] - Filter by user ID
     * @param {string} [options.action] - Filter by action
     * @param {string} [options.entity] - Filter by entity type
     * @param {string} [options.status] - Filter by status
     * @param {Date} [options.startDate] - Filter by start date
     * @param {Date} [options.endDate] - Filter by end date
     * @param {string} [options.search] - Search in action, entity, or details
     * @returns {Promise<Object>} Paginated results with logs and metadata
     */
    async getActivityLogs(options = {}) {
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
        } = options;

        // Build where clause
        const whereClause = {};

        if (userId) whereClause.userId = userId;
        if (action) whereClause.action = action;
        if (entity) whereClause.entity = entity;
        if (status) whereClause.status = status;

        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt.$gte = new Date(startDate);
            if (endDate) whereClause.createdAt.$lte = new Date(endDate);
        }

        // Build search clause
        let searchClause = null;
        if (search) {
            searchClause = {
                $or: [
                    { action: { $iLike: `%${search}%` } },
                    { entity: { $iLike: `%${search}%` } },
                    { details: { $iLike: `%${search}%` } },
                ],
            };
        }

        // Combine where clauses
        const finalWhere = searchClause
            ? { $and: [whereClause, searchClause] }
            : whereClause;

        // Calculate offset
        const offset = (page - 1) * limit;

        // Build query options
        const queryOptions = {
            where: finalWhere,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                },
            ],
            order: [[sortBy, sortOrder]],
            limit: parseInt(limit),
            offset: parseInt(offset),
        };

        // Execute queries
        const [logs, totalCount] = await Promise.all([
            ActivityLog.findAll(queryOptions),
            ActivityLog.count({ where: finalWhere }),
        ]);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return {
            logs,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalCount,
                limit: parseInt(limit),
                hasNextPage,
                hasPrevPage,
            },
        };
    }

    /**
     * Export activity logs to CSV format
     * @param {Object} options - Same as getActivityLogs options
     * @returns {Promise<string>} CSV string
     */
    async exportToCSV(options = {}) {
        // Get all logs without pagination for export
        const { logs } = await this.getActivityLogs({ ...options, limit: 10000 });

        // Define CSV headers
        const headers = [
            'ID',
            'User',
            'Email',
            'Action',
            'Entity',
            'Entity ID',
            'Status',
            'IP Address',
            'User Agent',
            'Details',
            'Timestamp',
        ];

        // Convert logs to CSV rows
        const rows = logs.map(log => [
            log.id,
            `${log.user?.firstName || ''} ${log.user?.lastName || ''}`.trim(),
            log.user?.email || '',
            log.action,
            log.entity || '',
            log.entityId || '',
            log.status,
            log.ipAddress || '',
            log.userAgent || '',
            JSON.stringify(log.details || {}),
            log.createdAt,
        ]);

        // Combine headers and rows
        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        return csvContent;
    }

    /**
     * Get activity statistics for dashboard
     * @returns {Promise<Object>} Activity statistics
     */
    async getActivityStats() {
        try {
            const [
                totalLogs,
                todayLogs,
                actionStats,
                userStats,
                entityStats,
            ] = await Promise.all([
                // Total logs
                ActivityLog.count(),

                // Today's logs
                ActivityLog.count({
                    where: {
                        createdAt: {
                            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        },
                    },
                }),

                // Action statistics
                ActivityLog.findAll({
                    attributes: [
                        'action',
                        [ActivityLog.sequelize.fn('COUNT', '*'), 'count'],
                    ],
                    group: ['action'],
                    order: [[ActivityLog.sequelize.fn('COUNT', '*'), 'DESC']],
                    limit: 10,
                }),

                // User statistics
                ActivityLog.findAll({
                    attributes: [
                        'userId',
                        [ActivityLog.sequelize.fn('COUNT', '*'), 'count'],
                    ],
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['firstName', 'lastName', 'email'],
                        },
                    ],
                    group: ['userId', 'user.id', 'user.firstName', 'user.lastName', 'user.email'],
                    order: [[ActivityLog.sequelize.fn('COUNT', '*'), 'DESC']],
                    limit: 10,
                }),

                // Entity statistics
                ActivityLog.findAll({
                    attributes: [
                        'entity',
                        [ActivityLog.sequelize.fn('COUNT', '*'), 'count'],
                    ],
                    where: {
                        entity: { $ne: null },
                    },
                    group: ['entity'],
                    order: [[ActivityLog.sequelize.fn('COUNT', '*'), 'DESC']],
                    limit: 10,
                }),
            ]);

            return {
                totalLogs,
                todayLogs,
                actionStats: actionStats.map(stat => ({
                    action: stat.action,
                    count: parseInt(stat.dataValues.count),
                })),
                userStats: userStats.map(stat => ({
                    user: stat.user,
                    count: parseInt(stat.dataValues.count),
                })),
                entityStats: entityStats.map(stat => ({
                    entity: stat.entity,
                    count: parseInt(stat.dataValues.count),
                })),
            };
        } catch (error) {
            console.error('Failed to get activity stats:', error);
            return {
                totalLogs: 0,
                todayLogs: 0,
                actionStats: [],
                userStats: [],
                entityStats: [],
            };
        }
    }
}

module.exports = new ActivityLogService();
