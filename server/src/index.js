import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/database.js';
import notesRouter from './routes/notes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notes', notesRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MindVault API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function startServer() {
  try {
    await connectToDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 MindVault server running on port ${PORT}`);
      console.log(`📚 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
