const Video = require('../models/Video');
const Course = require('../models/Course');

const uploadVideo = async (req, res) => {
    try {
        const { title, description, courseId, duration } = req.body;
        
        if (!title || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'Title and course ID are required'
            });
        }

        // Check if course exists and belongs to teacher
        const course = await Course.findOne({ _id: courseId, teacher: req.user.id });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found or not authorized'
            });
        }

        // For now, we'll store the file info. In production, you'd upload to cloud storage
        const videoData = {
            title,
            description,
            videoUrl: req.body.videoUrl || `https://example.com/videos/${title.replace(/\s+/g, '-').toLowerCase()}.mp4`,
            thumbnailUrl: req.body.thumbnailUrl || `https://via.placeholder.com/640x360?text=${encodeURIComponent(title)}`,
            duration: duration || '10:00',
            course: courseId,
            uploadedBy: req.user.id,
            order: req.body.order || 1,
            tags: req.body.tags || [],
            status: 'ready'
        };

        const video = new Video(videoData);
        await video.save();

        await video.populate('course', 'title');

        res.status(201).json({
            success: true,
            data: video
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getVideos = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, courseId } = req.query;
        const query = { uploadedBy: req.user.id };

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        if (courseId) {
            query.course = courseId;
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

const getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)
            .populate('course', 'title')
            .populate('uploadedBy', 'name email');

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }

        // Check if user owns the video
        if (video.uploadedBy._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this video'
            });
        }

        // Increment view count
        video.views += 1;
        await video.save();

        res.json({
            success: true,
            data: video
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }

        if (video.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this video'
            });
        }

        Object.assign(video, req.body);
        await video.save();

        await video.populate('course', 'title');

        res.json({
            success: true,
            data: video
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }

        if (video.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this video'
            });
        }

        await Video.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Video deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getTeacherVideos = async (req, res) => {
    try {
        const videos = await Video.find({ uploadedBy: req.user.id })
            .populate('course', 'title')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: videos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    uploadVideo,
    getVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    getTeacherVideos
};
