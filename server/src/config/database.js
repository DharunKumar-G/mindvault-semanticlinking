import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'mindvault';

let client = null;
let db = null;

export async function connectToDatabase() {
  if (db) return { client, db };

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log('✅ Connected to MongoDB Atlas');
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function getDatabase() {
  if (!db) {
    await connectToDatabase();
  }
  return db;
}

export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
}

export { client, db };
