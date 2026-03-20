const express = require('express');
const router = express.Router();
const {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollStudent,
    getTeacherCourses
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('teacher', 'admin'), createCourse);
router.get('/', getCourses);
router.get('/teacher', protect, authorize('teacher'), getTeacherCourses);
router.get('/:id', getCourseById);
router.put('/:id', protect, authorize('teacher', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteCourse);
router.post('/:id/enroll', protect, authorize('student'), enrollStudent);

module.exports = router;
