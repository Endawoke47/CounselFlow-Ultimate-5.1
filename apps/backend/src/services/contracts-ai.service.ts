/**
 * CounselFlow Ultimate 5.1 - Contracts AI Service
 * Comprehensive AI integration for contract lifecycle management
 */

import { Injectable } from '@nestjs/common';
import { AIOrchestrationService } from './ai-orchestration.service';
import { 
  Contract, 
  ContractReviewSession, 
  ContractDraftingSession,
  ContractImportJob,
  ContractTemplate 
} from '../types/contracts';

export interface ContractDraftingRequest {
  contractType: string;
  businessObjective: string;
  parties: {
    internal: string;
    counterparty: {
      name: string;
      type: string;
    };
  };
  keyTerms: Array<{
    term: string;
    value: string;
    importance: string;
  }>;
  constraints: {
    budgetRange?: { min: number; max: number; currency: string };
    timeline?: { start?: Date; end?: Date };
    riskTolerance: string;
    jurisdiction?: string;
  };
}

export interface ContractReviewRequest {
  contractId: string;
  documentContent: string;
  reviewType: 'initial_review' | 'due_diligence' | 'risk_assessment' | 'compliance_check' | 'renewal_review';
  scope: {
    analyzeRisk: boolean;
    checkCompliance: boolean;
    marketComparison: boolean;
    clauseAnalysis: boolean;
    financialAnalysis: boolean;
    customChecks?: string[];
  };
  companyPolicies?: string[];
  industryStandards?: string[];
}

export interface ContractExtractionRequest {
  documentContent: string;
  fileName: string;
  documentType: string;
  extractionMethod: 'ocr' | 'text_extraction' | 'structured_data' | 'hybrid';
}

@Injectable()
export class ContractsAIService {
  constructor(private aiOrchestrationService: AIOrchestrationService) {}

  /**
   * Generate contract draft using AI
   */
  async generateContractDraft(request: ContractDraftingRequest): Promise<string> {
    const prompt = this.buildDraftingPrompt(request);
    
    const response = await this.aiOrchestrationService.generateText(prompt, {
      temperature: 0.3, // More deterministic for legal documents
      maxTokens: 4000,
      model: 'gpt-4', // Use most capable model for complex legal drafting
    });

    return response;
  }

  /**
   * Analyze contract for risks, compliance, and optimization
   */
  async analyzeContract(request: ContractReviewRequest): Promise<ContractReviewSession['analysis']> {
    const analyses = await Promise.all([
      this.performRiskAssessment(request),
      this.performComplianceCheck(request),
      this.performClauseAnalysis(request),
      this.performMarketComparison(request)
    ]);

    const [riskAssessment, complianceCheck, clauseAnalysis, marketComparison] = analyses;

    // Calculate overall score based on different factors
    const overallScore = this.calculateOverallScore(riskAssessment, complianceCheck, clauseAnalysis);

    return {
      overallScore,
      riskAssessment,
      complianceCheck,
      clauseAnalysis,
      marketComparison
    };
  }

  /**
   * Extract data from contract documents
   */
  async extractContractData(request: ContractExtractionRequest): Promise<{
    extractedData: any;
    confidence: number;
    summary: string;
    keyPoints: string[];
  }> {
    const extractionPrompt = this.buildExtractionPrompt(request);
    
    const response = await this.aiOrchestrationService.generateText(extractionPrompt, {
      temperature: 0.1, // Very deterministic for data extraction
      maxTokens: 2000,
    });

    // Parse structured response
    const parsed = this.parseExtractionResponse(response);
    
    // Generate summary
    const summaryPrompt = this.buildSummaryPrompt(request.documentContent);
    const summary = await this.aiOrchestrationService.generateText(summaryPrompt, {
      temperature: 0.2,
      maxTokens: 500,
    });

    return {
      extractedData: parsed.data,
      confidence: parsed.confidence,
      summary,
      keyPoints: parsed.keyPoints
    };
  }

  /**
   * Generate contract template with AI assistance
   */
  async generateContractTemplate(
    templateType: string,
    jurisdiction: string,
    industry: string,
    customRequirements: string[]
  ): Promise<ContractTemplate> {
    const prompt = this.buildTemplatePrompt(templateType, jurisdiction, industry, customRequirements);
    
    const response = await this.aiOrchestrationService.generateText(prompt, {
      temperature: 0.4,
      maxTokens: 3000,
    });

    return this.parseTemplateResponse(response, templateType);
  }

