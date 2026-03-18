require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // import DB connection

const app = express();

// connecting to DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// simple test route
app.get('/', (req, res) => {
    res.send('Welcome to the EduNexus API! 🚀');
});

// Define the port (uses the one in .env or defaults to 5000)
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running smoothly on http://localhost:${PORT}`);
});