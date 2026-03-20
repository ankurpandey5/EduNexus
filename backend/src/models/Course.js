const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['video', 'quiz', 'reading'],
        default: 'video'
    },
    content: {
        type: mongoose.Schema.Types.Mixed
    },
    order: {
        type: Number,
        required: true
    },
    duration: {
        type: String
    }
});

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a course description']
    },
    category: {
        type: String,
        required: true,
        enum: ['Web Development', 'Data Science', 'AI & Machine Learning', 'Programming', 'Other']
    },
    thumbnail: {
        type: String
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lessons: [lessonSchema],
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    estimatedDuration: {
        type: String
    },
    tags: [String]
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
