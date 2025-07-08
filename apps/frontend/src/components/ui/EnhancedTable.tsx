import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronUp, 
  ChevronDown, 
  Check, 
  Download,
  Filter,
  Search
} from '../icons'
import { Button } from './Button'
import { Skeleton, TableSkeleton } from './SkeletonLoader'

interface Column<T> {
  id: string
  label: string
  accessor?: keyof T | ((item: T) => any)
  sortable?: boolean
  filterable?: boolean
  width?: string
  minWidth?: string
  render?: (value: any, item: T, index: number) => React.ReactNode
  headerRender?: () => React.ReactNode
  className?: string
  headerClassName?: string
}

interface TableAction<T> {
  label: string
  icon?: React.ComponentType<{ size?: number; className?: string }>
  onClick: (item: T) => void
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  show?: (item: T) => boolean
}

interface EnhancedTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  error?: string
  onRetry?: () => void
  
  // Selection
  selectable?: boolean
  selectedItems?: T[]
  onSelectionChange?: (items: T[]) => void
  getRowId?: (item: T) => string
  
  // Sorting
  sortable?: boolean
  defaultSort?: { column: string; direction: 'asc' | 'desc' }
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  
  // Pagination
  pagination?: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
  }
  
  // Actions
  actions?: TableAction<T>[]
  bulkActions?: Array<{
    label: string
    icon?: React.ComponentType<{ size?: number; className?: string }>
    onClick: (items: T[]) => void
    variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  }>
  
  // Styling
  className?: string
  striped?: boolean
  hoverable?: boolean
  dense?: boolean
  
  // Features
  exportable?: boolean
  onExport?: (format: 'csv' | 'xlsx' | 'pdf') => void
  searchable?: boolean
  onSearch?: (query: string) => void
  
  // Empty state
  emptyState?: {
    title: string
    description?: string
    action?: React.ReactNode
  }
}

