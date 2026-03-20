const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');

const createQuiz = async (req, res) => {
    try {
        const quizData = {
            ...req.body,
            createdBy: req.user.id
        };

        const quiz = new Quiz(quizData);
        await quiz.save();

        await quiz.populate('course', 'title');
        await quiz.populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getQuizzes = async (req, res) => {
    try {
        const { page = 1, limit = 10, course, status } = req.query;
        const query = {};

        if (course) query.course = course;
        if (status) query.status = status;

        const quizzes = await Quiz.find(query)
            .populate('course', 'title')
            .populate('createdBy', 'name email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Quiz.countDocuments(query);

        res.json({
            success: true,
            data: quizzes,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .populate('course', 'title')
            .populate('createdBy', 'name email');

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        res.json({
            success: true,
            data: quiz
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this quiz'
            });
        }

        Object.assign(quiz, req.body);
        await quiz.save();

        await quiz.populate('course', 'title');

        res.json({
            success: true,
            data: quiz
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this quiz'
            });
        }

        await Quiz.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Quiz deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const submitQuiz = async (req, res) => {
    try {
        const { answers } = req.body;
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        let score = 0;
        let maxScore = 0;

        quiz.questions.forEach((question, index) => {
            maxScore += question.points;
            if (answers[index] === question.correctAnswer) {
                score += question.points;
            }
        });

        const percentage = (score / maxScore) * 100;
        const passed = percentage >= quiz.passingScore;

        const progress = await Progress.findOne({
            student: req.user.id,
            course: quiz.course
        });

        if (progress) {
            progress.quizScores.push({
                quiz: quiz._id,
                score,
                maxScore,
                attemptedAt: new Date(),
                attemptNumber: progress.quizScores.filter(q => q.quiz.toString() === quiz._id.toString()).length + 1
            });
            await progress.save();
        }

        res.json({
            success: true,
            data: {
                score,
                maxScore,
                percentage,
                passed,
                totalQuestions: quiz.questions.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getTeacherQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ createdBy: req.user.id })
            .populate('course', 'title')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: quizzes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createQuiz,
    getQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    submitQuiz,
    getTeacherQuizzes
};
