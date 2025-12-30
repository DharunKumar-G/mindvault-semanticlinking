import { useState } from 'react';
import { MessageCircle, Send, Loader2, FileText, X } from 'lucide-react';
import { aiApi } from '../services/api';

export default function AskQuestion() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) return;

    try {
      setLoading(true);
      setAnswer(null);
      const result = await aiApi.askQuestion(question);
      setAnswer(result);
    } catch (error) {
      console.error('Error asking question:', error);
      setAnswer({
        answer: 'Sorry, I encountered an error. Please try again.',
        sources: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-vault-600 text-white rounded-full shadow-lg hover:bg-vault-700 transition-all z-40 hover:scale-110"
        title="Ask a question"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-40">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-vault-600 dark:text-vault-400" />
          <h3 className="font-semibold text-slate-900 dark:text-white">Ask Your Notes</h3>
        </div>
        <button
          onClick={() => {
            setIsOpen(false);
            setQuestion('');
            setAnswer(null);
          }}
          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {/* Question Input */}
        <form onSubmit={handleAsk} className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about your notes..."
              className="w-full px-4 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-vault-500 focus:border-transparent"
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-vault-600 text-white hover:bg-vault-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>

        {/* Answer Display */}
        {answer && (
          <div className="space-y-3">
            <div className="p-3 bg-vault-50 dark:bg-vault-900/20 rounded-lg border border-vault-200 dark:border-vault-800">
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {answer.answer}
              </p>
            </div>

            {/* Sources */}
            {answer.sources && answer.sources.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Sources:
                </p>
                <div className="space-y-1">
                  {answer.sources.map((source) => (
                    <a
                      key={source.id}
                      href={`/note/${source.id}`}
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-xs text-slate-700 dark:text-slate-300"
                      onClick={() => setIsOpen(false)}
                    >
                      <FileText className="w-3 h-3 text-slate-400" />
                      <span className="flex-1 truncate">{source.title}</span>
                      <span className="text-slate-400">Note {source.noteNumber}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Suggestions */}
        {!answer && !loading && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Try asking:
            </p>
            {[
              "What are my main goals?",
              "Summarize my work notes",
              "What did I learn recently?"
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setQuestion(suggestion)}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs text-slate-600 dark:text-slate-400 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
