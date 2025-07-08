// Type guards and utility functions for null/undefined checks

export function isNotNull<T>(value: T | null): value is T {
  return value !== null
}

export function isNotUndefined<T>(value: T | undefined): value is T {
  return value !== undefined
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function safeParseJSON<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString)
  } catch {
    return fallback
  }
}

export function safeAccess<T extends Record<string, any>>(
  obj: T | null | undefined,
  key: keyof T
): T[keyof T] | undefined {
  return obj && typeof obj === 'object' && key in obj ? obj[key] : undefined
}

export function safeArrayAccess<T>(
  array: T[] | null | undefined,
  index: number
): T | undefined {
  return Array.isArray(array) && index >= 0 && index < array.length 
    ? array[index] 
    : undefined
}

export function ensureArray<T>(value: T | T[] | null | undefined): T[] {
  if (Array.isArray(value)) return value
  if (isDefined(value)) return [value]
  return []
}

export function formatDisplayName(
  firstName?: string | null,
  lastName?: string | null
): string {
  const first = firstName?.trim() || ''
  const last = lastName?.trim() || ''
  
  if (first && last) return `${first} ${last}`
  if (first) return first
  if (last) return last
  return 'Unknown User'
}

export function formatCurrency(
  amount: number | null | undefined,
  currency = 'USD'
): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$0.00'
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatDate(
  date: string | Date | null | undefined,
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  if (!date) return 'No date'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return 'Invalid date'
  
  switch (format) {
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    case 'relative':
      return getRelativeTime(dateObj)
    default:
      return dateObj.toLocaleDateString('en-US')
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
  return `${Math.floor(diffInDays / 365)} years ago`
}

export function truncateText(
  text: string | null | undefined,
  maxLength: number
): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

export function capitalizeFirst(text: string | null | undefined): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return `${count} ${singular}`
  return `${count} ${plural || singular + 's'}`
}