import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Download, 
  Edit, 
  Delete, 
  Plus,
  Zap,
  Shield,
  Wifi,
  WifiOff,
  RefreshCw,
  Keyboard
} from '../components/icons'

import { DashboardSkeleton, CardSkeleton, TableSkeleton } from '../components/ui/SkeletonLoader'
import { ErrorDisplay, InlineError } from '../components/ui/ErrorDisplay'
import { EnhancedInput, SearchInput } from '../components/ui/EnhancedInput'
import { AdvancedSearch } from '../components/ui/AdvancedSearch'
import { EnhancedTable } from '../components/ui/EnhancedTable'
import { Button } from '../components/ui/Button'
import { ThemeToggle, useTheme } from '../contexts/ThemeContext'
import { useOptimisticUpdates } from '../hooks/useOptimisticUpdates'
import { useWebSocket } from '../hooks/useWebSocket'
import { useOffline } from '../hooks/useOfflineCapability'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'

interface DemoData {
  id: string
  name: string
  type: string
  status: string
  date: string
  priority: 'high' | 'medium' | 'low'
}

const demoData: DemoData[] = [
  { id: '1', name: 'Contract Review - ABC Corp', type: 'Contract', status: 'In Progress', date: '2024-01-15', priority: 'high' },
  { id: '2', name: 'Patent Application Filing', type: 'IP', status: 'Pending', date: '2024-01-14', priority: 'medium' },
  { id: '3', name: 'Employment Agreement', type: 'Contract', status: 'Completed', date: '2024-01-13', priority: 'low' },
  { id: '4', name: 'Trademark Registration', type: 'IP', status: 'In Progress', date: '2024-01-12', priority: 'high' },
  { id: '5', name: 'Compliance Audit', type: 'Compliance', status: 'Pending', date: '2024-01-11', priority: 'medium' },
]

const filterOptions = [
  {
    id: 'type',
    label: 'Type',
    type: 'select' as const,
    options: [
      { value: 'contract', label: 'Contract' },
      { value: 'ip', label: 'Intellectual Property' },
      { value: 'compliance', label: 'Compliance' }
    ]
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'in-progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' }
    ]
  },
  {
    id: 'priority',
    label: 'Priority',
    type: 'select' as const,
    options: [
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' }
    ]
  },
  {
    id: 'date',
    label: 'Date Range',
    type: 'dateRange' as const
  }
]

