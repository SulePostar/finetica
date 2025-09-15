import api from './api';

/**
 * Frontend service for activity log operations
 */
export const activityLogService = {
    /**
     * Log a new activity
     * @param {Object} payload - Activity data (userId, action, entity, status, etc.)
     * @returns {Promise<Object>} Created activity log
     */
    async logActivity(payload) {
        try {
            const response = await api.post('/admin/log', payload);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to log activity');
        }
    },

    /**
     * Get activity logs with filtering and pagination
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} Response with logs and pagination
     */
    async getActivityLogs(params = {}) {
        try {
            const response = await api.get('/admin', { params });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch activity logs');
        }
    },

    /**
     * Export activity logs to CSV
     * @param {Object} params - Query parameters
     * @returns {Promise<string>} CSV content
     */
    async exportToCSV(params = {}) {
        try {
            const response = await api.get('/admin/export', {
                params,
                responseType: 'text',
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to export activity logs');
        }
    },

    /**
     * Get activity statistics for dashboard
     * @returns {Promise<Object>} Activity statistics
     */
    async getActivityStats() {
        try {
            const response = await api.get('/admin/stats');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch activity statistics');
        }
    },
};
