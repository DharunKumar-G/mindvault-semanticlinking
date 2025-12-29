# 🚀 Quick Start Guide

Get MindVault running in **5 minutes**!

## Option 1: Docker (Fastest) 🐳

```bash
# 1. Clone repository
git clone https://github.com/DharunKumar-G/mindvault-semanticlinking.git
cd mindvault-semanticlinking

# 2. Start PostgreSQL with pgvector
docker run -d --name mindvault-postgres \
  -e POSTGRES_DB=mindvault \
  -e POSTGRES_USER=mindvault_user \
  -e POSTGRES_PASSWORD=mysecurepassword \
  -p 5432:5432 \
  pgvector/pgvector:pg15

# 3. Install dependencies
npm run install:all

# 4. Create server/.env
cat > server/.env << EOF
DATABASE_URL=postgresql://mindvault_user:mysecurepassword@localhost:5432/mindvault
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
EOF

# 5. Get FREE Gemini API key
# Visit: https://makersuite.google.com/app/apikey
# Add it to server/.env

# 6. Initialize database
cd server && npm run init:db && cd ..

# 7. Start the application
npm run dev
```

Visit: http://localhost:3000 🎉

---

## Option 2: Supabase (100% Cloud, FREE) ☁️

```bash
# 1. Clone repository
git clone https://github.com/DharunKumar-G/mindvault-semanticlinking.git
cd mindvault-semanticlinking

# 2. Create FREE Supabase account
# Visit: https://supabase.com/
# Create a new project (takes 2 minutes)

# 3. Get connection string
# In Supabase Dashboard: Settings > Database > Connection String > URI
# Example: postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres

# 4. Install dependencies
npm run install:all

# 5. Create server/.env
cat > server/.env << EOF
DATABASE_URL=your_supabase_connection_string_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
EOF

# 6. Get FREE Gemini API key
# Visit: https://makersuite.google.com/app/apikey

# 7. Initialize database (pgvector is pre-installed in Supabase!)
cd server && npm run init:db && cd ..

# 8. Start the application
npm run dev
```

Visit: http://localhost:3000 🎉

---

## Option 3: Local PostgreSQL 💻

### Ubuntu/Debian

```bash
# 1. Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib postgresql-15-pgvector

# 2. Create database
sudo -u postgres psql
CREATE DATABASE mindvault;
CREATE USER mindvault_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE mindvault TO mindvault_user;
\c mindvault
CREATE EXTENSION vector;
\q

# 3. Clone and setup
git clone https://github.com/DharunKumar-G/mindvault-semanticlinking.git
cd mindvault-semanticlinking
npm run install:all

# 4. Configure
cat > server/.env << EOF
DATABASE_URL=postgresql://mindvault_user:yourpassword@localhost:5432/mindvault
GEMINI_API_KEY=get_from_google_ai_studio
PORT=5000
EOF

# 5. Initialize and run
cd server && npm run init:db && cd ..
npm run dev
```

### macOS

```bash
# 1. Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# 2. Install pgvector
cd /tmp
git clone https://github.com/pgvector/pgvector.git
cd pgvector
make
make install

# 3. Create database
psql postgres
CREATE DATABASE mindvault;
CREATE USER mindvault_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE mindvault TO mindvault_user;
\c mindvault
CREATE EXTENSION vector;
\q

# 4. Clone and setup (same as Linux above)
```

---

## Verify Installation

```bash
# Test API
curl http://localhost:5000/api/health

# Expected response:
{
  "status": "ok",
  "message": "MindVault API is running",
  "database": "PostgreSQL connected"
}
```

---

## First Steps

1. **Create a note**
   - Click "New Note"
   - Title: "My first semantic note"
   - Content: "This is amazing! The AI will understand the meaning of my thoughts."
   - Watch tags auto-suggest ✨

2. **Create another note**
   - Title: "AI-powered note taking"
   - Content: "This system uses vector embeddings to find similar ideas."

3. **Search by meaning**
   - Search: "intelligent note system"
   - Both notes will appear, even though they don't share exact words!

4. **Check related notes**
   - Open any note
   - See similar notes in the sidebar
   - Start typing a new note - watch real-time suggestions

---

## Troubleshooting

### "Cannot connect to database"
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql   # Linux
brew services list                  # macOS
docker ps                          # Docker

# Test connection
psql postgresql://mindvault_user:password@localhost:5432/mindvault
```

### "extension vector does not exist"
```bash
psql -d mindvault
CREATE EXTENSION vector;
\q
```

### "Invalid API key"
- Get a FREE key: https://makersuite.google.com/app/apikey
- Update `server/.env` with your key

---

## Need Help?

- 📚 Full documentation: [README.md](README.md)
- 🐘 PostgreSQL setup: [POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md)
- 💬 Issues: Open a GitHub issue

---

**Estimated setup time:**
- Docker: **5 minutes**
- Supabase: **7 minutes**
- Local: **10 minutes**

**Total cost: $0** 🎉

Happy note-taking with your new AI-powered second brain! 🧠✨
