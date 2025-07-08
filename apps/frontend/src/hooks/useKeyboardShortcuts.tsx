import React, { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

interface ShortcutConfig {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
  action: () => void
  description: string
  category?: string
}

const defaultShortcuts: ShortcutConfig[] = [
  {
    key: 'k',
    ctrlKey: true,
    action: () => {
      // Focus global search
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
      if (searchInput) {
        searchInput.focus()
        searchInput.select()
      }
    },
    description: 'Focus search',
    category: 'Navigation'
  },
  {
    key: 'n',
    ctrlKey: true,
    action: () => {
      // Open new item modal based on current page
      const path = window.location.pathname
      if (path.includes('/matters')) {
        // Trigger new matter modal
        const newButton = document.querySelector('[data-testid="new-matter-button"]') as HTMLButtonElement
        newButton?.click()
      } else if (path.includes('/contracts')) {
        const newButton = document.querySelector('[data-testid="new-contract-button"]') as HTMLButtonElement
        newButton?.click()
      }
    },
    description: 'Create new item',
    category: 'Actions'
  },
  {
    key: 'Escape',
    action: () => {
      // Close modals, clear focus
      const activeElement = document.activeElement as HTMLElement
      if (activeElement && activeElement.blur) {
        activeElement.blur()
      }
      
      // Close any open modals
      const modalCloseButtons = document.querySelectorAll('[data-testid="modal-close"]')
      modalCloseButtons.forEach(button => (button as HTMLButtonElement).click())
    },
    description: 'Close modal/Clear focus',
    category: 'Actions'
  }
]

export function useKeyboardShortcuts(customShortcuts: ShortcutConfig[] = []) {
  const navigate = useNavigate()
  
  const shortcuts = React.useMemo(() => [
    ...defaultShortcuts,
    {
      key: '1',
      ctrlKey: true,
      action: () => navigate('/dashboard'),
      description: 'Go to Dashboard',
      category: 'Navigation'
    },
    {
      key: '2',
      ctrlKey: true,
      action: () => navigate('/matters'),
      description: 'Go to Matters',
      category: 'Navigation'
    },
    {
      key: '3',
      ctrlKey: true,
      action: () => navigate('/contracts'),
      description: 'Go to Contracts',
      category: 'Navigation'
    },
    {
      key: '4',
      ctrlKey: true,
      action: () => navigate('/clients'),
      description: 'Go to Clients',
      category: 'Navigation'
    },
    {
      key: '5',
      ctrlKey: true,
      action: () => navigate('/ai'),
      description: 'Go to AI Assistant',
      category: 'Navigation'
    },
    {
      key: '?',
      shiftKey: true,
      action: () => {
        // Show shortcuts modal
        const event = new CustomEvent('show-shortcuts-modal')
        window.dispatchEvent(event)
      },
      description: 'Show keyboard shortcuts',
      category: 'Help'
    },
    ...customShortcuts
  ], [navigate, customShortcuts])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      // Allow Escape to work in inputs
      if (event.key === 'Escape') {
        target.blur()
      }
      return
    }

    const matchingShortcut = shortcuts.find(shortcut => {
      return (
        shortcut.key.toLowerCase() === event.key.toLowerCase() &&
        !!shortcut.ctrlKey === event.ctrlKey &&
        !!shortcut.altKey === event.altKey &&
        !!shortcut.shiftKey === event.shiftKey &&
        !!shortcut.metaKey === event.metaKey
      )
    })

    if (matchingShortcut) {
      event.preventDefault()
      matchingShortcut.action()
    }
  }, [shortcuts])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return { shortcuts }
}

export function ShortcutsModal() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { shortcuts } = useKeyboardShortcuts()

  React.useEffect(() => {
    const handleShowModal = () => setIsOpen(true)
    window.addEventListener('show-shortcuts-modal', handleShowModal)
    return () => window.removeEventListener('show-shortcuts-modal', handleShowModal)
  }, [])

  if (!isOpen) return null

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || 'Other'
    if (!acc[category]) acc[category] = []
    acc[category].push(shortcut)
    return acc
  }, {} as Record<string, ShortcutConfig[]>)

  const formatShortcut = (shortcut: ShortcutConfig) => {
    const parts = []
    if (shortcut.ctrlKey) parts.push('Ctrl')
    if (shortcut.altKey) parts.push('Alt')
    if (shortcut.shiftKey) parts.push('Shift')
    if (shortcut.metaKey) parts.push('Cmd')
    parts.push(shortcut.key === ' ' ? 'Space' : shortcut.key.toUpperCase())
    return parts.join(' + ')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Keyboard Shortcuts</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
              data-testid="modal-close"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-6">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">
                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <span className="text-gray-700">{shortcut.description}</span>
                      <kbd className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono">
                        {formatShortcut(shortcut)}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t text-sm text-gray-500">
            <p>Press <kbd className="px-2 py-1 bg-gray-100 rounded">Shift + ?</kbd> to show this dialog anytime</p>
          </div>
        </div>
      </div>
    </div>
  )
}