require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('./firebase-config');
const usersRoutes = require('./routes/users');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows frontend to communicate with backend
app.use(express.json()); // Parses JSON requests
app.use('/uploads', express.static('backend/uploads')); // Serve uploads folder
app.use(usersRoutes); // Attach user routes

// Basic Route
app.get('/', (req, res) => {
  res.send("TrailMix Backend is Running! 🚀");
});

// Import API Routes
const trailRoutes = require('./routes/trails'); 
app.use('/trails', trailRoutes); // Routes for trail data

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));