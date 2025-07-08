/**
 * CounselFlow Ultimate 5.1 - Entity AI Service
 * AI-powered analytics and insights for entity management
 */

import { Injectable, Logger } from '@nestjs/common';
import { AIOrchestrationService } from './ai-orchestrator.service';
import { Entity, EntitySummary } from '../types/entity.types';

export interface EntityRiskAssessment {
  entityId: string;
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: {
    category: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    recommendation: string;
  }[];
  complianceGaps: {
    requirement: string;
    status: 'missing' | 'outdated' | 'incomplete';
    urgency: 'low' | 'medium' | 'high';
    action: string;
  }[];
  governanceRecommendations: {
    area: string;
    recommendation: string;
    priority: 'low' | 'medium' | 'high';
    timeline: string;
  }[];
}

export interface EntityInsights {
  summary: string;
  keyMetrics: {
    metric: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
    significance: string;
  }[];
  strategicRecommendations: string[];
  complianceAlerts: {
    entity: string;
    alert: string;
    severity: 'info' | 'warning' | 'critical';
    dueDate?: Date;
  }[];
}

@Injectable()
export class EntityAIService {
  private readonly logger = new Logger(EntityAIService.name);

  constructor(
    private readonly aiOrchestrationService: AIOrchestrationService
  ) {}

  async assessEntityRisk(entity: Entity): Promise<EntityRiskAssessment> {
    try {
      this.logger.log(`Assessing risk for entity: ${entity.id}`);

      const prompt = `
        Analyze the following entity data and provide a comprehensive risk assessment:
        
        Entity: ${entity.name} (${entity.legalName})
        Industry: ${entity.industry}
        Jurisdiction: ${entity.jurisdiction}
        Incorporation Date: ${entity.incorporationDate}
        Status: ${entity.status}
        Compliance Status: ${entity.complianceStatus}
        
        Shareholders: ${entity.shareholders?.length || 0} shareholders
        Directors: ${entity.directors?.length || 0} directors
        Board Meeting Frequency: ${entity.meetingFrequency}
        Last Filing: ${entity.lastFilingDate || 'Unknown'}
        Next Filing Due: ${entity.nextFilingDue || 'Unknown'}
        
        Provide analysis in JSON format with:
        1. Risk score (0-100)
        2. Risk level (low/medium/high/critical)
        3. Specific risk factors with categories, descriptions, severity, and recommendations
        4. Compliance gaps with requirements, status, urgency, and actions
        5. Governance recommendations with areas, recommendations, priority, and timelines
        
        Focus on:
        - Corporate governance standards
        - Regulatory compliance requirements
        - Operational risks
        - Financial reporting obligations
        - Board composition and effectiveness
        - Shareholder structure risks
      `;

      const response = await this.aiOrchestrationService.generateText(prompt, {
        temperature: 0.1,
        maxTokens: 2000
      });

      let riskAssessment: any;
      try {
        riskAssessment = JSON.parse(response.content);
      } catch (e) {
        // Fallback to structured response
        riskAssessment = this.generateFallbackRiskAssessment(entity);
      }

      return {
        entityId: entity.id,
        riskScore: riskAssessment.riskScore || this.calculateRiskScore(entity),
        riskLevel: riskAssessment.riskLevel || this.determineRiskLevel(entity),
        riskFactors: riskAssessment.riskFactors || [],
        complianceGaps: riskAssessment.complianceGaps || [],
        governanceRecommendations: riskAssessment.governanceRecommendations || []
      };

    } catch (error) {
      this.logger.error('Risk assessment failed', error);
      return this.generateFallbackRiskAssessment(entity);
    }
  }

  async generateEntityInsights(entities: Entity[]): Promise<EntityInsights> {
    try {
      this.logger.log(`Generating insights for ${entities.length} entities`);

      const summary = this.generateEntitySummary(entities);
      
      const prompt = `
        Based on the following entity portfolio data, provide strategic insights:
        
        Total Entities: ${entities.length}
        Industries: ${Array.from(new Set(entities.map(e => e.industry))).join(', ')}
        Jurisdictions: ${Array.from(new Set(entities.map(e => e.jurisdiction))).join(', ')}
        
        Compliance Status Distribution:
        - Compliant: ${entities.filter(e => e.complianceStatus === 'compliant').length}
        - Warning: ${entities.filter(e => e.complianceStatus === 'warning').length}
        - Non-compliant: ${entities.filter(e => e.complianceStatus === 'non_compliant').length}
        
        Status Distribution:
        - Active: ${entities.filter(e => e.status === 'active').length}
        - Dormant: ${entities.filter(e => e.status === 'dormant').length}
        - Other: ${entities.filter(e => !['active', 'dormant'].includes(e.status)).length}
        
        Provide insights in JSON format with:
        1. Executive summary
        2. Key metrics with values, trends, and significance
        3. Strategic recommendations
        4. Compliance alerts with entity names, alerts, severity, and due dates
        
        Focus on:
        - Portfolio optimization opportunities
        - Risk concentration areas
        - Compliance trends and patterns
        - Governance improvement areas
        - Cost optimization possibilities
        - Strategic restructuring opportunities
      `;

      const response = await this.aiOrchestrationService.generateText(prompt, {
        temperature: 0.2,
        maxTokens: 2000
      });

      let insights: any;
      try {
        insights = JSON.parse(response.content);
      } catch (e) {
        insights = this.generateFallbackInsights(entities);
      }

      return {
        summary: insights.summary || 'AI-generated insights are currently unavailable.',
        keyMetrics: insights.keyMetrics || [],
        strategicRecommendations: insights.strategicRecommendations || [],
        complianceAlerts: insights.complianceAlerts || []
      };

    } catch (error) {
      this.logger.error('Insights generation failed', error);
      return this.generateFallbackInsights(entities);
    }
  }

