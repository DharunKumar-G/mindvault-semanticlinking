# Deployment Guide

## Deployment Options

### 1. Vercel (Frontend) + Supabase (Database)

#### Prerequisites
- Vercel account
- Supabase account (already set up)
- Gemini API key

#### Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
cd client
vercel

# Follow prompts:
# - Project name: mindvault
# - Framework: Vite
# - Build command: npm run build
# - Output directory: dist
```

**Environment Variables in Vercel:**
```
VITE_API_URL=https://your-backend.herokuapp.com/api
```

---

### 2. Heroku (Full Stack)

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Deploy Backend

```bash
# Create Heroku app
heroku create mindvault-api

# Add PostgreSQL addon (or use existing Supabase)
# For Supabase, set DATABASE_URL config var

# Set environment variables
heroku config:set DATABASE_URL="postgresql://user:pass@host:5432/db"
heroku config:set GEMINI_API_KEY="your_key"
heroku config:set PORT=5001

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

#### Deploy Frontend

```bash
# Create separate app for client
heroku create mindvault-client

# Set buildpack
heroku buildpacks:set heroku/nodejs

# Add config
heroku config:set VITE_API_URL="https://mindvault-api.herokuapp.com/api"

# Deploy
git subtree push --prefix client heroku main
```

---

### 3. Railway (Recommended for Full Stack)

#### Deploy Backend + Database

1. Visit [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your repository
5. Add PostgreSQL plugin with pgvector
6. Set environment variables:
   - `DATABASE_URL` (auto-populated)
   - `GEMINI_API_KEY`
   - `PORT=5001`
7. Deploy!

#### Deploy Frontend

1. Create new service in same project
2. Select `client` directory
3. Set build command: `npm run build`
4. Set start command: `npm run preview`
5. Add environment variable: `VITE_API_URL`

---

### 4. Render

#### Backend Deployment

1. Go to [Render.com](https://render.com)
2. New > Web Service
3. Connect GitHub repository
4. Settings:
   - **Name:** mindvault-api
   - **Root Directory:** server
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Environment Variables:
   - `DATABASE_URL`
   - `GEMINI_API_KEY`
   - `PORT=5001`

#### Frontend Deployment

1. New > Static Site
2. Connect GitHub repository
3. Settings:
   - **Root Directory:** client
   - **Build Command:** `npm run build`
   - **Publish Directory:** dist
4. Environment Variables:
   - `VITE_API_URL`

---

### 5. Docker Deployment

#### Build and Deploy with Docker Compose

```bash
# Set environment variables
export GEMINI_API_KEY="your_key"

# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

#### Deploy to Cloud (AWS ECS, Google Cloud Run, etc.)

```bash
# Build images
docker build -t mindvault-server ./server
docker build -t mindvault-client ./client

# Tag for registry
docker tag mindvault-server:latest your-registry/mindvault-server:latest
docker tag mindvault-client:latest your-registry/mindvault-client:latest

# Push
docker push your-registry/mindvault-server:latest
docker push your-registry/mindvault-client:latest
```

---

## Environment Setup for Production

### Backend (.env)
```bash
NODE_ENV=production
DATABASE_URL=your_production_db_url
GEMINI_API_KEY=your_production_key
PORT=5001
```

### Frontend
```bash
VITE_API_URL=https://your-api-domain.com/api
```

---

## Post-Deployment Checklist

- [ ] Verify database connection
- [ ] Test API health endpoint: `GET /api/health`
- [ ] Create a test note
- [ ] Test semantic search
- [ ] Test related notes feature
- [ ] Check error logs
- [ ] Set up monitoring (optional)
- [ ] Configure custom domain (optional)
- [ ] Enable HTTPS (most platforms do this automatically)
- [ ] Set up backup strategy for database

---

## Performance Optimization

### Database
- Enable connection pooling (already configured)
- Set up read replicas for scaling
- Regular vacuum and analyze operations

### Backend
- Enable caching with Redis (future enhancement)
- Implement rate limiting
- Use CDN for static assets

### Frontend
- Enable gzip compression
- Optimize bundle size
- Use lazy loading for routes

---

## Monitoring

### Recommended Tools
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Datadog** - APM and monitoring
- **Uptime Robot** - Uptime monitoring

---

## Troubleshooting

### Common Issues

**Database Connection Failed**
- Check DATABASE_URL format
- Verify network access to database
- Check SSL requirements

**CORS Errors**
- Update CORS settings in `server/src/index.js`
- Verify API_URL in frontend

**AI Service Errors**
- Verify GEMINI_API_KEY is valid
- Check API quota limits
- Review error logs

---

## Scaling Considerations

- **Horizontal Scaling:** Deploy multiple server instances
- **Database:** Use connection pooling and read replicas
- **Caching:** Add Redis for embedding cache
- **Load Balancing:** Use platform-provided load balancers
- **CDN:** Serve frontend through CDN

---

## Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Input validation in place
- [ ] SQL injection protection (parameterized queries)
- [ ] CORS properly configured
- [ ] Security headers set (helmet.js)
- [ ] Database backups enabled
