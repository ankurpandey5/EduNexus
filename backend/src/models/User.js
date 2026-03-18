const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name']
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true, 
            lowercase: true
        },
        password: {
            type: String,
            required: [true, 'Please add a password']
        },
        role: {
            type: String,
            enum: ['student', 'teacher', 'admin'], // only allowed roles
            default: 'student' // If not specified, then Student
        }
    },
    {
        timestamps: true // Automatically add 'createdAt' and 'updatedAt' 
    }
);

// Exporting model to use in controllers
module.exports = mongoose.model('User', userSchema);