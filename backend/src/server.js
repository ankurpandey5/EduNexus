const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
    res.send('Welcome to the EduNexus API!');
});

// Define the port (uses the one in .env or defaults to 5000)
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});