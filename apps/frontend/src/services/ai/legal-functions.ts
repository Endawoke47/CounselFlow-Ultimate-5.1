import { AIProviderManager } from './providers'
import { 
  LegalResearchRequest, 
  ContractDraftRequest, 
  RiskAssessmentRequest, 
  ComplianceAnalysisRequest,
  DocumentAnalysisRequest,
  LegalInsightRequest,
  AIResponse 
} from './types'

export class LegalAIService {
  private aiManager: AIProviderManager

  constructor() {
    this.aiManager = new AIProviderManager()
  }

  async conductLegalResearch(request: LegalResearchRequest): Promise<AIResponse> {
    const prompt = `
Conduct comprehensive legal research on the following query:

Query: ${request.query}
${request.jurisdiction ? `Jurisdiction: ${request.jurisdiction}` : ''}
${request.practiceArea ? `Practice Area: ${request.practiceArea}` : ''}
${request.caseType ? `Case Type: ${request.caseType}` : ''}

Please provide:
1. Relevant case law and precedents
2. Applicable statutes and regulations
3. Key legal principles
4. Recent developments or trends
5. Practical implications and recommendations
6. Citations and sources

Format the response as a comprehensive legal research memo.
`

    return await this.aiManager.makeRequest({
      prompt,
      type: 'research',
      data: request
    })
  }

  async draftContract(request: ContractDraftRequest): Promise<AIResponse> {
    const partiesInfo = request.parties.map(p => 
      `${p.name} (${p.type}) - ${p.jurisdiction}`
    ).join('\n')

    const prompt = `
Draft a comprehensive ${request.contractType} contract with the following specifications:

PARTIES:
${partiesInfo}

TERMS:
${request.terms.duration ? `Duration: ${request.terms.duration}` : ''}
${request.terms.value ? `Contract Value: $${request.terms.value.toLocaleString()}` : ''}
${request.terms.deliverables ? `Deliverables: ${request.terms.deliverables.join(', ')}` : ''}
${request.terms.payments ? `Payment Terms: ${request.terms.payments}` : ''}
${request.terms.termination ? `Termination: ${request.terms.termination}` : ''}

JURISDICTION: ${request.jurisdiction}
${request.specialProvisions ? `Special Provisions: ${request.specialProvisions.join(', ')}` : ''}

Please draft a professional, legally sound contract including:
1. Complete contract header and parties section
2. Definitions and interpretation clauses
3. Core obligations and deliverables
4. Payment and financial terms
5. Intellectual property provisions
6. Confidentiality and data protection
7. Limitation of liability and indemnification
8. Termination and dispute resolution
9. General provisions and signatures

Ensure compliance with ${request.jurisdiction} law and include appropriate risk mitigation clauses.
`

    return await this.aiManager.makeRequest({
      prompt,
      type: 'contract',
      data: request
    })
  }

  async assessRisk(request: RiskAssessmentRequest): Promise<AIResponse> {
    const prompt = `
Conduct a comprehensive risk assessment for the following ${request.type}:

CONTENT:
${request.content}

CONTEXT:
${request.context?.jurisdiction ? `Jurisdiction: ${request.context.jurisdiction}` : ''}
${request.context?.practiceArea ? `Practice Area: ${request.context.practiceArea}` : ''}
${request.context?.businessType ? `Business Type: ${request.context.businessType}` : ''}
${request.context?.regulations ? `Applicable Regulations: ${request.context.regulations.join(', ')}` : ''}

Please provide:
1. Risk identification and categorization
2. Probability and impact assessment (High/Medium/Low)
3. Regulatory and compliance risks
4. Financial and operational impacts
5. Reputation and legal exposure
6. Mitigation strategies and recommendations
7. Priority ranking of identified risks
8. Recommended next steps

Format as a professional risk assessment report with clear risk ratings and actionable recommendations.
`

    return await this.aiManager.makeRequest({
      prompt,
      type: 'risk',
      data: request
    })
  }

  async analyzeCompliance(request: ComplianceAnalysisRequest): Promise<AIResponse> {
    const prompt = `
Conduct a comprehensive compliance analysis:

CONTENT TO ANALYZE:
${request.content}

COMPLIANCE REQUIREMENTS:
- Regulations: ${request.regulations.join(', ')}
- Jurisdiction: ${request.jurisdiction}
- Business Type: ${request.businessType}
- Risk Tolerance: ${request.riskTolerance}

Please analyze and provide:
1. Compliance status assessment
2. Regulatory gaps and deficiencies
3. Required actions for full compliance
4. Implementation timeline and priorities
5. Monitoring and ongoing compliance requirements
6. Cost implications and resource needs
7. Risk exposure if non-compliant
8. Recommended compliance framework

Format as a detailed compliance assessment with specific action items and deadlines.
`

    return await this.aiManager.makeRequest({
      prompt,
      type: 'compliance',
      data: request
    })
  }

