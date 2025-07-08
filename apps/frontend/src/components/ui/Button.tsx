import React, { forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  loading?: boolean
  fullWidth?: boolean
  children?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    fullWidth = false,
    disabled,
    children,
    ...props
  }, ref) => {
    const baseClasses = [
      // Base styles
      'inline-flex items-center justify-center gap-2',
      'font-semibold text-center transition-all duration-200 ease-out',
      'focus:outline-none focus:ring-4 focus:ring-offset-0',
      'disabled:pointer-events-none disabled:opacity-50',
      'select-none relative overflow-hidden',
      // Interactive states
      'active:scale-[0.98] transform-gpu',
    ]

    const variants = {
      primary: [
        'bg-gradient-to-r from-primary-600 to-primary-700',
        'text-white shadow-lg shadow-primary-500/25',
        'hover:from-primary-700 hover:to-primary-800',
        'hover:shadow-xl hover:shadow-primary-500/30',
        'focus:ring-primary-500/50',
        'active:from-primary-800 active:to-primary-900',
      ],
      secondary: [
        'bg-gradient-to-r from-secondary-500 to-secondary-600',
        'text-white shadow-lg shadow-secondary-500/25',
        'hover:from-secondary-600 hover:to-secondary-700',
        'hover:shadow-xl hover:shadow-secondary-500/30',
        'focus:ring-secondary-500/50',
        'active:from-secondary-700 active:to-secondary-800',
      ],
      outline: [
        'border-2 border-primary-500 bg-white text-primary-700',
        'shadow-sm hover:bg-primary-50',
        'hover:border-primary-600 hover:text-primary-800',
        'hover:shadow-md focus:ring-primary-500/50',
        'active:bg-primary-100',
      ],
      ghost: [
        'text-gray-700 hover:text-primary-700',
        'hover:bg-primary-50/50 active:bg-primary-100/50',
        'focus:ring-primary-500/30',
      ],
      danger: [
        'bg-gradient-to-r from-red-500 to-red-600',
        'text-white shadow-lg shadow-red-500/25',
        'hover:from-red-600 hover:to-red-700',
        'hover:shadow-xl hover:shadow-red-500/30',
        'focus:ring-red-500/50',
        'active:from-red-700 active:to-red-800',
      ],
      success: [
        'bg-gradient-to-r from-green-500 to-green-600',
        'text-white shadow-lg shadow-green-500/25',
        'hover:from-green-600 hover:to-green-700',
        'hover:shadow-xl hover:shadow-green-500/30',
        'focus:ring-green-500/50',
        'active:from-green-700 active:to-green-800',
      ],
      warning: [
        'bg-gradient-to-r from-orange-500 to-orange-600',
        'text-white shadow-lg shadow-orange-500/25',
        'hover:from-orange-600 hover:to-orange-700',
        'hover:shadow-xl hover:shadow-orange-500/30',
        'focus:ring-orange-500/50',
        'active:from-orange-700 active:to-orange-800',
      ],
    }

    const sizes = {
      xs: 'px-2.5 py-1.5 text-xs rounded-md gap-1',
      sm: 'px-3 py-2 text-sm rounded-lg gap-1.5',
      md: 'px-4 py-2.5 text-sm rounded-lg gap-2',
      lg: 'px-6 py-3 text-base rounded-xl gap-2',
      xl: 'px-8 py-4 text-lg rounded-xl gap-3',
    }

    const iconSizes = {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
    }

    const LoadingSpinner = () => (
      <motion.div
        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    )

    const isDisabled = disabled || loading

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        {...props}
      >
        {/* Shimmer effect for primary and secondary buttons */}
        {(variant === 'primary' || variant === 'secondary') && !isDisabled && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{
              x: '100%',
              transition: { duration: 0.6, ease: 'easeInOut' }
            }}
          />
        )}

        {loading && <LoadingSpinner />}
        
        {Icon && iconPosition === 'left' && !loading && (
          <Icon size={iconSizes[size]} className="flex-shrink-0" />
        )}
        
        {children && (
          <span className="relative z-10 truncate">
            {children}
          </span>
        )}
        
        {Icon && iconPosition === 'right' && !loading && (
          <Icon size={iconSizes[size]} className="flex-shrink-0" />
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button }