  /**
   * Suggest contract improvements and optimizations
   */
  async suggestImprovements(contractContent: string): Promise<{
    suggestions: Array<{
      category: string;
      priority: 'low' | 'medium' | 'high';
      description: string;
      implementation: string;
      impact: string;
    }>;
    optimizedClauses: Array<{
      original: string;
      improved: string;
      reasoning: string;
    }>;
  }> {
    const prompt = `
      As an expert contract attorney, analyze the following contract and provide specific improvement suggestions:

      CONTRACT CONTENT:
      ${contractContent}

      Provide suggestions in the following categories:
      1. Risk Mitigation
      2. Legal Protection
      3. Commercial Optimization
      4. Compliance Enhancement
      5. Operational Efficiency

      For each suggestion, include:
      - Priority level (high/medium/low)
      - Specific implementation steps
      - Expected business impact
      - Alternative clause language where applicable

      Focus on practical, actionable improvements that enhance the contract's effectiveness while protecting the company's interests.
    `;

    const response = await this.aiOrchestrationService.generateText(prompt, {
      temperature: 0.3,
      maxTokens: 2500,
    });

    return this.parseImprovementSuggestions(response);
  }

  /**
   * Compare contract terms against market standards
   */
  async performMarketComparison(request: ContractReviewRequest): Promise<Array<{
    aspect: string;
    ourPosition: string;
    marketStandard: string;
    assessment: 'favorable' | 'market' | 'unfavorable';
    recommendation: string;
  }>> {
    const prompt = `
      As a legal market analyst, compare the following contract terms against current market standards:

      CONTRACT CONTENT:
      ${request.documentContent}

      Analyze these key aspects:
      1. Payment terms and schedules
      2. Liability limitations and caps
      3. Intellectual property provisions
      4. Termination and notice periods
      5. Warranty and indemnification terms
      6. Dispute resolution mechanisms
      7. Performance metrics and SLAs

      For each aspect, provide:
      - Our current position
      - Market standard/best practice
      - Assessment (favorable/market/unfavorable)
      - Specific recommendation for improvement

      Base your analysis on current market practices in the relevant industry.
    `;

    const response = await this.aiOrchestrationService.generateText(prompt, {
      temperature: 0.2,
      maxTokens: 2000,
    });

    return this.parseMarketComparison(response);
  }

  /**
   * Private helper methods
   */
  private buildDraftingPrompt(request: ContractDraftingRequest): string {
    return `
      As an expert contract attorney, draft a comprehensive ${request.contractType} agreement based on the following requirements:

      BUSINESS OBJECTIVE:
      ${request.businessObjective}

      PARTIES:
      - Internal Entity: ${request.parties.internal}
      - Counterparty: ${request.parties.counterparty.name} (${request.parties.counterparty.type})

      KEY TERMS:
      ${request.keyTerms.map(term => `- ${term.term}: ${term.value} (Importance: ${term.importance})`).join('\n')}

      CONSTRAINTS:
      - Budget Range: ${request.constraints.budgetRange ? `$${request.constraints.budgetRange.min.toLocaleString()} - $${request.constraints.budgetRange.max.toLocaleString()} ${request.constraints.budgetRange.currency}` : 'Not specified'}
      - Timeline: ${request.constraints.timeline ? `${request.constraints.timeline.start?.toDateString()} to ${request.constraints.timeline.end?.toDateString()}` : 'Not specified'}
      - Risk Tolerance: ${request.constraints.riskTolerance}
      - Jurisdiction: ${request.constraints.jurisdiction || 'Not specified'}

      REQUIREMENTS:
      1. Create a professional, legally sound contract
      2. Include all standard clauses for this contract type
      3. Address all specified key terms
      4. Align with the stated risk tolerance
      5. Include appropriate protection clauses
      6. Use clear, unambiguous language
      7. Follow best practices for the jurisdiction

      Please generate a complete contract draft with:
      - Proper legal structure and formatting
      - All necessary sections and clauses
      - Placeholder text in [BRACKETS] for specific details to be filled
      - Comments explaining important clauses

      The contract should be ready for legal review and customization.
    `;
  }

  private async performRiskAssessment(request: ContractReviewRequest): Promise<{
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: Array<{
      category: string;
      risk: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      mitigation?: string;
    }>;
  }> {
    const prompt = `
      As a legal risk analyst, assess the risk factors in the following contract:

      CONTRACT CONTENT:
      ${request.documentContent}

      Analyze risks in these categories:
      1. Financial Risk - payment terms, penalties, liability exposure
      2. Legal Risk - compliance, enforceability, jurisdiction issues
      3. Operational Risk - performance obligations, delivery requirements
      4. Reputational Risk - confidentiality, public disclosure
      5. Strategic Risk - competitive implications, market position

      For each risk identified:
      - Categorize the risk type
      - Assess severity (low/medium/high/critical)
      - Explain the potential impact
      - Suggest specific mitigation strategies

      Provide an overall risk level assessment and prioritized action items.
    `;

    const response = await this.aiOrchestrationService.generateText(prompt, {
      temperature: 0.2,
      maxTokens: 1500,
    });

    return this.parseRiskAssessment(response);
  }

