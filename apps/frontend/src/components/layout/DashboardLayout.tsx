import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Menu, 
  X, 
  Home, 
  Cases, 
  Contracts, 
  Clients, 
  Documents,
  AI,
  Settings,
  User,
  Analytics,
  Database,
  Plus,
  ChevronDown,
  Scale,
  LogOut,
  Building,
  CheckCircle,
  Shield,
  Users,
  AlertTriangle
} from '../icons'
import { useAuth } from '../../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { SimpleSignOut } from '../SimpleSignOut'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { SmartTopbar } from './SmartTopbar'
import { cn } from '../../utils/cn'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showSidebarUserMenu, setShowSidebarUserMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  console.log('DashboardLayout rendered, user:', user)

  // Close dropdowns when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element
    if (!target.closest('.sidebar-user-menu-container')) {
      setShowSidebarUserMenu(false)
    }
  }

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    
    // Core Legal Operations
    { name: 'Entity Management', href: '/entity-management', icon: Building },
    { name: 'Contracts', href: '/contracts', icon: Contracts },
    { name: 'Disputes', href: '/disputes', icon: Cases },
    { name: 'Matters', href: '/matters', icon: Cases },
    { name: 'Tasks', href: '/tasks', icon: CheckCircle },
    
    // Governance & Compliance
    { name: 'Policies', href: '/policies', icon: Shield },
    { name: 'Knowledge', href: '/knowledge', icon: Database },
    { name: 'Licensing & Regulatory', href: '/licensing', icon: Shield },
    
    // External Management
    { name: 'Outsourcing & Spend', href: '/outsourcing', icon: Users },
    { name: 'Risk Management', href: '/risks', icon: AlertTriangle },
    
    // Legacy/AI Features
    { name: 'AI Assistant', href: '/ai', icon: AI },
    { name: 'Documents', href: '/documents', icon: Documents },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]


  const handleLogout = async () => {
    console.log('Logout button clicked')
    try {
      await logout()
      console.log('Logout completed, navigating to login')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-professional">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-gradient-teal shadow-floating lg:hidden"
            >
              <div className="flex items-center justify-between px-gutter py-6 border-b border-white/20">
                <div className="flex items-center space-x-2">
                  <Scale className="h-8 w-8 text-white" />
                  <span className="text-xl font-bold text-white gradient-text-white">CounselFlow</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  icon={X}
                  className="text-white hover:bg-white/20"
                />
              </div>
              <nav className="px-4 py-4 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group',
                        isActive
                          ? 'bg-white/20 text-white shadow-soft backdrop-blur-sm'
                          : 'text-white/80 hover:bg-white/10 hover:text-white hover:scale-105'
                      )}
                    >
                      <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* WORKING Mobile Sidebar User Profile Section */}
              <div className="px-4 pb-4 mt-auto">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('🟢 MOBILE SIDEBAR USER MENU CLICKED!')
                      setShowSidebarUserMenu(!showSidebarUserMenu)
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-white hover:bg-white/10 transition-all duration-200 group"
                    style={{ zIndex: 1000 }}
                  >
                    <div className="h-10 w-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-white">
                        {user ? `${user.firstName} ${user.lastName}` : 'John Doe'}
                      </div>
                      <div className="text-xs text-white text-opacity-60">
                        {user?.title || 'Senior Partner'}
                      </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-white text-opacity-60 transition-transform ${
                      showSidebarUserMenu ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {showSidebarUserMenu && (
                    <div 
                      className="absolute bottom-full left-0 right-0 mb-2"
                      style={{ zIndex: 1001 }}
                    >
                      <Card variant="glass" className="py-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('🟢 MOBILE SIDEBAR LOGOUT CLICKED!')
                            alert('Mobile sidebar logout working!')
                            handleLogout()
                            setSidebarOpen(false)
                            setShowSidebarUserMenu(false)
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-danger hover:bg-danger/10 transition-colors rounded-lg"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar - Fixed with CounselFlow primary teal background */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-gradient-teal border-r border-primary-600 shadow-floating">
          <div className="flex items-center flex-shrink-0 px-gutter py-6">
            <Scale className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-bold text-white gradient-text-white">CounselFlow</span>
          </div>
          <div className="mt-4 flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-white/20 text-white shadow-soft backdrop-blur-sm'
                        : 'text-white/80 hover:bg-white/10 hover:text-white hover:scale-105'
                    )}
                  >
                    <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
            
            {/* WORKING Sidebar User Profile Section */}
            <div className="px-4 pb-4 mt-auto">
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('🟢 SIDEBAR USER MENU CLICKED!')
                    setShowSidebarUserMenu(!showSidebarUserMenu)
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-white hover:bg-white/10 transition-all duration-200 group"
                  style={{ zIndex: 1000 }}
                >
                  <div className="h-10 w-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">
                      {user ? `${user.firstName} ${user.lastName}` : 'John Doe'}
                    </div>
                    <div className="text-xs text-white text-opacity-60">
                      {user?.title || 'Senior Partner'}
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-white text-opacity-60 transition-transform ${
                    showSidebarUserMenu ? 'rotate-180' : ''
                  }`} />
                </button>

                {showSidebarUserMenu && (
                  <div 
                    className="absolute bottom-full left-0 right-0 mb-2"
                    style={{ zIndex: 1001 }}
                  >
                    <Card variant="glass" className="py-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log('🟢 SIDEBAR LOGOUT CLICKED!')
                          alert('Sidebar logout working!')
                          handleLogout()
                          setShowSidebarUserMenu(false)
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-danger hover:bg-danger/10 transition-colors rounded-lg"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:pl-72">
        <SmartTopbar onSidebarToggle={() => setSidebarOpen(true)} />

        {/* Main content with proper spacing and max width */}
        <main className="py-gutter">
          <div className="max-w-app mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}