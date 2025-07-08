export interface AIProvider {
  name: string
  endpoint: string
  apiKey: string
  model: string
  maxTokens: number
  temperature: number
}

export interface AIRequest {
  prompt: string
  context?: string
  type: 'research' | 'contract' | 'analysis' | 'risk' | 'compliance' | 'chat' | 'insight'
  data?: any
  provider?: string
}

export interface AIResponse {
  content: string
  confidence: number
  provider: string
  tokens: number
  cost: number
  timestamp: string
  metadata?: {
    sources?: string[]
    citations?: string[]
    riskLevel?: 'low' | 'medium' | 'high'
    category?: string
  }
}

export interface LegalResearchRequest {
  query: string
  jurisdiction?: string
  practiceArea?: string
  caseType?: string
  dateRange?: {
    start: string
    end: string
  }
}

export interface ContractDraftRequest {
  contractType: string
  parties: {
    name: string
    type: 'individual' | 'corporation' | 'llc' | 'partnership'
    jurisdiction: string
  }[]
  terms: {
    duration?: string
    value?: number
    deliverables?: string[]
    payments?: string
    termination?: string
  }
  jurisdiction: string
  specialProvisions?: string[]
}

export interface RiskAssessmentRequest {
  type: 'contract' | 'matter' | 'compliance' | 'litigation'
  content: string
  context?: {
    jurisdiction?: string
    practiceArea?: string
    businessType?: string
    regulations?: string[]
  }
}

export interface ComplianceAnalysisRequest {
  content: string
  regulations: string[]
  jurisdiction: string
  businessType: string
  riskTolerance: 'low' | 'medium' | 'high'
}

export interface DocumentAnalysisRequest {
  content: string
  documentType: string
  analysisType: 'summary' | 'risk' | 'compliance' | 'terms' | 'redlines'
  compareWith?: string
}

export interface LegalInsightRequest {
  type: 'trend' | 'precedent' | 'strategy' | 'forecast'
  context: string
  practiceArea: string
  jurisdiction?: string
  timeframe?: string
}