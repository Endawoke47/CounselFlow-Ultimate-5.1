import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'
type ActualTheme = 'light' | 'dark'

interface ThemeColors {
  primary: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
  }
  secondary: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
  }
}

interface ThemeContextType {
  theme: Theme
  actualTheme: ActualTheme
  setTheme: (theme: Theme) => void
  colors: ThemeColors
  isDark: boolean
  toggleTheme: () => void
}

const defaultColors: ThemeColors = {
  primary: {
    50: '#f0fdff',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
    950: '#042f2e'
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617'
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('counselflow-theme')
    return (stored as Theme) || 'system'
  })

  const [actualTheme, setActualTheme] = useState<ActualTheme>('light')

  // Determine actual theme based on user preference and system preference
  useEffect(() => {
    const determineActualTheme = (): ActualTheme => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      return theme as ActualTheme
    }

    const updateTheme = () => {
      const newActualTheme = determineActualTheme()
      setActualTheme(newActualTheme)
      
      // Update document class
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(newActualTheme)
      
      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]')
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          'content', 
          newActualTheme === 'dark' ? '#0f172a' : '#ffffff'
        )
      }
    }

    updateTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        updateTheme()
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [theme])

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('counselflow-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    const themeOrder: Theme[] = ['light', 'dark', 'system']
    const currentIndex = themeOrder.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themeOrder.length
    setTheme(themeOrder[nextIndex])
  }

  const value: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    colors: defaultColors,
    isDark: actualTheme === 'dark',
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Hook for theme-aware styles
export function useThemeStyles() {
  const { isDark, actualTheme } = useTheme()

  const getThemeClass = (lightClass: string, darkClass: string) => {
    return isDark ? darkClass : lightClass
  }

  const getThemeValue = <T,>(lightValue: T, darkValue: T): T => {
    return isDark ? darkValue : lightValue
  }

  const cardStyles = getThemeClass(
    'bg-white border-gray-200 text-gray-900',
    'bg-gray-800 border-gray-700 text-gray-100'
  )

  const inputStyles = getThemeClass(
    'bg-white border-gray-200 text-gray-900 placeholder-gray-500',
    'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
  )

  const buttonStyles = {
    primary: getThemeClass(
      'bg-primary-600 hover:bg-primary-700 text-white',
      'bg-primary-500 hover:bg-primary-600 text-white'
    ),
    secondary: getThemeClass(
      'bg-gray-100 hover:bg-gray-200 text-gray-900',
      'bg-gray-700 hover:bg-gray-600 text-gray-100'
    ),
    outline: getThemeClass(
      'border-gray-300 text-gray-700 hover:bg-gray-50',
      'border-gray-600 text-gray-300 hover:bg-gray-700'
    )
  }

  return {
    actualTheme,
    isDark,
    getThemeClass,
    getThemeValue,
    cardStyles,
    inputStyles,
    buttonStyles
  }
}

// Component for theme toggle button
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme, isDark } = useTheme()
  
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️'
      case 'dark':
        return '🌙'
      case 'system':
        return '🖥️'
      default:
        return '☀️'
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light theme'
      case 'dark':
        return 'Dark theme'
      case 'system':
        return 'System theme'
      default:
        return 'Light theme'
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        inline-flex items-center justify-center
        w-10 h-10 rounded-lg
        transition-colors duration-200
        ${isDark 
          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }
        ${className}
      `}
      title={getThemeLabel()}
      aria-label={getThemeLabel()}
    >
      <span className="text-lg">{getThemeIcon()}</span>
    </button>
  )
}