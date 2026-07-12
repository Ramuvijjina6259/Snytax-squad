const mongoose = require('mongoose');
const { setUseMock } = require('../utils/mockMongoose');

const connectDB = async () => {
  try {
    // Attempt connection
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000 // Quick timeout to fallback fast if service is missing
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    setUseMock(false);
  } catch (error) {
    console.warn(`⚠️ MongoDB service not running. Falling back to local file storage mode.`);
    setUseMock(true);
  }
};

module.exports = connectDB;
