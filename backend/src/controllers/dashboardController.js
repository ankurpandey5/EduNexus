const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const Video = require('../models/Video');
const Progress = require('../models/Progress');
const User = require('../models/User');

const getTeacherStats = async (req, res) => {
    try {
        const teacherId = req.user.id;

        const coursesCount = await Course.countDocuments({ teacher: teacherId });
        const totalStudents = await Progress.distinct('student', {
            course: { $in: await Course.find({ teacher: teacherId }).distinct('_id') }
        });
        const videosCount = await Video.countDocuments({ uploadedBy: teacherId });
        
        const quizScores = await Progress.aggregate([
            {
                $lookup: {
                    from: 'courses',
                    localField: 'course',
                    foreignField: '_id',
                    as: 'courseInfo'
                }
            },
            {
                $unwind: '$courseInfo'
            },
            {
                $match: {
                    'courseInfo.teacher': teacherId
                }
            },
            {
                $unwind: '$quizScores'
            },
            {
                $group: {
                    _id: null,
                    avgScore: { $avg: { $multiply: ['$quizScores.score', 100] } },
                    totalQuizzes: { $sum: 1 }
                }
            }
        ]);

        const avgQuizScore = quizScores.length > 0 ? 
            Math.round(quizScores[0].avgScore / quizScores[0].totalQuizzes) : 0;

        res.json({
            success: true,
            data: {
                coursesCreated: coursesCount,
                totalStudents: totalStudents.length,
                videosUploaded: videosCount,
                avgQuizScore: `${avgQuizScore}%`
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getRecentActivity = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const limit = parseInt(req.query.limit) || 10;

        const recentQuizzes = await Quiz.find({ createdBy: teacherId })
            .populate('course', 'title')
            .sort({ createdAt: -1 })
            .limit(limit);

        const recentVideos = await Video.find({ uploadedBy: teacherId })
            .populate('course', 'title')
            .sort({ createdAt: -1 })
            .limit(limit);

        const recentCourses = await Course.find({ teacher: teacherId })
            .sort({ updatedAt: -1 })
            .limit(limit);

        const activities = [
            ...recentQuizzes.map(quiz => ({
                id: quiz._id,
                text: `New quiz: ${quiz.title}`,
                color: 'bg-orange-400',
                type: 'quiz',
                createdAt: quiz.createdAt
            })),
            ...recentVideos.map(video => ({
                id: video._id,
                text: `Video: ${video.title}`,
                color: 'bg-blue-400',
                type: 'video',
                createdAt: video.createdAt
            })),
            ...recentCourses.map(course => ({
                id: course._id,
                text: `Course update: ${course.title}`,
                color: 'bg-teal-400',
                type: 'course',
                createdAt: course.updatedAt
            }))
        ];

        activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({
            success: true,
            data: activities.slice(0, limit)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getCourseAnalytics = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const courseId = req.params.id;

        const course = await Course.findOne({ _id: courseId, teacher: teacherId });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found or not authorized'
            });
        }

        const progressData = await Progress.find({ course: courseId })
            .populate('student', 'name email')
            .sort({ overallProgress: -1 });

        const totalEnrolled = progressData.length;
        const completedStudents = progressData.filter(p => p.overallProgress === 100).length;
        const avgProgress = totalEnrolled > 0 ? 
            Math.round(progressData.reduce((sum, p) => sum + p.overallProgress, 0) / totalEnrolled) : 0;

        const quizPerformance = await Progress.aggregate([
            { $match: { course: courseId } },
            { $unwind: '$quizScores' },
            {
                $lookup: {
                    from: 'quizzes',
                    localField: 'quizScores.quiz',
                    foreignField: '_id',
                    as: 'quizInfo'
                }
            },
            { $unwind: '$quizInfo' },
            {
                $group: {
                    _id: '$quizInfo._id',
                    quizTitle: { $first: '$quizInfo.title' },
                    avgScore: { $avg: { $multiply: ['$quizScores.score', 100] } },
                    attempts: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                course: course,
                totalEnrolled,
                completedStudents,
                avgProgress,
                studentProgress: progressData,
                quizPerformance
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getVideoLibrary = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const { page = 1, limit = 10, search } = req.query;

        const query = { uploadedBy: teacherId };
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const videos = await Video.find(query)
            .populate('course', 'title')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Video.countDocuments(query);

        res.json({
            success: true,
            data: videos,
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

module.exports = {
    getTeacherStats,
    getRecentActivity,
    getCourseAnalytics,
    getVideoLibrary
};
