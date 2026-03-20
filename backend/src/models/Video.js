const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a video title']
    },
    description: {
        type: String
    },
    videoUrl: {
        type: String,
        required: [true, 'Please add a video URL']
    },
    thumbnailUrl: {
        type: String
    },
    duration: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course.lessons'
    },
    order: {
        type: Number,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    tags: [String],
    status: {
        type: String,
        enum: ['processing', 'ready', 'error'],
        default: 'processing'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Video', videoSchema);
