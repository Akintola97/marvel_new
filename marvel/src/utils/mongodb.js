import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI; // Your MongoDB URI

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env');
}

async function dbConnect() {
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log("DB is connected");  // Log the connection message here
    } catch (err) {
      console.error("DB connection error:", err);
      throw err; // Rethrow the error so it can be caught by the caller if necessary
    }
  } else {
    console.log("DB is already connected");
  }
}

export default dbConnect;
