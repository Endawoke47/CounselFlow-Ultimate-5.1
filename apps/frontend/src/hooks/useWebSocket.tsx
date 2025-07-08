import React, { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import toast from 'react-hot-toast'
import { logger } from '../services/logger'

interface WebSocketContextType {
  socket: Socket | null
  isConnected: boolean
  subscribe: (event: string, callback: (data: any) => void) => () => void
  emit: (event: string, data?: any) => void
  connectionAttempts: number
}

const WebSocketContext = React.createContext<WebSocketContextType | null>(null)

interface WebSocketProviderProps {
  children: React.ReactNode
  url?: string
  options?: any
}

export function WebSocketProvider({ 
  children, 
  url = 'http://localhost:3001',
  options = {} 
}: WebSocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionAttempts, setConnectionAttempts] = useState(0)
  const socketRef = useRef<Socket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const subscribersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map())

  const connect = useCallback(() => {
    try {
      // Get auth token for authentication
      const token = localStorage.getItem('auth_token')
      
      socketRef.current = io(url, {
        ...options,
        auth: {
          token
        },
        transports: ['websocket', 'polling'],
        timeout: 5000,
        retries: 3
      })

      const socket = socketRef.current

      socket.on('connect', () => {
        logger.info('WebSocket connected')
        setIsConnected(true)
        setConnectionAttempts(0)
        
        toast.success('Real-time updates enabled', {
          duration: 2000,
          position: 'bottom-right'
        })
      })

      socket.on('disconnect', (reason) => {
        logger.warn('WebSocket disconnected', { reason })
        setIsConnected(false)
        
        if (reason === 'io server disconnect') {
          // Server disconnected, try to reconnect
          setTimeout(() => connect(), 1000)
        }
      })

      socket.on('connect_error', (error) => {
        logger.error('WebSocket connection error', { error })
        setIsConnected(false)
        setConnectionAttempts(prev => prev + 1)
        
        // Exponential backoff for reconnection
        const delay = Math.min(1000 * Math.pow(2, connectionAttempts), 30000)
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }
        
        reconnectTimeoutRef.current = setTimeout(() => {
          if (connectionAttempts < 5) {
            connect()
          } else {
            toast.error('Unable to establish real-time connection', {
              duration: 5000
            })
          }
        }, delay)
      })

      // Handle real-time events
      socket.on('notification', (data) => {
        toast(data.message, {
          icon: data.type === 'success' ? '✅' : data.type === 'error' ? '❌' : '📢',
          duration: 4000
        })
      })

      socket.on('case_update', (data) => {
        logger.info('Case updated', data)
        // Trigger subscribers
        const subscribers = subscribersRef.current.get('case_update')
        if (subscribers) {
          subscribers.forEach(callback => callback(data))
        }
      })

      socket.on('matter_update', (data) => {
        logger.info('Matter updated', data)
        const subscribers = subscribersRef.current.get('matter_update')
        if (subscribers) {
          subscribers.forEach(callback => callback(data))
        }
      })

      socket.on('contract_update', (data) => {
        logger.info('Contract updated', data)
        const subscribers = subscribersRef.current.get('contract_update')
        if (subscribers) {
          subscribers.forEach(callback => callback(data))
        }
      })

      socket.on('user_activity', (data) => {
        logger.info('User activity', data)
        const subscribers = subscribersRef.current.get('user_activity')
        if (subscribers) {
          subscribers.forEach(callback => callback(data))
        }
      })

    } catch (error) {
      logger.error('Failed to initialize WebSocket', { error })
    }
  }, [url, options, connectionAttempts])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    
    setIsConnected(false)
    subscribersRef.current.clear()
  }, [])

  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    if (!subscribersRef.current.has(event)) {
      subscribersRef.current.set(event, new Set())
    }
    
    subscribersRef.current.get(event)!.add(callback)
    
    // Return unsubscribe function
    return () => {
      const subscribers = subscribersRef.current.get(event)
      if (subscribers) {
        subscribers.delete(callback)
        if (subscribers.size === 0) {
          subscribersRef.current.delete(event)
        }
      }
    }
  }, [])

  const emit = useCallback((event: string, data?: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data)
    } else {
      logger.warn('Cannot emit event - socket not connected', { event, data })
    }
  }, [isConnected])

  useEffect(() => {
    connect()
    
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  // Handle auth token changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        // Reconnect with new token
        disconnect()
        setTimeout(connect, 100)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [connect, disconnect])

  const value: WebSocketContextType = {
    socket: socketRef.current,
    isConnected,
    subscribe,
    emit,
    connectionAttempts
  }

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  const context = React.useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }
  return context
}

// Hook for specific event subscriptions
export function useWebSocketEvent(event: string, callback: (data: any) => void) {
  const { subscribe } = useWebSocket()
  
  useEffect(() => {
    const unsubscribe = subscribe(event, callback)
    return unsubscribe
  }, [event, callback, subscribe])
}

// Hook for real-time data updates
export function useRealTimeData<T>(
  initialData: T,
  eventName: string,
  updateCondition?: (newData: any, currentData: T) => boolean
) {
  const [data, setData] = useState<T>(initialData)
  
  useWebSocketEvent(eventName, (newData) => {
    if (!updateCondition || updateCondition(newData, data)) {
      setData(prevData => {
        if (Array.isArray(prevData)) {
          // Handle array updates (lists)
          const existingIndex = (prevData as any[]).findIndex(
            item => item.id === newData.id
          )
          
          if (existingIndex >= 0) {
            // Update existing item
            const updated = [...prevData as any[]]
            updated[existingIndex] = { ...updated[existingIndex], ...newData }
            return updated as T
          } else {
            // Add new item
            return [...prevData as any[], newData] as T
          }
        } else if (typeof prevData === 'object' && prevData !== null) {
          // Handle object updates
          return { ...prevData, ...newData } as T
        } else {
          // Handle primitive updates
          return newData as T
        }
      })
    }
  })

  return [data, setData] as const
}