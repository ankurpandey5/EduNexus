const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    completedLessons: [{
        lesson: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        completedAt: {
            type: Date,
            default: Date.now
        },
        timeSpent: {
            type: Number,
            default: 0
        }
    }],
    quizScores: [{
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz',
            required: true
        },
        score: {
            type: Number,
            required: true
        },
        maxScore: {
            type: Number,
            required: true
        },
        attemptedAt: {
            type: Date,
            default: Date.now
        },
        attemptNumber: {
            type: Number,
            default: 1
        }
    }],
    overallProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    timeSpent: {
        type: Number,
        default: 0
    },
    lastAccessedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },
    certificate: {
        type: String
    }
}, {
    timestamps: true
});

progressSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
