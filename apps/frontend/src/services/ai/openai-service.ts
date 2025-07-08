import OpenAI from 'openai'
import { logger } from '../logger'
import { config } from '../config'
import { safeAsync } from '../errorHandler'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp?: string
}

export interface LegalAnalysisRequest {
  text: string
  type: 'contract' | 'litigation' | 'compliance' | 'research' | 'general'
  jurisdiction?: string
  practiceArea?: string
  context?: string
}

export interface LegalAnalysisResponse {
  summary: string
  keyPoints: string[]
  risks: Array<{
    level: 'low' | 'medium' | 'high' | 'critical'
    description: string
    recommendation: string
  }>
  recommendations: string[]
  nextSteps: string[]
  confidence: number
  sources?: string[]
}

export interface ContractAnalysisResponse extends LegalAnalysisResponse {
  contractType: string
  parties: string[]
  keyTerms: Array<{
    term: string
    description: string
    importance: 'low' | 'medium' | 'high'
  }>
  missingClauses: string[]
  complianceIssues: string[]
}

export interface LitigationAnalysisResponse extends LegalAnalysisResponse {
  caseType: string
  jurisdiction: string
  timeEstimate: string
  costEstimate: string
  successProbability: number
  precedents: string[]
  strategy: string[]
}

class OpenAIService {
  private client: OpenAI | null = null
  private isInitialized = false

  constructor() {
    this.initialize()
  }

  private async initialize() {
    try {
      const apiKey = config.ai.openaiApiKey
      
      if (!apiKey || apiKey === 'your_openai_api_key_here') {
        logger.warn('OpenAI API key not configured, AI features will be limited')
        return
      }

      this.client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
      })

