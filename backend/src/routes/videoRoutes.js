const express = require('express');
const router = express.Router();
const {
    uploadVideo,
    getVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    getTeacherVideos
} = require('../controllers/videoController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('teacher', 'admin'), uploadVideo);
router.get('/', getVideos);
router.get('/teacher', protect, authorize('teacher'), getTeacherVideos);
router.get('/:id', getVideoById);
router.put('/:id', protect, authorize('teacher', 'admin'), updateVideo);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteVideo);

module.exports = router;
