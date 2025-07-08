import React from 'react'
import { motion } from 'framer-motion'
import { Loader2, Brain, Scale, FileText, Users, BarChart3 } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'dots' | 'pulse' | 'legal' | 'ai'
  color?: 'primary' | 'secondary' | 'white' | 'gray'
  text?: string
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default',
  color = 'primary',
  text,
  className 
}: LoadingSpinnerProps) {
  const sizes = {
    xs: 12,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48
  }

  const containerSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4', 
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colors = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    white: 'text-white',
    gray: 'text-gray-500'
  }

  const borderColors = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500', 
    white: 'border-white',
    gray: 'border-gray-500'
  }

  if (variant === 'default') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <motion.div
          className={cn(
            containerSizes[size],
            `border-2 rounded-full ${borderColors[color]} border-t-transparent`,
            colors[color]
          )}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn('text-sm font-medium', colors[color])}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn(
                'rounded-full',
                size === 'xs' ? 'w-1 h-1' :
                size === 'sm' ? 'w-1.5 h-1.5' :
                size === 'md' ? 'w-2 h-2' :
                size === 'lg' ? 'w-3 h-3' : 'w-4 h-4',
                color === 'primary' ? 'bg-primary-500' :
                color === 'secondary' ? 'bg-secondary-500' :
                color === 'white' ? 'bg-white' : 'bg-gray-500'
              )}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn('text-sm font-medium', colors[color])}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <motion.div
          className={cn(
            containerSizes[size],
            'rounded-full',
            color === 'primary' ? 'bg-primary-500' :
            color === 'secondary' ? 'bg-secondary-500' :
            color === 'white' ? 'bg-white' : 'bg-gray-500'
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn('text-sm font-medium', colors[color])}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  if (variant === 'legal') {
    const legalIcons = [Scale, FileText, Users, BarChart3]
    const IconComponent = legalIcons[Math.floor(Math.random() * legalIcons.length)]
    
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <motion.div
          className={cn(
            'relative',
            containerSizes[size]
          )}
        >
          {/* Spinning ring */}
          <motion.div
            className={cn(
              'absolute inset-0 border-2 rounded-full border-t-transparent',
              borderColors[color]
            )}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          {/* Center icon */}
          <div className={cn(
            'absolute inset-0 flex items-center justify-center',
            colors[color]
          )}>
            <IconComponent size={sizes[size] * 0.6} />
          </div>
        </motion.div>
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn('text-sm font-medium', colors[color])}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  if (variant === 'ai') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <motion.div
          className={cn(
            'relative',
            containerSizes[size]
          )}
        >
          {/* Spinning ring */}
          <motion.div
            className={cn(
              'absolute inset-0 border-2 rounded-full border-t-transparent',
              borderColors[color]
            )}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          {/* Pulsing inner ring */}
          <motion.div
            className={cn(
              'absolute inset-1 border rounded-full',
              borderColors[color]
            )}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          {/* Center AI icon */}
          <div className={cn(
            'absolute inset-0 flex items-center justify-center',
            colors[color]
          )}>
            <Brain size={sizes[size] * 0.5} />
          </div>
        </motion.div>
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn('text-sm font-medium', colors[color])}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  // Fallback to default
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader2 className={cn(containerSizes[size], colors[color], 'animate-spin')} />
    </div>
  )
}

// Full-screen loading overlay component
export interface LoadingOverlayProps {
  isVisible: boolean
  text?: string
  variant?: LoadingSpinnerProps['variant']
  className?: string
}

export function LoadingOverlay({ 
  isVisible, 
  text = 'Loading...', 
  variant = 'ai',
  className 
}: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'fixed inset-0 bg-white/80 backdrop-blur-sm z-50',
        'flex items-center justify-center',
        className
      )}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200"
      >
        <LoadingSpinner
          size="lg"
          variant={variant}
          text={text}
          color="primary"
        />
      </motion.div>
    </motion.div>
  )
}

// Skeleton loading components
export interface SkeletonProps {
  className?: string
  animate?: boolean
}

export function Skeleton({ className, animate = true }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gray-200 rounded',
        animate && 'animate-pulse',
        className
      )}
    />
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-6 bg-white rounded-xl border border-gray-200', className)}>
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-20 w-full" />
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number, cols?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}