import { toast } from 'react-hot-toast'

export interface AnalysisRequest {
  fileId: string
  fileName: string
  fileType: string
  analysisType: AnalysisType
  file: File
}

export interface AnalysisResult {
  id: string
  fileId: string
  type: AnalysisType
  status: 'pending' | 'processing' | 'completed' | 'error'
  result?: any
  error?: string
  downloadUrl?: string
  createdAt: Date
  completedAt?: Date
}

export type AnalysisType = 
  | 'summary' 
  | 'risk-assessment' 
  | 'key-terms' 
  | 'compliance-check' 
  | 'contract-review'
  | 'legal-research'
  | 'redaction'

class DocumentAnalysisService {
  private baseUrl = '/api/document-analysis'
  private analyses = new Map<string, AnalysisResult>()

  async uploadAndAnalyze(request: AnalysisRequest): Promise<AnalysisResult> {
    const analysisId = `${request.fileId}-${request.analysisType}-${Date.now()}`
    
    // Create initial analysis record
    const analysis: AnalysisResult = {
      id: analysisId,
      fileId: request.fileId,
      type: request.analysisType,
      status: 'pending',
      createdAt: new Date()
    }

    this.analyses.set(analysisId, analysis)

    try {
      // Upload file first
      const uploadResult = await this.uploadFile(request.file)
      
      // Start analysis
      const analysisResult = await this.startAnalysis({
        ...request,
        uploadUrl: uploadResult.url
      })

      return analysisResult
    } catch (error) {
      const failedAnalysis = {
        ...analysis,
        status: 'error' as const,
        error: error instanceof Error ? error.message : 'Analysis failed'
      }
      
      this.analyses.set(analysisId, failedAnalysis)
      throw error
    }
  }

