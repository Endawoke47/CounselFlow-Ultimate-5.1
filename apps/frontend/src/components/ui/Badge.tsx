import React from 'react'
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  TrendingDown,
  FileText
} from '../icons'
import { cn } from '../../utils/cn'

interface StatusBadgeProps {
  status: 'active' | 'pending' | 'completed' | 'overdue' | 'draft' | 'review' | 'executed'
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle,
          text: 'Active'
        }
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock,
          text: 'Pending'
        }
      case 'completed':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: CheckCircle,
          text: 'Completed'
        }
      case 'overdue':
        return {
          color: 'bg-red-100 text-red-800',
          icon: AlertCircle,
          text: 'Overdue'
        }
      case 'draft':
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: FileText,
          text: 'Draft'
        }
      case 'review':
        return {
          color: 'bg-orange-100 text-orange-800',
          icon: Clock,
          text: 'Review'
        }
      case 'executed':
        return {
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle,
          text: 'Executed'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: AlertCircle,
          text: status
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.text}
    </span>
  )
}

interface PriorityBadgeProps {
  priority: 'high' | 'medium' | 'low'
  className?: string
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const getPriorityConfig = () => {
    switch (priority) {
      case 'high':
        return {
          color: 'bg-red-100 text-red-800',
          icon: TrendingUp,
          text: 'High Priority'
        }
      case 'medium':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock,
          text: 'Medium Priority'
        }
      case 'low':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: TrendingDown,
          text: 'Low Priority'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: AlertCircle,
          text: priority
        }
    }
  }

  const config = getPriorityConfig()
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.text}
    </span>
  )
}

// Generic Badge Component
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Badge({ 
  className, 
  variant = 'default', 
  size = 'md',
  children, 
  ...props 
}: BadgeProps) {
  const variants = {
    default: 'bg-primary-100 text-primary-800 border-primary-200',
    secondary: 'bg-gray-100 text-gray-800 border-gray-200',
    outline: 'border-2 border-gray-300 bg-transparent text-gray-600',
    destructive: 'bg-red-100 text-red-800 border-red-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
