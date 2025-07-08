import React, { createContext, useContext, useState, useEffect } from 'react'
import { LegalAIService } from '../services/ai/legal-functions'
import { AIResponse } from '../services/ai/types'

interface AIContextType {
  aiService: LegalAIService
  isLoading: boolean
  error: string | null
  currentProvider: string
  availableProviders: string[]
  providerStatus: Record<string, boolean>
  setProvider: (provider: string) => boolean
  clearError: () => void
}

const AIContext = createContext<AIContextType | undefined>(undefined)

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [aiService] = useState(() => new LegalAIService())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentProvider, setCurrentProvider] = useState('openai')
  const [availableProviders, setAvailableProviders] = useState<string[]>([])
  const [providerStatus, setProviderStatus] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setAvailableProviders(aiService.getAvailableProviders())
    setProviderStatus(aiService.getProviderStatus())
  }, [aiService])

  const setProvider = (provider: string): boolean => {
    const success = aiService.setAIProvider(provider)
    if (success) {
      setCurrentProvider(provider)
      setError(null)
    } else {
      setError(`Failed to set provider: ${provider}`)
    }
    return success
  }

  const clearError = () => {
    setError(null)
  }

  const value: AIContextType = {
    aiService,
    isLoading,
    error,
    currentProvider,
    availableProviders,
    providerStatus,
    setProvider,
    clearError
  }

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  )
}

export function useAI() {
  const context = useContext(AIContext)
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider')
  }
  return context
}