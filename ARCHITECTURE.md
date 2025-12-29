# MindVault Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                             │
│                     (React + Vite + Tailwind)                    │
└──────────────────────────────────────────────────────────────────┘
                                  │
                                  ↓
┌──────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                             │
├──────────────────────────────────────────────────────────────────┤
│  Components:                                                      │
│  • Header (Search Bar)          • NotesList (Grid View)          │
│  • NoteEditor (Create/Edit)     • NoteDetail (View)              │
│  • SearchResults                • RelatedNotes                   │
│  • RelatedNotesLive (Real-time)                                  │
├──────────────────────────────────────────────────────────────────┤
│  Services:                                                        │
│  • API Client (Axios)           • Utilities (Debounce, Format)   │
└──────────────────────────────────────────────────────────────────┘
                                  │
                          HTTP/REST API
                                  ↓
┌──────────────────────────────────────────────────────────────────┐
│                        BACKEND LAYER                              │
│                     (Node.js + Express)                          │
├──────────────────────────────────────────────────────────────────┤
│  API Routes:                                                      │
│  • GET    /api/notes              - List all notes               │
│  • POST   /api/notes              - Create note                  │
│  • GET    /api/notes/:id          - Get single note              │
│  • PUT    /api/notes/:id          - Update note                  │
│  • DELETE /api/notes/:id          - Delete note                  │
│  • GET    /api/notes/search       - Semantic search              │
│  • GET    /api/notes/:id/related  - Get related notes            │
│  • POST   /api/notes/related-by-content - Real-time suggestions  │
│  • POST   /api/notes/categorize   - AI tag suggestions           │
└──────────────────────────────────────────────────────────────────┘
                                  │
                                  ↓
┌──────────────────────────────────────────────────────────────────┐
│                        SERVICE LAYER                              │
├──────────────────────────────────────────────────────────────────┤
│  noteService.js:                                                  │
│  • CRUD operations              • Vector search queries          │
│  • Related notes logic          • Data transformation            │
│                                                                   │
│  embeddingService.js:                                             │
│  • Generate embeddings          • Batch processing               │
│  • OpenAI API integration       • Vector management              │
│                                                                   │
│  categorizationService.js:                                        │
│  • Auto-tag suggestions         • GPT-3.5 integration            │
│  • Tag management               • Content analysis               │
└──────────────────────────────────────────────────────────────────┘
            │                              │
            ↓                              ↓
┌──────────────────────┐    ┌────────────────────────────────┐
│   OpenAI API         │    │   MongoDB Atlas                │
├──────────────────────┤    ├────────────────────────────────┤
│ • text-embedding-    │    │ Database: mindvault            │
│   3-small (1536D)    │    │ Collection: notes              │
│ • gpt-3.5-turbo      │    │                                │
│                      │    │ Vector Search Index:           │
│ Returns:             │    │ • Name: vector_index           │
│ [0.12, -0.04, ...]  │    │ • Dimensions: 1536             │
│                      │    │ • Similarity: cosine           │
└──────────────────────┘    └────────────────────────────────┘
```

## Data Flow: Creating a Note

```
1. User types note
        ↓
2. Frontend: NoteEditor component
        ↓
3. POST /api/notes
        ↓
4. Backend: noteService.createNote()
        ├→ embeddingService.generateEmbedding()
        │       ↓
        │   OpenAI API (text-embedding-3-small)
        │       ↓
        │   Returns: [0.12, -0.04, 0.89, ..., 0.34] (1536 numbers)
        │
        └→ categorizationService.categorizeNote()
                ↓
            GPT-3.5 Turbo
                ↓
            Returns: ["Travel", "Memories"]
        ↓
5. MongoDB: Insert document
   {
     _id: ObjectId,
     title: "...",
     content: "...",
     tags: ["Travel", "Memories"],
     embedding: [0.12, -0.04, ...],  // 1536 dimensions
     createdAt: Date,
     updatedAt: Date
   }
        ↓
6. Response to frontend
        ↓
7. UI updates with new note
```

## Data Flow: Semantic Search

```
1. User types search query: "peaceful moments"
        ↓
2. Frontend: Header component (debounced)
        ↓
