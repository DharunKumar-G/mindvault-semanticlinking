#!/bin/bash

# MindVault Quick Setup Script

echo "🧠 MindVault Setup Script"
echo "========================="
echo ""

# Check if .env exists
if [ ! -f "server/.env" ]; then
    echo "⚠️  Creating server/.env from template..."
    cp server/.env.example server/.env
    echo "✅ Created server/.env - Please add your MongoDB URI and OpenAI API key!"
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
echo "1. Edit server/.env with your MongoDB URI and OpenAI API key"
echo "2. Set up MongoDB Atlas Vector Search index (see MONGODB_SETUP.md)"
echo "3. Run 'npm run dev' to start both server and client"
echo ""
echo "📚 Documentation:"
echo "- README.md - Full project documentation"
echo "- MONGODB_SETUP.md - MongoDB Atlas setup guide"
echo ""
echo "🚀 Happy note-taking!"
