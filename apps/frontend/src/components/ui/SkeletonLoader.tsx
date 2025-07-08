import React from 'react'
import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  variant?: 'rectangular' | 'circular' | 'text'
  lines?: number
}

export function Skeleton({ 
  className = '', 
  width = '100%', 
  height = '1rem',
  variant = 'rectangular',
  lines = 1
}: SkeletonProps) {
  const baseClasses = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
  
  const variantClasses = {
    rectangular: "rounded-md",
    circular: "rounded-full",
    text: "rounded-sm"
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={`${baseClasses} ${variantClasses.text} ${className}`}
            style={{ 
              width: index === lines - 1 ? '75%' : width,
              height 
            }}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              delay: index * 0.1 
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  )
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={`header-${index}`} height="2rem" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={`row-${rowIndex}`} 
          className="grid gap-4" 
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={`cell-${rowIndex}-${colIndex}`} 
              height="1.5rem" 
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton({ showHeader = true, showFooter = false }: { 
  showHeader?: boolean; 
  showFooter?: boolean 
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      {showHeader && (
        <div className="space-y-2">
          <Skeleton height="1.5rem" width="60%" />
          <Skeleton height="1rem" width="40%" />
        </div>
      )}
      
      <div className="space-y-3">
        <Skeleton variant="text" lines={3} />
      </div>
      
      {showFooter && (
        <div className="flex justify-between items-center pt-4">
          <Skeleton height="2rem" width="5rem" />
          <Skeleton height="2rem" width="5rem" />
        </div>
      )}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton height="1rem" width="4rem" />
                <Skeleton height="2rem" width="3rem" />
              </div>
              <Skeleton variant="circular" width="3rem" height="3rem" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton showHeader showFooter />
        <CardSkeleton showHeader showFooter />
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          <Skeleton height="1.5rem" width="40%" />
          <TableSkeleton />
        </div>
      </div>
    </div>
  )
}