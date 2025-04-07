const path = require('path');

// 1. Configure module paths to use package/node_modules
process.env.NODE_PATH = path.join(__dirname, 'package/node_modules');
require('module').Module._initPaths();

// 2. Load environment variables with absolute path
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Debug output
console.log('🔍 Environment Path:', path.join(__dirname, '.env'));
console.log('📋 Environment Variables Loaded:', {
  MONGO_URI: process.env.MONGO_URI ? '✅ Loaded (hidden for security)' : '❌ Missing',
  PORT: process.env.PORT || '3000 (default)'
});

// 3. Main application
const express = require("express");
const connectDB = require("./db");
const basicRoutes = require("./routes/basic");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use("/", basicRoutes);

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

startServer()
