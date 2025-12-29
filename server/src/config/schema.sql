-- MindVault PostgreSQL Schema with pgvector extension

-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  embedding vector(768),  -- Gemini embedding-001 produces 768-dimensional vectors
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on embedding column for fast vector similarity search
CREATE INDEX IF NOT EXISTS notes_embedding_idx ON notes 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS notes_created_at_idx ON notes(created_at DESC);

-- Create index on tags using GIN for array searching
CREATE INDEX IF NOT EXISTS notes_tags_idx ON notes USING GIN(tags);

-- Create full-text search index on title and content
CREATE INDEX IF NOT EXISTS notes_search_idx ON notes 
USING GIN(to_tsvector('english', title || ' ' || content));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_notes_updated_at 
BEFORE UPDATE ON notes 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Sample query functions
COMMENT ON TABLE notes IS 'Stores notes with vector embeddings for semantic search';
COMMENT ON COLUMN notes.embedding IS 'Gemini embedding-001 768-dimensional vector for semantic search';
COMMENT ON INDEX notes_embedding_idx IS 'IVFFlat index for fast cosine similarity search';
