const express = require('express');
const router = express.Router();

// Import controller functions
const { registerUser, loginUser } = require('../controllers/authController');

// When someone sends a POST request to /register, run the registerUser function
router.post('/register', registerUser);

// When someone sends a POST request to /login, run the loginUser function
router.post('/login', loginUser);

module.exports = router;