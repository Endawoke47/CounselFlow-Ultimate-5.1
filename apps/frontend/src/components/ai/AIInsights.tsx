import React, { useState, useEffect } from 'react'
import { logger } from '../../services/logger'
import { safeAsync } from '../../services/errorHandler'
import { Brain, TrendingUp, AlertTriangle, Target, Lightbulb, BarChart3, Zap, Loader, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAI } from '../../contexts/AIContext'
import { AIResponse } from '../../services/ai/types'

interface AIInsightsProps {
  type: 'dashboard' | 'matter' | 'contract' | 'risk' | 'compliance'
  data?: any
  context?: string
}

interface Insight {
  id: string
  title: string
  content: string
  type: 'trend' | 'risk' | 'opportunity' | 'recommendation'
  confidence: number
  priority: 'low' | 'medium' | 'high'
  actionable: boolean
  metadata?: any
}

export function AIInsights({ type, data, context }: AIInsightsProps) {
  const { aiService } = useAI()
  const [insights, setInsights] = useState<Insight[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    generateInsights()
  }, [type, data])

  const generateInsights = async () => {
    setIsLoading(true)
    try {
      let response: AIResponse
      
      switch (type) {
        case 'dashboard':
          response = await aiService.generateLegalInsights({
            type: 'trend',
            context: 'Legal department dashboard analysis',
            practiceArea: 'General',
            timeframe: 'current'
          })
          break
        
        case 'matter':
          response = await aiService.generateMatterInsights(data?.id || 'unknown', data)
          break
        
        case 'contract':
          response = await aiService.analyzeContracts(data || [])
          break
        
        case 'risk':
          response = await aiService.assessRisk({
            type: 'compliance',
            content: context || 'General risk assessment',
            context: { practiceArea: 'General' }
          })
          break
        
        case 'compliance':
          response = await aiService.analyzeCompliance({
            content: context || 'Compliance analysis',
            regulations: ['GDPR', 'CCPA', 'SOX'],
            jurisdiction: 'United States',
            businessType: 'Technology',
            riskTolerance: 'medium'
          })
          break
        
        default:
          response = await aiService.generateLegalInsights({
            type: 'trend',
            context: context || 'General legal analysis',
            practiceArea: 'General'
          })
      }

      const parsedInsights = parseInsightsFromResponse(response)
      setInsights(parsedInsights)
      setLastUpdated(new Date().toISOString())
    } catch (error) {
      logger.error('Error generating AI insights', { error, type, context })
      setInsights(getDefaultInsights(type))
    } finally {
      setIsLoading(false)
    }
  }

  const parseInsightsFromResponse = (response: AIResponse): Insight[] => {
    // Parse AI response and extract insights
    const content = response.content
    const lines = content.split('\n').filter(line => line.trim())
    
    const insights: Insight[] = []
    let currentInsight: Partial<Insight> | null = null
    
    for (const line of lines) {
      if (line.match(/^\d+\./)) {
        if (currentInsight) {
          insights.push({
            id: Date.now().toString() + Math.random(),
            title: currentInsight.title || 'Insight',
            content: currentInsight.content || '',
            type: currentInsight.type || 'recommendation',
            confidence: response.confidence,
            priority: currentInsight.priority || 'medium',
            actionable: true
          })
        }
        
        currentInsight = {
          title: line.replace(/^\d+\.\s*/, ''),
          content: '',
          type: 'recommendation',
          priority: 'medium'
        }
      } else if (currentInsight && line.trim()) {
        currentInsight.content += line + '\n'
      }
    }
    
    if (currentInsight) {
      insights.push({
        id: Date.now().toString() + Math.random(),
        title: currentInsight.title || 'Insight',
        content: currentInsight.content || '',
        type: currentInsight.type || 'recommendation',
        confidence: response.confidence,
        priority: currentInsight.priority || 'medium',
        actionable: true
      })
    }
    
    return insights.slice(0, 4) // Limit to 4 insights
  }

  const getDefaultInsights = (insightType: string): Insight[] => {
    const defaultInsights = {
      dashboard: [
        {
          id: '1',
          title: 'Contract Renewal Opportunities',
          content: 'You have 12 contracts expiring in the next 90 days. Early renewal negotiations could secure better terms.',
          type: 'opportunity' as const,
          confidence: 0.85,
          priority: 'high' as const,
          actionable: true
        },
        {
          id: '2',
          title: 'Compliance Risk Alert',
          content: 'New data privacy regulations in California may affect your current data handling practices.',
          type: 'risk' as const,
          confidence: 0.90,
          priority: 'high' as const,
          actionable: true
        }
      ],
      matter: [
        {
          id: '1',
          title: 'Settlement Opportunity',
          content: 'Based on similar cases, early settlement could reduce costs by 40% while achieving favorable terms.',
          type: 'recommendation' as const,
          confidence: 0.75,
          priority: 'medium' as const,
          actionable: true
        }
      ],
      contract: [
        {
          id: '1',
          title: 'Cost Optimization',
          content: 'Vendor performance analysis suggests renegotiating terms with top 3 vendors could save $150K annually.',
          type: 'opportunity' as const,
          confidence: 0.82,
          priority: 'high' as const,
          actionable: true
        }
      ]
    }
    
    return defaultInsights[insightType as keyof typeof defaultInsights] || []
  }

  const getInsightIcon = (insightType: string) => {
    switch (insightType) {
      case 'trend':
        return TrendingUp
      case 'risk':
        return AlertTriangle
      case 'opportunity':
        return Target
      case 'recommendation':
        return Lightbulb
      default:
        return Brain
    }
  }

  const getInsightColor = (insightType: string, priority: string) => {
    if (insightType === 'risk') {
      return priority === 'high' ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'
    }
    if (insightType === 'opportunity') {
      return 'border-green-200 bg-green-50'
    }
    return 'border-blue-200 bg-blue-50'
  }

  const getInsightTextColor = (insightType: string) => {
    if (insightType === 'risk') return 'text-red-700'
    if (insightType === 'opportunity') return 'text-green-700'
    return 'text-blue-700'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-cyan-100 to-teal-100 rounded-lg">
            <Brain size={24} className="text-cyan-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
            <p className="text-sm text-gray-500">
              {lastUpdated ? `Last updated: ${new Date(lastUpdated).toLocaleTimeString()}` : 'Generating insights...'}
            </p>
          </div>
        </div>
        
        <button
          onClick={generateInsights}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 disabled:opacity-50 transition-all"
        >
          {isLoading ? <Loader className="animate-spin" size={16} /> : <RefreshCw size={16} />}
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => {
            const IconComponent = getInsightIcon(insight.type)
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-xl p-4 ${getInsightColor(insight.type, insight.priority)}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${getInsightColor(insight.type, insight.priority)}`}>
                    <IconComponent size={20} className={getInsightTextColor(insight.type)} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${getInsightTextColor(insight.type)}`}>
                      {insight.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
                      <span>•</span>
                      <span className={`font-medium ${
                        insight.priority === 'high' ? 'text-red-600' :
                        insight.priority === 'medium' ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {insight.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className={`text-sm ${getInsightTextColor(insight.type)} leading-relaxed`}>
                  {insight.content}
                </p>
                
                {insight.actionable && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <button className={`text-xs font-medium ${getInsightTextColor(insight.type)} hover:underline`}>
                      Take Action →
                    </button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {insights.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <Brain size={48} className="mx-auto text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">No insights available</h4>
          <p className="text-gray-500">Click refresh to generate AI-powered insights for your legal data.</p>
        </div>
      )}
    </div>
  )
}