import React, { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'gradient'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  interactive?: boolean
  children?: React.ReactNode
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant = 'default',
    padding = 'md',
    interactive = false,
    children,
    ...props
  }, ref) => {
    const baseClasses = [
      'relative overflow-hidden transition-all duration-200 ease-out',
    ]

    const variants = {
      default: [
        'bg-white border border-gray-200 rounded-xl shadow-sm',
        'hover:shadow-md',
      ],
      elevated: [
        'bg-white rounded-2xl shadow-lg border border-gray-100',
        'hover:shadow-xl hover:-translate-y-1',
      ],
      outlined: [
        'bg-white border-2 border-primary-200 rounded-xl',
        'hover:border-primary-300 hover:shadow-sm',
      ],
      glass: [
        'bg-white/80 backdrop-blur-md border border-white/20 rounded-xl',
        'shadow-lg shadow-primary-500/10',
        'hover:bg-white/90 hover:shadow-xl hover:shadow-primary-500/15',
      ],
      gradient: [
        'bg-gradient-to-br from-primary-50 to-secondary-50',
        'border border-primary-200/50 rounded-xl shadow-sm',
        'hover:from-primary-100 hover:to-secondary-100',
        'hover:shadow-md hover:border-primary-300/50',
      ],
    }

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    }

    const interactiveClasses = interactive ? [
      'cursor-pointer transform-gpu',
      'hover:scale-[1.02] active:scale-[0.99]',
      'focus:outline-none focus:ring-4 focus:ring-primary-500/20',
    ] : []

    return (
      <motion.div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          paddings[padding],
          interactiveClasses,
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        whileHover={interactive ? { scale: 1.02 } : undefined}
        whileTap={interactive ? { scale: 0.99 } : undefined}
        {...props}
      >
        {/* Gradient overlay for interactive cards */}
        {interactive && variant === 'default' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
        
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

// Sub-components
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-6', className)}
      {...props}
    >
      {children}
    </div>
  )
)
CardHeader.displayName = 'CardHeader'

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode
}

const CardTitle = forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight text-gray-900',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
)
CardTitle.displayName = 'CardTitle'

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-gray-600 leading-relaxed', className)}
      {...props}
    >
      {children}
    </p>
  )
)
CardDescription.displayName = 'CardDescription'

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>
      {children}
    </div>
  )
)
CardContent.displayName = 'CardContent'

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-6', className)}
      {...props}
    >
      {children}
    </div>
  )
)
CardFooter.displayName = 'CardFooter'

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
}