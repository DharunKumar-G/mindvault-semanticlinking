# 🤝 Contributing to MindVault

Thank you for considering contributing to MindVault! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Feature Ideas](#feature-ideas)

## 🌟 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards other contributors

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- OpenAI API key
- Git

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   git clone https://github.com/YOUR_USERNAME/mindvault-semanticlinking.git
   cd mindvault-semanticlinking
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure environment**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your credentials
   ```

4. **Set up MongoDB Atlas**
   Follow instructions in `MONGODB_SETUP.md`

5. **Run the app**
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### Branch Naming Convention
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/what-changed` - Documentation updates
- `refactor/area-name` - Code refactoring
- `test/test-description` - Test additions

### Making Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Test your changes thoroughly

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

   Commit message format:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

## 📝 Pull Request Process

### PR Checklist
- [ ] Code follows the project's coding standards
- [ ] Changes are well-documented
- [ ] No console errors or warnings
- [ ] Tested in development environment
- [ ] Updated README if needed
- [ ] Added comments to complex code

### PR Description Should Include
- What changes were made
- Why the changes were necessary
- How to test the changes
- Screenshots (for UI changes)
- Related issue numbers

### Review Process
1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited!

## 💻 Coding Standards

### JavaScript/React
```javascript
// Use descriptive variable names
const userNotes = await notesApi.getAll();

// Use async/await over promises
async function loadNotes() {
  try {
    const notes = await notesApi.getAll();
    setNotes(notes);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Component naming: PascalCase
export default function NoteCard({ note }) {
  // ...
}

// Props destructuring
function NoteEditor({ onSave, initialData = {} }) {
  // ...
}
```

### File Organization
```
- One component per file
- Components in PascalCase.jsx
- Utilities in camelCase.js
- Keep components under 300 lines
- Extract complex logic to utilities
```

### CSS/Tailwind
```jsx
// Use Tailwind utility classes
<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">

// Group related classes
<button className="
  flex items-center gap-2 px-4 py-2 
  bg-vault-600 text-white rounded-lg 
  hover:bg-vault-700 transition-colors
">
```

### API Endpoints
```javascript
// Use descriptive route names
router.get('/notes', getAllNotes);
router.get('/notes/:id', getNoteById);
router.post('/notes', createNote);

// Handle errors consistently
try {
  const result = await someOperation();
  res.json(result);
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ error: 'Failed to perform operation' });
}
```

## 💡 Feature Ideas

Looking for something to work on? Here are some ideas:

### Easy (Good First Issues)
- [ ] Add dark mode toggle
- [ ] Export notes to Markdown
- [ ] Note sharing links
- [ ] Keyboard shortcuts
- [ ] Note templates

### Medium
- [ ] Note folders/collections
- [ ] Multi-user support with authentication
- [ ] Rich text editor (formatting, images)
- [ ] Advanced filtering by date/tags
- [ ] Mobile app (React Native)

### Advanced
- [ ] Voice-to-text note creation
- [ ] PDF/document import with OCR
- [ ] Graph view of note connections
- [ ] Collaborative editing
- [ ] Browser extension for quick capture
- [ ] Integration with other note apps (import/export)

### AI Enhancements
- [ ] Smart note summarization
- [ ] Question answering from notes
- [ ] Auto-linking related concepts
- [ ] Content suggestions while writing
- [ ] Duplicate detection

## 🐛 Reporting Bugs

### Before Submitting
- Check if the bug has already been reported
- Try to reproduce the bug
- Gather relevant information

### Bug Report Should Include
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/error messages
- Environment (OS, browser, Node version)

### Where to Report
Create an issue on GitHub with the `bug` label.

## 💬 Questions?

- Open a GitHub Discussion
- Create an issue with the `question` label
- Check existing documentation first

## 🎉 Recognition

Contributors will be:
- Listed in the project README
- Credited in release notes
- Part of the MindVault community!

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to MindVault! 🧠✨

**Let's build the best semantic note-taking app together!**
