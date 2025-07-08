import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Bell,
  Shield,
  Analytics,
  Key,
  Moon,
  Sun
} from '../icons'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { Avatar } from './Avatar'
import { Badge } from './Badge'
import { cn } from '../../utils/cn'

interface ProfileDropdownProps {
  className?: string
}

export function ProfileDropdown({ className }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      setIsOpen(false)
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const menuItems = [
    {
      icon: User,
      label: 'My Profile',
      action: () => navigate('/profile'),
      description: 'Manage your account settings'
    },
    {
      icon: Bell,
      label: 'Notifications',
      action: () => navigate('/notifications'),
      description: 'View recent updates',
      badge: notifications > 0 ? notifications.toString() : undefined
    },
    {
      icon: Settings,
      label: 'Preferences',
      action: () => navigate('/settings'),
      description: 'Customize your experience'
    },
    {
      icon: Analytics,
      label: 'Activity Dashboard',
      action: () => navigate('/dashboard'),
      description: 'View your performance metrics'
    },
    {
      icon: Shield,
      label: 'Security',
      action: () => navigate('/security'),
      description: 'Manage security settings'
    },
    {
      icon: Key,
      label: 'API Keys',
      action: () => navigate('/api-keys'),
      description: 'Manage integration keys'
    }
  ]

  const userInfo = {
    name: user ? `${user.firstName} ${user.lastName}` : 'John Doe',
    email: user?.email || 'john.doe@counselflow.com',
    role: user?.role || 'Senior Partner',
    avatar: null,
    status: 'online' as const
  }

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* Profile Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-xl transition-all duration-200 group"
        style={{ 
          backgroundColor: isOpen ? 'var(--color-primary-50)' : 'transparent',
          border: `1px solid ${isOpen ? 'var(--color-primary-200)' : 'transparent'}`
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative">
          <Avatar
            src={userInfo.avatar}
            name={userInfo.name}
            size="sm"
            className="ring-2 ring-white shadow-lg"
          />
          {/* Online status indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          {/* Notification badge */}
          {notifications > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
              {notifications > 9 ? '9+' : notifications}
            </motion.div>
          )}
        </div>
        
        <div className="hidden md:block text-left min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text-primary)' }}>
            {userInfo.name}
          </p>
          <p className="text-xs truncate" style={{ color: 'var(--color-text-secondary)' }}>
            {userInfo.role}
          </p>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="hidden md:block"
        >
          <ChevronDown size={16} style={{ color: 'var(--color-text-secondary)' }} />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl border z-50 overflow-hidden"
            style={{ 
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)'
            }}
          >
            {/* Header */}
            <div className="p-6 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-secondary)' }}>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar
                    src={userInfo.avatar}
                    name={userInfo.name}
                    size="md"
                    className="ring-2 ring-white shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate" style={{ color: 'var(--color-text-primary)' }}>
                    {userInfo.name}
                  </h3>
                  <p className="text-sm truncate" style={{ color: 'var(--color-text-secondary)' }}>
                    {userInfo.email}
                  </p>
                  <div className="flex items-center mt-1">
                    <Badge variant="success" size="sm">
                      {userInfo.role}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={item.label}
                    onClick={() => {
                      item.action()
                      setIsOpen(false)
                    }}
                    className="w-full px-6 py-3 flex items-center space-x-3 transition-colors duration-150 group"
                    style={{ 
                      backgroundColor: 'transparent',
                      color: 'var(--color-text-primary)'
                    }}
                    whileHover={{ 
                      backgroundColor: 'var(--color-surface-secondary)' 
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex-shrink-0">
                      <Icon 
                        size={18} 
                        className="transition-colors duration-150"
                        style={{ color: 'var(--color-text-secondary)' }}
                      />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {item.label}
                        </span>
                        {item.badge && (
                          <Badge variant="destructive" size="sm">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p 
                        className="text-xs mt-0.5 truncate"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Theme Toggle & Logout */}
            <div className="border-t" style={{ borderColor: 'var(--color-border)' }}>
              <div className="p-2 space-y-1">
                {/* Theme Toggle */}
                <motion.button
                  onClick={() => {
                    toggleTheme()
                    setIsOpen(false)
                  }}
                  className="w-full px-4 py-3 flex items-center space-x-3 rounded-lg transition-colors duration-150"
                  whileHover={{ backgroundColor: 'var(--color-surface-secondary)' }}
                >
                  <div className="flex-shrink-0">
                    {theme === 'dark' ? (
                      <Sun size={18} style={{ color: 'var(--color-warning-500)' }} />
                    ) : (
                      <Moon size={18} style={{ color: 'var(--color-info-500)' }} />
                    )}
                  </div>
                  <span className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </motion.button>

                {/* Logout */}
                <motion.button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 flex items-center space-x-3 rounded-lg transition-colors duration-150 group"
                  whileHover={{ backgroundColor: 'var(--color-error-50)' }}
                >
                  <div className="flex-shrink-0">
                    <LogOut 
                      size={18} 
                      className="group-hover:text-red-600 transition-colors duration-150"
                      style={{ color: 'var(--color-error-500)' }}
                    />
                  </div>
                  <span 
                    className="font-medium text-sm group-hover:text-red-600 transition-colors duration-150"
                    style={{ color: 'var(--color-error-500)' }}
                  >
                    Sign Out
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}