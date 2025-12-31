# Testing Guide

## Overview

This guide covers testing strategies for MindVault.

## Test Structure

```
server/
  tests/
    unit/
      services/
        embeddingService.test.js
        noteService.test.js
    integration/
      routes/
        notes.test.js
    fixtures/
      notes.json

client/
  src/
    __tests__/
      components/
        NoteEditor.test.jsx
      utils/
        helpers.test.js
```

## Running Tests

### Server Tests
```bash
cd server
npm test              # Run all tests
npm test:watch        # Watch mode
npm test:coverage     # Coverage report
```

### Client Tests
```bash
cd client
npm test              # Run all tests
npm test:watch        # Watch mode
npm test:coverage     # Coverage report
```

## Writing Tests

### Unit Test Example (Server)

```javascript
// server/tests/unit/services/embeddingService.test.js
import { describe, it, expect, beforeAll } from '@jest/globals';
import { generateEmbedding } from '../../../src/services/embeddingService.js';

describe('Embedding Service', () => {
  it('should generate 768-dimensional embedding', async () => {
    const text = 'Test note content';
    const embedding = await generateEmbedding(text);
    
    expect(embedding).toHaveLength(768);
    expect(embedding[0]).toBeTypeOf('number');
  });

  it('should handle empty text', async () => {
    await expect(generateEmbedding('')).rejects.toThrow();
  });
});
```

### Integration Test Example

```javascript
// server/tests/integration/routes/notes.test.js
import request from 'supertest';
import app from '../../../src/index.js';

describe('Notes API', () => {
  it('GET /api/notes should return all notes', async () => {
    const response = await request(app)
      .get('/api/notes')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('POST /api/notes should create a note', async () => {
    const newNote = {
      title: 'Test Note',
      content: 'Test content'
    };

    const response = await request(app)
      .post('/api/notes')
      .send(newNote)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe(newNote.title);
  });
});
```

### React Component Test

```javascript
// client/src/__tests__/components/NoteEditor.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NoteEditor from '../../components/NoteEditor';

describe('NoteEditor', () => {
  it('should render title and content inputs', () => {
    render(<NoteEditor />);
    
    expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/content/i)).toBeInTheDocument();
  });

  it('should call onSave with note data', () => {
    const mockSave = vi.fn();
    render(<NoteEditor onSave={mockSave} />);
    
    fireEvent.change(screen.getByPlaceholderText(/title/i), {
      target: { value: 'New Note' }
    });
    
    fireEvent.click(screen.getByText(/save/i));
    
    expect(mockSave).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New Note' })
    );
  });
});
```

## Test Database

For integration tests, use a separate test database:

```bash
# .env.test
DATABASE_URL=postgresql://postgres:password@localhost:5432/mindvault_test
GEMINI_API_KEY=test_key
```

## Mocking

### Mock Gemini API

```javascript
// server/tests/mocks/gemini.js
export const mockGenerateEmbedding = vi.fn(() => 
  new Array(768).fill(0).map(() => Math.random())
);

export const mockGenerateContent = vi.fn(() => ({
  response: {
    text: () => JSON.stringify({ tags: ['test', 'mock'] })
  }
}));
```

## Coverage Goals

- **Overall:** 80%+
- **Critical paths:** 95%+
- **Services:** 90%+
- **Routes:** 85%+
- **Components:** 80%+

## Best Practices

1. **Test behavior, not implementation**
2. **Use descriptive test names**
3. **Keep tests isolated and independent**
4. **Mock external dependencies**
5. **Test edge cases and error conditions**
6. **Maintain fast test execution**

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Push to main branch
- See `.github/workflows/ci.yml`
