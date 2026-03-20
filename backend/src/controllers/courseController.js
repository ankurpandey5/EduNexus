const Course = require('../models/Course');
const Progress = require('../models/Progress');

const createCourse = async (req, res) => {
    try {
        const courseData = {
            ...req.body,
            teacher: req.user.id
        };

        const course = new Course(courseData);
        await course.save();

        res.status(201).json({
            success: true,
            data: course
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getCourses = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, status } = req.query;
        const query = {};

        if (category) query.category = category;
        if (status) query.status = status;

        const courses = await Course.find(query)
            .populate('teacher', 'name email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Course.countDocuments(query);

        res.json({
            success: true,
            data: courses,
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

const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('teacher', 'name email')
            .populate('enrolledStudents', 'name email');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.json({
            success: true,
            data: course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        if (course.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this course'
            });
        }

        Object.assign(course, req.body);
        await course.save();

        res.json({
            success: true,
            data: course
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        if (course.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this course'
            });
        }

        await Course.findByIdAndDelete(req.params.id);
        await Progress.deleteMany({ course: req.params.id });

        res.json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const enrollStudent = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        if (course.enrolledStudents.includes(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: 'Already enrolled in this course'
            });
        }

        course.enrolledStudents.push(req.user.id);
        await course.save();

        const progress = new Progress({
            student: req.user.id,
            course: course._id
        });
        await progress.save();

        res.json({
            success: true,
            message: 'Enrolled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getTeacherCourses = async (req, res) => {
    try {
        const courses = await Course.find({ teacher: req.user.id })
            .populate('enrolledStudents', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollStudent,
    getTeacherCourses
};
