import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Scale, Eye, EyeOff, AI, Analytics, Documents, Clients, Clock, Shield } from '../components/icons'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormData>({
    defaultValues: {
      email: 'demo@counselflow.com',
      password: 'demo123',
      rememberMe: false
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)
    try {
      await login(data.email, data.password)
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const quickLogin = async (email: string, password: string) => {
    setValue('email', email)
    setValue('password', password)
    setError(null)
    setIsLoading(true)
    try {
      await login(email, password)
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))' }}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 30% 40%, var(--color-primary-300) 0%, transparent 50%), radial-gradient(circle at 80% 80%, var(--color-primary-400) 0%, transparent 50%)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/30" />
        
        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full blur-xl animate-pulse" style={{ backgroundColor: 'var(--color-primary-300)', opacity: 0.2 }} />
        <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full blur-xl animate-pulse" style={{ backgroundColor: 'var(--color-primary-400)', opacity: 0.2, animationDelay: '1s' }} />
        
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-lg"
          >
            {/* Logo with glow effect */}
            <motion.div 
              className="relative mb-8"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-150" />
              <Scale className="h-24 w-24 mx-auto relative z-10 drop-shadow-lg" />
            </motion.div>
            
            <motion.h1 
              className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              CounselFlow Ultimate
            </motion.h1>
            
            <motion.p 
              className="text-xl text-white/90 mb-12 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Enterprise Legal Technology Platform
            </motion.p>
            
            {/* Feature grid */}
            <motion.div 
              className="grid grid-cols-2 gap-6 text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <div className="flex items-center space-x-3">
                <AI className="h-6 w-6 text-white/80" />
                <span className="text-white/90">AI Legal Assistant</span>
              </div>
              <div className="flex items-center space-x-3">
                <Documents className="h-6 w-6 text-white/80" />
                <span className="text-white/90">Contract Management</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clients className="h-6 w-6 text-white/80" />
                <span className="text-white/90">Matter Tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <Analytics className="h-6 w-6 text-white/80" />
                <span className="text-white/90">Advanced Analytics</span>
              </div>
              <div className="flex items-center space-x-3">
                <Scale className="h-6 w-6 text-white/80" />
                <span className="text-white/90">Risk Assessment</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-white/80" />
                <span className="text-white/90">Time Tracking</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-md w-full"
        >
          <div className="backdrop-blur-sm rounded-3xl shadow-2xl border p-8 relative overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 rounded-3xl opacity-30" style={{ background: 'linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100))' }} />
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="lg:hidden mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Scale className="h-16 w-16 mx-auto mb-4 drop-shadow-lg" style={{ color: 'var(--color-primary-600)' }} />
                  </motion.div>
                </div>
                
                <motion.h2 
                  className="text-4xl font-bold mb-3"
                  style={{ color: 'var(--color-text-primary)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  Welcome Back
                </motion.h2>
                
                <motion.p 
                  className="font-medium"
                  style={{ color: 'var(--color-text-secondary)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  Access your legal command center
                </motion.p>
              </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </motion.div>
            )}

            <motion.form 
              onSubmit={handleSubmit(onSubmit)} 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                <label htmlFor="email" className="block text-sm font-semibold text-counsel-700 mb-2">
                  Email Address
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="w-full px-4 py-3 border-2 border-counsel-200 rounded-xl focus:border-counsel-500 focus:ring-0 outline-none transition-colors duration-200 bg-white/70 backdrop-blur-sm text-counsel-800 placeholder-counsel-400"
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <motion.p 
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                <label htmlFor="password" className="block text-sm font-semibold text-counsel-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 pr-12 border-2 border-counsel-200 rounded-xl focus:border-counsel-500 focus:ring-0 outline-none transition-colors duration-200 bg-white/70 backdrop-blur-sm text-counsel-800 placeholder-counsel-400"
                    placeholder="Enter your password"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-counsel-400 hover:text-counsel-600 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </motion.button>
                </div>
                {errors.password && (
                  <motion.p 
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div 
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <label className="flex items-center cursor-pointer">
                  <input
                    {...register('rememberMe')}
                    type="checkbox"
                    className="h-4 w-4 text-counsel-600 focus:ring-counsel-500 border-counsel-300 rounded"
                  />
                  <span className="ml-2 text-sm text-counsel-600 font-medium">Remember me</span>
                </label>
                <a href="#" className="text-sm text-counsel-600 hover:text-counsel-500 font-medium transition-colors duration-200">
                  Forgot password?
                </a>
              </motion.div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-counsel-600 to-legal-600 hover:from-counsel-700 hover:to-legal-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-counsel-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.5 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In to CounselFlow'
                )}
              </motion.button>
            </motion.form>

            {/* Demo Credentials */}
            <motion.div 
              className="mt-8 p-6 bg-gradient-to-br from-counsel-50 to-legal-100 rounded-2xl border border-counsel-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <h4 className="text-sm font-bold text-counsel-700 mb-3 text-center flex items-center justify-center">
                <Shield className="h-4 w-4 mr-2" />
                Demo Access Credentials
              </h4>
              <div className="text-sm text-counsel-600 space-y-2 bg-white/60 p-3 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span className="font-mono bg-counsel-100 px-2 py-1 rounded text-xs">demo@counselflow.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Password:</span>
                  <span className="font-mono bg-counsel-100 px-2 py-1 rounded text-xs">demo123</span>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <p className="text-xs text-counsel-500 text-center font-medium mb-3">
                  🚀 Quick Login Options
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => quickLogin('admin@counselflow.com', 'admin123')}
                    disabled={isLoading}
                    className="px-3 py-2 bg-counsel-100 hover:bg-counsel-200 text-counsel-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => quickLogin('lawyer@counselflow.com', 'lawyer123')}
                    disabled={isLoading}
                    className="px-3 py-2 bg-counsel-100 hover:bg-counsel-200 text-counsel-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    Lawyer
                  </button>
                  <button
                    type="button"
                    onClick={() => quickLogin('paralegal@counselflow.com', 'paralegal123')}
                    disabled={isLoading}
                    className="px-3 py-2 bg-counsel-100 hover:bg-counsel-200 text-counsel-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    Paralegal
                  </button>
                  <button
                    type="button"
                    onClick={() => quickLogin('demo@counselflow.com', 'demo123')}
                    disabled={isLoading}
                    className="px-3 py-2 bg-legal-100 hover:bg-legal-200 text-legal-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    Demo
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <p className="text-sm text-counsel-600">
                Need enterprise access?{' '}
                <motion.a 
                  href="#" 
                  className="text-counsel-700 hover:text-counsel-800 font-semibold transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                >
                  Contact Sales
                </motion.a>
              </p>
            </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}