3. GET /api/notes/search?q=peaceful%20moments
        ↓
4. Backend: noteService.semanticSearch()
        ↓
5. embeddingService.generateEmbedding("peaceful moments")
        ↓
6. OpenAI API returns query vector: [0.45, -0.23, ...]
        ↓
7. MongoDB Atlas Vector Search:
   db.notes.aggregate([
     {
       $vectorSearch: {
         index: "vector_index",
         path: "embedding",
         queryVector: [0.45, -0.23, ...],
         numCandidates: 100,
         limit: 10
       }
     },
     {
       $project: {
         title: 1,
         content: 1,
         tags: 1,
         score: { $meta: "vectorSearchScore" }
       }
     }
   ])
        ↓
8. MongoDB returns similar notes with similarity scores:
   [
     { title: "Calming sunset", score: 0.89 },
     { title: "Quiet evening", score: 0.82 },
     ...
   ]
        ↓
9. Response to frontend with results
        ↓
10. SearchResults component displays with match percentages
```

## Data Flow: Related Notes (Real-time)

```
1. User types in NoteEditor
        ↓
2. RelatedNotesLive component (debounced 1000ms)
        ↓
3. POST /api/notes/related-by-content
   Body: { content: "As I walked through the park..." }
        ↓
4. Backend generates embedding for current text
        ↓
5. Vector search against all notes
        ↓
6. Returns top 5 similar notes
        ↓
7. Sidebar updates in real-time showing:
   - Related note titles
   - Content previews
   - Similarity scores
   - Links to full notes
```

## MongoDB Document Structure

```javascript
{
  _id: ObjectId("..."),
  title: "The sunset at the beach yesterday was calming",
  content: "Sitting by the ocean watching the colors...",
  tags: ["Travel", "Memories", "Nature"],
  embedding: [
    0.12453,
    -0.04231,
    0.89234,
    // ... 1533 more numbers
    0.34567
  ],  // Total: 1536 dimensions
  createdAt: ISODate("2025-12-26T10:30:00Z"),
  updatedAt: ISODate("2025-12-26T10:30:00Z")
}
```

## Vector Search Index Configuration

```json
{
  "name": "vector_index",
  "type": "vectorSearch",
  "definition": {
    "fields": [
      {
        "type": "vector",
        "path": "embedding",
        "numDimensions": 1536,
        "similarity": "cosine"
      }
    ]
  }
}
```

## Technology Stack

```
┌─────────────────────────────────────┐
│          Frontend Stack              │
├─────────────────────────────────────┤
│ • React 18                          │
│ • React Router 6                    │
│ • Vite (Build Tool)                 │
│ • TailwindCSS 3                     │
│ • Axios (HTTP Client)               │
│ • Lucide React (Icons)              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│          Backend Stack               │
├─────────────────────────────────────┤
│ • Node.js 18+                       │
│ • Express 4                         │
│ • MongoDB Driver 6                  │
│ • OpenAI SDK 4                      │
│ • dotenv (Config)                   │
│ • CORS                              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│       External Services              │
├─────────────────────────────────────┤
│ • MongoDB Atlas (M0 Free Tier)      │
│ • OpenAI API                        │
│   - text-embedding-3-small          │
│   - gpt-3.5-turbo                   │
└─────────────────────────────────────┘
```

## File Count Summary

- **Source Files**: 18 JavaScript/JSX files
- **Total Project Files**: 28 files
- **Documentation**: 4 comprehensive guides
- **Configuration**: 6 config files

## Key Algorithms

### Cosine Similarity
```
similarity = (A · B) / (||A|| × ||B||)

Where:
- A and B are embedding vectors
- · is dot product
- ||A|| is the magnitude of vector A

Result: Score from 0 (unrelated) to 1 (identical)
```

### Real-time Debouncing
```javascript
// Wait 1000ms after user stops typing
debounce(searchFunction, 1000)

Prevents:
- Excessive API calls
- Rate limiting
- Poor UX from too many updates
```

---

This architecture enables:
✅ Sub-second semantic search
✅ Real-time related note suggestions
✅ AI-powered auto-categorization
✅ Scalable to 100,000+ notes
✅ Cost-effective ($1 per 10,000 notes)
