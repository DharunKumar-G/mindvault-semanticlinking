import { useEffect } from 'react';

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if we're in an input or textarea
      const isInputFocused = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
      
      for (const shortcut of shortcuts) {
        const { key, ctrl, alt, shift, meta, callback, allowInInput } = shortcut;
        
        // Skip if in input and not allowed
        if (isInputFocused && !allowInInput) continue;
        
        // Check if all modifiers match
        const ctrlMatch = ctrl === undefined || event.ctrlKey === ctrl;
        const altMatch = alt === undefined || event.altKey === alt;
        const shiftMatch = shift === undefined || event.shiftKey === shift;
        const metaMatch = meta === undefined || event.metaKey === meta;
        
        // Check if key matches (case insensitive)
        const keyMatch = event.key.toLowerCase() === key.toLowerCase();
        
        if (keyMatch && ctrlMatch && altMatch && shiftMatch && metaMatch) {
          event.preventDefault();
          callback(event);
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}
