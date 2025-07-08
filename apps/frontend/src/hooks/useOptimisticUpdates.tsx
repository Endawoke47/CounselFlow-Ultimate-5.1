import { useState, useCallback } from 'react'
import { useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { logger } from '../services/logger'

interface OptimisticUpdate<T> {
  id: string
  data: T
  timestamp: number
  operation: 'create' | 'update' | 'delete'
  rollback: () => void
}

export function useOptimisticUpdates<T extends { id: string }>() {
  const queryClient = useQueryClient()
  const [pendingUpdates, setPendingUpdates] = useState<Map<string, OptimisticUpdate<T>>>(new Map())

  const applyOptimisticUpdate = useCallback((
    queryKey: string | string[],
    operation: 'create' | 'update' | 'delete',
    item: T,
    updateFn?: (oldData: T[], newItem: T) => T[]
  ) => {
    const updateId = `${operation}-${item.id}-${Date.now()}`
    
    // Store previous data for rollback
    const previousData = queryClient.getQueryData(queryKey)
    
    const rollback = () => {
      queryClient.setQueryData(queryKey, previousData)
      setPendingUpdates(prev => {
        const newMap = new Map(prev)
        newMap.delete(updateId)
        return newMap
      })
      toast.error('Update failed - changes reverted', { duration: 3000 })
    }

    // Apply optimistic update
    queryClient.setQueryData(queryKey, (oldData: T[] = []) => {
      if (updateFn) {
        return updateFn(oldData, item)
      }

      switch (operation) {
        case 'create':
          return [item, ...oldData]
        
        case 'update':
          return oldData.map(existing => 
            existing.id === item.id ? { ...existing, ...item } : existing
          )
        
        case 'delete':
          return oldData.filter(existing => existing.id !== item.id)
        
        default:
          return oldData
      }
    })

    // Track the update
    const update: OptimisticUpdate<T> = {
      id: updateId,
      data: item,
      timestamp: Date.now(),
      operation,
      rollback
    }

    setPendingUpdates(prev => new Map(prev).set(updateId, update))

    return {
      updateId,
      rollback,
      confirm: () => {
        setPendingUpdates(prev => {
          const newMap = new Map(prev)
          newMap.delete(updateId)
          return newMap
        })
      }
    }
  }, [queryClient])

  const createOptimistic = useCallback((
    queryKey: string | string[],
    item: T,
    apiCall: () => Promise<any>
  ) => {
    const { updateId, rollback, confirm } = applyOptimisticUpdate(queryKey, 'create', item)

    // Show immediate feedback
    toast.success('Creating...', { duration: 1000 })

    // Execute API call
    apiCall()
      .then(() => {
        confirm()
        toast.success('Created successfully', { duration: 2000 })
        logger.info('Optimistic create confirmed', { item })
      })
      .catch((error) => {
        rollback()
        logger.error('Optimistic create failed', { error, item })
      })

    return updateId
  }, [applyOptimisticUpdate])

  const updateOptimistic = useCallback((
    queryKey: string | string[],
    item: T,
    apiCall: () => Promise<any>
  ) => {
    const { updateId, rollback, confirm } = applyOptimisticUpdate(queryKey, 'update', item)

    // Show immediate feedback
    toast.success('Updating...', { duration: 1000 })

    // Execute API call
    apiCall()
      .then(() => {
        confirm()
        toast.success('Updated successfully', { duration: 2000 })
        logger.info('Optimistic update confirmed', { item })
      })
      .catch((error) => {
        rollback()
        logger.error('Optimistic update failed', { error, item })
      })

    return updateId
  }, [applyOptimisticUpdate])

  const deleteOptimistic = useCallback((
    queryKey: string | string[],
    item: T,
    apiCall: () => Promise<any>
  ) => {
    const { updateId, rollback, confirm } = applyOptimisticUpdate(queryKey, 'delete', item)

    // Show immediate feedback
    toast.success('Deleting...', { duration: 1000 })

    // Execute API call
    apiCall()
      .then(() => {
        confirm()
        toast.success('Deleted successfully', { duration: 2000 })
        logger.info('Optimistic delete confirmed', { item })
      })
      .catch((error) => {
        rollback()
        logger.error('Optimistic delete failed', { error, item })
      })

    return updateId
  }, [applyOptimisticUpdate])

  const isPending = useCallback((itemId: string) => {
    for (const [, update] of pendingUpdates) {
      if (update.data.id === itemId) {
        return true
      }
    }
    return false
  }, [pendingUpdates])

  const getPendingOperation = useCallback((itemId: string) => {
    for (const [, update] of pendingUpdates) {
      if (update.data.id === itemId) {
        return update.operation
      }
    }
    return null
  }, [pendingUpdates])

  const clearAllPending = useCallback(() => {
    for (const [, update] of pendingUpdates) {
      update.rollback()
    }
    setPendingUpdates(new Map())
  }, [pendingUpdates])

  return {
    createOptimistic,
    updateOptimistic,
    deleteOptimistic,
    applyOptimisticUpdate,
    isPending,
    getPendingOperation,
    pendingUpdates: Array.from(pendingUpdates.values()),
    clearAllPending
  }
}

// Hook for individual item optimistic updates
export function useOptimisticItem<T extends { id: string }>(
  queryKey: string | string[],
  item: T | null
) {
  const { updateOptimistic, isPending, getPendingOperation } = useOptimisticUpdates<T>()

  const update = useCallback((updatedFields: Partial<T>, apiCall: () => Promise<any>) => {
    if (!item) return

    const updatedItem = { ...item, ...updatedFields } as T
    return updateOptimistic(queryKey, updatedItem, apiCall)
  }, [item, queryKey, updateOptimistic])

  return {
    update,
    isPending: item ? isPending(item.id) : false,
    pendingOperation: item ? getPendingOperation(item.id) : null
  }
}

// Hook for list optimistic updates
export function useOptimisticList<T extends { id: string }>(queryKey: string | string[]) {
  const { 
    createOptimistic, 
    updateOptimistic, 
    deleteOptimistic,
    isPending,
    getPendingOperation,
    pendingUpdates
  } = useOptimisticUpdates<T>()

  const create = useCallback((item: T, apiCall: () => Promise<any>) => {
    return createOptimistic(queryKey, item, apiCall)
  }, [queryKey, createOptimistic])

  const update = useCallback((item: T, apiCall: () => Promise<any>) => {
    return updateOptimistic(queryKey, item, apiCall)
  }, [queryKey, updateOptimistic])

  const remove = useCallback((item: T, apiCall: () => Promise<any>) => {
    return deleteOptimistic(queryKey, item, apiCall)
  }, [queryKey, deleteOptimistic])

  return {
    create,
    update,
    remove,
    isPending,
    getPendingOperation,
    pendingUpdates
  }
}