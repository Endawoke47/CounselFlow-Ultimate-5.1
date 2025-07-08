import React, { useState, useRef, useEffect } from 'react'
import { Search, X, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchInputProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showFilters?: boolean
  onFiltersClick?: () => void
  suggestions?: string[]
  autoFocus?: boolean
}

export function SearchInput({
  placeholder = 'Search...',
  value,
  onChange,
  onSubmit,
  className = '',
  size = 'md',
  showFilters = false,
  onFiltersClick,
  suggestions = [],
  autoFocus = false
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base'
  }

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24
  }

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(value)
    }
    setShowSuggestions(false)
  }

  const handleClear = () => {
    onChange('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
    if (onSubmit) {
      onSubmit(suggestion)
    }
  }

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(value.toLowerCase()) && s !== value
  ).slice(0, 5)

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative flex items-center ${
          isFocused ? 'ring-2 ring-cyan-500 ring-offset-2' : ''
        } rounded-lg border border-gray-300 bg-white transition-all`}>
          <Search 
            size={iconSize[size]} 
            className="absolute left-3 text-gray-400" 
          />
          
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => {
              setIsFocused(true)
              setShowSuggestions(true)
            }}
            onBlur={() => {
              setIsFocused(false)
              setTimeout(() => setShowSuggestions(false), 200)
            }}
            placeholder={placeholder}
            className={`
              w-full pl-10 pr-${value ? '20' : showFilters ? '16' : '4'} 
              ${sizeClasses[size]} 
              border-0 rounded-lg focus:ring-0 focus:outline-none
            `}
          />

          <div className="absolute right-3 flex items-center space-x-2">
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={iconSize[size] - 4} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
            
            {showFilters && (
              <button
                type="button"
                onClick={onFiltersClick}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Filter size={iconSize[size] - 4} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <Search size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{suggestion}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface SearchFiltersProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function SearchFilters({ isOpen, onClose, children }: SearchFiltersProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Search Filters</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}