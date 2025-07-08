import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
  Bell,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Settings
} from '../icons'
import { Badge } from './Badge'
import { cn } from '../../utils/cn'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

interface NotificationPanelProps {
  onClose: () => void
  className?: string
}

export function NotificationPanel({ onClose, className }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Contract Review Due',
      message: 'TechCorp Service Agreement expires in 3 days',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      actionUrl: '/contracts/1'
    },
    {
      id: '2',
      type: 'info',
      title: 'New Client Inquiry',
      message: 'StartupCo has requested a consultation meeting',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: false,
      actionUrl: '/clients/new'
    },
    {
      id: '3',
      type: 'success',
      title: 'Payment Received',
      message: '$15,000 payment has been processed successfully',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: true,
      actionUrl: '/billing'
    },
    {
      id: '4',
      type: 'error',
      title: 'Document Analysis Failed',
      message: 'Unable to process compliance-report.pdf due to format issues',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      read: true,
      actionUrl: '/document-analysis'
    },
    {
      id: '5',
      type: 'info',
      title: 'Calendar Reminder',
      message: 'Client meeting with Johnson Corp in 30 minutes',
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
      read: true,
      actionUrl: '/calendar'
    }
  ])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return { icon: CheckCircle, color: 'var(--color-success-600)', bg: 'var(--color-success-100)' }
      case 'warning':
        return { icon: AlertCircle, color: 'var(--color-warning-600)', bg: 'var(--color-warning-100)' }
      case 'error':
        return { icon: AlertCircle, color: 'var(--color-error-600)', bg: 'var(--color-error-100)' }
      default:
        return { icon: Bell, color: 'var(--color-info-600)', bg: 'var(--color-info-100)' }
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={cn(
        'w-96 rounded-2xl shadow-2xl border overflow-hidden z-50',
        className
      )}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-primary-100)' }}>
              <Bell size={20} style={{ color: 'var(--color-primary-600)' }} />
            </div>
            <div>
              <h3 className="font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <motion.button
                onClick={markAllAsRead}
                className="text-xs font-medium px-3 py-1 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'var(--color-primary-100)',
                  color: 'var(--color-primary-700)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Mark all read
              </motion.button>
            )}
            <motion.button
              onClick={onClose}
              className="p-1 rounded-lg transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
              whileHover={{ backgroundColor: 'var(--color-surface-secondary)' }}
            >
              <X size={16} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          <div className="p-2">
            {notifications.map((notification, index) => {
              const iconData = getNotificationIcon(notification.type)
              const Icon = iconData.icon

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'p-3 rounded-lg mb-2 border transition-all duration-150 group cursor-pointer',
                    !notification.read && 'ring-2 ring-blue-500/20'
                  )}
                  style={{
                    backgroundColor: notification.read ? 'transparent' : 'var(--color-primary-50)',
                    borderColor: notification.read ? 'var(--color-border)' : 'var(--color-primary-200)'
                  }}
                  onClick={() => {
                    markAsRead(notification.id)
                    if (notification.actionUrl) {
                      window.location.href = notification.actionUrl
                    }
                  }}
                  whileHover={{ backgroundColor: 'var(--color-surface-secondary)' }}
                >
                  <div className="flex items-start space-x-3">
                    <div 
                      className="flex-shrink-0 p-2 rounded-lg"
                      style={{ backgroundColor: iconData.bg }}
                    >
                      <Icon size={16} style={{ color: iconData.color }} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm truncate" style={{ color: 'var(--color-text-primary)' }}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeNotification(notification.id)
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center space-x-2">
                        <Clock size={12} style={{ color: 'var(--color-text-secondary)' }} />
                        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </span>
                        {notification.type === 'warning' && (
                          <Badge variant="warning" size="sm">
                            Urgent
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Bell size={48} className="mx-auto mb-3 opacity-50" style={{ color: 'var(--color-text-secondary)' }} />
            <h3 className="font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
              No notifications
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              You're all caught up!
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div 
        className="p-3 border-t"
        style={{ 
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-surface-secondary)'
        }}
      >
        <motion.button
          className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg transition-colors"
          whileHover={{ backgroundColor: 'var(--color-surface)' }}
        >
          <Settings size={16} style={{ color: 'var(--color-text-secondary)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            Notification Settings
          </span>
        </motion.button>
      </div>
    </motion.div>
  )
}