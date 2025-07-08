import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, TrendingUp, TrendingDown, Shield } from '../icons'
import { documentAnalysisService, type AnalysisResult } from '../../services/documentAnalysis'

interface RiskData {
  category: string
  level: 'Low' | 'Medium' | 'High' | 'Critical'
  severity: number
  count: number
  trend: 'up' | 'down' | 'stable'
  description: string
}

interface RiskVisualizationProps {
  className?: string
  height?: number
}

export function RiskVisualization({ className, height = 400 }: RiskVisualizationProps) {
  const [riskData, setRiskData] = useState<RiskData[]>([])
  const [loading, setLoading] = useState(true)
  const [totalRiskScore, setTotalRiskScore] = useState(0)

  useEffect(() => {
    loadRiskData()
  }, [])

  const loadRiskData = async () => {
    try {
      setLoading(true)
      
      // Simulate loading real analysis data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock risk data based on document analysis results
      const mockRiskData: RiskData[] = [
        {
          category: 'Liability',
          level: 'High',
          severity: 8.5,
          count: 12,
          trend: 'up',
          description: 'Unlimited liability clauses found in contracts'
        },
        {
          category: 'Compliance',
          level: 'Medium',
          severity: 6.2,
          count: 8,
          trend: 'down',
          description: 'Missing regulatory requirements'
        },
        {
          category: 'Termination',
          level: 'Medium',
          severity: 5.8,
          count: 15,
          trend: 'stable',
          description: 'Complex termination procedures'
        },
        {
          category: 'Intellectual Property',
          level: 'High',
          severity: 7.9,
          count: 6,
          trend: 'up',
          description: 'Unclear IP ownership terms'
        },
        {
          category: 'Payment Terms',
          level: 'Low',
          severity: 3.2,
          count: 22,
          trend: 'down',
          description: 'Standard payment conditions'
        },
        {
          category: 'Data Protection',
          level: 'Critical',
          severity: 9.1,
          count: 4,
          trend: 'up',
          description: 'GDPR compliance issues detected'
        }
      ]

      setRiskData(mockRiskData)
      const avgRisk = mockRiskData.reduce((sum, item) => sum + item.severity, 0) / mockRiskData.length
      setTotalRiskScore(avgRisk)
    } catch (error) {
      console.error('Failed to load risk data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low':
        return { bg: 'var(--color-success-500)', light: 'var(--color-success-100)', text: 'var(--color-success-700)' }
      case 'Medium':
        return { bg: 'var(--color-warning-500)', light: 'var(--color-warning-100)', text: 'var(--color-warning-700)' }
      case 'High':
        return { bg: 'var(--color-error-500)', light: 'var(--color-error-100)', text: 'var(--color-error-700)' }
      case 'Critical':
        return { bg: '#dc2626', light: '#fef2f2', text: '#991b1b' }
      default:
        return { bg: 'var(--color-gray-500)', light: 'var(--color-gray-100)', text: 'var(--color-gray-700)' }
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-red-500" />
      case 'down':
        return <TrendingDown size={16} className="text-green-500" />
      default:
        return <div className="w-4 h-4" />
    }
  }

  const maxSeverity = Math.max(...riskData.map(item => item.severity))

  if (loading) {
    return (
      <div 
        className={`p-6 rounded-xl border animate-pulse ${className}`}
        style={{ 
          height,
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)'
        }}
      >
        <div className="h-6 bg-gray-200 rounded w-48 mb-6" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="flex-1 h-4 bg-gray-200 rounded" />
              <div className="w-16 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`p-6 rounded-xl border ${className}`}
      style={{
        height,
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-error-100)' }}>
            <AlertCircle size={20} style={{ color: 'var(--color-error-600)' }} />
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Risk Analysis Dashboard
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Based on document analysis results
            </p>
          </div>
        </div>
        
        {/* Overall Risk Score */}
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: 'var(--color-error-600)' }}>
            {totalRiskScore.toFixed(1)}
          </div>
          <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Risk Score
          </div>
        </div>
      </div>

      {/* Risk Categories */}
      <div className="space-y-4 overflow-y-auto" style={{ maxHeight: height - 140 }}>
        {riskData.map((risk, index) => {
          const colors = getRiskColor(risk.level)
          const barWidth = (risk.severity / maxSeverity) * 100

          return (
            <motion.div
              key={risk.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group p-4 rounded-lg border transition-all duration-200 hover:shadow-md"
              style={{
                backgroundColor: 'var(--color-surface-secondary)',
                borderColor: 'var(--color-border)'
              }}
            >
              {/* Category Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors.bg }}
                  />
                  <h4 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {risk.category}
                  </h4>
                  <span 
                    className="px-2 py-1 text-xs font-medium rounded-full"
                    style={{ 
                      backgroundColor: colors.light,
                      color: colors.text
                    }}
                  >
                    {risk.level}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getTrendIcon(risk.trend)}
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    {risk.count} issues
                  </span>
                </div>
              </div>

              {/* Severity Bar */}
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Severity
                  </span>
                  <span className="text-xs font-bold" style={{ color: colors.text }}>
                    {risk.severity.toFixed(1)}/10
                  </span>
                </div>
                <div 
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--color-gray-200)' }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ delay: (index * 0.1) + 0.3, duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: colors.bg }}
                  />
                </div>
              </div>

              {/* Description */}
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {risk.description}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Risk Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-4 p-3 rounded-lg border"
        style={{
          backgroundColor: 'var(--color-info-50)',
          borderColor: 'var(--color-info-200)'
        }}
      >
        <div className="flex items-center space-x-2">
          <Shield size={16} style={{ color: 'var(--color-info-600)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--color-info-800)' }}>
            Risk Mitigation Recommended
          </span>
        </div>
        <p className="text-xs mt-1" style={{ color: 'var(--color-info-700)' }}>
          {riskData.filter(r => r.level === 'High' || r.level === 'Critical').length} high-priority issues need immediate attention
        </p>
      </motion.div>
    </motion.div>
  )
}