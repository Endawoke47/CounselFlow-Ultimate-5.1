import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { 
  Search, 
  Bell, 
  Plus, 
  Menu,
  AI,
  Analytics,
  Filter,
  Calendar,
  Clock
} from '../icons'
import { ProfileDropdown } from '../ui/ProfileDropdown'
import { QuickActions } from '../ui/QuickActions'
import { SmartSearch } from '../ui/SmartSearch'
import { NotificationPanel } from '../ui/NotificationPanel'
import { Badge } from '../ui/Badge'
import { cn } from '../../utils/cn'

interface SmartTopbarProps {
  onSidebarToggle: () => void
  className?: string
}

export function SmartTopbar({ onSidebarToggle, className }: SmartTopbarProps) {
  const [showSearch, setShowSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [notifications] = useState(4) // Mock notification count
  const location = useLocation()
  const searchRef = useRef<HTMLDivElement>(null)

  // Get current page title
  const getPageTitle = () => {
    const path = location.pathname
    const titles: { [key: string]: string } = {
      '/dashboard': 'Dashboard',
      '/matters': 'Matters',
      '/contracts': 'Contracts',
      '/clients': 'Clients',
      '/documents': 'Documents',
      '/document-analysis': 'AI Document Analysis',
      '/ai': 'AI Assistant',
      '/settings': 'Settings',
      '/analytics': 'Analytics',
      '/compliance': 'Compliance',
      '/calendar': 'Calendar'
    }
    return titles[path] || 'CounselFlow'
  }

  // Current time
  const [currentTime, setCurrentTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Quick stats (mock data)
  const quickStats = {
    activeCases: 127,
    pendingReviews: 8,
    upcomingDeadlines: 3
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'sticky top-0 z-30 border-b backdrop-blur-sm',
        className
      )}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSidebarToggle}
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--color-text-secondary)'
            }}
          >
            <Menu size={20} />
          </motion.button>

          {/* Page Title & Breadcrumb */}
          <div className="hidden sm:block">
            <h1 
              className="text-xl font-bold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {getPageTitle()}
            </h1>
            <div className="flex items-center space-x-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              <span>CounselFlow</span>
              <span>•</span>
              <span>{getPageTitle()}</span>
            </div>
          </div>

          {/* Quick Stats - Hidden on small screens */}
          <div className="hidden xl:flex items-center space-x-4 ml-8">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
              <Analytics size={14} style={{ color: 'var(--color-primary-600)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {quickStats.activeCases}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                cases
              </span>
            </div>
            
            {quickStats.pendingReviews > 0 && (
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--color-warning-50)' }}>
                <Clock size={14} style={{ color: 'var(--color-warning-600)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-warning-800)' }}>
                  {quickStats.pendingReviews}
                </span>
                <span className="text-xs" style={{ color: 'var(--color-warning-700)' }}>
                  pending
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-xl mx-4" ref={searchRef}>
          <div className="relative">
            <motion.button
              onClick={() => setShowSearch(true)}
              className="w-full flex items-center space-x-3 px-4 py-2 rounded-xl border transition-all duration-200"
              style={{
                backgroundColor: showSearch ? 'var(--color-surface)' : 'var(--color-surface-secondary)',
                borderColor: showSearch ? 'var(--color-primary-300)' : 'var(--color-border)',
                color: 'var(--color-text-secondary)'
              }}
              whileHover={{ scale: 1.01 }}
            >
              <Search size={18} />
              <span className="text-sm">Search cases, clients, documents...</span>
              <div className="ml-auto flex items-center space-x-1">
                <kbd className="px-2 py-1 text-xs rounded border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                  ⌘K
                </kbd>
              </div>
            </motion.button>

            <AnimatePresence>
              {showSearch && (
                <SmartSearch 
                  onClose={() => setShowSearch(false)}
                  className="absolute top-full left-0 right-0 mt-2"
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Current Time - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
            <Clock size={14} style={{ color: 'var(--color-text-secondary)' }} />
            <span className="text-sm font-medium tabular-nums" style={{ color: 'var(--color-text-primary)' }}>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: showQuickActions ? 'var(--color-primary-100)' : 'transparent',
                color: showQuickActions ? 'var(--color-primary-700)' : 'var(--color-text-secondary)'
              }}
            >
              <Plus size={20} />
            </motion.button>

            <AnimatePresence>
              {showQuickActions && (
                <QuickActions 
                  onClose={() => setShowQuickActions(false)}
                  className="absolute top-full right-0 mt-2"
                />
              )}
            </AnimatePresence>
          </div>

          {/* AI Assistant Quick Access */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('/ai', '_blank')}
            className="p-2 rounded-lg transition-colors group"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--color-text-secondary)'
            }}
            title="AI Assistant"
          >
            <AI size={20} className="group-hover:text-blue-600 transition-colors" />
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: showNotifications ? 'var(--color-primary-100)' : 'transparent',
                color: showNotifications ? 'var(--color-primary-700)' : 'var(--color-text-secondary)'
              }}
            >
              <Bell size={20} />
              {notifications > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge variant="destructive" size="sm">
                    {notifications > 9 ? '9+' : notifications}
                  </Badge>
                </motion.div>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <NotificationPanel 
                  onClose={() => setShowNotifications(false)}
                  className="absolute top-full right-0 mt-2"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <ProfileDropdown />
        </div>
      </div>

      {/* Mobile Quick Stats */}
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="xl:hidden border-t px-4 py-2"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Analytics size={14} style={{ color: 'var(--color-primary-600)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {quickStats.activeCases} cases
              </span>
            </div>
            
            {quickStats.pendingReviews > 0 && (
              <div className="flex items-center space-x-2">
                <Clock size={14} style={{ color: 'var(--color-warning-600)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-warning-800)' }}>
                  {quickStats.pendingReviews} pending
                </span>
              </div>
            )}
          </div>
          
          <div className="md:hidden text-sm font-medium tabular-nums" style={{ color: 'var(--color-text-primary)' }}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </motion.div>
    </motion.header>
  )
}