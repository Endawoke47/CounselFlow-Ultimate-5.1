import React, { useState, useEffect, useCallback } from 'react'
import { useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { logger } from '../services/logger'

interface OfflineAction {
  id: string
  type: 'create' | 'update' | 'delete'
  endpoint: string
  data?: any
  timestamp: number
  retries: number
}

interface OfflineCapabilityOptions {
  enableOfflineStorage?: boolean
  maxStorageSize?: number // in MB
  syncInterval?: number // in milliseconds
  maxRetries?: number
}

const STORAGE_KEYS = {
  OFFLINE_ACTIONS: 'counselflow_offline_actions',
  CACHED_DATA: 'counselflow_cached_data',
  LAST_SYNC: 'counselflow_last_sync'
}

export function useOfflineCapability(options: OfflineCapabilityOptions = {}) {
  const {
    enableOfflineStorage = true,
    maxStorageSize = 50, // 50MB
    syncInterval = 30000, // 30 seconds
    maxRetries = 3
  } = options

  const queryClient = useQueryClient()
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingActions, setPendingActions] = useState<OfflineAction[]>([])
  const [isSyncing, setIsSyncing] = useState(false)

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast.success('Back online - syncing data...', { duration: 3000 })
      syncPendingActions()
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast.error('You are offline - changes will be saved locally', { 
        duration: 5000,
        icon: '📱'
      })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Load pending actions from localStorage on mount
  useEffect(() => {
    if (enableOfflineStorage) {
      const stored = localStorage.getItem(STORAGE_KEYS.OFFLINE_ACTIONS)
      if (stored) {
        try {
          const actions = JSON.parse(stored)
          setPendingActions(actions)
          logger.info('Loaded offline actions from storage', { count: actions.length })
        } catch (error) {
          logger.error('Failed to load offline actions', { error })
        }
      }
    }
  }, [enableOfflineStorage])

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && pendingActions.length > 0) {
      syncPendingActions()
    }
  }, [isOnline])

  // Periodic sync
  useEffect(() => {
    if (!isOnline || !enableOfflineStorage) return

    const interval = setInterval(() => {
      if (pendingActions.length > 0) {
        syncPendingActions()
      }
    }, syncInterval)

    return () => clearInterval(interval)
  }, [isOnline, pendingActions.length, syncInterval, enableOfflineStorage])

  const saveToStorage = useCallback((actions: OfflineAction[]) => {
    if (!enableOfflineStorage) return

    try {
      // Check storage size
      const dataSize = new Blob([JSON.stringify(actions)]).size / (1024 * 1024) // MB
      if (dataSize > maxStorageSize) {
        // Remove oldest actions if exceeding size limit
        const maxActions = Math.floor(actions.length * 0.8)
        actions = actions.slice(-maxActions)
        toast('Storage limit reached - removed oldest offline actions', { icon: '⚠️' })
      }

      localStorage.setItem(STORAGE_KEYS.OFFLINE_ACTIONS, JSON.stringify(actions))
      logger.debug('Saved offline actions to storage', { count: actions.length, size: dataSize })
    } catch (error) {
      logger.error('Failed to save offline actions', { error })
      toast.error('Failed to save offline changes')
    }
  }, [enableOfflineStorage, maxStorageSize])

  const queueOfflineAction = useCallback((
    type: OfflineAction['type'],
    endpoint: string,
    data?: any
  ) => {
    const action: OfflineAction = {
      id: `${type}-${endpoint}-${Date.now()}-${Math.random()}`,
      type,
      endpoint,
      data,
      timestamp: Date.now(),
      retries: 0
    }

    setPendingActions(prev => {
      const updated = [...prev, action]
      saveToStorage(updated)
      return updated
    })

    logger.info('Queued offline action', { action })
    
    if (!isOnline) {
      toast.success('Action saved for when you\'re back online', {
        duration: 3000,
        icon: '💾'
      })
    }

    return action.id
  }, [saveToStorage, isOnline])

  const removeOfflineAction = useCallback((actionId: string) => {
    setPendingActions(prev => {
      const updated = prev.filter(action => action.id !== actionId)
      saveToStorage(updated)
      return updated
    })
  }, [saveToStorage])

  const syncPendingActions = useCallback(async () => {
    if (!isOnline || pendingActions.length === 0 || isSyncing) return

    setIsSyncing(true)
    logger.info('Starting sync of pending actions', { count: pendingActions.length })

    let successCount = 0
    let failureCount = 0

    for (const action of pendingActions) {
      try {
        // Here you would make the actual API call
        // This is a simulation - replace with your actual API calls
        await simulateApiCall(action)
        
        removeOfflineAction(action.id)
        successCount++
        
        logger.info('Synced offline action', { action })
      } catch (error) {
        logger.error('Failed to sync offline action', { action, error })
        
        // Increment retry count
        setPendingActions(prev => prev.map(a => 
          a.id === action.id 
            ? { ...a, retries: a.retries + 1 }
            : a
        ))

        // Remove action if max retries exceeded
        if (action.retries >= maxRetries) {
          removeOfflineAction(action.id)
          logger.warn('Removed action after max retries', { action })
        }
        
        failureCount++
      }
    }

    setIsSyncing(false)

    // Update last sync timestamp
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString())

    // Show sync results
    if (successCount > 0) {
      toast.success(`Synced ${successCount} offline changes`, { duration: 3000 })
    }
    
    if (failureCount > 0) {
      toast.error(`Failed to sync ${failureCount} changes`, { duration: 5000 })
    }

    logger.info('Sync completed', { successCount, failureCount })
  }, [isOnline, pendingActions, isSyncing, maxRetries, removeOfflineAction])

  const clearOfflineData = useCallback(() => {
    setPendingActions([])
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_ACTIONS)
    localStorage.removeItem(STORAGE_KEYS.CACHED_DATA)
    toast.success('Offline data cleared')
  }, [])

  const getStorageInfo = useCallback(() => {
    const actions = localStorage.getItem(STORAGE_KEYS.OFFLINE_ACTIONS)
    const cachedData = localStorage.getItem(STORAGE_KEYS.CACHED_DATA)
    const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC)

    const actionsSize = actions ? new Blob([actions]).size : 0
    const cachedSize = cachedData ? new Blob([cachedData]).size : 0
    const totalSize = (actionsSize + cachedSize) / (1024 * 1024) // MB

    return {
      pendingActionsCount: pendingActions.length,
      totalSizeMB: totalSize,
      lastSync: lastSync ? new Date(parseInt(lastSync)) : null,
      storageUsage: `${totalSize.toFixed(2)}MB / ${maxStorageSize}MB`
    }
  }, [pendingActions.length, maxStorageSize])

  // Cache management
  const cacheData = useCallback((key: string, data: any, ttl?: number) => {
    if (!enableOfflineStorage) return

    try {
      const cacheItem = {
        data,
        timestamp: Date.now(),
        ttl: ttl || 3600000 // 1 hour default
      }

      const existingCache = JSON.parse(localStorage.getItem(STORAGE_KEYS.CACHED_DATA) || '{}')
      existingCache[key] = cacheItem

      localStorage.setItem(STORAGE_KEYS.CACHED_DATA, JSON.stringify(existingCache))
      logger.debug('Cached data', { key, size: JSON.stringify(data).length })
    } catch (error) {
      logger.error('Failed to cache data', { error, key })
    }
  }, [enableOfflineStorage])

  const getCachedData = useCallback((key: string) => {
    if (!enableOfflineStorage) return null

    try {
      const cache = JSON.parse(localStorage.getItem(STORAGE_KEYS.CACHED_DATA) || '{}')
      const item = cache[key]

      if (!item) return null

      // Check if cache is expired
      if (Date.now() - item.timestamp > item.ttl) {
        // Remove expired item
        delete cache[key]
        localStorage.setItem(STORAGE_KEYS.CACHED_DATA, JSON.stringify(cache))
        return null
      }

      logger.debug('Retrieved cached data', { key })
      return item.data
    } catch (error) {
      logger.error('Failed to retrieve cached data', { error, key })
      return null
    }
  }, [enableOfflineStorage])

  return {
    isOnline,
    isOfflineModeEnabled: enableOfflineStorage,
    pendingActions,
    isSyncing,
    queueOfflineAction,
    syncPendingActions,
    clearOfflineData,
    getStorageInfo,
    cacheData,
    getCachedData
  }
}

// Simulation function - replace with actual API calls
async function simulateApiCall(action: OfflineAction): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
  
  // Simulate random failures for testing
  if (Math.random() < 0.1) {
    throw new Error('Simulated network error')
  }
  
  logger.debug('Simulated API call success', { action })
}

// Context for offline capability
const OfflineContext = React.createContext<ReturnType<typeof useOfflineCapability> | null>(null)

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const offlineCapability = useOfflineCapability()

  return (
    <OfflineContext.Provider value={offlineCapability}>
      {children}
    </OfflineContext.Provider>
  )
}

export function useOffline() {
  const context = React.useContext(OfflineContext)
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider')
  }
  return context
}