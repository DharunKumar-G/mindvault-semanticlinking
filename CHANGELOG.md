# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-12-31

### Added
- Initial release of MindVault
- Semantic search using PostgreSQL pgvector
- Real-time related notes sidebar
- AI-powered auto-categorization with Google Gemini
- 768-dimensional vector embeddings
- Supabase cloud database support
- Comprehensive documentation (README, QUICKSTART, POSTGRESQL_SETUP, API, ENV, DEPLOYMENT, TESTING)
- CI/CD workflow with GitHub Actions
- MIT License and Code of Conduct
- Docker Compose support for local development
- Trash/restore functionality for notes
- GitHub issue templates and PR template
- VS Code workspace settings and extensions
- Development helper scripts
- Utility functions and error handling
- Constants for client and server

### Features
- Create, read, update, delete notes
- Soft delete with trash functionality
- Semantic similarity search with cosine distance
- Tag suggestions using Gemini Pro
- Related notes detection while typing
- PostgreSQL with pgvector extension
- React frontend with Vite and TailwindCSS
- Express backend with Node.js
- Note statistics and reading time estimation

### Infrastructure
- Supabase PostgreSQL database
- Google Gemini API integration (text-embedding-004 + gemini-pro)
- IVFFlat vector indexing for performance
- Port configuration (5001) to avoid conflicts
- Structured logging and custom error classes
- Environment variable management
- Security policy and best practices

### Documentation
- Complete API documentation
- Deployment guides for multiple platforms
- Testing infrastructure guide
- Roadmap through version 2.0
- Contributing guidelines
- Security policy

