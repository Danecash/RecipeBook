//backend/config/db.js
// MongoDB connection configuration with enhanced error handling and logging

const mongoose = require('mongoose');

// Connection with enhanced options and debugging
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MongoDB connection URI is missing in .env file");
    }

    // Mask password in logs
    const maskedURI = process.env.MONGO_URI.replace(
      /(mongodb\+srv:\/\/[^:]+:)([^@]+)/,
      '$1********'
    );
    console.log('🔗 Connecting to MongoDB:', maskedURI);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    });

    console.log('✅ MongoDB Connected:');
    console.log(`   • Host: ${conn.connection.host}`);
    console.log(`   • Database: ${conn.connection.name}`);
    console.log(`   • Collections: ${Object.keys(conn.connection.collections).length}`);

  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed:');
    console.error('   • Error:', error.message);
    console.error('   • Reason:', error.reason || 'Unknown');

    if (error.code === 'ENOTFOUND') {
      console.error('   • Solution: Check your network connection or MongoDB Atlas URL');
    } else if (error.code === 'ETIMEOUT') {
      console.error('   • Solution: Increase timeout in db.js or check MongoDB status');
    }

    process.exit(1);
  }
};

module.exports = connectDB