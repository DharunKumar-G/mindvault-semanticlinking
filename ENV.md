# Environment Variables

This document describes all environment variables used in MindVault.

## Server Environment Variables

Create a `server/.env` file with the following:

### Required Variables

#### `DATABASE_URL`
PostgreSQL connection string with pgvector support.

**Format:**
```
postgresql://username:password@host:port/database
```

**Examples:**
- Local: `postgresql://postgres:password@localhost:5432/mindvault`
- Supabase: `postgresql://postgres:password@db.project.supabase.co:5432/postgres`
- Docker: `postgresql://mindvault:mindvault_dev@postgres:5432/mindvault`

---

#### `GEMINI_API_KEY`
Google Gemini API key for embeddings and AI features.

**How to get:**
1. Visit https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

**Format:**
```
GEMINI_API_KEY=AIzaSy...your-key-here
```

**Free Tier:**
- 60 requests per minute
- 1500 requests per day
- No credit card required

---

### Optional Variables

#### `PORT`
Server port number (default: 5000)

```
PORT=5001
```

---

#### `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
Individual database connection parameters. Used only if `DATABASE_URL` is not provided.

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mindvault
DB_USER=postgres
DB_PASSWORD=your_password
```

---

## Client Environment Variables

The client uses Vite and doesn't require environment variables by default. API calls are proxied through Vite config.

If you need to configure the API URL:

Create `client/.env`:

```
VITE_API_URL=http://localhost:5001/api
```

---

## Docker Environment Variables

When using Docker Compose, create a `.env` file in the project root:

```
# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Database (optional overrides)
POSTGRES_USER=mindvault
POSTGRES_PASSWORD=mindvault_dev
POSTGRES_DB=mindvault
```

---

## Environment Templates

### Development (.env.example)
```bash
# PostgreSQL Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/mindvault

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port
PORT=5001
```

### Production
```bash
# Use connection pooling for production
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# Production Gemini Key (separate from dev)
GEMINI_API_KEY=your_production_key

# Production port
PORT=5000

# Additional production settings
NODE_ENV=production
```

---

## Security Notes

⚠️ **Never commit `.env` files to version control!**

- Keep API keys secret
- Use different keys for dev/staging/production
- Rotate keys if exposed
- Use SSL for database connections in production
- Limit database access by IP when possible

---

## Testing Environment Variables

For running tests:

```bash
# Test Database (separate from dev)
DATABASE_URL=postgresql://postgres:password@localhost:5432/mindvault_test

# Test API Key (can use same as dev)
GEMINI_API_KEY=your_test_key

# Test port
PORT=5002
```
