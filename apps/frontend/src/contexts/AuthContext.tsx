import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  title?: string
  firm?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    console.log('🔍 Checking existing token:', token ? 'exists' : 'none')
    
    if (token) {
      // If it's a mock token, restore mock user immediately
      if (token.startsWith('mock_token_')) {
        console.log('🎭 Restoring mock user from token')
        const mockUser = {
          id: '1',
          email: 'demo@counselflow.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'partner',
          title: 'Senior Partner',
          firm: 'CounselFlow Law Firm'
        }
        setUser(mockUser)
        setIsLoading(false)
        return
      }
      
      // Try to validate real API token
      authApi.validateToken()
        .then(response => {
          console.log('✅ Token validation successful')
          setUser(response.data.user)
        })
        .catch(() => {
          console.log('❌ Token validation failed, removing token')
          localStorage.removeItem('auth_token')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    console.log('🔑 Login attempt:', { email, password })
    
    // Force mock authentication for demo (comment out to try real API)
    const FORCE_MOCK = true
    
    if (!FORCE_MOCK) {
      try {
        console.log('🌐 Attempting API login with:', { email, password })
        const response = await authApi.login({ email, password })
        const { access_token, user } = response.data
        
        localStorage.setItem('auth_token', access_token)
        setUser(user)
        toast.success(`Welcome back, ${user.firstName}!`)
        return
      } catch (error: any) {
        console.warn('❌ API login failed:', error.message)
      }
    }
    
    // Mock authentication - always works for demo purposes
    console.log('🎭 Using mock authentication')
    const mockUser = {
      id: '1',
      email: email,
      firstName: 'John',
      lastName: 'Doe',
      role: 'partner',
      title: 'Senior Partner',
      firm: 'CounselFlow Law Firm'
    }
    
    localStorage.setItem('auth_token', 'mock_token_' + Date.now())
    setUser(mockUser)
    toast.success(`Welcome back, ${mockUser.firstName}! (Demo Mode)`)
    console.log('✅ Mock login successful')
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const register = async (data: any) => {
    try {
      const response = await authApi.register(data)
      const { access_token, user } = response.data
      
      localStorage.setItem('auth_token', access_token)
      setUser(user)
      toast.success(`Welcome to CounselFlow, ${user.firstName}!`)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}