  async analyzeGovernanceStructure(entity: Entity): Promise<{
    score: number;
    recommendations: string[];
    boardComposition: {
      assessment: string;
      recommendations: string[];
    };
    shareholderStructure: {
      assessment: string;
      risks: string[];
    };
  }> {
    try {
      const prompt = `
        Analyze the governance structure of this entity:
        
        Entity: ${entity.name}
        Directors: ${entity.directors?.length || 0}
        Board Composition: ${entity.directors?.map(d => `${d.name} (${d.type})`).join(', ') || 'No directors listed'}
        Shareholders: ${entity.shareholders?.length || 0}
        Ownership Structure: ${entity.shareholders?.map(s => `${s.name}: ${s.shareholding}%`).join(', ') || 'No shareholders listed'}
        Meeting Frequency: ${entity.meetingFrequency}
        
        Provide governance analysis focusing on:
        1. Board independence and composition
        2. Ownership concentration risks
        3. Decision-making processes
        4. Compliance with best practices
        5. Recommendations for improvement
      `;

      const response = await this.aiOrchestrationService.generateText(prompt, {
        temperature: 0.1,
        maxTokens: 1500
      });

      // Parse and structure the response
      return {
        score: this.calculateGovernanceScore(entity),
        recommendations: this.extractRecommendations(response.content),
        boardComposition: {
          assessment: this.assessBoardComposition(entity),
          recommendations: this.getBoardRecommendations(entity)
        },
        shareholderStructure: {
          assessment: this.assessShareholderStructure(entity),
          risks: this.identifyShareholderRisks(entity)
        }
      };

    } catch (error) {
      this.logger.error('Governance analysis failed', error);
      return this.generateFallbackGovernanceAnalysis(entity);
    }
  }

  private generateFallbackRiskAssessment(entity: Entity): EntityRiskAssessment {
    const riskScore = this.calculateRiskScore(entity);
    const riskLevel = this.determineRiskLevel(entity);

    return {
      entityId: entity.id,
      riskScore,
      riskLevel,
      riskFactors: [
        {
          category: 'Compliance',
          description: `Entity compliance status: ${entity.complianceStatus}`,
          severity: entity.complianceStatus === 'non_compliant' ? 'high' : 
                   entity.complianceStatus === 'warning' ? 'medium' : 'low',
          recommendation: entity.complianceStatus !== 'compliant' ? 
                          'Review and address compliance gaps immediately' : 
                          'Maintain current compliance standards'
        }
      ],
      complianceGaps: [],
      governanceRecommendations: []
    };
  }

  private generateFallbackInsights(entities: Entity[]): EntityInsights {
    return {
      summary: `Portfolio overview: ${entities.length} entities across ${Array.from(new Set(entities.map(e => e.industry))).length} industries.`,
      keyMetrics: [
        {
          metric: 'Total Entities',
          value: entities.length.toString(),
          trend: 'stable',
          significance: 'Current portfolio size'
        }
      ],
      strategicRecommendations: [
        'Regular compliance review recommended',
        'Consider governance structure optimization'
      ],
      complianceAlerts: entities
        .filter(e => e.complianceStatus !== 'compliant')
        .map(e => ({
          entity: e.name,
          alert: `Compliance status: ${e.complianceStatus}`,
          severity: e.complianceStatus === 'non_compliant' ? 'critical' as const : 'warning' as const
        }))
    };
  }

  private calculateRiskScore(entity: Entity): number {
    let score = 0;
    
    // Compliance status impact
    if (entity.complianceStatus === 'non_compliant') score += 40;
    else if (entity.complianceStatus === 'warning') score += 20;
    
    // Filing status impact
    if (entity.nextFilingDue && entity.nextFilingDue < new Date()) score += 30;
    
    // Governance factors
    if (!entity.directors || entity.directors.length < 1) score += 15;
    if (!entity.shareholders || entity.shareholders.length < 1) score += 10;
    
    // Age and status
    if (entity.status === 'dormant') score += 25;
    if (entity.status === 'under_liquidation') score += 50;
    
    return Math.min(score, 100);
  }