      this.isInitialized = true
      logger.info('OpenAI service initialized successfully')
    } catch (error) {
      logger.error('Failed to initialize OpenAI service', { error })
    }
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    if (!this.isInitialized || !this.client) {
      throw new Error('OpenAI service not initialized')
    }

    const result = await safeAsync(async () => {
      const completion = await this.client!.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7,
        max_tokens: 2000,
      })

      return completion.choices[0]?.message?.content || 'No response generated'
    }, 'OpenAI chat completion')

    if (result.error) {
      logger.error('OpenAI chat error', { error: result.error, messages })
      throw new Error('Failed to get AI response')
    }

    const response = result.data || 'No response generated'

    logger.info('OpenAI chat completed', { 
      messageCount: messages.length,
      responseLength: response.length 
    })

    return response
  }

  async analyzeLegalDocument(request: LegalAnalysisRequest): Promise<LegalAnalysisResponse> {
    if (!this.isInitialized || !this.client) {
      throw new Error('OpenAI service not initialized')
    }

    const systemPrompt = this.getLegalAnalysisPrompt(request.type, request.jurisdiction, request.practiceArea)
    
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: `Please analyze the following legal document:\n\n${request.text}\n\n${request.context ? `Additional context: ${request.context}` : ''}`
      }
    ]

    const result = await safeAsync(async () => {
      const completion = await this.client!.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.3, // Lower temperature for more consistent legal analysis
        max_tokens: 3000,
        response_format: { type: 'json_object' }
      })

      const content = completion.choices[0]?.message?.content
      if (!content) throw new Error('No response generated')

      return JSON.parse(content) as LegalAnalysisResponse
    }, 'Legal document analysis')

    if (result.error) {
      logger.error('Legal document analysis error', { error: result.error, request })
      throw new Error('Failed to analyze legal document')
    }

    const response = result.data
    if (!response) {
      throw new Error('No analysis response received')
    }

    logger.info('Legal document analysis completed', { 
      type: request.type,
      responseLength: JSON.stringify(response).length 
    })

    return response
  }

  async analyzeContract(contractText: string, jurisdiction?: string): Promise<ContractAnalysisResponse> {
    const request: LegalAnalysisRequest = {
      text: contractText,
      type: 'contract',
      jurisdiction,
      context: 'Comprehensive contract analysis for legal review'
    }

    const analysis = await this.analyzeLegalDocument(request) as ContractAnalysisResponse

    // Enhance with contract-specific analysis
    const contractPrompt = `
      You are a senior contract attorney. Analyze this contract and provide additional contract-specific insights:
      
      ${contractText}
      
      Focus on:
      1. Contract type identification
      2. Party analysis
      3. Key terms and clauses
      4. Missing standard clauses
      5. Compliance issues
      
      Respond in JSON format with contractType, parties, keyTerms, missingClauses, and complianceIssues fields.
    `

    const contractResult = await safeAsync(async () => {
      const completion = await this.client!.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: contractPrompt }],
        temperature: 0.2,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })

      const content = completion.choices[0]?.message?.content
      if (!content) throw new Error('No contract details generated')

      return JSON.parse(content)
    }, 'Contract analysis enhancement')

    if (!contractResult.error && contractResult.data) {
      Object.assign(analysis, contractResult.data)
    }

    return analysis as ContractAnalysisResponse
  }

  async analyzeLitigation(caseText: string, jurisdiction: string): Promise<LitigationAnalysisResponse> {
    const request: LegalAnalysisRequest = {
      text: caseText,
      type: 'litigation',
      jurisdiction,
      context: 'Litigation strategy and outcome analysis'
    }

    const analysis = await this.analyzeLegalDocument(request) as LitigationAnalysisResponse

    // Enhance with litigation-specific analysis
    const litigationPrompt = `
      You are a senior litigation attorney. Analyze this case and provide litigation-specific insights:
      
      ${caseText}
      
      Jurisdiction: ${jurisdiction}
      
      Provide:
      1. Case type classification
      2. Time estimate for resolution
      3. Cost estimate range
      4. Success probability (0-100)
      5. Relevant precedents
      6. Strategic recommendations
      
      Respond in JSON format with caseType, timeEstimate, costEstimate, successProbability, precedents, and strategy fields.
    `

    const litigationResult = await safeAsync(async () => {
      const completion = await this.client!.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: litigationPrompt }],
        temperature: 0.2,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })

      const content = completion.choices[0]?.message?.content
      if (!content) throw new Error('No litigation details generated')

      return JSON.parse(content)
    }, 'Litigation analysis enhancement')

    if (!litigationResult.error && litigationResult.data) {
      Object.assign(analysis, litigationResult.data)
    }

    return analysis as LitigationAnalysisResponse
  }

  async generateLegalDocument(
    documentType: string,
    parameters: Record<string, any>,
    jurisdiction?: string
  ): Promise<string> {
    if (!this.isInitialized || !this.client) {
      throw new Error('OpenAI service not initialized')
    }

    const prompt = `
      You are an expert legal document drafter. Generate a professional ${documentType} document with the following parameters:
      
      ${JSON.stringify(parameters, null, 2)}
      
      ${jurisdiction ? `Jurisdiction: ${jurisdiction}` : ''}
      
      Requirements:
      1. Use professional legal language
      2. Include all necessary clauses
      3. Ensure compliance with relevant laws
      4. Add appropriate disclaimers
      5. Format as a complete, ready-to-use document
      
      Generate only the document content, properly formatted.
    `

    const docResult = await safeAsync(async () => {
      const completion = await this.client!.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 4000,
      })

      return completion.choices[0]?.message?.content || 'Failed to generate document'
    }, 'Document generation')

    if (docResult.error) {
      logger.error('Document generation error', { error: docResult.error, documentType, parameters })
      throw new Error('Failed to generate legal document')
    }

    const document = docResult.data || 'Failed to generate document'
    logger.info('Legal document generated', { 
      documentType,
      documentLength: document.length 
    })

    return document
  }

  async researchLegalTopic(
    query: string,
    jurisdiction?: string,
    practiceArea?: string
  ): Promise<{
    summary: string
    keyFindings: string[]
    relevantCases: string[]
    applicableLaws: string[]
    practicalImplications: string[]
    nextSteps: string[]
  }> {
    if (!this.isInitialized || !this.client) {
      throw new Error('OpenAI service not initialized')
    }

    const prompt = `
      You are a senior legal researcher. Conduct comprehensive research on the following legal topic:
      
      Query: ${query}
      ${jurisdiction ? `Jurisdiction: ${jurisdiction}` : ''}
      ${practiceArea ? `Practice Area: ${practiceArea}` : ''}
      
      Provide:
      1. Executive summary
      2. Key legal findings
      3. Relevant case law and precedents
      4. Applicable statutes and regulations
      5. Practical implications for legal practice
      6. Recommended next steps for further research
      
      Respond in JSON format with summary, keyFindings, relevantCases, applicableLaws, practicalImplications, and nextSteps fields.
    `

    const researchResult = await safeAsync(async () => {
      const completion = await this.client!.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 3000,
        response_format: { type: 'json_object' }
      })

      const content = completion.choices[0]?.message?.content
      if (!content) throw new Error('No research generated')

      return JSON.parse(content)
    }, 'Legal research')

    if (researchResult.error) {
      logger.error('Legal research error', { error: researchResult.error, query })
      throw new Error('Failed to conduct legal research')
    }

    const research = researchResult.data
    logger.info('Legal research completed', { 
      query,
      jurisdiction,
      practiceArea 
    })

    return research
  }

  private getLegalAnalysisPrompt(
    type: string,
    jurisdiction?: string,
    practiceArea?: string
  ): string {
    const basePrompt = `
      You are an expert legal analyst with over 20 years of experience in ${practiceArea || 'general practice'}.
      ${jurisdiction ? `You specialize in ${jurisdiction} law.` : ''}
      
      Analyze the provided legal document with the highest level of professional expertise.
      
      Provide a comprehensive analysis in JSON format with the following structure:
      {
        "summary": "Executive summary of the document",
        "keyPoints": ["List of key legal points"],
        "risks": [
          {
            "level": "low|medium|high|critical",
            "description": "Risk description",
            "recommendation": "Specific recommendation"
          }
        ],
        "recommendations": ["List of actionable recommendations"],
        "nextSteps": ["List of next steps"],
        "confidence": 85
      }
      
      Focus on:
      1. Legal accuracy and precision
      2. Practical implications
      3. Risk assessment
      4. Actionable recommendations
      5. Compliance considerations
    `

    const typeSpecificPrompts = {
      contract: `
        ${basePrompt}
        
        For contract analysis, pay special attention to:
        - Terms and conditions
        - Liability and indemnification clauses
        - Termination provisions
        - Intellectual property rights
        - Dispute resolution mechanisms
        - Compliance with applicable laws
      `,
      litigation: `
        ${basePrompt}
        
        For litigation analysis, focus on:
        - Legal merits of the case
        - Potential outcomes and damages
        - Procedural considerations
        - Settlement opportunities
        - Discovery requirements
        - Timeline and cost estimates
      `,
      compliance: `
        ${basePrompt}
        
        For compliance analysis, emphasize:
        - Regulatory requirements
        - Compliance gaps and violations
        - Remediation strategies
        - Ongoing monitoring needs
        - Training and policy requirements
        - Reporting obligations
      `,
      research: `
        ${basePrompt}
        
        For legal research, provide:
        - Comprehensive legal analysis
        - Relevant case law and precedents
        - Applicable statutes and regulations
        - Practical implications
        - Strategic considerations
        - Areas for further research
      `
    }

    return typeSpecificPrompts[type as keyof typeof typeSpecificPrompts] || typeSpecificPrompts.contract
  }

  isAvailable(): boolean {
    return this.isInitialized && this.client !== null
  }

  getStatus(): { available: boolean, provider: string, model: string } {
    return {
      available: this.isAvailable(),
      provider: 'OpenAI',
      model: 'GPT-4 Turbo'
    }
  }
}

export const openAIService = new OpenAIService()
export default openAIService