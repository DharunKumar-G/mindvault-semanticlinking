# API Documentation

## Base URL
```
http://localhost:5001/api
```

## Endpoints

### Health Check

**GET** `/api/health`

Check if the API and database are running.

**Response:**
```json
{
  "status": "ok",
  "message": "MindVault API is running",
  "database": "PostgreSQL connected"
}
```

---

### Notes

#### Get All Notes

**GET** `/api/notes`

Retrieve all notes ordered by creation date.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "My First Note",
      "content": "This is the content...",
      "tags": ["idea", "project"],
      "created_at": "2025-12-29T10:00:00Z",
      "updated_at": "2025-12-29T10:00:00Z"
    }
  ]
}
```

---

#### Get Single Note

**GET** `/api/notes/:id`

Retrieve a specific note by ID.

**Parameters:**
- `id` (path parameter) - Note ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "My First Note",
    "content": "This is the content...",
    "tags": ["idea", "project"],
    "created_at": "2025-12-29T10:00:00Z",
    "updated_at": "2025-12-29T10:00:00Z"
  }
}
```

---

#### Create Note

**POST** `/api/notes`

Create a new note with AI-generated embeddings and tags.

**Request Body:**
```json
{
  "title": "My New Note",
  "content": "Note content here..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "My New Note",
    "content": "Note content here...",
    "tags": ["auto-generated-tag"],
    "created_at": "2025-12-29T11:00:00Z",
    "updated_at": "2025-12-29T11:00:00Z"
  }
}
```

---

#### Update Note

**PUT** `/api/notes/:id`

Update an existing note. Re-generates embeddings and tags.

**Parameters:**
- `id` (path parameter) - Note ID

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "Updated Title",
    "content": "Updated content...",
    "tags": ["updated-tag"],
    "updated_at": "2025-12-29T12:00:00Z"
  }
}
```

---

#### Delete Note

**DELETE** `/api/notes/:id`

Delete a note permanently.

**Parameters:**
- `id` (path parameter) - Note ID

**Response:**
```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

---

#### Semantic Search

**GET** `/api/notes/search?q=query`

Search notes by semantic meaning using vector similarity.

**Query Parameters:**
- `q` (required) - Search query text
- `limit` (optional) - Max results (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Related Note",
      "content": "Content...",
      "tags": ["tag1"],
      "similarity": 0.87,
      "created_at": "2025-12-29T10:00:00Z"
    }
  ]
}
```

---

#### Get Related Notes

**GET** `/api/notes/:id/related`

Find notes similar to a specific note.

**Parameters:**
- `id` (path parameter) - Note ID
- `limit` (query, optional) - Max results (default: 5)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "title": "Similar Note",
      "content": "Content...",
      "tags": ["tag2"],
      "similarity": 0.92,
      "created_at": "2025-12-29T09:00:00Z"
    }
  ]
}
```

---

#### Live Related Notes Suggestion

**POST** `/api/notes/related-live`

Get related notes for text being typed (before saving).

**Request Body:**
```json
{
  "content": "Text being typed..."
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "title": "Relevant Note",
      "content": "Content...",
      "similarity": 0.85
    }
  ]
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

---

## AI Features

### Auto-Categorization
When creating/updating notes, the Gemini AI automatically suggests relevant tags based on content.

### Vector Embeddings
All notes are converted to 768-dimensional vectors using Google Gemini's `text-embedding-004` model.

### Semantic Search
Uses PostgreSQL pgvector with cosine similarity to find semantically similar notes, even without keyword matches.
