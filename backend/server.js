require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors()); // Allows frontend to communicate with backend
app.use(express.json()); // Parses JSON requests

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Basic Route
app.get('/', (req, res) => {
  res.send("TrailMix Backend is Running! 🚀");
});

// Import API Routes
const trailRoutes = require('./routes/trails'); 
app.use('/trails', trailRoutes); // Routes for trail data

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
