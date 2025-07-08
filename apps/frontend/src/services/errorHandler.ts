import { logger } from './logger'

export interface ApiError {
  message: string
  code: string
  status?: number
  details?: any
}

export interface ValidationError {
  field: string
  message: string
}

export class AppError extends Error {
  public readonly code: string
  public readonly status?: number
  public readonly details?: any

  constructor(message: string, code: string, status?: number, details?: any) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.status = status
    this.details = details
  }
}

class ErrorHandler {
  // Handle API errors with proper typing and logging
  handleApiError(error: any): ApiError {
    logger.error('API Error occurred', error)

    // Handle network errors
    if (!error.response) {
      return {
        message: 'Network error - please check your connection',
        code: 'NETWORK_ERROR'
      }
    }

    // Handle different HTTP status codes
    const status = error.response?.status
    const data = error.response?.data

    switch (status) {
      case 400:
        return {
          message: data?.message || 'Invalid request',
          code: 'BAD_REQUEST',
          status,
          details: data?.errors || data?.details
        }
      case 401:
        return {
          message: 'Authentication required',
          code: 'UNAUTHORIZED',
          status
        }
      case 403:
        return {
          message: 'Access denied',
          code: 'FORBIDDEN',
          status
        }
      case 404:
        return {
          message: 'Resource not found',
          code: 'NOT_FOUND',
          status
        }
      case 422:
        return {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          status,
          details: data?.errors
        }
      case 429:
        return {
          message: 'Too many requests - please try again later',
          code: 'RATE_LIMITED',
          status
        }
      case 500:
        return {
          message: 'Server error - please try again',
          code: 'SERVER_ERROR',
          status
        }
      default:
        return {
          message: data?.message || 'An unexpected error occurred',
          code: 'UNKNOWN_ERROR',
          status
        }
    }
  }

  // Handle validation errors
  handleValidationErrors(errors: any[]): ValidationError[] {
    return errors.map(error => ({
      field: error.field || error.path || 'unknown',
      message: error.message || 'Validation failed'
    }))
  }

  // Async wrapper for error handling
  async withErrorHandling<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<{ data: T | null; error: ApiError | null }> {
    try {
      const data = await operation()
      return { data, error: null }
    } catch (error) {
      logger.error(`Error in ${context}`, error)
      return { data: null, error: this.handleApiError(error) }
    }
  }

  // Sync wrapper for error handling
  withSyncErrorHandling<T>(
    operation: () => T,
    context: string
  ): { data: T | null; error: Error | null } {
    try {
      const data = operation()
      return { data, error: null }
    } catch (error) {
      logger.error(`Error in ${context}`, error)
      return { data: null, error: error as Error }
    }
  }

  // Handle form submission errors
  handleFormError(error: any): { message: string; fieldErrors?: Record<string, string> } {
    const apiError = this.handleApiError(error)
    
    if (apiError.code === 'VALIDATION_ERROR' && apiError.details) {
      const fieldErrors: Record<string, string> = {}
      
      if (Array.isArray(apiError.details)) {
        apiError.details.forEach((err: any) => {
          if (err.field && err.message) {
            fieldErrors[err.field] = err.message
          }
        })
      }
      
      return {
        message: apiError.message,
        fieldErrors
      }
    }
    
    return { message: apiError.message }
  }

  // Show user-friendly error messages
  getUserFriendlyMessage(error: ApiError): string {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Please check your internet connection and try again.'
      case 'UNAUTHORIZED':
        return 'Please log in to continue.'
      case 'FORBIDDEN':
        return 'You don\'t have permission to perform this action.'
      case 'NOT_FOUND':
        return 'The requested information could not be found.'
      case 'VALIDATION_ERROR':
        return 'Please check your input and try again.'
      case 'RATE_LIMITED':
        return 'You\'re doing that too often. Please wait a moment and try again.'
      case 'SERVER_ERROR':
        return 'We\'re experiencing technical difficulties. Please try again in a few minutes.'
      default:
        return error.message || 'Something went wrong. Please try again.'
    }
  }

  // Check if error requires authentication
  requiresAuth(error: ApiError): boolean {
    return error.code === 'UNAUTHORIZED'
  }

  // Check if error is retryable
  isRetryable(error: ApiError): boolean {
    return ['NETWORK_ERROR', 'SERVER_ERROR', 'RATE_LIMITED'].includes(error.code)
  }
}

// Create singleton instance
export const errorHandler = new ErrorHandler()

// Utility function for async operations with error handling
export async function safeAsync<T>(
  operation: () => Promise<T>,
  context: string
): Promise<{ data: T | null; error: ApiError | null }> {
  return errorHandler.withErrorHandling(operation, context)
}

// Utility function for sync operations with error handling
export function safeSync<T>(
  operation: () => T,
  context: string
): { data: T | null; error: Error | null } {
  return errorHandler.withSyncErrorHandling(operation, context)
}