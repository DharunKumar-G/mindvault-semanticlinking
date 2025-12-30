import { X, Sparkles } from 'lucide-react';
import { noteTemplates } from '../data/noteTemplates';

export default function TemplateSelector({ isOpen, onClose, onSelectTemplate }) {
  if (!isOpen) return null;

  const categories = {
    'Personal': ['daily', 'goal', 'travel', 'recipe'],
    'Work': ['meeting', 'project', 'retrospective'],
    'Learning': ['learning', 'book', 'idea'],
    'Quick Start': ['blank']
  };

  const handleSelectTemplate = (template) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-vault-50 to-purple-50 dark:from-slate-700 dark:to-slate-700 
                      border-b border-slate-200 dark:border-slate-600 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-vault-600 dark:text-vault-400" />
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Choose a Template
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Start with a structured note template
                </p>
              </div>
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
          {Object.entries(categories).map(([category, templateIds]) => (
            <div key={category} className="mb-8 last:mb-0">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templateIds.map(templateId => {
                  const template = noteTemplates.find(t => t.id === templateId);
                  if (!template) return null;
                  
                  return (
                    <button
                      key={template.id}
                      onClick={() => handleSelectTemplate(template)}
                      className="text-left p-4 bg-slate-50 dark:bg-slate-700 hover:bg-vault-50 dark:hover:bg-slate-600 
                               border border-slate-200 dark:border-slate-600 rounded-xl transition-all hover:shadow-md
                               hover:border-vault-300 dark:hover:border-vault-500 group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{template.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1 group-hover:text-vault-600 dark:group-hover:text-vault-400">
                            {template.name}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {template.description}
                          </p>
                          {template.tags && template.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {template.tags.map((tag, idx) => (
                                <span 
                                  key={idx}
                                  className="text-xs px-2 py-0.5 bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-300 
                                           rounded-full border border-slate-200 dark:border-slate-500"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 bg-slate-50 dark:bg-slate-800/50">
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
            💡 Templates help you get started quickly with structured notes
          </p>
        </div>
      </div>
    </div>
  );
}
