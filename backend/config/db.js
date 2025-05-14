// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MongoDB connection URI is missing in .env file");
    }

    const maskedURI = process.env.MONGO_URI.replace(
      /(mongodb\+srv:\/\/[^:]+:)([^@]+)/,
      '$1********'
    );
    console.log('🔗 Connecting to MongoDB:', maskedURI);

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority',
      retryReads: true
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log('✅ MongoDB Connected:');
    console.log(`   • Host: ${conn.connection.host}`);
    console.log(`   • Database: ${conn.connection.name}`);
    console.log(`   • Collections: ${Object.keys(conn.connection.collections).length}`);
    console.log(`   • Ready State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('Mongoose disconnected from DB');
    });

  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed:');
    console.error('   • Error:', error.message);
    console.error('   • Error Code:', error.code || 'N/A');
    console.error('   • Reason:', error.reason || 'Unknown');

    if (error.name === 'MongoServerSelectionError') {
      console.error('   • Solution: Check your internet connection and MongoDB Atlas IP whitelist');
      console.error('   • Action: Whitelist your current IP in MongoDB Atlas dashboard');
    } else if (error.code === 'ETIMEOUT') {
      console.error('   • Solution: Check your network connection or MongoDB status');
    } else if (error.code === 'ENOTFOUND') {
      console.error('   • Solution: Verify your MongoDB URI is correct');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('   • Solution: MongoDB service might not be running or accessible');
    }

    console.error('\nFor MongoDB Atlas users:');
    console.error('1. Go to MongoDB Atlas Dashboard');
    console.error('2. Navigate to Network Access');
    console.error('3. Add your current IP address to the whitelist');
    console.error('4. Ensure your database user credentials are correct\n');

    process.exit(1);
  }
};

module.exports = connectDB;