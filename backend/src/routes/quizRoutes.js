const express = require('express');
const router = express.Router();
const {
    createQuiz,
    getQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    submitQuiz,
    getTeacherQuizzes
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('teacher', 'admin'), createQuiz);
router.get('/', getQuizzes);
router.get('/teacher', protect, authorize('teacher'), getTeacherQuizzes);
router.get('/:id', getQuizById);
router.put('/:id', protect, authorize('teacher', 'admin'), updateQuiz);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteQuiz);
router.post('/:id/submit', protect, authorize('student'), submitQuiz);

module.exports = router;