  async analyzeDocument(request: DocumentAnalysisRequest): Promise<AIResponse> {
    let analysisPrompt = ''
    
    switch (request.analysisType) {
      case 'summary':
        analysisPrompt = 'Provide a comprehensive summary highlighting key terms, obligations, and important provisions.'
        break
      case 'risk':
        analysisPrompt = 'Identify potential legal risks, problematic clauses, and areas of concern with recommendations.'
        break
      case 'compliance':
        analysisPrompt = 'Analyze compliance with applicable laws and regulations, identifying any deficiencies.'
        break
      case 'terms':
        analysisPrompt = 'Extract and analyze all key terms, conditions, and obligations for each party.'
        break
      case 'redlines':
        analysisPrompt = 'Suggest specific redlines and amendments to improve terms and reduce risk.'
        break
    }

    const prompt = `
Analyze the following ${request.documentType} document:

DOCUMENT CONTENT:
${request.content}

${request.compareWith ? `COMPARE WITH: ${request.compareWith}` : ''}

ANALYSIS REQUEST: ${analysisPrompt}

Provide a detailed professional analysis including:
1. Executive summary
2. Key findings and observations
3. Specific recommendations
4. Risk assessment and mitigation
5. Next steps and action items

Format as a comprehensive legal analysis memo.
`

    return await this.aiManager.makeRequest({
      prompt,
      type: 'analysis',
      data: request
    })
  }

  async generateLegalInsights(request: LegalInsightRequest): Promise<AIResponse> {
    const prompt = `
Generate legal insights and analysis:

TYPE: ${request.type}
CONTEXT: ${request.context}
PRACTICE AREA: ${request.practiceArea}
${request.jurisdiction ? `JURISDICTION: ${request.jurisdiction}` : ''}
${request.timeframe ? `TIMEFRAME: ${request.timeframe}` : ''}

Please provide:
1. Current legal landscape analysis
2. Key trends and developments
3. Strategic recommendations
4. Risk and opportunity identification
5. Best practices and benchmarking
6. Future outlook and predictions
7. Actionable next steps

Format as a strategic legal insight report with executive summary and detailed analysis.
`

    return await this.aiManager.makeRequest({
      prompt,
      type: 'insight',
      data: request
    })
  }

  async chatWithAI(message: string, context?: string): Promise<AIResponse> {
    const prompt = context ? `${context}\n\nUser Question: ${message}` : message

    return await this.aiManager.makeRequest({
      prompt,
      type: 'chat',
      context
    })
  }

  async generateMatterInsights(matterId: string, matterData: any): Promise<AIResponse> {
    const prompt = `
Analyze the following legal matter and provide strategic insights:

MATTER ID: ${matterId}
MATTER TYPE: ${matterData.type}
STATUS: ${matterData.status}
CLIENT: ${matterData.client}
DESCRIPTION: ${matterData.description}
VALUE: $${matterData.value?.toLocaleString()}
TIMELINE: ${matterData.timeline}

Based on similar matters and current legal trends, provide:
1. Case strategy recommendations
2. Risk assessment and mitigation
3. Timeline and budget predictions
4. Settlement opportunities (if applicable)
5. Key success factors
6. Potential challenges and obstacles
7. Next steps and action items

Format as a strategic matter analysis with actionable recommendations.
`

    return await this.aiManager.makeRequest({
      prompt,
      type: 'insight',
      data: matterData
    })
  }

  async analyzeContracts(contractData: any): Promise<AIResponse> {
    const prompt = `
Analyze the contract portfolio and provide insights:

CONTRACTS ANALYZED: ${contractData.length} contracts
CONTRACT TYPES: ${[...new Set(contractData.map((c: any) => c.type))].join(', ')}
TOTAL VALUE: $${contractData.reduce((sum: number, c: any) => sum + (c.value || 0), 0).toLocaleString()}

Provide analysis on:
1. Portfolio risk assessment
2. Renewal and expiration management
3. Cost optimization opportunities
4. Compliance status overview
5. Performance metrics and KPIs
6. Vendor/counterparty analysis
7. Strategic recommendations

Format as a comprehensive contract portfolio analysis.
`

    return await this.aiManager.makeRequest({
      prompt,
      type: 'analysis',
      data: contractData
    })
  }

  async predictLitigationOutcome(litigationData: any): Promise<AIResponse> {
    const prompt = `
Analyze the litigation case and predict outcomes:

CASE: ${litigationData.title}
TYPE: ${litigationData.type}
COURT: ${litigationData.court}
AMOUNT: $${litigationData.amount?.toLocaleString()}
STAGE: ${litigationData.status}
FACTS: ${litigationData.description}

Provide predictive analysis including:
1. Likely outcome scenarios with probabilities
2. Settlement opportunity assessment
3. Timeline and cost projections
4. Key success factors and risks
5. Strategic recommendations
6. Comparable case analysis
7. Next steps for optimal positioning

Format as a litigation outcome prediction report with confidence levels.
`

    return await this.aiManager.makeRequest({
      prompt,
      type: 'insight',
      data: litigationData
    })
  }

  setAIProvider(provider: string): boolean {
    return this.aiManager.setProvider(provider)
  }

  getAvailableProviders(): string[] {
    return this.aiManager.getAvailableProviders()
  }

  getProviderStatus(): Record<string, boolean> {
    return this.aiManager.getProviderStatus()
  }
}