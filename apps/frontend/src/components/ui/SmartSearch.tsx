import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Clock,
  Clients,
  Cases,
  Documents,
  Contracts,
  AI,
  TrendingUp,
  ArrowRight
} from '../icons'
import { cn } from '../../utils/cn'

interface SearchResult {
  id: string
  title: string
  type: 'client' | 'matter' | 'document' | 'contract' | 'ai-chat'
  description: string
  url: string
  metadata?: {
    status?: string
    date?: string
    priority?: string
  }
}

interface SmartSearchProps {
  onClose: () => void
  className?: string
}

export function SmartSearch({ onClose, className }: SmartSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches] = useState([
    'TechCorp Contract Review',
    'Johnson vs Smith',
    'GDPR Compliance Documents',
    'Q4 Financial Analysis'
  ])
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Mock search data
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'TechCorp Service Agreement',
      type: 'contract',
      description: 'Master service agreement with TechCorp Industries',
      url: '/contracts/1',
      metadata: { status: 'Active', date: '2024-01-15' }
    },
    {
      id: '2',
      title: 'Johnson vs Smith Case',
      type: 'matter',
      description: 'Employment discrimination case',
      url: '/matters/2',
      metadata: { status: 'In Progress', priority: 'High' }
    },
    {
      id: '3',
      title: 'ACME Corporation',
      type: 'client',
      description: 'Fortune 500 technology company',
      url: '/clients/3',
      metadata: { status: 'Active' }
    },
    {
      id: '4',
      title: 'GDPR Compliance Report',
      type: 'document',
      description: 'Data protection compliance analysis',
      url: '/documents/4',
      metadata: { date: '2024-02-20' }
    },
    {
      id: '5',
      title: 'Contract Risk Analysis',
      type: 'ai-chat',
      description: 'AI conversation about contract risks',
      url: '/ai/chat/5',
      metadata: { date: '2024-03-01' }
    }
  ]

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Handle search
  useEffect(() => {
    if (query.trim()) {
      setLoading(true)
      const timeout = setTimeout(() => {
        const filtered = mockResults.filter(
          result =>
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.description.toLowerCase().includes(query.toLowerCase())
        )
        setResults(filtered)
        setSelectedIndex(0)
        setLoading(false)
      }, 300)

      return () => clearTimeout(timeout)
    } else {
      setResults([])
      setSelectedIndex(0)
      setLoading(false)
    }
  }, [query])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (results[selectedIndex]) {
          handleResultClick(results[selectedIndex])
        }
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [results, selectedIndex, onClose])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'client':
        return Clients
      case 'matter':
        return Cases
      case 'document':
        return Documents
      case 'contract':
        return Contracts
      case 'ai-chat':
        return AI
      default:
        return Documents
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'client':
        return 'var(--color-primary-600)'
      case 'matter':
        return 'var(--color-success-600)'
      case 'document':
        return 'var(--color-info-600)'
      case 'contract':
        return 'var(--color-warning-600)'
      case 'ai-chat':
        return 'var(--color-primary-600)'
      default:
        return 'var(--color-gray-600)'
    }
  }

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'client':
        return 'var(--color-primary-100)'
      case 'matter':
        return 'var(--color-success-100)'
      case 'document':
        return 'var(--color-info-100)'
      case 'contract':
        return 'var(--color-warning-100)'
      case 'ai-chat':
        return 'var(--color-primary-100)'
      default:
        return 'var(--color-gray-100)'
    }
  }

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url)
    onClose()
  }

  const handleRecentSearchClick = (search: string) => {
    setQuery(search)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={cn(
        'w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden z-50',
        className
      )}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)'
      }}
    >
      {/* Search Input */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center space-x-3">
          <Search size={20} style={{ color: 'var(--color-text-secondary)' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases, clients, documents..."
            className="flex-1 text-lg outline-none"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--color-text-primary)'
            }}
          />
          {loading && (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-h-96 overflow-y-auto">
        {query.trim() === '' ? (
          /* Recent Searches */
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Clock size={16} style={{ color: 'var(--color-text-secondary)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Recent Searches
              </span>
            </div>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <motion.button
                  key={search}
                  onClick={() => handleRecentSearchClick(search)}
                  className="w-full text-left p-2 rounded-lg transition-colors"
                  whileHover={{ backgroundColor: 'var(--color-surface-secondary)' }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                    {search}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp size={16} style={{ color: 'var(--color-text-secondary)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  Quick Actions
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-3 rounded-lg text-left transition-colors" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
                  <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    New Matter
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Create legal matter
                  </div>
                </button>
                <button className="p-3 rounded-lg text-left transition-colors" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
                  <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    Upload Document
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Analyze with AI
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : results.length > 0 ? (
          /* Search Results */
          <div className="p-2">
            {results.map((result, index) => {
              const Icon = getTypeIcon(result.type)
              const isSelected = index === selectedIndex

              return (
                <motion.button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={cn(
                    'w-full p-3 flex items-center space-x-3 rounded-lg transition-all duration-150 group',
                    isSelected && 'ring-2 ring-blue-500'
                  )}
                  style={{
                    backgroundColor: isSelected ? 'var(--color-primary-50)' : 'transparent'
                  }}
                  whileHover={{ backgroundColor: 'var(--color-surface-secondary)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div 
                    className="flex-shrink-0 p-2 rounded-lg"
                    style={{ backgroundColor: getTypeBg(result.type) }}
                  >
                    <Icon size={18} style={{ color: getTypeColor(result.type) }} />
                  </div>
                  
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate" style={{ color: 'var(--color-text-primary)' }}>
                        {result.title}
                      </span>
                      {result.metadata?.status && (
                        <span 
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: result.metadata.status === 'Active' ? 'var(--color-success-100)' : 'var(--color-warning-100)',
                            color: result.metadata.status === 'Active' ? 'var(--color-success-700)' : 'var(--color-warning-700)'
                          }}
                        >
                          {result.metadata.status}
                        </span>
                      )}
                    </div>
                    <div className="text-xs truncate mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                      {result.description}
                    </div>
                    {result.metadata?.date && (
                      <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                        {new Date(result.metadata.date).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <ArrowRight 
                    size={16} 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--color-text-secondary)' }}
                  />
                </motion.button>
              )
            })}
          </div>
        ) : query.trim() !== '' && !loading ? (
          /* No Results */
          <div className="p-8 text-center">
            <Search size={48} className="mx-auto mb-3" style={{ color: 'var(--color-text-secondary)' }} />
            <h3 className="font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
              No results found
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Try searching for clients, matters, documents, or contracts
            </p>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div 
        className="p-3 border-t text-center"
        style={{ 
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-surface-secondary)'
        }}
      >
        <div className="flex items-center justify-center space-x-4 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          <span>↑↓ to navigate</span>
          <span>↵ to select</span>
          <span>esc to close</span>
        </div>
      </div>
    </motion.div>
  )
}