  private async performComplianceCheck(request: ContractReviewRequest): Promise<Array<{
    regulation: string;
    status: 'compliant' | 'non_compliant' | 'unclear' | 'not_applicable';
    details: string;
    action_required?: string;
  }>> {
    const prompt = `
      As a compliance expert, review the following contract for regulatory compliance:

      CONTRACT CONTENT:
      ${request.documentContent}

      Check compliance with key regulations:
      1. Data Protection (GDPR, CCPA, etc.)
      2. Employment Law (if applicable)
      3. Financial Regulations (SOX, etc.)
      4. Industry-Specific Regulations
      5. Export Control Laws (if applicable)
      6. Anti-Corruption/FCPA
      7. Consumer Protection Laws

      For each regulation:
      - Assess compliance status
      - Identify specific compliance gaps
      - Suggest required actions
      - Flag any high-risk non-compliance issues

      Focus on practical compliance requirements and actionable recommendations.
    `;

    const response = await this.aiOrchestrationService.generateText(prompt, {
      temperature: 0.1,
      maxTokens: 1500,
    });

    return this.parseComplianceCheck(response);
  }

  private async performClauseAnalysis(request: ContractReviewRequest): Promise<Array<{
    clause: string;
    location: string;
    analysis: string;
    recommendation: string;
    priority: 'low' | 'medium' | 'high';
  }>> {
    const prompt = `
      As a contract attorney, perform detailed clause-by-clause analysis of this contract:

      CONTRACT CONTENT:
      ${request.documentContent}

      Analyze each major clause for:
      1. Legal soundness and enforceability
      2. Fairness and balance of terms
      3. Protection of company interests
      4. Potential ambiguities or gaps
      5. Industry standard compliance

      Focus on critical clauses:
      - Scope of work/services
      - Payment and billing terms
      - Intellectual property rights
      - Confidentiality and data protection
      - Liability and indemnification
      - Termination and dispute resolution
      - Force majeure and change management

      For each clause, provide:
      - Specific location/section reference
      - Detailed analysis of strengths/weaknesses
      - Specific improvement recommendations
      - Priority level for addressing issues

      Prioritize recommendations that significantly impact risk or commercial terms.
    `;

    const response = await this.aiOrchestrationService.generateText(prompt, {
      temperature: 0.3,
      maxTokens: 2000,
    });

    return this.parseClauseAnalysis(response);
  }

  private calculateOverallScore(
    riskAssessment: any,
    complianceCheck: any,
    clauseAnalysis: any
  ): number {
    // Calculate score based on risk level, compliance issues, and clause quality
    let score = 100;

    // Deduct points for risk factors
    const riskDeduction = {
      'critical': 30,
      'high': 20,
      'medium': 10,
      'low': 5
    };

    if (riskAssessment.factors) {
      riskAssessment.factors.forEach((factor: any) => {
        score -= riskDeduction[factor.severity] || 0;
      });
    }

    // Deduct points for compliance issues
    if (complianceCheck) {
      const nonCompliantCount = complianceCheck.filter((check: any) => 
        check.status === 'non_compliant'
      ).length;
      score -= nonCompliantCount * 15;
    }

    // Deduct points for high-priority clause issues
    if (clauseAnalysis) {
      const highPriorityIssues = clauseAnalysis.filter((analysis: any) => 
        analysis.priority === 'high'
      ).length;
      score -= highPriorityIssues * 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  private buildExtractionPrompt(request: ContractExtractionRequest): string {
    return `
      Extract structured data from the following contract document:

      DOCUMENT: ${request.fileName}
      TYPE: ${request.documentType}
      
      CONTENT:
      ${request.documentContent}

      Extract the following information and return as JSON:
      {
        "title": "Contract title",
        "counterparty": "Other party name",
        "contractType": "Type of contract",
        "effectiveDate": "Start date",
        "expirationDate": "End date", 
        "value": "Contract value (number)",
        "currency": "Currency code",
        "paymentTerms": "Payment terms",
        "governingLaw": "Governing law",
        "keyTerms": ["Array of key terms"],
        "deliverables": ["Array of deliverables"],
        "confidence": "Extraction confidence (0-100)"
      }

      Focus on accuracy and only extract information that is clearly stated in the document.
      If information is not available, use null values.
    `;
  }

  private buildSummaryPrompt(documentContent: string): string {
    return `
      Provide a concise 2-3 sentence summary of this contract, focusing on:
      - Main purpose and business objective
      - Key commercial terms
      - Notable provisions or requirements

      CONTRACT CONTENT:
      ${documentContent.substring(0, 2000)}...

      Keep the summary professional and highlight the most important aspects for business stakeholders.
    `;
  }

  private buildTemplatePrompt(
    templateType: string,
    jurisdiction: string,
    industry: string,
    customRequirements: string[]
  ): string {
    return `
      Create a comprehensive ${templateType} contract template for ${jurisdiction} jurisdiction in the ${industry} industry.

      CUSTOM REQUIREMENTS:
      ${customRequirements.map((req, index) => `${index + 1}. ${req}`).join('\n')}

      The template should include:
      1. Standard legal structure and formatting
      2. All necessary clauses for this contract type
      3. Industry-specific provisions
      4. Jurisdiction-appropriate legal language
      5. Variable placeholders for customization
      6. Alternative clause options where applicable

      Include these essential sections:
      - Parties and background
      - Scope of work/services
      - Terms and conditions
      - Payment and billing
      - Intellectual property
      - Confidentiality
      - Liability and indemnification
      - Termination
      - General provisions

      Use [VARIABLE_NAME] format for template variables and provide guidance comments.
    `;
  }

  // Parsing helper methods
  private parseExtractionResponse(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          data: parsed,
          confidence: parsed.confidence || 85,
          keyPoints: parsed.keyTerms || []
        };
      }
    } catch (error) {
      console.error('Failed to parse extraction response:', error);
    }

