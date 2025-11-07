import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    await createIndexes();
    
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const createIndexes = async (): Promise<void> => {
  try {
    const db = mongoose.connection.db;
    
    if (!db) {
      console.log('⚠️  Database not ready for indexes');
      return;
    }
    
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('chatsessions').createIndex({ patientId: 1, createdAt: -1 });
    await db.collection('emotionrecords').createIndex({ patientId: 1, timestamp: -1 });
    await db.collection('questionnaires').createIndex({ patientId: 1, status: 1 });
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.log('⚠️  Some indexes may already exist');
  }
};

mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 MongoDB connection closed');
  process.exit(0);
});