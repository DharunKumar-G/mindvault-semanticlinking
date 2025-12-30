import { useState, useEffect } from 'react';
import { Link2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Component that highlights and links related concepts in note content
 * Uses semantic search to find related notes for key phrases
 */
export default function AutoLinkedContent({ content, currentNoteId, relatedNotes = [] }) {
  const [linkedContent, setLinkedContent] = useState(content);

  useEffect(() => {
    if (!relatedNotes || relatedNotes.length === 0) {
      setLinkedContent(content);
      return;
    }

    // Extract key phrases from related notes' titles (2-4 words)
    const concepts = new Map();
    relatedNotes.forEach(note => {
      if (note.id !== currentNoteId) {
        const title = note.title;
        // Store title and associated note
        concepts.set(title.toLowerCase(), {
          original: title,
          noteId: note.id,
          noteTitle: title
        });

        // Also check for multi-word phrases in title
        const words = title.split(' ');
        if (words.length >= 2 && words.length <= 4) {
          concepts.set(title.toLowerCase(), {
            original: title,
            noteId: note.id,
            noteTitle: title
          });
        }
      }
    });

    // Sort concepts by length (longest first) to match longer phrases first
    const sortedConcepts = Array.from(concepts.entries())
      .sort((a, b) => b[0].length - a[0].length);

    // Replace concepts with links in the content
    let processedContent = content;
    const replacements = [];

    sortedConcepts.forEach(([key, value]) => {
      // Case-insensitive regex to find the concept
      const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      
      let match;
      while ((match = regex.exec(processedContent)) !== null) {
        replacements.push({
          start: match.index,
          end: match.index + match[0].length,
          original: match[0],
          noteId: value.noteId,
          noteTitle: value.noteTitle
        });
      }
    });

    // Sort replacements by position (reverse to maintain indices)
    replacements.sort((a, b) => b.start - a.start);

    // Remove overlapping replacements
    const nonOverlapping = [];
    let lastEnd = Infinity;
    replacements.forEach(rep => {
      if (rep.end <= lastEnd) {
        nonOverlapping.push(rep);
        lastEnd = rep.start;
      }
    });

    // Apply replacements
    nonOverlapping.forEach(rep => {
      const before = processedContent.substring(0, rep.start);
      const after = processedContent.substring(rep.end);
      const link = `<a href="/note/${rep.noteId}" class="auto-link" data-note-id="${rep.noteId}" data-note-title="${rep.noteTitle}" title="Related: ${rep.noteTitle}">${rep.original}</a>`;
      processedContent = before + link + after;
    });

    setLinkedContent(processedContent);
  }, [content, relatedNotes, currentNoteId]);

  const handleLinkClick = (e) => {
    if (e.target.classList.contains('auto-link')) {
      e.preventDefault();
      const noteId = e.target.getAttribute('data-note-id');
      window.location.href = `/note/${noteId}`;
    }
  };

  return (
    <div className="prose dark:prose-invert max-w-none">
      <div
        className="whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: linkedContent }}
        onClick={handleLinkClick}
      />
      <style>{`
        .auto-link {
          color: #7c3aed;
          text-decoration: underline;
          text-decoration-style: dotted;
          text-underline-offset: 2px;
          cursor: pointer;
        }
        .auto-link:hover {
          color: #6d28d9;
          text-decoration-style: solid;
        }
        .dark .auto-link {
          color: #a78bfa;
        }
        .dark .auto-link:hover {
          color: #c4b5fd;
        }
      `}</style>
    </div>
  );
}
