class Logger {
  constructor(context) {
    this.context = context;
  }

  info(message, ...args) {
    console.log(`[${this.context}] ℹ️  ${message}`, ...args);
  }

  success(message, ...args) {
    console.log(`[${this.context}] ✅ ${message}`, ...args);
  }

  warn(message, ...args) {
    console.warn(`[${this.context}] ⚠️  ${message}`, ...args);
  }

  error(message, error) {
    console.error(`[${this.context}] ❌ ${message}`, error);
  }

  debug(message, ...args) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${this.context}] 🐛 ${message}`, ...args);
    }
  }
}

export default Logger;
