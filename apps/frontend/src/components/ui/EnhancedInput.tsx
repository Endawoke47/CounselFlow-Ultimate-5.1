import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertTriangle, Eye, EyeOff, Search } from 'lucide-react'
import { InlineError } from './ErrorDisplay'

interface EnhancedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'autoSave'> {
  label?: string
  error?: string
  success?: boolean
  loading?: boolean
  hint?: string
  showPasswordToggle?: boolean
  validateOnChange?: boolean
  validationRules?: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: string) => string | null
  }
  suggestions?: string[]
  onValidate?: (isValid: boolean, error?: string) => void
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  autoSave?: boolean
  autoSaveDelay?: number
  onAutoSave?: (value: string) => void
}

export function EnhancedInput({
  label,
  error,
  success,
  loading,
  hint,
  showPasswordToggle,
  validateOnChange = true,
  validationRules,
  suggestions = [],
  onValidate,
  leftIcon,
  rightIcon,
  autoSave,
  autoSaveDelay = 1000,
  onAutoSave,
  className = '',
  type = 'text',
  ...props
}: EnhancedInputProps) {
  const [internalValue, setInternalValue] = useState(props.value || '')
  const [showPassword, setShowPassword] = useState(false)
  const [internalError, setInternalError] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !onAutoSave) return

    const timeoutId = setTimeout(() => {
      if (internalValue && internalValue !== props.value) {
        onAutoSave(internalValue as string)
      }
    }, autoSaveDelay)

    return () => clearTimeout(timeoutId)
  }, [internalValue, autoSave, onAutoSave, autoSaveDelay, props.value])

  // Suggestions filtering
  useEffect(() => {
    if (suggestions.length > 0 && internalValue) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes((internalValue as string).toLowerCase())
      )
      setFilteredSuggestions(filtered)
    } else {
      setFilteredSuggestions([])
    }
  }, [internalValue, suggestions])

  const validateInput = (value: string): string | null => {
    if (!validationRules) return null

    if (validationRules.required && !value.trim()) {
      return 'This field is required'
    }

    if (validationRules.minLength && value.length < validationRules.minLength) {
      return `Minimum ${validationRules.minLength} characters required`
    }

    if (validationRules.maxLength && value.length > validationRules.maxLength) {
      return `Maximum ${validationRules.maxLength} characters allowed`
    }

    if (validationRules.pattern && !validationRules.pattern.test(value)) {
      return 'Invalid format'
    }

    if (validationRules.custom) {
      return validationRules.custom(value)
    }

    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInternalValue(value)

    if (validateOnChange && validationRules) {
      const validationError = validateInput(value)
      setInternalError(validationError)
      onValidate?.(validationError === null, validationError || undefined)
    }

    props.onChange?.(e)
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    setShowSuggestions(filteredSuggestions.length > 0)
    props.onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    setTimeout(() => setShowSuggestions(false), 200) // Delay to allow suggestion click
    props.onBlur?.(e)
  }

  const selectSuggestion = (suggestion: string) => {
    setInternalValue(suggestion)
    setShowSuggestions(false)
    
    // Create synthetic event
    const syntheticEvent = {
      target: { value: suggestion }
    } as React.ChangeEvent<HTMLInputElement>
    
    props.onChange?.(syntheticEvent)
  }

  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type

  const hasError = error || internalError
  const isValid = success || (!hasError && internalValue && validationRules)

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {validationRules?.required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      )}

      <div className="relative">
        <div className={`
          relative flex items-center
          ${hasError ? 'ring-2 ring-red-500' : ''}
          ${isValid ? 'ring-2 ring-green-500' : ''}
          ${isFocused && !hasError && !isValid ? 'ring-2 ring-blue-500' : ''}
          transition-all duration-200 rounded-lg
        `}>
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            {...props}
            type={inputType}
            value={internalValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`
              w-full px-4 py-3 border border-gray-200 rounded-lg
              focus:outline-none focus:ring-0 focus:border-transparent
              transition-all duration-200
              ${leftIcon ? 'pl-10' : ''}
              ${(rightIcon || showPasswordToggle || loading || isValid) ? 'pr-10' : ''}
              ${hasError ? 'border-red-300 bg-red-50' : ''}
              ${isValid ? 'border-green-300 bg-green-50' : ''}
              ${className}
            `}
          />

          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {loading && (
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            )}
            
            {isValid && !loading && (
              <Check className="h-4 w-4 text-green-500" />
            )}
            
            {hasError && !loading && (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}

            {showPasswordToggle && type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}

            {rightIcon && !showPasswordToggle && !loading && !isValid && !hasError && (
              <div className="text-gray-400">
                {rightIcon}
              </div>
            )}
          </div>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectSuggestion(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {hasError && (
          <InlineError message={hasError} className="mt-1" />
        )}
      </AnimatePresence>

      {/* Hint */}
      {hint && !hasError && (
        <p className="text-sm text-gray-500 mt-1">{hint}</p>
      )}

      {/* Auto-save indicator */}
      {autoSave && internalValue !== props.value && (
        <p className="text-xs text-blue-500 mt-1">Auto-saving...</p>
      )}
    </div>
  )
}

export function SearchInput({ 
  onSearch, 
  suggestions = [],
  placeholder = "Search...",
  className = "",
  ...props 
}: {
  onSearch: (query: string) => void
  suggestions?: string[]
  placeholder?: string
  className?: string
} & Omit<EnhancedInputProps, 'leftIcon' | 'onValidate'>) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <EnhancedInput
        {...props}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        leftIcon={<Search className="h-4 w-4" />}
        suggestions={suggestions}
      />
    </form>
  )
}