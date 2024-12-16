const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Drop all indexes and let them be recreated
    const collections = await mongoose.connection.db.collections();
    
    for (let collection of collections) {
      try {
        await collection.dropIndexes();
        console.log(`Dropped indexes for ${collection.collectionName}`);
      } catch (error) {
        console.log(`No indexes to drop for ${collection.collectionName}`);
      }
    }

  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 