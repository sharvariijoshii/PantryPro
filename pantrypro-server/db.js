const mongoose = require('mongoose');
require('dotenv').config();

// Get MongoDB URI from environment variables or use local fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pantrypro';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // If remote connection fails, try connecting to local MongoDB
    if (MONGO_URI !== 'mongodb://localhost:27017/pantrypro') {
      console.log('Attempting to connect to local MongoDB...');
      try {
        await mongoose.connect('mongodb://localhost:27017/pantrypro', {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        console.log('Connected to local MongoDB successfully');
        return true;
      } catch (localError) {
        console.error('Local MongoDB connection error:', localError);
        return false;
      }
    }
    return false;
  }
};

module.exports = connectDB;
