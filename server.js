const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve frontend HTML/CSS/JS

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected '))
.catch(err => console.error('MongoDB Connection Error ', err));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/enroll', require('./routes/enrollRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
const helmet = require("helmet");
app.use(helmet());


// Health check
app.get('/', (req, res) => {
  res.send('CourseHub API is running 🚀');
});


app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
