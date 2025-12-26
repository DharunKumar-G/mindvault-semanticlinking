# MongoDB Atlas Vector Search Setup Guide

This guide will walk you through setting up MongoDB Atlas Vector Search for MindVault.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account (no credit card required)
3. Create a new organization and project

## Step 2: Create a Cluster

1. Click "Build a Cluster"
2. Choose the **FREE** M0 tier
3. Select your preferred cloud provider and region
4. Name your cluster (e.g., "MindVault")
5. Click "Create Cluster" (this takes 3-5 minutes)

## Step 3: Configure Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose authentication method: **Password**
4. Create a username and strong password
5. Set privileges to "Read and write to any database"
6. Click "Add User"

## Step 4: Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IP addresses
5. Click "Confirm"

## Step 5: Create Database and Collection

1. Go back to "Database" and click "Browse Collections"
2. Click "Add My Own Data"
3. Database name: `mindvault`
4. Collection name: `notes`
5. Click "Create"

## Step 6: Create Vector Search Index

This is the **most important step** for semantic search to work!

### Option A: Using Atlas UI (Recommended)

1. In your cluster, click "Search" tab (formerly "Atlas Search")
2. Click "Create Search Index"
3. Choose "JSON Editor"
4. Select:
   - Database: `mindvault`
   - Collection: `notes`
5. Index Name: `vector_index`
6. Paste this JSON definition:

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

7. Click "Create Search Index"
8. Wait for the index to become active (shows green "Active" status)

### Option B: Using MongoDB Shell

```javascript
db.notes.createSearchIndex(
  "vector_index",
  "vectorSearch",
  {
    fields: [
      {
        type: "vector",
        path: "embedding",
        numDimensions: 1536,
        similarity: "cosine"
      }
    ]
  }
)
```

## Step 7: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: Node.js, Version: 5.5 or later
4. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your database user credentials
6. Add `/mindvault` before the `?` to specify the database:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/mindvault?retryWrites=true&w=majority
   ```

## Step 8: Add to .env File

Create `server/.env` with:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/mindvault?retryWrites=true&w=majority
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=5000
DB_NAME=mindvault
COLLECTION_NAME=notes
```

## Troubleshooting

### "Could not connect to MongoDB"
- Check your IP whitelist in Network Access
- Verify username/password are correct
- Ensure connection string is properly formatted

### "vectorSearch is not supported"
- The Vector Search index might not be created or active
- Wait a few minutes for the index to build
- Verify the index name is exactly `vector_index`
- Check that you're using Atlas (not local MongoDB)

### "Index not found"
- Make sure you created the index in the correct database/collection
- The index must be a "Vector Search" type, not a regular index
- Check index status is "Active" (green)

## Verifying Setup

Run this command to check if your setup works:

```bash
cd server
npm run dev
```

You should see:
```
✅ Connected to MongoDB Atlas
🚀 MindVault server running on port 5000
```

## Understanding Vector Search

### What is a Vector?
A vector is an array of numbers that represents the semantic meaning of text:
```javascript
[0.12, -0.04, 0.89, ..., 0.34]  // 1536 numbers
```

### How It Works
1. Text is converted to a vector using OpenAI's embedding model
2. Vectors are stored in MongoDB with a special index
3. Searches find notes with similar vectors using cosine similarity
4. Results are ranked by how "close" the vectors are in mathematical space

### Why 1536 dimensions?
This is the output size of OpenAI's `text-embedding-3-small` model. Each dimension captures a different aspect of meaning.

## Cost Considerations

### MongoDB Atlas (Free Tier)
- 512 MB storage
- Shared RAM
- Sufficient for ~50,000 notes with embeddings

### OpenAI API
- Embeddings: ~$0.0001 per 1K tokens
- Categorization (GPT-3.5): ~$0.002 per 1K tokens
- Estimate: ~$1 for 10,000 notes

## Next Steps

Once setup is complete:
1. Start the server: `npm run dev`
2. Create your first note
3. Try searching by meaning!

---

Need help? Check the main README or open an issue on GitHub.
