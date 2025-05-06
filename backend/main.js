// backend/main.js

const express = require("express");
const cors = require('cors');
const path = require('path');
const connectDB = require("./config/db");
const basicRoutes = require("./routes/basic");
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

// Static files
app.use('/backend/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api", basicRoutes);
app.use('/api/auth', authRoutes);

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer();