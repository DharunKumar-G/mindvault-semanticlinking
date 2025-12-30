# New Features Added

## 1. Dark Mode Toggle 🌙

A fully functional dark mode has been implemented across the entire application.

### Features:
- Toggle button in the header (Moon/Sun icon)
- Remembers preference in localStorage
- Respects system preference on first load
- Smooth transitions between modes
- Dark mode support for all components:
  - Header, notes list, note detail, note editor
  - Tags, buttons, modals, and inputs
  - Search bar and related notes

### Usage:
- Click the Moon/Sun icon in the header
- Preference is automatically saved

---

## 2. Export to Markdown 📥

Export individual notes or all notes at once to Markdown format.

### Features:
- **Export Single Note**: Download button in note detail view
- **Export All Notes**: Export button in notes list
- Includes:
  - Title as H1 heading
  - Tags with # prefix
  - Creation and update timestamps
  - Full note content
- Clean markdown formatting
- Automatic filename generation

### Usage:
- **Single Note**: Open any note → Click "Export" button
- **All Notes**: Go to notes list → Click "Export All" button

---

## 3. Keyboard Shortcuts ⌨️

Comprehensive keyboard shortcuts for faster navigation and actions.

### Available Shortcuts:

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Focus search bar | `Ctrl + K` | `⌘ + K` |
| Create new note | `Ctrl + N` | `⌘ + N` |
| Edit current note | `Ctrl + E` | `⌘ + E` |
| Save note (in editor) | `Ctrl + S` | `⌘ + S` |
| Show shortcuts help | `Ctrl + /` | `⌘ + /` |
| Close modal / Go back | `Esc` | `Esc` |

### Features:
- Help modal with all shortcuts (press `Ctrl+/` or click `?` button)
- Works in all views
- Smart detection of context (e.g., Edit only works on note detail page)
- Mac keyboard symbol support (⌘, ⌥, etc.)
- Floating help button in bottom-right corner

---

## Technical Implementation

### Dark Mode
- Context API for theme management (`ThemeContext.jsx`)
- Tailwind CSS dark mode classes
- localStorage persistence
- System preference detection

### Markdown Export
- Client-side file generation using Blob API
- Proper markdown formatting
- Safe filename generation
- Individual and bulk export support

### Keyboard Shortcuts
- Custom React hook (`useKeyboardShortcuts.js`)
- Configurable key combinations
- Smart input field detection
- Modal component for help display
- Cross-platform support (Windows/Mac/Linux)

---

## Files Added/Modified

### New Files:
- `client/src/contexts/ThemeContext.jsx`
- `client/src/hooks/useKeyboardShortcuts.js`
- `client/src/components/KeyboardShortcutsModal.jsx`
- `NEW_FEATURES.md`

### Modified Files:
- `client/src/App.jsx` - Added ThemeProvider and keyboard shortcuts
- `client/src/components/Header.jsx` - Added dark mode toggle
- `client/src/components/NotesList.jsx` - Added export all and dark mode styles
- `client/src/components/NoteDetail.jsx` - Added export single note
- `client/src/components/NoteEditor.jsx` - Added Ctrl+S save shortcut
- `client/src/index.css` - Added dark mode styles for tags
- `client/tailwind.config.js` - Enabled dark mode
- `CONTRIBUTING.md` - Updated feature checklist

---

## Testing

All features have been implemented and are ready to test:

1. **Dark Mode**: Click the Moon/Sun icon in header, verify all pages switch themes
2. **Export**: Create some notes, try exporting individual and all notes
3. **Shortcuts**: Press Ctrl+/ to see help modal, try all shortcuts

---

## Future Enhancements

Potential improvements:
- [ ] Dark mode toggle animation
- [ ] Export to PDF
- [ ] More keyboard shortcuts (delete, search from anywhere)
- [ ] Customizable shortcuts
- [ ] Export options (format, which fields to include)