export function ImprovementsDemo() {
  const [activeDemo, setActiveDemo] = useState<string>('skeleton')
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showError, setShowError] = useState(false)
  const [tableData, setTableData] = useState(demoData)
  const [selectedItems, setSelectedItems] = useState<DemoData[]>([])
  
  const { isDark } = useTheme()
  const { isOnline, pendingActions } = useOffline()
  const { isConnected } = useWebSocket()
  const { createOptimistic, updateOptimistic, deleteOptimistic } = useOptimisticUpdates<DemoData>()

  // Initialize keyboard shortcuts for this demo
  useKeyboardShortcuts([
    {
      key: 'd',
      ctrlKey: true,
      action: () => setActiveDemo('skeleton'),
      description: 'Show skeleton demo',
      category: 'Demo'
    }
  ])

  const columns = [
    {
      id: 'name',
      label: 'Name',
      accessor: 'name' as keyof DemoData,
      sortable: true
    },
    {
      id: 'type',
      label: 'Type',
      accessor: 'type' as keyof DemoData,
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Contract' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
          value === 'IP' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
        }`}>
          {value}
        </span>
      )
    },
    {
      id: 'status',
      label: 'Status',
      accessor: 'status' as keyof DemoData,
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          value === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        }`}>
          {value}
        </span>
      )
    },
    {
      id: 'priority',
      label: 'Priority',
      accessor: 'priority' as keyof DemoData,
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
          value === 'medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      id: 'date',
      label: 'Date',
      accessor: 'date' as keyof DemoData,
      sortable: true
    }
  ]

  const tableActions = [
    {
      label: 'Edit',
      icon: Edit,
      onClick: (item: DemoData) => {
        updateOptimistic(['demo-data'], { ...item, name: item.name + ' (Updated)' }, async () => {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
        })
      },
      variant: 'outline' as const
    },
    {
      label: 'Delete',
      icon: Delete,
      onClick: (item: DemoData) => {
        deleteOptimistic(['demo-data'], item, async () => {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          setTableData(prev => prev.filter(d => d.id !== item.id))
        })
      },
      variant: 'danger' as const
    }
  ]

  const bulkActions = [
    {
      label: 'Export Selected',
      icon: Download,
      onClick: (items: DemoData[]) => {
        console.log('Exporting items:', items)
      }
    },
    {
      label: 'Delete Selected',
      icon: Delete,
      onClick: (items: DemoData[]) => {
        console.log('Deleting items:', items)
      },
      variant: 'danger' as const
    }
  ]

  const demos = [
    {
      id: 'skeleton',
      title: 'Skeleton Loading States',
      description: 'Enhanced loading experience with contextual skeleton screens',
      icon: RefreshCw
    },
    {
      id: 'forms',
      title: 'Enhanced Form Validation',
      description: 'Real-time validation with smart feedback and auto-save',
      icon: Edit
    },
    {
      id: 'search',
      title: 'Advanced Search & Filtering',
      description: 'Powerful search with filters, saved searches, and suggestions',
      icon: Search
    },
    {
      id: 'tables',
      title: 'Enhanced Data Tables',
      description: 'Sortable, filterable tables with bulk actions and selection',
      icon: Download
    },
    {
      id: 'errors',
      title: 'Error Handling & Recovery',
      description: 'Smart error handling with retry logic and user guidance',
      icon: Shield
    },
    {
      id: 'offline',
      title: 'Offline Capability',
      description: 'Work offline with automatic sync when connection returns',
      icon: WifiOff
    },
    {
      id: 'realtime',
      title: 'Real-time Updates',
      description: 'Live data synchronization with WebSocket integration',
      icon: Zap
    },
    {
      id: 'shortcuts',
      title: 'Keyboard Shortcuts',
      description: 'Power user features with comprehensive keyboard navigation',
      icon: Keyboard
    }
  ]

  const renderDemo = () => {
    switch (activeDemo) {
      case 'skeleton':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Skeleton Loading States</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-4">Dashboard Skeleton</h4>
                <DashboardSkeleton />
              </div>
              <div>
                <h4 className="font-medium mb-4">Card Skeleton</h4>
                <CardSkeleton showHeader showFooter />
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">Table Skeleton</h4>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <TableSkeleton rows={5} columns={4} />
              </div>
            </div>
          </div>
        )

      case 'forms':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Enhanced Form Validation</h3>
            <div className="max-w-md space-y-4">
              <EnhancedInput
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                validationRules={{
                  required: true,
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                }}
                validateOnChange
                suggestions={['user@example.com', 'admin@company.com']}
                hint="We'll never share your email"
                autoSave
                onAutoSave={(value) => console.log('Auto-saved:', value)}
              />
              
              <EnhancedInput
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                showPasswordToggle
                validationRules={{
                  required: true,
                  minLength: 8
                }}
                validateOnChange
              />
              
              <Button variant="primary" className="w-full">
                Sign In
              </Button>
            </div>
          </div>
        )

      case 'search':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Advanced Search & Filtering</h3>
            <AdvancedSearch
              placeholder="Search legal matters..."
              filters={filterOptions}
              onSearch={(query, filters) => console.log('Search:', { query, filters })}
              showFilters
              showSavedSearches
            />
            
            <div className="mt-6">
              <h4 className="font-medium mb-4">Simple Search Input</h4>
              <SearchInput
                onSearch={(query) => console.log('Simple search:', query)}
                placeholder="Quick search..."
                suggestions={['Contract Review', 'Patent Filing', 'Compliance Audit']}
              />
            </div>
          </div>
        )

      case 'tables':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Enhanced Data Tables</h3>
            <EnhancedTable
              data={tableData}
              columns={columns}
              selectable
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
              actions={tableActions}
              bulkActions={bulkActions}
              sortable
              searchable
              exportable
              onExport={(format) => console.log('Export as:', format)}
              striped
              hoverable
              emptyState={{
                title: 'No legal matters found',
                description: 'Create your first matter to get started',
                action: (
                  <Button icon={Plus} variant="primary">
                    Create Matter
                  </Button>
                )
              }}
            />
          </div>
        )

      case 'errors':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Error Handling & Recovery</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <ErrorDisplay
                  type="error"
                  title="Operation Failed"
                  message="Unable to save your changes. Please check your connection and try again."
                  showRetry
                  onRetry={() => console.log('Retrying...')}
                />
                
                <ErrorDisplay
                  type="network"
                  title="Connection Issue"
                  message="Network request failed. Retrying automatically..."
                  actions={[
                    { label: 'Retry Now', onClick: () => console.log('Manual retry') },
                    { label: 'Go Offline', onClick: () => console.log('Go offline'), variant: 'outline' }
                  ]}
                />
              </div>
              
              <div className="space-y-4">
                <ErrorDisplay
                  type="warning"
                  title="Unsaved Changes"
                  message="You have unsaved changes that will be lost if you leave this page."
                  actions={[
                    { label: 'Save Changes', onClick: () => console.log('Save'), variant: 'primary' },
                    { label: 'Discard', onClick: () => console.log('Discard'), variant: 'outline' }
                  ]}
                />
                
                <ErrorDisplay
                  type="offline"
                  title="Working Offline"
                  message="Your changes are being saved locally and will sync when you're back online."
                />
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Inline Field Errors</h4>
              <div className="max-w-md">
                <EnhancedInput
                  label="Email"
                  error="Please enter a valid email address"
                  value="invalid-email"
                />
              </div>
            </div>
          </div>
        )

      case 'offline':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Offline Capability</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`p-4 rounded-lg border ${
                isOnline 
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                  : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              }`}>
                <div className="flex items-center space-x-2">
                  {isOnline ? (
                    <Wifi className="h-5 w-5 text-green-600" />
                  ) : (
                    <WifiOff className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    isOnline ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                  }`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${
                  isOnline ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                }`}>
                  {isOnline ? 'All features available' : 'Working in offline mode'}
                </p>
              </div>
              
              <div className="p-4 rounded-lg border bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">
                    Pending Actions
                  </span>
                </div>
                <p className="text-sm mt-1 text-blue-700 dark:text-blue-300">
                  {pendingActions?.length || 0} actions queued for sync
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                isConnected 
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                  : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
              }`}>
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <span className={`font-medium ${
                    isConnected ? 'text-green-800 dark:text-green-200' : 'text-yellow-800 dark:text-yellow-200'
                  }`}>
                    Real-time
                  </span>
                </div>
                <p className={`text-sm mt-1 ${
                  isConnected ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'
                }`}>
                  {isConnected ? 'Connected' : 'Reconnecting...'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={() => {
                  // Simulate offline action
                  console.log('Offline action queued')
                }}
                icon={Plus}
              >
                Create Matter (Works Offline)
              </Button>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Actions performed while offline are automatically queued and synchronized when connection is restored.
              </p>
            </div>
          </div>
        )

      case 'shortcuts':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Shift + ?</kbd> to view all available shortcuts
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Navigation</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Dashboard</span>
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl + 1</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Matters</span>
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl + 2</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Contracts</span>
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl + 3</kbd>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Actions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Search</span>
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl + K</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>New Item</span>
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl + N</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Escape</span>
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Esc</kbd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return <div>Select a demo from the sidebar</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Improvements Demo
              </h1>
              <ThemeToggle />
            </div>
            
            <nav className="space-y-2">
              {demos.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => setActiveDemo(demo.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeDemo === demo.id
                      ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <demo.icon className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="font-medium">{demo.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {demo.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-6">
            <motion.div
              key={activeDemo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderDemo()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}