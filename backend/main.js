// backend/main.js

const path = require('path');
const express = require("express");
const cors = require('cors');
const connectDB = require("./config/db");
const basicRoutes = require("./routes/basic");

const app = express(); // Declare `app` only once
const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from the frontend
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// Serve static files - exact path matching
app.use('/backend/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
  }
}));

app.use(express.json());

// Serve static files from the uploads folder
app.use('/backend/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api", basicRoutes); // All routes will be prefixed with /api

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Debug output
console.log('🔍 Environment Path:', path.join(__dirname, '.env'));
console.log('📋 Environment Variables Loaded:', {
  MONGO_URI: process.env.MONGO_URI ? '✅ Loaded (hidden for security)' : '❌ Missing',
  PORT: process.env.PORT || '3000 (default)'
});

// Server startup
const startServer = async () => {
  try {
    console.log('⏳ Starting server...');
    await connectDB();
    app.listen(PORT, () => {
      console.log(`\n🚀 Server successfully started:`);
      console.log(`   • Local: http://localhost:${PORT}`);
      console.log(`   • Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   • Database: Connected to MongoDB\n`);
    });
  } catch (error) {
    console.error('\n💥 Critical Server Error:');
    console.error('   • Message:', error.message);
    console.error('   • Stack:', error.stack.split('\n')[1].trim());
    process.exit(1);
  }
};

startServer();