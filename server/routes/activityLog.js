const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');
const {
    getActivityLogs,
    exportActivityLogs,
    getActivityStats,
} = require('../controllers/activityLog');

// Get activity logs with filtering and pagination
router.get('/', isAuthenticated, getActivityLogs);

// Export activity logs to CSV
router.get('/export', isAuthenticated, exportActivityLogs);

// Get activity statistics for dashboard
router.get('/stats', isAuthenticated, getActivityStats);

module.exports = router;