export function EnhancedTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error,
  onRetry,
  
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  getRowId = (item: T) => item.id || JSON.stringify(item),
  
  sortable = true,
  defaultSort,
  onSort,
  
  pagination,
  
  actions = [],
  bulkActions = [],
  
  className = '',
  striped = true,
  hoverable = true,
  dense = false,
  
  exportable = false,
  onExport,
  searchable = false,
  onSearch,
  
  emptyState
}: EnhancedTableProps<T>) {
  const [sortColumn, setSortColumn] = useState(defaultSort?.column || '')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSort?.direction || 'asc')
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map(col => col.id))
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [showColumnSelector, setShowColumnSelector] = useState(false)

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let result = [...data]

    // Apply search filter
    if (searchQuery && searchable) {
      result = result.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    // Apply sorting
    if (sortColumn) {
      const column = columns.find(col => col.id === sortColumn)
      if (column) {
        result.sort((a, b) => {
          let aValue = column.accessor
            ? typeof column.accessor === 'function'
              ? column.accessor(a)
              : a[column.accessor]
            : a[sortColumn]
          
          let bValue = column.accessor
            ? typeof column.accessor === 'function'
              ? column.accessor(b)
              : b[column.accessor]
            : b[sortColumn]

          // Handle null/undefined values
          if (aValue == null) aValue = ''
          if (bValue == null) bValue = ''

          // Convert to strings for comparison
          aValue = String(aValue).toLowerCase()
          bValue = String(bValue).toLowerCase()

          if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
          if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
          return 0
        })
      }
    }

    return result
  }, [data, searchQuery, sortColumn, sortDirection, columns, searchable])

  const handleSort = useCallback((columnId: string) => {
    const column = columns.find(col => col.id === columnId)
    if (!column?.sortable && !sortable) return

    let newDirection: 'asc' | 'desc' = 'asc'
    
    if (sortColumn === columnId) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc'
    }

    setSortColumn(columnId)
    setSortDirection(newDirection)
    onSort?.(columnId, newDirection)
  }, [sortColumn, sortDirection, onSort, columns, sortable])

  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return

    const allSelected = selectedItems.length === processedData.length
    onSelectionChange(allSelected ? [] : processedData)
  }, [selectedItems, processedData, onSelectionChange])

  const handleSelectItem = useCallback((item: T) => {
    if (!onSelectionChange) return

    const itemId = getRowId(item)
    const isSelected = selectedItems.some(selected => getRowId(selected) === itemId)
    
    if (isSelected) {
      onSelectionChange(selectedItems.filter(selected => getRowId(selected) !== itemId))
    } else {
      onSelectionChange([...selectedItems, item])
    }
  }, [selectedItems, onSelectionChange, getRowId])

  const isItemSelected = useCallback((item: T) => {
    const itemId = getRowId(item)
    return selectedItems.some(selected => getRowId(selected) === itemId)
  }, [selectedItems, getRowId])

  const visibleColumnsArray = useMemo(() => 
    columns.filter(col => visibleColumns.has(col.id)),
    [columns, visibleColumns]
  )

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
        <div className="p-6">
          <TableSkeleton rows={5} columns={columns.length} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 text-center ${className}`}>
        <div className="text-red-600 mb-4">{error}</div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header Controls */}
      {(searchable || exportable || bulkActions.length > 0 || selectedItems.length > 0) && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              {searchable && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      onSearch?.(e.target.value)
                    }}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {selectedItems.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedItems.length} selected
                  </span>
                  {bulkActions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant || 'outline'}
                      size="sm"
                      onClick={() => action.onClick(selectedItems)}
                      icon={action.icon}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {exportable && onExport && (
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Download}
                    onClick={() => onExport('csv')}
                  >
                    Export
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                icon={Filter}
                onClick={() => setShowColumnSelector(!showColumnSelector)}
              >
                Columns
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Column Selector */}
      <AnimatePresence>
        {showColumnSelector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-gray-200 bg-gray-50 p-4"
          >
            <div className="flex flex-wrap gap-2">
              {columns.map((column) => (
                <label key={column.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={visibleColumns.has(column.id)}
                    onChange={(e) => {
                      const newVisible = new Set(visibleColumns)
                      if (e.target.checked) {
                        newVisible.add(column.id)
                      } else {
                        newVisible.delete(column.id)
                      }
                      setVisibleColumns(newVisible)
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{column.label}</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === processedData.length && processedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
              )}
              
              {visibleColumnsArray.map((column) => (
                <th
                  key={column.id}
                  className={`px-4 py-3 text-left font-semibold text-gray-900 ${
                    (column.sortable || sortable) ? 'cursor-pointer hover:bg-gray-100' : ''
                  } ${column.headerClassName || ''}`}
                  style={{ 
                    width: column.width, 
                    minWidth: column.minWidth 
                  }}
                  onClick={() => handleSort(column.id)}
                >
                  <div className="flex items-center space-x-2">
                    {column.headerRender ? column.headerRender() : column.label}
                    {(column.sortable || sortable) && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={`h-3 w-3 ${
                            sortColumn === column.id && sortDirection === 'asc'
                              ? 'text-blue-600' 
                              : 'text-gray-300'
                          }`} 
                        />
                        <ChevronDown 
                          className={`h-3 w-3 -mt-1 ${
                            sortColumn === column.id && sortDirection === 'desc'
                              ? 'text-blue-600' 
                              : 'text-gray-300'
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              
              {actions.length > 0 && (
                <th className="px-4 py-3 text-right w-20">Actions</th>
              )}
            </tr>
          </thead>
          
          <tbody>
            {processedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={visibleColumnsArray.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  className="px-4 py-12 text-center"
                >
                  {emptyState ? (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {emptyState.title}
                      </h3>
                      {emptyState.description && (
                        <p className="text-gray-500 mb-4">{emptyState.description}</p>
                      )}
                      {emptyState.action}
                    </div>
                  ) : (
                    <div className="text-gray-500">No data available</div>
                  )}
                </td>
              </tr>
            ) : (
              processedData.map((item, index) => (
                <motion.tr
                  key={getRowId(item)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    border-b border-gray-100 last:border-b-0
                    ${striped && index % 2 === 1 ? 'bg-gray-50' : ''}
                    ${hoverable ? 'hover:bg-blue-50' : ''}
                    ${isItemSelected(item) ? 'bg-blue-100' : ''}
                    ${dense ? 'text-sm' : ''}
                  `}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isItemSelected(item)}
                        onChange={() => handleSelectItem(item)}
                        className="rounded border-gray-300"
                      />
                    </td>
                  )}
                  
                  {visibleColumnsArray.map((column) => {
                    const value = column.accessor
                      ? typeof column.accessor === 'function'
                        ? column.accessor(item)
                        : item[column.accessor]
                      : item[column.id]

                    return (
                      <td
                        key={column.id}
                        className={`px-4 ${dense ? 'py-2' : 'py-3'} ${column.className || ''}`}
                      >
                        {column.render ? column.render(value, item, index) : value}
                      </td>
                    )
                  })}
                  
                  {actions.length > 0 && (
                    <td className={`px-4 ${dense ? 'py-2' : 'py-3'} text-right`}>
                      <div className="flex items-center justify-end space-x-2">
                        {actions
                          .filter(action => !action.show || action.show(item))
                          .map((action, actionIndex) => (
                            <Button
                              key={actionIndex}
                              variant={action.variant || 'outline'}
                              size="sm"
                              onClick={() => action.onClick(item)}
                              icon={action.icon}
                            >
                              {action.label}
                            </Button>
                          ))}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={pagination.pageSize}
              onChange={(e) => pagination.onPageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            
            <span className="px-3 py-1 text-sm">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}