  private async uploadFile(file: File): Promise<{ url: string; id: string }> {
    // In a real implementation, this would upload to your backend/cloud storage
    // For now, we'll simulate the upload
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          const url = URL.createObjectURL(file)
          resolve({ url, id: `upload-${Date.now()}` })
        } else {
          reject(new Error('File upload failed'))
        }
      }, 1000 + Math.random() * 2000)
    })
  }

  private async startAnalysis(request: AnalysisRequest & { uploadUrl: string }): Promise<AnalysisResult> {
    const analysisId = `${request.fileId}-${request.analysisType}-${Date.now()}`
    
    // Update status to processing
    const analysis = this.analyses.get(analysisId) || {
      id: analysisId,
      fileId: request.fileId,
      type: request.analysisType,
      status: 'processing' as const,
      createdAt: new Date()
    }

    analysis.status = 'processing'
    this.analyses.set(analysisId, analysis)

    try {
      // Simulate AI analysis processing
      const result = await this.processAnalysis(request)
      
      const completedAnalysis: AnalysisResult = {
        ...analysis,
        status: 'completed',
        result: result.data,
        downloadUrl: result.downloadUrl,
        completedAt: new Date()
      }

      this.analyses.set(analysisId, completedAnalysis)
      return completedAnalysis

    } catch (error) {
      const failedAnalysis: AnalysisResult = {
        ...analysis,
        status: 'error',
        error: error instanceof Error ? error.message : 'Analysis processing failed'
      }

      this.analyses.set(analysisId, failedAnalysis)
      throw error
    }
  }

  private async processAnalysis(request: AnalysisRequest & { uploadUrl: string }): Promise<{
    data: any
    downloadUrl: string
  }> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 5000))

    const analysisData = this.generateAnalysisResult(request.analysisType, request.fileName)
    const downloadUrl = this.generateDownloadUrl(analysisData, request.analysisType, request.fileName)

    return { data: analysisData, downloadUrl }
  }

  private generateAnalysisResult(type: AnalysisType, fileName: string): any {
    const baseData = {
      fileName,
      processedAt: new Date().toISOString(),
      confidence: 0.85 + Math.random() * 0.15
    }

    switch (type) {
      case 'summary':
        return {
          ...baseData,
          summary: 'This document outlines a comprehensive legal agreement between the parties, establishing clear terms for service delivery, payment obligations, and termination conditions. Key provisions include liability limitations, intellectual property rights, and dispute resolution mechanisms.',
          keyPoints: [
            'Contract duration: 24 months with automatic renewal clause',
            'Payment terms: Net 30 days with 2% early payment discount',
            'Termination clause: 60-day notice period required',
            'Liability cap: Limited to 12 months of fees paid',
            'Governing law: Delaware state law applies'
          ],
          wordCount: 1250,
          pages: 5,
          readingTime: '4-6 minutes',
          complexity: 'Medium',
          legalRisk: 'Low to Medium'
        }

      case 'risk-assessment':
        return {
          ...baseData,
          overallRisk: 'Medium',
          riskScore: 6.2,
          risks: [
            {
              category: 'Liability',
              level: 'High',
              severity: 8.5,
              description: 'Unlimited liability clause present in section 12.3',
              recommendation: 'Negotiate liability cap not exceeding 12 months of fees',
              impact: 'Could expose organization to significant financial risk'
            },
            {
              category: 'Termination',
              level: 'Medium',
              severity: 5.5,
              description: 'Complex termination procedures may delay exit',
              recommendation: 'Simplify termination process and reduce notice period',
              impact: 'May increase costs and complexity during contract exit'
            },
            {
              category: 'Payment Terms',
              level: 'Low',
              severity: 2.5,
              description: 'Standard payment terms with reasonable conditions',
              recommendation: 'Consider negotiating early payment discounts',
              impact: 'Minimal risk with potential for cost savings'
            },
            {
              category: 'Intellectual Property',
              level: 'Medium',
              severity: 6.0,
              description: 'Unclear ownership of derivative works',
              recommendation: 'Clarify IP ownership and licensing terms',
              impact: 'Potential disputes over work product ownership'
            }
          ],
          recommendations: [
            'Implement liability cap provisions',
            'Clarify intellectual property ownership',
            'Simplify termination procedures',
            'Add force majeure clause',
            'Review indemnification terms'
          ],
          compliance: {
            gdpr: 'Compliant',
            hipaa: 'Not Applicable',
            sox: 'Requires Review'
          }
        }

      case 'key-terms':
        return {
          ...baseData,
          parties: [
            { name: 'ABC Corporation', role: 'Service Provider', jurisdiction: 'Delaware' },
            { name: 'XYZ Industries Ltd.', role: 'Client', jurisdiction: 'New York' }
          ],
          financialTerms: {
            totalValue: '$250,000',
            paymentSchedule: 'Monthly',
            paymentTerms: 'Net 30',
            penalties: 'Late payment: 1.5% per month',
            currency: 'USD'
          },
          importantDates: [
            { type: 'Effective Date', date: '2024-01-15', description: 'Contract commencement' },
            { type: 'Initial Delivery', date: '2024-02-15', description: 'First milestone delivery' },
            { type: 'Review Period', date: '2024-07-15', description: 'Mid-term performance review' },
            { type: 'Expiration Date', date: '2026-01-15', description: 'Contract end date' },
            { type: 'Renewal Notice', date: '2025-10-15', description: 'Deadline for renewal notice' }
          ],
          obligations: {
            serviceProvider: [
              'Deliver services per statement of work',
              'Maintain professional liability insurance',
              'Provide monthly progress reports',
              'Ensure data security compliance'
            ],
            client: [
              'Provide timely feedback and approvals',
              'Make payments according to schedule',
              'Provide necessary access and resources',
              'Maintain confidentiality of proprietary information'
            ]
          },
          keyTerms: [
            'Service Level Agreement: 99.5% uptime',
            'Confidentiality period: 5 years post-termination',
            'Non-compete restriction: 12 months',
            'Limitation of liability: Fees paid in preceding 12 months'
          ]
        }

      case 'compliance-check':
        return {
          ...baseData,
          overallCompliance: 'Partially Compliant',
          complianceScore: 78,
          frameworks: [
            {
              name: 'GDPR',
              status: 'Compliant',
              score: 95,
              issues: [],
              recommendations: ['Consider adding data processing addendum']
            },
            {
              name: 'SOX',
              status: 'Requires Review',
              score: 65,
              issues: [
                'Missing internal controls documentation',
                'Insufficient audit trail requirements'
              ],
              recommendations: [
                'Add internal controls section',
                'Include audit trail provisions',
                'Define record retention policies'
              ]
            },
            {
              name: 'Industry Standards',
              status: 'Compliant',
              score: 88,
              issues: ['Minor formatting inconsistencies'],
              recommendations: ['Standardize clause numbering']
            }
          ],
          criticalIssues: [
            'Missing required clause 4.2 (Data Protection)',
            'Incomplete jurisdiction specification in section 15'
          ],
          passedChecks: [
            'Privacy requirements adequately addressed',
            'Industry standards compliance verified',
            'Standard legal provisions present',
            'Termination clauses properly structured'
          ],
          actionItems: [
            'Add missing data protection clause',
            'Clarify governing jurisdiction',
            'Review audit trail requirements',
            'Update compliance certification references'
          ]
        }

      case 'contract-review':
        return {
          ...baseData,
          reviewSummary: 'Standard commercial agreement with several areas requiring attention',
          strengths: [
            'Clear service specifications',
            'Well-defined payment terms',
            'Appropriate confidentiality provisions',
            'Reasonable termination clauses'
          ],
          concerns: [
            'Unlimited liability exposure',
            'Broad indemnification obligations',
            'Unclear intellectual property ownership',
            'Complex dispute resolution process'
          ],
          redFlags: [
            'Automatic renewal without notice requirement',
            'One-sided termination rights',
            'Excessive penalty clauses'
          ],
          negotiationPriorities: [
            'High: Liability limitation and caps',
            'High: Intellectual property clarification',
            'Medium: Termination process simplification',
            'Medium: Payment terms optimization',
            'Low: Administrative process improvements'
          ],
          recommendations: {
            accept: ['Standard payment terms', 'Confidentiality provisions'],
            negotiate: ['Liability clauses', 'IP ownership terms', 'Termination procedures'],
            reject: ['Unlimited liability', 'Automatic renewal without notice']
          }
        }

      case 'legal-research':
        return {
          ...baseData,
          researchSummary: 'Comprehensive analysis of relevant legal precedents and statutory requirements',
          relevantLaws: [
            {
              jurisdiction: 'Delaware',
              statute: 'Delaware General Corporation Law § 102(b)(7)',
              relevance: 'Director liability limitations',
              impact: 'High'
            },
            {
              jurisdiction: 'Federal',
              statute: 'Uniform Commercial Code § 2-719',
              relevance: 'Limitation of damages',
              impact: 'Medium'
            }
          ],
          caseLaw: [
            {
              case: 'Smith v. Johnson Corp.',
              citation: '123 F.3d 456 (3d Cir. 2020)',
              relevance: 'Liability limitation enforceability',
              outcome: 'Favorable precedent for liability caps'
            },
            {
              case: 'ABC Inc. v. XYZ Ltd.',
              citation: '789 Del. 123 (2019)',
              relevance: 'Contract interpretation principles',
              outcome: 'Supports clear terms requirement'
            }
          ],
          regulations: [
            'SEC Regulation S-K Item 103 (Legal Proceedings)',
            'FTC Guidelines on Commercial Practices',
            'State Consumer Protection Laws'
          ],
          riskAnalysis: {
            enforceability: 'High likelihood of enforcement',
            jurisdictionalRisks: 'Low risk given Delaware choice of law',
            regulatoryCompliance: 'Requires minor adjustments'
          }
        }

      case 'redaction':
        return {
          ...baseData,
          redactionSummary: 'Identified and marked sensitive information for protection',
          sensitiveDataFound: {
            personalInfo: {
              count: 5,
              types: ['SSN', 'Phone Numbers', 'Email Addresses'],
              locations: ['Page 2, Section 3', 'Appendix A']
            },
            financialData: {
              count: 8,
              types: ['Account Numbers', 'Credit Card Info', 'Banking Details'],
              locations: ['Page 4, Payment Section', 'Schedule B']
            },
            confidentialInfo: {
              count: 12,
              types: ['Trade Secrets', 'Client Lists', 'Proprietary Methods'],
              locations: ['Throughout document', 'Exhibits C-F']
            }
          },
          redactionStats: {
            totalRedactions: 25,
            pagesAffected: 8,
            redactionPercentage: 15.5,
            confidenceLevel: 94.2
          },
          downloadOptions: [
            'Fully redacted version',
            'Redaction report only',
            'Side-by-side comparison'
          ]
        }

      default:
        return {
          ...baseData,
          analysis: 'Analysis completed successfully',
          status: 'Processed'
        }
    }
  }

  private generateDownloadUrl(analysisData: any, type: AnalysisType, fileName: string): string {
    // Generate downloadable report
    const report = {
      metadata: {
        fileName,
        analysisType: type,
        generatedAt: new Date().toISOString(),
        version: '1.0'
      },
      analysis: analysisData,
      disclaimer: 'This analysis is generated by AI and should be reviewed by legal professionals.'
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { 
      type: 'application/json' 
    })
    
    return URL.createObjectURL(blob)
  }

  async getAnalysis(analysisId: string): Promise<AnalysisResult | null> {
    return this.analyses.get(analysisId) || null
  }

  async getAnalysesByFile(fileId: string): Promise<AnalysisResult[]> {
    return Array.from(this.analyses.values()).filter(
      analysis => analysis.fileId === fileId
    )
  }

  async downloadAnalysisReport(analysisId: string): Promise<void> {
    const analysis = this.analyses.get(analysisId)
    if (!analysis || !analysis.downloadUrl) {
      throw new Error('Analysis report not available')
    }

    const link = document.createElement('a')
    link.href = analysis.downloadUrl
    link.download = `${analysis.type}-analysis-${analysis.fileId}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Cleanup method to revoke object URLs
  cleanup(): void {
    this.analyses.forEach(analysis => {
      if (analysis.downloadUrl && analysis.downloadUrl.startsWith('blob:')) {
        URL.revokeObjectURL(analysis.downloadUrl)
      }
    })
    this.analyses.clear()
  }
}

export const documentAnalysisService = new DocumentAnalysisService()