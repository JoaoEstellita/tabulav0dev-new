import type { } from 'node';
// Simple logger with level control based on environment variables
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const levelWeights: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

// Determine active level: LOG_LEVEL env or debug by default in non-production
const envLevel = (process.env.LOG_LEVEL as LogLevel) || (process.env.NODE_ENV === 'production' ? 'info' : 'debug')

function shouldLog(level: LogLevel): boolean {
  const current = levelWeights[envLevel]
  const desired = levelWeights[level]
  // In production hide debug logs unless DEBUG flag is set
  if (level === 'debug' && process.env.NODE_ENV === 'production' && !process.env.DEBUG) {
    return false
  }
  return desired >= current
}

function log(level: LogLevel, ...args: any[]): void {
  if (!shouldLog(level)) return
  // eslint-disable-next-line no-console
  console[level](...args)
}

export const logger = {
  debug: (...args: any[]) => log('debug', ...args),
  info: (...args: any[]) => log('info', ...args),
  warn: (...args: any[]) => log('warn', ...args),
  error: (...args: any[]) => log('error', ...args),
}

export default logger
