const express = require('express');
const router = express.Router();
const authorizeAdmin = require('../middleware/authMiddleware');
const {
    getActivityLogs,
    exportActivityLogs,
    getActivityStats,
} = require('../controllers/activityLog');

// Get activity logs with filtering and pagination
router.get('/', authorizeAdmin, getActivityLogs);

// Export activity logs to CSV
router.get('/export', authorizeAdmin, exportActivityLogs);

// Get activity statistics for dashboard
router.get('/stats', authorizeAdmin, getActivityStats);

module.exports = router;
