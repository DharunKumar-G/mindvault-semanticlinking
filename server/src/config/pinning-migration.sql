-- Migration to add pinning, archiving, and view tracking features

-- Add pinned flag to notes
ALTER TABLE notes ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;

-- Add archived flag to notes
ALTER TABLE notes ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;

-- Add last viewed timestamp
ALTER TABLE notes ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMP;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS notes_is_pinned_idx ON notes(is_pinned) WHERE is_pinned = TRUE;
CREATE INDEX IF NOT EXISTS notes_is_archived_idx ON notes(is_archived) WHERE is_archived = FALSE;
CREATE INDEX IF NOT EXISTS notes_last_viewed_idx ON notes(last_viewed_at DESC NULLS LAST);

COMMENT ON COLUMN notes.is_pinned IS 'Whether the note is pinned to the top of lists';
COMMENT ON COLUMN notes.is_archived IS 'Whether the note is archived (hidden from main view)';
COMMENT ON COLUMN notes.last_viewed_at IS 'Timestamp of when the note was last viewed';
