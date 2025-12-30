import { useState } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { notesApi } from '../services/api';

export default function ImportExport() {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleExportJSON = async () => {
    try {
      setExporting(true);
      const notes = await notesApi.getAll();
      
      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        notes: notes.map(note => ({
          title: note.title,
          content: note.content,
          tags: note.tags,
          createdAt: note.created_at || note.createdAt,
          updatedAt: note.updated_at || note.updatedAt
        }))
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindvault-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: `Successfully exported ${notes.length} notes` });
    } catch (error) {
      console.error('Export error:', error);
      setMessage({ type: 'error', text: 'Failed to export notes' });
    } finally {
      setExporting(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleExportMarkdown = async () => {
    try {
      setExporting(true);
      const notes = await notesApi.getAll();
      
      let markdown = '# MindVault Notes Export\n\n';
      markdown += `Exported on ${new Date().toLocaleDateString()}\n\n`;
      markdown += `Total notes: ${notes.length}\n\n`;
      markdown += '---\n\n';

      notes.forEach((note, idx) => {
        markdown += `## ${note.title}\n\n`;
        
        if (note.tags && note.tags.length > 0) {
          markdown += `**Tags:** ${note.tags.map(t => `#${t}`).join(', ')}\n\n`;
        }
        
        markdown += `${note.content}\n\n`;
        
        if (idx < notes.length - 1) {
          markdown += '---\n\n';
        }
      });

      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindvault-export-${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: `Successfully exported ${notes.length} notes to Markdown` });
    } catch (error) {
      console.error('Export error:', error);
      setMessage({ type: 'error', text: 'Failed to export notes' });
    } finally {
      setExporting(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleImportJSON = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setImporting(true);
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.notes || !Array.isArray(data.notes)) {
        throw new Error('Invalid JSON format');
      }

      let imported = 0;
      for (const note of data.notes) {
        try {
          await notesApi.create({
            title: note.title || 'Untitled',
            content: note.content || '',
            tags: note.tags || []
          });
          imported++;
        } catch (error) {
          console.error('Error importing note:', error);
        }
      }

      setMessage({ type: 'success', text: `Successfully imported ${imported} of ${data.notes.length} notes` });
      
      // Refresh the page after a short delay
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('Import error:', error);
      setMessage({ type: 'error', text: 'Failed to import notes. Check file format.' });
    } finally {
      setImporting(false);
      event.target.value = '';
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleImportMarkdown = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setImporting(true);
      const text = await file.text();
      
      // Simple markdown parsing - split by headers
      const sections = text.split(/^## /m).filter(s => s.trim());
      
      let imported = 0;
      for (const section of sections) {
        const lines = section.split('\n');
        const title = lines[0].trim();
        
        if (!title || title.startsWith('#')) continue;
        
        // Extract tags
        let tags = [];
        let contentStart = 1;
        if (lines[1]?.includes('**Tags:**')) {
          const tagLine = lines[1].replace('**Tags:**', '').trim();
          tags = tagLine.split(',').map(t => t.trim().replace('#', ''));
          contentStart = 2;
        }
        
        // Get content
        const content = lines.slice(contentStart)
          .join('\n')
          .trim()
          .replace(/^---\s*/g, '');
        
        if (content) {
          try {
            await notesApi.create({ title, content, tags: tags.filter(t => t) });
            imported++;
          } catch (error) {
            console.error('Error importing note:', error);
          }
        }
      }

      setMessage({ type: 'success', text: `Successfully imported ${imported} notes from Markdown` });
      
      // Refresh the page after a short delay
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('Import error:', error);
      setMessage({ type: 'error', text: 'Failed to import markdown. Check file format.' });
    } finally {
      setImporting(false);
      event.target.value = '';
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Import / Export</h2>
      
      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Export */}
        <div>
          <h3 className="font-medium text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Export Notes
          </h3>
          <div className="space-y-2">
            <button
              onClick={handleExportJSON}
              disabled={exporting}
              className="w-full px-4 py-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-left disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900 dark:text-blue-200">JSON Format</p>
                  <p className="text-xs text-blue-700 dark:text-blue-400">Compatible with MindVault</p>
                </div>
              </div>
            </button>

            <button
              onClick={handleExportMarkdown}
              disabled={exporting}
              className="w-full px-4 py-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-left disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900 dark:text-blue-200">Markdown Format</p>
                  <p className="text-xs text-blue-700 dark:text-blue-400">Universal format for all apps</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Import */}
        <div>
          <h3 className="font-medium text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Upload className="w-5 h-5 text-green-600 dark:text-green-400" />
            Import Notes
          </h3>
          <div className="space-y-2">
            <label className="block w-full px-4 py-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                disabled={importing}
                className="hidden"
              />
              <div className="flex items-center gap-3">
                <Upload className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="font-medium text-green-900 dark:text-green-200">JSON File</p>
                  <p className="text-xs text-green-700 dark:text-green-400">From MindVault or compatible apps</p>
                </div>
              </div>
            </label>

            <label className="block w-full px-4 py-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors cursor-pointer">
              <input
                type="file"
                accept=".md,.markdown"
                onChange={handleImportMarkdown}
                disabled={importing}
                className="hidden"
              />
              <div className="flex items-center gap-3">
                <Upload className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="font-medium text-green-900 dark:text-green-200">Markdown File</p>
                  <p className="text-xs text-green-700 dark:text-green-400">From Notion, Obsidian, etc.</p>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          <strong>Note:</strong> Importing will add notes to your existing collection. To replace all notes, export first as backup, then delete all notes before importing.
        </p>
      </div>
    </div>
  );
}
