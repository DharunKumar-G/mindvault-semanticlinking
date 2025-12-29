#!/bin/bash

# MindVault Quick Setup Script

echo "🧠 MindVault Setup Script"
echo "========================="
echo ""

# Check if .env exists
if [ ! -f "server/.env" ]; then
    echo "⚠️  Creating server/.env from template..."
    cp server/.env.example server/.env
    echo "✅ Created server/.env - Please add your PostgreSQL connection and Gemini API key!"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
echo ""

# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..

echo ""
echo "✅ All dependencies installed!"
echo ""
echo "📋 Next Steps:"
echo "1. Install PostgreSQL with pgvector (see POSTGRESQL_SETUP.md)"
echo "2. Edit server/.env with your DATABASE_URL and GEMINI_API_KEY"
echo "3. Run 'cd server && npm run init:db' to initialize database"
echo "4. Run 'npm run dev' to start both server and client"
echo ""
echo "📚 Documentation:"
echo "- README.md - Full project documentation"
echo "- POSTGRESQL_SETUP.md - PostgreSQL + pgvector setup guide"
echo ""
echo "🚀 Happy note-taking!"
