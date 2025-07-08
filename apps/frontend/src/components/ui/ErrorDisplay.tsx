import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Wifi, WifiOff, AlertCircle, Info } from 'lucide-react'
import { Button } from './Button'

interface ErrorDisplayProps {
  type?: 'error' | 'warning' | 'network' | 'offline' | 'info'
  title?: string
  message?: string
  showRetry?: boolean
  onRetry?: () => void
  actions?: Array<{
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary' | 'outline'
  }>
  className?: string
}

const errorTypes = {
  error: {
    icon: AlertTriangle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    titleColor: 'text-red-800',
    messageColor: 'text-red-700'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-800',
    messageColor: 'text-yellow-700'
  },
  network: {
    icon: WifiOff,
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconColor: 'text-orange-600',
    titleColor: 'text-orange-800',
    messageColor: 'text-orange-700'
  },
  offline: {
    icon: WifiOff,
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    iconColor: 'text-gray-600',
    titleColor: 'text-gray-800',
    messageColor: 'text-gray-700'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-800',
    messageColor: 'text-blue-700'
  }
}

export function ErrorDisplay({
  type = 'error',
  title,
  message,
  showRetry = false,
  onRetry,
  actions = [],
  className = ''
}: ErrorDisplayProps) {
  const config = errorTypes[type]
  const Icon = config.icon

  const defaultTitles = {
    error: 'Something went wrong',
    warning: 'Warning',
    network: 'Network Error',
    offline: 'You are offline',
    info: 'Information'
  }

  const defaultMessages = {
    error: 'An unexpected error occurred. Please try again.',
    warning: 'Please review the following information.',
    network: 'Unable to connect to the server. Please check your connection.',
    offline: 'Some features may not be available while offline.',
    info: 'Here is some important information.'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        ${config.bgColor} ${config.borderColor} 
        border rounded-lg p-4 ${className}
      `}
    >
      <div className="flex items-start">
        <Icon className={`${config.iconColor} h-5 w-5 mt-0.5 mr-3 flex-shrink-0`} />
        
        <div className="flex-1 min-w-0">
          <h3 className={`${config.titleColor} font-semibold text-sm mb-1`}>
            {title || defaultTitles[type]}
          </h3>
          
          <p className={`${config.messageColor} text-sm`}>
            {message || defaultMessages[type]}
          </p>
          
          {(showRetry || actions.length > 0) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {showRetry && onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  icon={RefreshCw}
                >
                  Try Again
                </Button>
              )}
              
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function InlineError({ 
  message, 
  className = '' 
}: { 
  message: string; 
  className?: string 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={`flex items-center text-red-600 text-sm mt-1 ${className}`}
    >
      <AlertTriangle className="h-4 w-4 mr-1 flex-shrink-0" />
      <span>{message}</span>
    </motion.div>
  )
}

export function NetworkStatus() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine)

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-center py-2 text-sm font-medium"
    >
      <div className="flex items-center justify-center">
        <WifiOff className="h-4 w-4 mr-2" />
        You are currently offline. Some features may not be available.
      </div>
    </motion.div>
  )
}