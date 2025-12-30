import { X, Keyboard } from 'lucide-react';

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['Ctrl', 'K'], description: 'Focus search bar', mac: ['⌘', 'K'] },
    { keys: ['Ctrl', 'N'], description: 'Create new note', mac: ['⌘', 'N'] },
    { keys: ['Ctrl', '/'], description: 'Show keyboard shortcuts', mac: ['⌘', '/'] },
    { keys: ['Ctrl', 'E'], description: 'Edit current note', mac: ['⌘', 'E'] },
    { keys: ['Ctrl', 'S'], description: 'Save note (in editor)', mac: ['⌘', 'S'] },
    { keys: ['Esc'], description: 'Close modal or go back', mac: ['Esc'] },
  ];

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
         onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto"
           onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-vault-50 to-purple-50 dark:from-slate-700 dark:to-slate-700 
                      border-b border-slate-200 dark:border-slate-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Keyboard className="w-6 h-6 text-vault-600 dark:text-vault-400" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Keyboard Shortcuts
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-3">
            {shortcuts.map((shortcut, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-700 dark:text-slate-300">{shortcut.description}</span>
                <div className="flex gap-1">
                  {(isMac ? shortcut.mac : shortcut.keys).map((key, keyIdx) => (
                    <kbd key={keyIdx} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 
                                                  border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono shadow-sm">
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Tip:</strong> Press <kbd className="px-2 py-1 bg-white dark:bg-slate-700 border border-blue-300 dark:border-blue-700 rounded text-xs">
                {isMac ? '⌘' : 'Ctrl'} + /
              </kbd> anytime to see this help
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
