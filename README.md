# MindVault 🧠✨

**Semantic Personal Notes powered by MongoDB Atlas Vector Search**

MindVault is a second-brain application that understands the *intent* and *context* of your thoughts, not just keywords. It uses AI-powered embeddings and vector search to connect related ideas, even when they share zero overlapping words.

![MindVault Banner](https://img.shields.io/badge/AI-Powered-purple?style=for-the-badge) ![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge) ![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)

---

## 🌟 Key Features

### 1. **Semantic Search** 
Search notes by *meaning*, not just keywords. Query "peaceful evening memories" and find notes about "calming sunset at the beach" — even though they share no words.

### 2. **Real-Time Related Notes**
As you type a new note, a smart sidebar automatically shows similar past notes, helping you connect old ideas to new ones.

### 3. **AI Auto-Categorization**
The AI automatically suggests relevant tags (e.g., #Travel, #Health, #Ideas) based on your note's content.

### 4. **Vector-Powered Intelligence**
Each note is converted into a 1536-dimensional vector using OpenAI's embedding model, enabling mathematical similarity comparisons.

---

## 🏗️ Architecture

### **Tech Stack**
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas with Vector Search
- **AI**: OpenAI Embeddings API (text-embedding-3-small)

### **How It Works**

```
User writes note → OpenAI generates embedding vector → 
Stored in MongoDB with Vector Index → 
User searches → Query vectorized → 
$vectorSearch finds similar notes by cosine similarity
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (free tier works!)
- OpenAI API key

### 1. Clone the Repository

```bash
git clone https://github.com/DharunKumar-G/mindvault-semanticlinking.git
cd mindvault-semanticlinking
```

### 2. Install Dependencies

```bash
npm run install:all
```

This installs dependencies for the root, server, and client.

### 3. Set Up MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database called `mindvault`
3. Create a collection called `notes`
4. **Create a Vector Search Index**:
   - Go to "Atlas Search" tab
   - Click "Create Search Index" → "JSON Editor"
   - Select `mindvault.notes` collection
   - Name it `vector_index`
   - Use this definition:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,
      "similarity": "cosine"
    }
  ]
}
```

5. Get your connection string and add it to `.env`

### 4. Configure Environment Variables

Create `server/.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/mindvault?retryWrites=true&w=majority
OPENAI_API_KEY=sk-your-openai-api-key
PORT=5000
DB_NAME=mindvault
COLLECTION_NAME=notes
```

### 5. Run the Application

**Development mode (with hot reload):**

```bash
npm run dev
```

This starts:
- Backend API on `http://localhost:5000`
- React frontend on `http://localhost:3000`

**Or run separately:**

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

---

## 📖 Usage Guide

### Creating a Note
1. Click "New Note"
2. Write your title and content
3. AI will auto-suggest tags
4. Watch the "Related Notes" sidebar populate in real-time

### Semantic Search
Use the search bar to find notes by *meaning*:
- "peaceful evening memories" → finds "calming sunset at beach"
- "productivity tips" → finds "how I stay focused at work"
- "happy moments" → finds "the day I got promoted"

### Related Notes
- **In Note Detail**: See similar notes in the sidebar
- **While Editing**: Live preview of related notes as you type

---

## 🧪 API Endpoints

### Notes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes |
| GET | `/api/notes/:id` | Get single note |
| POST | `/api/notes` | Create new note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

### Search & AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes/search?q=query` | Semantic search |
| GET | `/api/notes/:id/related` | Get related notes |
| POST | `/api/notes/related-by-content` | Find related by text |
| POST | `/api/notes/categorize` | Get AI tag suggestions |
| GET | `/api/notes/tags` | Get available tags |

### Example Request

```bash
# Semantic Search
curl "http://localhost:5000/api/notes/search?q=peaceful%20moments&limit=5"

# Create Note
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Morning Coffee Ritual",
    "content": "The quiet moment before sunrise with a warm cup is my favorite part of the day.",
    "tags": ["Wellness", "Reflection"]
  }'
```

---

## 🎨 Features Deep Dive

### 1. Vector Embeddings

Each note is converted to a 1536-dimensional vector using OpenAI's `text-embedding-3-small` model:

```javascript
const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: `${title} ${content}`,
});
```

### 2. MongoDB Vector Search

Uses the `$vectorSearch` aggregation pipeline:

```javascript
const pipeline = [
  {
    $vectorSearch: {
      index: 'vector_index',
      path: 'embedding',
      queryVector: queryEmbedding,
      numCandidates: 100,
      limit: 10,
    },
  },
  {
    $project: {
      title: 1,
      content: 1,
      tags: 1,
      score: { $meta: 'vectorSearchScore' },
    },
  },
];
```

### 3. AI Categorization

Uses GPT-3.5 to suggest tags:

```javascript
const response = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [
    {
      role: 'system',
      content: 'Suggest 1-3 tags from: Travel, Health, Work...',
    },
    { role: 'user', content: noteContent },
  ],
});
```

---

## 🛠️ Project Structure

```
mindvault-semanticlinking/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Header.jsx
│   │   │   ├── NotesList.jsx
│   │   │   ├── NoteEditor.jsx
│   │   │   ├── NoteDetail.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   ├── RelatedNotes.jsx
│   │   │   └── RelatedNotesLive.jsx
│   │   ├── services/          # API client
│   │   ├── utils/             # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── server/                    # Node.js backend
│   ├── src/
│   │   ├── config/            # Database config
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   │   ├── embeddingService.js
│   │   │   ├── categorizationService.js
│   │   │   └── noteService.js
│   │   ├── scripts/           # Setup scripts
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── package.json               # Root workspace config
└── README.md
```

---

## 🔒 Security Notes

- Never commit `.env` files
- Use environment variables for all secrets
- Restrict MongoDB Atlas IP whitelist in production
- Implement rate limiting for API endpoints
- Validate and sanitize all user inputs

---

## 🐛 Troubleshooting

### Vector Search Not Working

**Error**: `$vectorSearch is not supported`

**Solution**: Ensure you've created the Vector Search Index in MongoDB Atlas (not a regular index).

### OpenAI API Errors

**Error**: `Invalid API key`

**Solution**: Check your `.env` file and ensure `OPENAI_API_KEY` is set correctly.

### No Related Notes Showing

**Issue**: Related notes sidebar is empty

**Solution**: 
1. Ensure you have at least 2-3 notes created
2. Check that the vector index is active in Atlas
3. Verify embeddings are being generated (check MongoDB documents)

---

## 🚀 Deployment

### Backend (Railway/Render/Heroku)

1. Set environment variables in platform dashboard
2. Deploy from GitHub
3. Ensure MongoDB Atlas allows connections from your host

### Frontend (Vercel/Netlify)

1. Build command: `cd client && npm run build`
2. Publish directory: `client/dist`
3. Add environment variable for API URL if needed

---

## 📝 License

MIT License - feel free to use this project for learning or production!

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## 💡 Use Cases

- **Personal Knowledge Management**: Build a searchable second brain
- **Research Notes**: Connect research across different topics
- **Journal Entries**: Find patterns in your thoughts over time
- **Meeting Notes**: Recall discussions by topic, not date
- **Learning**: Connect concepts across courses

---

## 🙏 Acknowledgments

- MongoDB Atlas for Vector Search capabilities
- OpenAI for embedding models
- The open-source community

---

**Built with 💜 by [DharunKumar-G](https://github.com/DharunKumar-G)**

*"Your thoughts, understood and connected."*