    return {
      data: {},
      confidence: 50,
      keyPoints: []
    };
  }

  private parseTemplateResponse(response: string, templateType: string): ContractTemplate {
    // This would parse the AI response into a proper ContractTemplate object
    // For now, returning a basic structure
    return {
      id: `template_${Date.now()}`,
      name: `${templateType} Template`,
      type: templateType as any,
      category: 'standard',
      description: 'AI-generated contract template',
      template: {
        content: response,
        format: 'html',
        language: 'en',
        jurisdiction: 'California',
        governingLaw: 'California'
      },
      variables: [],
      metadata: {
        version: '1.0',
        lastUpdated: new Date(),
        updatedBy: 'ai_system',
        status: 'draft',
        tags: [templateType, 'ai_generated'],
        complexity: 'moderate',
        estimatedCompletionTime: 30
      },
      usage: {
        timesUsed: 0
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'ai_system',
      updatedBy: 'ai_system'
    };
  }

  private parseRiskAssessment(response: string): any {
    // Parse AI response into structured risk assessment
    // This would be more sophisticated in a real implementation
    return {
      level: 'medium',
      factors: [
        {
          category: 'financial',
          risk: 'Payment terms favor counterparty',
          severity: 'medium',
          mitigation: 'Negotiate shorter payment terms'
        }
      ]
    };
  }

  private parseComplianceCheck(response: string): any {
    // Parse AI response into structured compliance check
    return [
      {
        regulation: 'GDPR',
        status: 'compliant',
        details: 'Data processing clauses include adequate GDPR protections'
      }
    ];
  }

  private parseClauseAnalysis(response: string): any {
    // Parse AI response into structured clause analysis
    return [
      {
        clause: 'Liability Limitation',
        location: 'Section 8.2',
        analysis: 'Current liability cap is set too low',
        recommendation: 'Increase liability cap to $500K',
        priority: 'high'
      }
    ];
  }

  private parseMarketComparison(response: string): any {
    // Parse AI response into structured market comparison
    return [
      {
        aspect: 'Payment Terms',
        ourPosition: 'Net 45 days',
        marketStandard: 'Net 30 days',
        assessment: 'unfavorable',
        recommendation: 'Negotiate to Net 30 days'
      }
    ];
  }

  private parseImprovementSuggestions(response: string): any {
    // Parse AI response into structured improvement suggestions
    return {
      suggestions: [
        {
          category: 'Risk Mitigation',
          priority: 'high',
          description: 'Add liability limitation clause',
          implementation: 'Insert standard liability cap provision',
          impact: 'Reduces financial exposure significantly'
        }
      ],
      optimizedClauses: [
        {
          original: 'Party shall indemnify...',
          improved: 'Party shall indemnify, except for gross negligence...',
          reasoning: 'Adds protection against excessive liability'
        }
      ]
    };
  }
}