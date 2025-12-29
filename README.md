# MindVault 🧠✨

**Semantic Personal Notes powered by PostgreSQL pgvector & Google Gemini**

MindVault is a second-brain application that understands the *intent* and *context* of your thoughts, not just keywords. It uses AI-powered embeddings and vector search to connect related ideas, even when they share zero overlapping words.

![MindVault Banner](https://img.shields.io/badge/AI-Powered-purple?style=for-the-badge) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-blue?style=for-the-badge) ![MERN Stack](https://img.shields.io/badge/Stack-PERN-green?style=for-the-badge)

---

## 🌟 Key Features

### 1. **Semantic Search** 
Search notes by *meaning*, not just keywords. Query "peaceful evening memories" and find notes about "calming sunset at the beach" — even though they share no words.

### 2. **Real-Time Related Notes**
As you type a new note, a smart sidebar automatically shows similar past notes, helping you connect old ideas to new ones.

### 3. **AI Auto-Categorization**
The AI automatically suggests relevant tags (e.g., #Travel, #Health, #Ideas) based on your note's content.

### 4. **Vector-Powered Intelligence**
Each note is converted into a 768-dimensional vector using Google Gemini's embedding model, enabling mathematical similarity comparisons.

---

## 🏗️ Architecture

### **Tech Stack**
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL with pgvector extension
- **AI**: Google Gemini (embedding-001 + gemini-pro)

### **How It Works**

```
User writes note → Gemini generates embedding vector → 
Stored in PostgreSQL with vector column → 
User searches → Query vectorized → 
pgvector finds similar notes by cosine similarity
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 15+ with pgvector extension
- Google Gemini API key (FREE!)

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

### 3. Set Up PostgreSQL with pgvector

Follow the detailed guide in [POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md)

**Quick Start with Docker:**

```bash
docker run -d \
  --name mindvault-postgres \
  -e POSTGRES_DB=mindvault \
  -e POSTGRES_USER=mindvault_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  pgvector/pgvector:pg15
```

### 4. Initialize Database

```bash
cd server
npm run init:db
```

This creates the notes table with vector column and indexes.

### 5. Configure Environment Variables

Create `server/.env`:

```env
DATABASE_URL=postgresql://mindvault_user:your_password@localhost:5432/mindvault
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

**Get FREE Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy to `.env` file

Free tier: 60 requests/min, 1500/day - perfect for personal use!

### 6. Run the Application

```bash
npm run dev
```

This starts:
- Backend API on `http://localhost:5000`
- React frontend on `http://localhost:3000`

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

Each note is converted to a 768-dimensional vector using Google Gemini's `text-embedding-004` model:

```javascript
const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
const result = await model.embedContent(`${title} ${content}`);
const embedding = result.embedding.values;
```

### 2. PostgreSQL Vector Search

Uses pgvector with cosine distance for similarity:

```sql
SELECT 
  id, title, content, tags,
  1 - (embedding <=> $1) as score
FROM notes
ORDER BY embedding <=> $1
LIMIT 10;
```

The `<=>` operator calculates cosine distance. Lower distance = more similar.

### 3. AI Categorization

Uses Gemini Pro to suggest tags:

```javascript
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
const result = await model.generateContent(`Categorize this note: "${content}"`);
const tags = JSON.parse(result.response.text());
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

### pgvector Extension Not Found

**Error**: `extension "vector" does not exist`

**Solution**: Install pgvector and enable it:
```bash
# Connect to database
psql -d mindvault
# Enable extension
CREATE EXTENSION vector;
```

### Gemini API Errors

**Error**: `Invalid API key`

**Solution**: Check your `.env` file and ensure `GEMINI_API_KEY` is set correctly. Get a free key at [Google AI Studio](https://makersuite.google.com/app/apikey).

### Database Connection Failed

**Issue**: Cannot connect to PostgreSQL

**Solution**: 
1. Ensure PostgreSQL is running: `sudo systemctl status postgresql`
2. Check connection settings in `.env`
3. Verify user permissions: `GRANT ALL ON DATABASE mindvault TO mindvault_user;`

### No Related Notes Showing

**Issue**: Related notes sidebar is empty

**Solution**: 
1. Ensure you have at least 2-3 notes created
2. Check that pgvector index exists: `\d notes` in psql
3. Verify embeddings are being generated (check notes table)

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

## � Cost Estimates

### PostgreSQL Hosting (Choose One)

| Option | Cost | Storage | Best For |
|--------|------|---------|----------|
| **Local/Docker** | FREE | Unlimited | Development |
| **Supabase** | FREE tier: 500MB | 500MB | Small projects |
| **Neon** | FREE tier: 3GB | 3GB | Serverless apps |
| **DigitalOcean** | $15/month | 10GB | Production |
| **AWS RDS** | ~$15-30/month | Varies | Enterprise |

### Google Gemini API (FREE!)

- **Embedding** (text-embedding-004): FREE
- **Text Generation** (gemini-pro): FREE
- **Rate Limits**: 60 requests/min, 1500/day
- **Perfect for**: Personal use, small teams

### Total Cost Examples

- **Personal Use** (Local PostgreSQL + Gemini): **$0/month** 🎉
- **Small Team** (Supabase + Gemini): **$0/month** (up to 500MB)
- **Production** (DigitalOcean + Gemini): **~$15/month**

Compare to MongoDB Atlas + OpenAI: ~$20-50/month minimum

---

## 🙏 Acknowledgments

- MongoDB Atlas for Vector Search capabilities
- OpenAI for embedding models
- The open-source community

---

**Built with 💜 by [DharunKumar-G](https://github.com/DharunKumar-G)**

*"Your thoughts, understood and connected."*