  private determineRiskLevel(entity: Entity): 'low' | 'medium' | 'high' | 'critical' {
    const score = this.calculateRiskScore(entity);
    if (score >= 70) return 'critical';
    if (score >= 50) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
  }

  private generateEntitySummary(entities: Entity[]): EntitySummary {
    return {
      totalEntities: entities.length,
      byJurisdiction: entities.reduce((acc, entity) => {
        acc[entity.jurisdiction] = (acc[entity.jurisdiction] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byIndustry: entities.reduce((acc, entity) => {
        acc[entity.industry] = (acc[entity.industry] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byStatus: entities.reduce((acc, entity) => {
        acc[entity.status] = (acc[entity.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      complianceOverview: {
        compliant: entities.filter(e => e.complianceStatus === 'compliant').length,
        warning: entities.filter(e => e.complianceStatus === 'warning').length,
        nonCompliant: entities.filter(e => e.complianceStatus === 'non_compliant').length
      },
      upcomingBoardMeetings: entities.filter(e => 
        e.nextBoardMeeting && e.nextBoardMeeting > new Date() && 
        e.nextBoardMeeting <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ).length,
      overdueFilings: entities.filter(e => 
        e.nextFilingDue && e.nextFilingDue < new Date()
      ).length
    };
  }

  private calculateGovernanceScore(entity: Entity): number {
    let score = 100;
    
    // Board composition
    if (!entity.directors || entity.directors.length === 0) score -= 30;
    else if (entity.directors.length < 3) score -= 15;
    
    // Independent directors
    const independentDirectors = entity.directors?.filter(d => d.type === 'independent').length || 0;
    const totalDirectors = entity.directors?.length || 0;
    if (totalDirectors > 0 && independentDirectors / totalDirectors < 0.3) score -= 20;
    
    // Shareholder concentration
    if (entity.shareholders && entity.shareholders.length > 0) {
      const maxShareholder = Math.max(...entity.shareholders.map(s => s.shareholding));
      if (maxShareholder > 75) score -= 15;
    }
    
    // Meeting frequency
    if (entity.meetingFrequency === 'as-needed') score -= 10;
    
    return Math.max(score, 0);
  }

  private assessBoardComposition(entity: Entity): string {
    const directorCount = entity.directors?.length || 0;
    if (directorCount === 0) return 'No directors appointed - immediate action required';
    if (directorCount < 3) return 'Board composition below recommended minimum of 3 directors';
    return 'Board composition meets basic requirements';
  }

  private getBoardRecommendations(entity: Entity): string[] {
    const recommendations = [];
    const directorCount = entity.directors?.length || 0;
    
    if (directorCount === 0) {
      recommendations.push('Appoint minimum required directors');
    }
    if (directorCount < 3) {
      recommendations.push('Consider expanding board to 3+ directors');
    }
    
    const independentCount = entity.directors?.filter(d => d.type === 'independent').length || 0;
    if (independentCount === 0 && directorCount > 0) {
      recommendations.push('Appoint independent directors for better governance');
    }
    
    return recommendations;
  }

  private assessShareholderStructure(entity: Entity): string {
    const shareholderCount = entity.shareholders?.length || 0;
    if (shareholderCount === 0) return 'No shareholders recorded';
    
    const maxOwnership = Math.max(...(entity.shareholders?.map(s => s.shareholding) || [0]));
    if (maxOwnership > 75) return 'High ownership concentration detected';
    
    return 'Shareholder structure appears balanced';
  }

  private identifyShareholderRisks(entity: Entity): string[] {
    const risks = [];
    const shareholderCount = entity.shareholders?.length || 0;
    
    if (shareholderCount === 0) {
      risks.push('No recorded shareholders - ownership structure unclear');
    }
    
    if (entity.shareholders) {
      const maxOwnership = Math.max(...entity.shareholders.map(s => s.shareholding));
      if (maxOwnership > 75) {
        risks.push('Concentrated ownership may limit minority shareholder rights');
      }
      
      const totalOwnership = entity.shareholders.reduce((sum, s) => sum + s.shareholding, 0);
      if (Math.abs(totalOwnership - 100) > 1) {
        risks.push('Shareholding percentages do not total 100%');
      }
    }
    
    return risks;
  }

  private extractRecommendations(content: string): string[] {
    // Simple extraction of recommendations from AI response
    const lines = content.split('\n').filter(line => 
      line.includes('recommend') || 
      line.includes('should') || 
      line.includes('consider')
    );
    return lines.slice(0, 5); // Limit to top 5 recommendations
  }

  private generateFallbackGovernanceAnalysis(entity: Entity) {
    return {
      score: this.calculateGovernanceScore(entity),
      recommendations: this.getBoardRecommendations(entity),
      boardComposition: {
        assessment: this.assessBoardComposition(entity),
        recommendations: this.getBoardRecommendations(entity)
      },
      shareholderStructure: {
        assessment: this.assessShareholderStructure(entity),
        risks: this.identifyShareholderRisks(entity)
      }
    };
  }
}