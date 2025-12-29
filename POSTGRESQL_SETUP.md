# PostgreSQL with pgvector Setup Guide

This guide will walk you through setting up PostgreSQL with the pgvector extension for MindVault.

## Option 1: Local PostgreSQL Installation (Recommended for Development)

### On Linux (Ubuntu/Debian)

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install pgvector extension
sudo apt install postgresql-15-pgvector

# Or build from source:
cd /tmp
git clone --branch v0.5.1 https://github.com/pgvector/pgvector.git
cd pgvector
make
sudo make install
```

### On macOS

```bash
# Install PostgreSQL using Homebrew
brew install postgresql@15
brew services start postgresql@15

# Install pgvector
cd /tmp
git clone --branch v0.5.1 https://github.com/pgvector/pgvector.git
cd pgvector
make
make install
```

### On Windows

1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install PostgreSQL
3. Download pgvector pre-built binaries or build from source
4. Follow pgvector Windows installation guide

### Create Database and User

```bash
# Access PostgreSQL
sudo -u postgres psql

# In psql shell:
CREATE DATABASE mindvault;
CREATE USER mindvault_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE mindvault TO mindvault_user;

# Connect to mindvault database
\c mindvault

# Enable pgvector extension
CREATE EXTENSION vector;

# Exit psql
\q
```

## Option 2: Docker (Easiest)

```bash
# Run PostgreSQL with pgvector using Docker
docker run -d \
  --name mindvault-postgres \
  -e POSTGRES_DB=mindvault \
  -e POSTGRES_USER=mindvault_user \
  -e POSTGRES_PASSWORD=your_secure_password \
  -p 5432:5432 \
  pgvector/pgvector:pg15

# The pgvector extension is pre-installed in this image
```

## Option 3: Cloud PostgreSQL (Production)

### Supabase (Recommended - Free Tier Available)

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. **pgvector is pre-installed** on all Supabase projects!
4. Get your connection string from Project Settings > Database
5. Connection string format:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
   ```

### Neon (Serverless PostgreSQL)

1. Go to [Neon](https://neon.tech/)
2. Create a new project
3. Install pgvector extension in SQL Editor:
   ```sql
   CREATE EXTENSION vector;
   ```
4. Get connection string from dashboard

### AWS RDS PostgreSQL

1. Create RDS PostgreSQL instance (15.0 or higher)
2. Connect to instance
3. Install pgvector:
   ```sql
   CREATE EXTENSION vector;
   ```

### DigitalOcean Managed PostgreSQL

1. Create managed PostgreSQL database
2. Connect via psql
3. Enable pgvector extension

## Configuration

### Update .env file

```env
# For local PostgreSQL
DATABASE_URL=postgresql://mindvault_user:your_secure_password@localhost:5432/mindvault

# Or use individual connection params
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mindvault
DB_USER=mindvault_user
DB_PASSWORD=your_secure_password

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

PORT=5000
```

### Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key to your `.env` file

**Free Tier:**
- 60 requests per minute
- 1500 requests per day
- Perfect for development and small projects!

## Initialize Database

After configuring your connection, run:

```bash
cd server
npm run init:db
```

This will:
- Create the `notes` table
- Enable pgvector extension
- Create vector indexes
- Set up triggers for auto-updating timestamps

## Verify Setup

```bash
# Connect to database
psql postgresql://mindvault_user:your_secure_password@localhost:5432/mindvault

# Check if pgvector is installed
SELECT * FROM pg_extension WHERE extname = 'vector';

# Check if notes table exists
\dt

# Check table structure
\d notes

# Exit
\q
```

Expected output:
```
   extname   | extowner | extnamespace | extrelocatable | extversion  
-------------|----------|--------------|----------------|-------------
 vector      |       10 |         2200 | t              | 0.5.1
```

## Understanding pgvector

### What is pgvector?

pgvector is a PostgreSQL extension that adds vector similarity search capabilities:

```sql
-- Store vectors
CREATE TABLE items (
  id serial PRIMARY KEY,
  embedding vector(768)
);

-- Find similar vectors using cosine distance
SELECT * FROM items
ORDER BY embedding <=> '[0.1, 0.2, ...]'
LIMIT 5;
```

### Distance Operators

- `<->` : Euclidean distance (L2)
- `<#>` : Negative inner product
- `<=>` : Cosine distance (used in MindVault)

### Index Types

- **IVFFlat** : Fast approximate search (used in MindVault)
  - Good for datasets > 1000 vectors
  - Trade-off between speed and accuracy
  
- **HNSW** : Hierarchical Navigable Small World
  - Better accuracy, slower builds
  - Use for very large datasets

## Troubleshooting

### "extension vector does not exist"

```sql
-- Enable the extension
CREATE EXTENSION vector;
```

### Connection refused

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql
```

### Permission denied for database

```sql
-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE mindvault TO mindvault_user;
GRANT ALL ON SCHEMA public TO mindvault_user;
```

### pgvector not found

Make sure pgvector is installed:
```bash
# Check installed extensions
psql -c "SELECT * FROM pg_available_extensions WHERE name = 'vector';"
```

## Performance Tips

### Optimize Vector Search

```sql
-- Create IVFFlat index (adjust 'lists' based on data size)
-- lists = rows / 1000 (recommended)
CREATE INDEX ON notes USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- For HNSW (better accuracy)
CREATE INDEX ON notes USING hnsw (embedding vector_cosine_ops);
```

### Connection Pooling

The application uses connection pooling by default (max 20 connections).

### Monitor Performance

```sql
-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE tablename = 'notes';

-- Check table size
SELECT pg_size_pretty(pg_total_relation_size('notes'));
```

## Cost Comparison

| Service | Free Tier | Vector Support | Best For |
|---------|-----------|----------------|----------|
| **Supabase** | 500MB database | ✅ Built-in | Development & Production |
| **Neon** | 3GB storage | ✅ Available | Serverless apps |
| **Local** | Unlimited | ✅ Manual setup | Development |
| **Docker** | Unlimited | ✅ Pre-installed | Development |
| **AWS RDS** | None (paid) | ✅ Manual setup | Enterprise |

## Next Steps

1. ✅ Install PostgreSQL
2. ✅ Enable pgvector extension
3. ✅ Create database and user
4. ✅ Configure `.env` file
5. ✅ Get Gemini API key
6. ✅ Run `npm run init:db`
7. ✅ Start the server: `npm run dev`

---

Need help? Check the main README or open an issue on GitHub.
