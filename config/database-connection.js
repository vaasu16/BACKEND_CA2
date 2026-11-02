import mongoose from 'mongoose';

async function connectDatabase() {
  const databaseUri = process.env.MONGODB_URI;

  if (!databaseUri) {
    throw new Error('Please add MONGODB_URI to your .env file');
  }

  await mongoose.connect(databaseUri);
  console.log('MongoDB connection is ready');
}

export default connectDatabase;