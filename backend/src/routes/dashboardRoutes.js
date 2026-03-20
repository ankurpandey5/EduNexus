const express = require('express');
const router = express.Router();
const {
    getTeacherStats,
    getRecentActivity,
    getCourseAnalytics,
    getVideoLibrary
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize('teacher'), getTeacherStats);
router.get('/activity', protect, authorize('teacher'), getRecentActivity);
router.get('/analytics/:id', protect, authorize('teacher'), getCourseAnalytics);
router.get('/videos', protect, authorize('teacher'), getVideoLibrary);

module.exports = router;
