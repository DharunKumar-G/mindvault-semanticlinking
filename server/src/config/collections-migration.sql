-- Migration to add collections/folders feature

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(20) DEFAULT 'slate',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add collection_id to notes table
ALTER TABLE notes ADD COLUMN IF NOT EXISTS collection_id INTEGER REFERENCES collections(id) ON DELETE SET NULL;

-- Create index on collection_id
CREATE INDEX IF NOT EXISTS notes_collection_id_idx ON notes(collection_id);

-- Trigger to update collections updated_at
CREATE TRIGGER update_collections_updated_at 
BEFORE UPDATE ON collections 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Insert default collections
INSERT INTO collections (name, description, color) 
VALUES 
  ('General', 'Uncategorized notes', 'slate'),
  ('Work', 'Work-related notes', 'blue'),
  ('Personal', 'Personal thoughts and ideas', 'purple'),
  ('Learning', 'Study notes and learning resources', 'green')
ON CONFLICT DO NOTHING;

COMMENT ON TABLE collections IS 'Organizes notes into folders/collections';
COMMENT ON COLUMN collections.color IS 'Tailwind color name for UI display';
