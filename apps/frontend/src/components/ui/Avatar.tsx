import React from 'react'
import { motion } from 'framer-motion'
import { User } from '../icons'
import { cn } from '../../utils/cn'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showBorder?: boolean
  status?: 'online' | 'offline' | 'away' | 'busy'
}

export function Avatar({ 
  src, 
  name, 
  size = 'md', 
  className,
  showBorder = false,
  status
}: AvatarProps) {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const iconSizes = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32
  }

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const gradientColors = [
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-indigo-400 to-indigo-600',
    'from-red-400 to-red-600',
    'from-yellow-400 to-yellow-600',
    'from-teal-400 to-teal-600'
  ]

  // Generate consistent color based on name
  const getGradient = (name: string) => {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return gradientColors[Math.abs(hash) % gradientColors.length]
  }

  return (
    <div className={cn('relative inline-block', className)}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={cn(
          'relative flex items-center justify-center rounded-full overflow-hidden transition-transform duration-200',
          sizes[size],
          showBorder && 'ring-2 ring-white shadow-sm'
        )}
        style={{
          backgroundColor: src ? 'transparent' : undefined,
          background: src ? undefined : `linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600))`
        }}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide image on error and show initials instead
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            {name ? (
              <span 
                className={cn(
                  'font-semibold text-white select-none',
                  size === 'xs' && 'text-xs',
                  size === 'sm' && 'text-xs',
                  size === 'md' && 'text-sm',
                  size === 'lg' && 'text-base',
                  size === 'xl' && 'text-xl'
                )}
              >
                {getInitials(name)}
              </span>
            ) : (
              <User 
                size={iconSizes[size]} 
                className="text-white/80" 
              />
            )}
          </div>
        )}
      </motion.div>

      {/* Status indicator */}
      {status && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            statusColors[status],
            size === 'xs' && 'w-2 h-2',
            size === 'sm' && 'w-2.5 h-2.5',
            size === 'md' && 'w-3 h-3',
            size === 'lg' && 'w-3.5 h-3.5',
            size === 'xl' && 'w-4 h-4'
          )}
        />
      )}
    </div>
  )
}