import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Clients,
  Cases,
  Contracts,
  Documents,
  AI,
  Calendar,
  Upload
} from '../icons'
import { cn } from '../../utils/cn'

interface QuickActionsProps {
  onClose: () => void
  className?: string
}

export function QuickActions({ onClose, className }: QuickActionsProps) {
  const navigate = useNavigate()

  const quickActions = [
    {
      icon: Clients,
      label: 'New Client',
      description: 'Add a new client profile',
      action: () => navigate('/clients/new'),
      color: 'var(--color-primary-600)',
      bgColor: 'var(--color-primary-100)'
    },
    {
      icon: Cases,
      label: 'New Matter',
      description: 'Create a new legal matter',
      action: () => navigate('/matters/new'),
      color: 'var(--color-success-600)',
      bgColor: 'var(--color-success-100)'
    },
    {
      icon: Contracts,
      label: 'New Contract',
      description: 'Draft a new contract',
      action: () => navigate('/contracts/new'),
      color: 'var(--color-warning-600)',
      bgColor: 'var(--color-warning-100)'
    },
    {
      icon: Documents,
      label: 'Upload Document',
      description: 'Upload and analyze documents',
      action: () => navigate('/document-analysis'),
      color: 'var(--color-info-600)',
      bgColor: 'var(--color-info-100)'
    },
    {
      icon: AI,
      label: 'AI Assistant',
      description: 'Get AI legal assistance',
      action: () => navigate('/ai'),
      color: 'var(--color-primary-600)',
      bgColor: 'var(--color-primary-100)'
    },
    {
      icon: Calendar,
      label: 'Schedule Meeting',
      description: 'Schedule a client meeting',
      action: () => navigate('/calendar/new'),
      color: 'var(--color-error-600)',
      bgColor: 'var(--color-error-100)'
    }
  ]

  const handleAction = (action: () => void) => {
    action()
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={cn(
        'w-80 rounded-2xl shadow-2xl border overflow-hidden z-50',
        className
      )}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-primary-100)' }}>
            <Plus size={20} style={{ color: 'var(--color-primary-600)' }} />
          </div>
          <div>
            <h3 className="font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
              Quick Actions
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Create new items quickly
            </p>
          </div>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="p-2">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.label}
              onClick={() => handleAction(action.action)}
              className="w-full p-3 flex items-center space-x-3 rounded-lg transition-all duration-150 group"
              style={{
                backgroundColor: 'transparent'
              }}
              whileHover={{
                backgroundColor: 'var(--color-surface-secondary)'
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div 
                className="flex-shrink-0 p-2 rounded-lg transition-transform duration-150 group-hover:scale-110"
                style={{
                  backgroundColor: action.bgColor
                }}
              >
                <Icon size={18} style={{ color: action.color }} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  {action.label}
                </div>
                <div 
                  className="text-xs truncate mt-0.5"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {action.description}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Footer */}
      <div 
        className="p-3 border-t text-center"
        style={{ 
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-surface-secondary)'
        }}
      >
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          Use keyboard shortcut <kbd className="px-1 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>⌘+K</kbd> for quick access
        </p>
      </div>
    </motion.div>
  )
}