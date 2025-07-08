import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface Tab {
  id: string
  label: string
  icon?: any
  badge?: string | number
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
  variant?: 'default' | 'pills' | 'underline'
  size?: 'sm' | 'md' | 'lg'
}

export function Tabs({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = '', 
  variant = 'default',
  size = 'md'
}: TabsProps) {
  const getTabClasses = (tab: Tab, isActive: boolean) => {
    const baseClasses = 'relative flex items-center gap-2 font-medium transition-all duration-200'
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-sm',
      lg: 'px-6 py-4 text-base'
    }

    const variantClasses = {
      default: isActive
        ? 'bg-gradient-to-r from-cyan-50 to-teal-50 text-cyan-700 border border-cyan-200 rounded-lg shadow-sm'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg',
      pills: isActive
        ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full shadow-lg'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full',
      underline: isActive
        ? 'text-cyan-600 border-b-2 border-cyan-500'
        : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
    }

    const disabledClasses = tab.disabled 
      ? 'opacity-50 cursor-not-allowed pointer-events-none' 
      : 'cursor-pointer'

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses}`
  }

  return (
    <div className={`flex ${variant === 'underline' ? 'border-b border-gray-200' : 'space-x-1'} ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const Icon = tab.icon

        return (
          <motion.button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            className={getTabClasses(tab, isActive)}
            whileHover={!tab.disabled ? { scale: 1.02 } : undefined}
            whileTap={!tab.disabled ? { scale: 0.98 } : undefined}
            layout
          >
            {Icon && (
              <Icon 
                size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} 
                className={isActive ? 'text-current' : 'text-gray-500'} 
              />
            )}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                isActive
                  ? variant === 'pills'
                    ? 'bg-white/20 text-white'
                    : 'bg-cyan-100 text-cyan-700'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.badge}
              </span>
            )}
            {isActive && variant === 'underline' && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-teal-500"
                layoutId="activeTab"
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

interface TabPanelProps {
  activeTab: string
  tabId: string
  children: React.ReactNode
  className?: string
}

export function TabPanel({ activeTab, tabId, children, className = '' }: TabPanelProps) {
  if (activeTab !== tabId) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}