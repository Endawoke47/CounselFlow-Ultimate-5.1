import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  User, 
  Tag, 
  ChevronDown,
  Clock,
  Star,
  Save
} from 'lucide-react'
import { Button } from './Button'
import { EnhancedInput } from './EnhancedInput'

interface FilterOption {
  id: string
  label: string
  type: 'text' | 'select' | 'date' | 'dateRange' | 'multiSelect'
  options?: Array<{ value: string; label: string }>
  placeholder?: string
}

interface SearchFilter {
  id: string
  value: any
  operator?: 'equals' | 'contains' | 'startsWith' | 'greaterThan' | 'lessThan' | 'between'
}

interface SavedSearch {
  id: string
  name: string
  query: string
  filters: SearchFilter[]
  timestamp: number
}

interface AdvancedSearchProps {
  placeholder?: string
  filters?: FilterOption[]
  savedSearches?: SavedSearch[]
  onSearch: (query: string, filters: SearchFilter[]) => void
  onSaveSearch?: (search: SavedSearch) => void
  onDeleteSavedSearch?: (searchId: string) => void
  className?: string
  showFilters?: boolean
  showSavedSearches?: boolean
}

export function AdvancedSearch({
  placeholder = "Search...",
  filters = [],
  savedSearches = [],
  onSearch,
  onSaveSearch,
  onDeleteSavedSearch,
  className = "",
  showFilters = true,
  showSavedSearches = true
}: AdvancedSearchProps) {
  const [query, setQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<SearchFilter[]>([])
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [showSavedPanel, setShowSavedPanel] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Save recent searches
  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return

    setRecentSearches(prev => {
      const updated = [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 10)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
      return updated
    })
  }, [])

  const handleSearch = useCallback(() => {
    setIsSearching(true)
    saveRecentSearch(query)
    onSearch(query, activeFilters)
    
    // Simulate search delay for UX
    setTimeout(() => setIsSearching(false), 500)
  }, [query, activeFilters, onSearch, saveRecentSearch])

  const addFilter = useCallback((filterId: string, value: any, operator: SearchFilter['operator'] = 'equals') => {
    setActiveFilters(prev => [
      ...prev.filter(f => f.id !== filterId),
      { id: filterId, value, operator }
    ])
  }, [])

  const removeFilter = useCallback((filterId: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== filterId))
  }, [])

  const clearAllFilters = useCallback(() => {
    setActiveFilters([])
    setQuery('')
  }, [])

  const loadSavedSearch = useCallback((savedSearch: SavedSearch) => {
    setQuery(savedSearch.query)
    setActiveFilters(savedSearch.filters)
    setShowSavedPanel(false)
    onSearch(savedSearch.query, savedSearch.filters)
  }, [onSearch])

  const saveCurrentSearch = useCallback(() => {
    if (!query.trim() && activeFilters.length === 0) return

    const searchName = prompt('Enter a name for this search:')
    if (!searchName) return

    const savedSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName,
      query,
      filters: activeFilters,
      timestamp: Date.now()
    }

    onSaveSearch?.(savedSearch)
  }, [query, activeFilters, onSaveSearch])

  const getFilterDisplay = useCallback((filter: SearchFilter) => {
    const filterOption = filters.find(f => f.id === filter.id)
    if (!filterOption) return ''

    let displayValue = filter.value
    if (filterOption.type === 'select' && filterOption.options) {
      const option = filterOption.options.find(o => o.value === filter.value)
      displayValue = option?.label || filter.value
    } else if (filterOption.type === 'multiSelect' && Array.isArray(filter.value)) {
      displayValue = filter.value.join(', ')
    }

    return `${filterOption.label}: ${displayValue}`
  }, [filters])

  return (
    <div className={`relative ${className}`}>
      {/* Main Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="flex-1">
            <EnhancedInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              leftIcon={<Search className="h-4 w-4" />}
              suggestions={recentSearches}
              loading={isSearching}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSearch()
                }
              }}
            />
          </div>

          <div className="flex items-center ml-2 space-x-2">
            {showFilters && filters.length > 0 && (
              <Button
                variant={showFilterPanel ? "primary" : "outline"}
                size="sm"
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                icon={Filter}
                className="relative"
              >
                {activeFilters.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </Button>
            )}

            {showSavedSearches && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSavedPanel(!showSavedPanel)}
                icon={Star}
              />
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={handleSearch}
              loading={isSearching}
            >
              Search
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex flex-wrap gap-2"
            >
              {activeFilters.map((filter) => (
                <motion.div
                  key={filter.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{getFilterDisplay(filter)}</span>
                  <button
                    onClick={() => removeFilter(filter.id)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
              
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilterPanel && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <div className="flex items-center space-x-2">
                {(query || activeFilters.length > 0) && onSaveSearch && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveCurrentSearch}
                    icon={Save}
                  >
                    Save Search
                  </Button>
                )}
                <button
                  onClick={() => setShowFilterPanel(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map((filter) => (
                <FilterInput
                  key={filter.id}
                  filter={filter}
                  value={activeFilters.find(f => f.id === filter.id)?.value}
                  onChange={(value) => addFilter(filter.id, value)}
                  onRemove={() => removeFilter(filter.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Searches Panel */}
      <AnimatePresence>
        {showSavedPanel && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Saved Searches</h3>
              <button
                onClick={() => setShowSavedPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {savedSearches.length === 0 ? (
                <p className="text-gray-500 text-sm">No saved searches yet</p>
              ) : (
                savedSearches.map((savedSearch) => (
                  <div
                    key={savedSearch.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => loadSavedSearch(savedSearch)}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{savedSearch.name}</div>
                      <div className="text-sm text-gray-500">
                        {savedSearch.query && `"${savedSearch.query}"`}
                        {savedSearch.filters.length > 0 && ` • ${savedSearch.filters.length} filters`}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(savedSearch.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {onDeleteSavedSearch && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteSavedSearch(savedSearch.id)
                        }}
                        className="text-gray-400 hover:text-red-600 p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FilterInput({ 
  filter, 
  value, 
  onChange, 
  onRemove 
}: { 
  filter: FilterOption
  value: any
  onChange: (value: any) => void
  onRemove: () => void
}) {
  const [localValue, setLocalValue] = useState(value || '')

  const handleChange = (newValue: any) => {
    setLocalValue(newValue)
    if (newValue) {
      onChange(newValue)
    } else {
      onRemove()
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {filter.label}
      </label>

      {filter.type === 'text' && (
        <EnhancedInput
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={filter.placeholder}
        />
      )}

      {filter.type === 'select' && filter.options && (
        <select
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{filter.placeholder || 'Select...'}</option>
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {filter.type === 'date' && (
        <input
          type="date"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      {filter.type === 'multiSelect' && filter.options && (
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {filter.options.map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="checkbox"
                checked={(localValue || []).includes(option.value)}
                onChange={(e) => {
                  const currentValues = localValue || []
                  const newValues = e.target.checked
                    ? [...currentValues, option.value]
                    : currentValues.filter((v: string) => v !== option.value)
                  handleChange(newValues.length > 0 ? newValues : null)
                }}
                className="mr-2"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}