import React, { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { TrendingUp, TrendingDown, AlertCircle } from '../icons'
import { cn } from '../../utils/cn'

interface AnimatedKPIProps {
  title: string
  value: number | string
  previousValue?: number
  format?: 'number' | 'currency' | 'percentage' | 'duration'
  icon?: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: number
  description?: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
  animationDelay?: number
  isLoading?: boolean
}

export function AnimatedKPI({
  title,
  value,
  previousValue,
  format = 'number',
  icon: Icon,
  trend,
  trendValue,
  description,
  variant = 'default',
  className,
  animationDelay = 0,
  isLoading = false
}: AnimatedKPIProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const controls = useAnimation()

  const formatValue = (val: number | string, type: string) => {
    if (typeof val === 'string') return val
    
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val)
      case 'percentage':
        return `${val.toFixed(1)}%`
      case 'duration':
        const hours = Math.floor(val)
        const minutes = Math.round((val - hours) * 60)
        return `${hours}h ${minutes}m`
      default:
        return new Intl.NumberFormat('en-US').format(val)
    }
  }

  const variants = {
    default: {
      background: 'var(--color-surface)',
      borderColor: 'var(--color-border)',
      iconColor: 'var(--color-primary-500)',
      titleColor: 'var(--color-text-secondary)',
      valueColor: 'var(--color-text-primary)'
    },
    success: {
      background: 'var(--color-success-50)',
      borderColor: 'var(--color-success-200)',
      iconColor: 'var(--color-success-600)',
      titleColor: 'var(--color-success-700)',
      valueColor: 'var(--color-success-800)'
    },
    warning: {
      background: 'var(--color-warning-50)',
      borderColor: 'var(--color-warning-200)',
      iconColor: 'var(--color-warning-600)',
      titleColor: 'var(--color-warning-700)',
      valueColor: 'var(--color-warning-800)'
    },
    danger: {
      background: 'var(--color-error-50)',
      borderColor: 'var(--color-error-200)',
      iconColor: 'var(--color-error-600)',
      titleColor: 'var(--color-error-700)',
      valueColor: 'var(--color-error-800)'
    },
    info: {
      background: 'var(--color-info-50)',
      borderColor: 'var(--color-info-200)',
      iconColor: 'var(--color-info-600)',
      titleColor: 'var(--color-info-700)',
      valueColor: 'var(--color-info-800)'
    }
  }

  const currentVariant = variants[variant]

  // Animate number counting
  useEffect(() => {
    if (typeof value === 'number' && !isLoading) {
      setIsAnimating(true)
      const startValue = previousValue || 0
      const endValue = value
      const duration = 2000 // 2 seconds
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        
        const currentValue = startValue + (endValue - startValue) * easeOutQuart
        setDisplayValue(currentValue)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }

      const timeoutId = setTimeout(() => {
        requestAnimationFrame(animate)
      }, animationDelay)

      return () => clearTimeout(timeoutId)
    }
  }, [value, previousValue, animationDelay, isLoading])

  // Card animation
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: animationDelay / 1000,
        ease: 'easeOut'
      }
    })
  }, [controls, animationDelay])

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-green-600" />
      case 'down':
        return <TrendingDown size={16} className="text-red-600" />
      default:
        return null
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={controls}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      className={cn(
        'relative p-6 rounded-xl border transition-all duration-300 cursor-pointer group overflow-hidden',
        className
      )}
      style={{
        backgroundColor: currentVariant.background,
        borderColor: currentVariant.borderColor
      }}
    >
      {/* Background gradient overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${currentVariant.iconColor}10, ${currentVariant.iconColor}05)`
        }}
      />

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600">Loading...</span>
          </div>
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {Icon && (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${currentVariant.iconColor}20` }}
              >
                <Icon 
                  size={20} 
                  style={{ color: currentVariant.iconColor }}
                />
              </motion.div>
            )}
            <h3 
              className="font-semibold text-sm"
              style={{ color: currentVariant.titleColor }}
            >
              {title}
            </h3>
          </div>
          
          {trend && trendValue && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (animationDelay + 500) / 1000 }}
              className={cn('flex items-center space-x-1 text-xs font-medium', getTrendColor())}
            >
              {getTrendIcon()}
              <span>{Math.abs(trendValue).toFixed(1)}%</span>
            </motion.div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          <motion.div
            className="text-3xl font-bold tabular-nums"
            style={{ color: currentVariant.valueColor }}
            animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {typeof value === 'number' ? formatValue(displayValue, format) : value}
          </motion.div>
          
          {previousValue && typeof value === 'number' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: (animationDelay + 1000) / 1000 }}
              className="text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Previous: {formatValue(previousValue, format)}
            </motion.div>
          )}
        </div>

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: (animationDelay + 1500) / 1000 }}
            className="text-xs"
            style={{ color: currentVariant.titleColor }}
          >
            {description}
          </motion.p>
        )}

        {/* Pulse animation for active values */}
        {isAnimating && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 opacity-0"
            style={{ borderColor: currentVariant.iconColor }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </div>
    </motion.div>
  )
}

// Skeleton loader for KPI cards
export function AnimatedKPISkeleton({ className }: { className?: string }) {
  return (
    <div 
      className={cn('p-6 rounded-xl border animate-pulse', className)}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gray-200 rounded-lg" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-12" />
      </div>
      <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-20" />
    </div>
  )
}