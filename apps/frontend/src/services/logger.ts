type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  data?: any
  stack?: string
  userId?: string
  sessionId?: string
}

class Logger {
  private isDevelopment = import.meta.env.DEV
  private logHistory: LogEntry[] = []
  private maxHistorySize = 100

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId()
    }

    if (level === 'error' && data instanceof Error) {
      entry.stack = data.stack
    }

    return entry
  }

  private getCurrentUserId(): string | undefined {
    try {
      const authData = localStorage.getItem('auth')
      if (authData) {
        const parsed = JSON.parse(authData)
        return parsed.user?.id
      }
    } catch {
      return undefined
    }
    return undefined
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('sessionId')
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15)
      sessionStorage.setItem('sessionId', sessionId)
    }
    return sessionId
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true
    
    // In production, only log warnings and errors
    return level === 'warn' || level === 'error'
  }

  private addToHistory(entry: LogEntry) {
    this.logHistory.push(entry)
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift()
    }
  }

  private async sendToRemoteLogger(entry: LogEntry) {
    // In production, send logs to your logging service
    // e.g., LogRocket, Datadog, CloudWatch, etc.
    if (!this.isDevelopment && (entry.level === 'error' || entry.level === 'warn')) {
      try {
        // Replace with your actual logging endpoint
        await fetch('/api/logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entry)
        })
      } catch (error) {
        // Fallback to console if remote logging fails
        console.error('Failed to send log to remote service:', error)
      }
    }
  }

  debug(message: string, data?: any) {
    if (!this.shouldLog('debug')) return

    const entry = this.createLogEntry('debug', message, data)
    this.addToHistory(entry)
    
    if (this.isDevelopment) {
      console.debug(`[${entry.timestamp.toISOString()}] DEBUG: ${message}`, data)
    }
  }

  info(message: string, data?: any) {
    if (!this.shouldLog('info')) return

    const entry = this.createLogEntry('info', message, data)
    this.addToHistory(entry)
    
    if (this.isDevelopment) {
      console.info(`[${entry.timestamp.toISOString()}] INFO: ${message}`, data)
    }
  }

  warn(message: string, data?: any) {
    if (!this.shouldLog('warn')) return

    const entry = this.createLogEntry('warn', message, data)
    this.addToHistory(entry)
    
    console.warn(`[${entry.timestamp.toISOString()}] WARN: ${message}`, data)
    this.sendToRemoteLogger(entry)
  }

  error(message: string, error?: Error | any) {
    if (!this.shouldLog('error')) return

    const entry = this.createLogEntry('error', message, error)
    this.addToHistory(entry)
    
    console.error(`[${entry.timestamp.toISOString()}] ERROR: ${message}`, error)
    this.sendToRemoteLogger(entry)
  }

  // Get recent logs for debugging
  getRecentLogs(count = 50): LogEntry[] {
    return this.logHistory.slice(-count)
  }

  // Clear log history
  clearHistory() {
    this.logHistory = []
  }

  // Export logs for debugging
  exportLogs(): string {
    return JSON.stringify(this.logHistory, null, 2)
  }
}

// Create singleton instance
export const logger = new Logger()

// Export types for use in other files
export type { LogLevel, LogEntry }