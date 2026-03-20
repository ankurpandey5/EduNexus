const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'short-answer'],
        default: 'multiple-choice'
    },
    options: [{
        type: String
    }],
    correctAnswer: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    points: {
        type: Number,
        default: 1
    },
    explanation: {
        type: String
    }
});

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a quiz title']
    },
    description: {
        type: String
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
    questions: [questionSchema],
    timeLimit: {
        type: Number,
        default: 30
    },
    passingScore: {
        type: Number,
        default: 70
    },
    maxAttempts: {
        type: Number,
        default: 3
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);
