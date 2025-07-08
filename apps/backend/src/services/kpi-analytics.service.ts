/**
 * CounselFlow Ultimate 5.1 - Enhanced KPI Analytics Service  
 * Advanced legal metrics calculation and trending analysis
 * Enhanced from CounselFlow Ultimate V3 implementation
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan, In } from 'typeorm';

export interface KpiMetrics {
  // Core Legal Metrics
  activeMatterCount: number;
  newMattersThisMonth: number;
  pendingRiskActions: number;
  averageMatterValue: number;
  
  // Financial Metrics
  totalRevenue: number;
  revenueGrowth: number;
  averageBillableHours: number;
  collectionRate: number;
  
  // Risk Metrics
  criticalRisksCount: number;
  riskTrend: 'up' | 'down' | 'stable';
  complianceScore: number;
  
  // Performance Metrics
  clientSatisfactionScore: number;
  caseSuccessRate: number;
  averageResolutionTime: number; // in days
  
  // Trends and Comparisons
  trends: {
    matters: TrendData;
    revenue: TrendData;
    risks: TrendData;
    satisfaction: TrendData;
  };
  
  // Metadata
  generatedAt: Date;
  periodType: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  comparisonPeriod: string;
}

export interface TrendData {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  sparklineData: number[];
}

export interface RiskDistribution {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
  riskByCategory: Record<string, number>;
  trendingRisks: Array<{
    category: string;
    count: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }>;
}

export interface MatterAnalytics {
  totalMatters: number;
  activeMatters: number;
  newThisMonth: number;
  completedThisMonth: number;
  mattersByType: Record<string, number>;
  mattersByStatus: Record<string, number>;
  averageValue: number;
  totalValue: number;
  highValueMatters: number; // > $100k
  urgentMatters: number;
  pastDueMatters: number;
}

// Mock entities - in production these would be real TypeORM entities
interface Matter {
  id: number;
  title: string;
  status: 'active' | 'pending' | 'completed' | 'on-hold';
  type: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  clientId: number;
}

interface Risk {
  id: number;
  title: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'identified' | 'assessed' | 'mitigating' | 'monitored' | 'closed';
  inherentLikelihood: number;
  financialImpactMin: number;
  financialImpactMax: number;
  createdAt: Date;
  updatedAt: Date;
  matterId?: number;
  companyId: number;
}

interface Action {
  id: number;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  dueDate: Date;
  createdAt: Date;
  riskId?: number;
  assigneeId: number;
}

@Injectable()
export class KpiAnalyticsService {
  private readonly logger = new Logger(KpiAnalyticsService.name);

  constructor(
    // In a real implementation, inject actual repositories
    // @InjectRepository(Matter) private matterRepository: Repository<Matter>,
    // @InjectRepository(Risk) private riskRepository: Repository<Risk>,
    // @InjectRepository(Action) private actionRepository: Repository<Action>
  ) {}

  async getKpiMetrics(
    periodType: 'daily' | 'weekly' | 'monthly' | 'quarterly' = 'monthly'
  ): Promise<KpiMetrics> {
    try {
      const now = new Date();
      const { startDate, endDate, previousStartDate, previousEndDate } = this.getPeriodDates(now, periodType);

      // Calculate all metrics in parallel for better performance
      const [
        matterMetrics,
        riskMetrics,
        financialMetrics,
        performanceMetrics,
        trendsData
      ] = await Promise.all([
        this.calculateMatterMetrics(startDate, endDate, previousStartDate, previousEndDate),
        this.calculateRiskMetrics(startDate, endDate, previousStartDate, previousEndDate),
        this.calculateFinancialMetrics(startDate, endDate, previousStartDate, previousEndDate),
        this.calculatePerformanceMetrics(startDate, endDate, previousStartDate, previousEndDate),
        this.calculateTrends(startDate, endDate, periodType)
      ]);

      const kpiMetrics: KpiMetrics = {
        // Core metrics
        activeMatterCount: matterMetrics.activeMatters,
        newMattersThisMonth: matterMetrics.newThisMonth,
        pendingRiskActions: riskMetrics.pendingActions,
        averageMatterValue: matterMetrics.averageValue,
        
        // Financial metrics
        totalRevenue: financialMetrics.totalRevenue,
        revenueGrowth: financialMetrics.revenueGrowth,
        averageBillableHours: financialMetrics.billableHours,
        collectionRate: financialMetrics.collectionRate,
        
        // Risk metrics
        criticalRisksCount: riskMetrics.criticalCount,
        riskTrend: riskMetrics.trend,
        complianceScore: riskMetrics.complianceScore,
        
        // Performance metrics
        clientSatisfactionScore: performanceMetrics.satisfaction,
        caseSuccessRate: performanceMetrics.successRate,
        averageResolutionTime: performanceMetrics.resolutionTime,
        
        // Trends
        trends: trendsData,
        
        // Metadata
        generatedAt: now,
        periodType,
        comparisonPeriod: this.formatPeriod(previousStartDate, previousEndDate)
      };

      this.logger.log(`KPI metrics calculated for period: ${periodType}`, {
        totalMatters: kpiMetrics.activeMatterCount,
        totalRevenue: kpiMetrics.totalRevenue,
        criticalRisks: kpiMetrics.criticalRisksCount
      });

      return kpiMetrics;

    } catch (error) {
      this.logger.error('Failed to calculate KPI metrics', error);
      throw new Error('Failed to generate KPI metrics');
    }
  }

  async getRiskDistribution(): Promise<RiskDistribution> {
    try {
      // Mock data - in production, query actual risk repository
      const mockRisks = this.getMockRisks();
      
      const distribution = mockRisks.reduce((acc, risk) => {
        acc[risk.severity]++;
        acc.total++;
        
        if (acc.riskByCategory[risk.category]) {
          acc.riskByCategory[risk.category]++;
        } else {
          acc.riskByCategory[risk.category] = 1;
        }
        
        return acc;
      }, {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        total: 0,
        riskByCategory: {} as Record<string, number>
      });

      // Calculate trending risks (mock implementation)
      const trendingRisks = Object.entries(distribution.riskByCategory).map(([category, count]) => ({
        category,
        count,
        trend: Math.random() > 0.5 ? 'increasing' : 'decreasing' as 'increasing' | 'decreasing' | 'stable'
      }));

      return {
        ...distribution,
        trendingRisks: trendingRisks.slice(0, 5) // Top 5 trending risks
      };

    } catch (error) {
      this.logger.error('Failed to calculate risk distribution', error);
      throw new Error('Failed to generate risk distribution');
    }
  }

  async getMatterAnalytics(): Promise<MatterAnalytics> {
    try {
      // Mock data - in production, query actual matter repository
      const mockMatters = this.getMockMatters();
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const analytics: MatterAnalytics = {
        totalMatters: mockMatters.length,
        activeMatters: mockMatters.filter(m => m.status === 'active').length,
        newThisMonth: mockMatters.filter(m => m.createdAt >= startOfMonth).length,
        completedThisMonth: mockMatters.filter(m => 
          m.status === 'completed' && m.updatedAt >= startOfMonth
        ).length,
        mattersByType: this.groupByField(mockMatters, 'type'),
        mattersByStatus: this.groupByField(mockMatters, 'status'),
        averageValue: this.calculateAverage(mockMatters.map(m => m.value)),
        totalValue: mockMatters.reduce((sum, m) => sum + m.value, 0),
        highValueMatters: mockMatters.filter(m => m.value > 100000).length,
        urgentMatters: mockMatters.filter(m => m.priority === 'urgent').length,
        pastDueMatters: mockMatters.filter(m => 
          m.dueDate && m.dueDate < now && m.status !== 'completed'
        ).length
      };

      return analytics;

    } catch (error) {
      this.logger.error('Failed to calculate matter analytics', error);
      throw new Error('Failed to generate matter analytics');
    }
  }

  async getDetailedMetrics(matterId?: number, companyId?: number): Promise<any> {
    try {
      // This would provide drill-down metrics for specific matters or companies
      const filters = { matterId, companyId };
      
      // Mock detailed metrics
      return {
        billingMetrics: {
          totalBilled: 250000,
          totalCollected: 225000,
          outstandingAmount: 25000,
          averagePaymentTime: 32, // days
          writeOffAmount: 5000
        },
        timeMetrics: {
          totalHours: 1250,
          billableHours: 1125,
          billabilityRate: 0.90,
          averageHourlyRate: 450,
          overtimeHours: 125
        },
        caseMetrics: {
          openCases: 15,
          closedCases: 8,
          avgCaseValue: 31250,
          winRate: 0.85,
          avgResolutionDays: 45
        },
        clientMetrics: {
          activeClients: 12,
          newClients: 3,
          retainedClients: 11,
          clientSatisfaction: 4.7,
          retentionRate: 0.92
        },
        complianceMetrics: {
          complianceChecks: 45,
          passedChecks: 42,
          failedChecks: 3,
          complianceRate: 0.93,
          auditFindings: 2
        }
      };

    } catch (error) {
      this.logger.error('Failed to calculate detailed metrics', error);
      throw new Error('Failed to generate detailed metrics');
    }
  }

  async getPerformanceBenchmarks(): Promise<any> {
    try {
      // Industry benchmarks for legal practices
      return {
        industryAverages: {
          billableHoursPerLawyer: 1800,
          revenuePerLawyer: 750000,
          clientRetentionRate: 0.85,
          caseSuccessRate: 0.78,
          averageResolutionTime: 60, // days
          complianceScore: 0.88
        },
        firmPerformance: {
          billableHoursPerLawyer: 1950,
          revenuePerLawyer: 825000,
          clientRetentionRate: 0.92,
          caseSuccessRate: 0.85,
          averageResolutionTime: 45,
          complianceScore: 0.94
        },
        performanceRatings: {
          billableHours: 'above_average',
          revenue: 'above_average',
          retention: 'excellent',
          success: 'above_average',
          resolution: 'excellent',
          compliance: 'excellent'
        }
      };

    } catch (error) {
      this.logger.error('Failed to get performance benchmarks', error);
      throw new Error('Failed to get performance benchmarks');
    }
  }

  // Private helper methods

  private getPeriodDates(now: Date, periodType: string) {
    let startDate: Date, endDate: Date, previousStartDate: Date, previousEndDate: Date;

    switch (periodType) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000 - 1);
        previousStartDate = new Date(startDate.getTime() - 24 * 60 * 60 * 1000);
        previousEndDate = new Date(startDate.getTime() - 1);
        break;
      
      case 'weekly':
        const dayOfWeek = now.getDay();
        startDate = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
        endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
        previousStartDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousEndDate = new Date(startDate.getTime() - 1);
        break;
      
      case 'quarterly':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0);
        previousStartDate = new Date(startDate.getFullYear(), startDate.getMonth() - 3, 1);
        previousEndDate = new Date(startDate.getTime() - 1);
        break;
      
      default: // monthly
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        previousEndDate = new Date(startDate.getTime() - 1);
    }

    return { startDate, endDate, previousStartDate, previousEndDate };
  }

  private async calculateMatterMetrics(startDate: Date, endDate: Date, previousStartDate: Date, previousEndDate: Date) {
    // Mock data - in production, use actual repository queries
    const matters = this.getMockMatters();
    
    return {
      activeMatters: matters.filter(m => m.status === 'active').length,
      newThisMonth: matters.filter(m => m.createdAt >= startDate && m.createdAt <= endDate).length,
      averageValue: this.calculateAverage(matters.map(m => m.value)),
      totalValue: matters.reduce((sum, m) => sum + m.value, 0)
    };
  }

  private async calculateRiskMetrics(startDate: Date, endDate: Date, previousStartDate: Date, previousEndDate: Date) {
    // Mock data - in production, use actual repository queries
    const risks = this.getMockRisks();
    const actions = this.getMockActions();
    
    const criticalRisks = risks.filter(r => r.severity === 'critical' && r.status !== 'closed');
    const pendingActions = actions.filter(a => ['not_started', 'in_progress', 'blocked'].includes(a.status));
    
    return {
      criticalCount: criticalRisks.length,
      pendingActions: pendingActions.length,
      trend: 'stable' as const,
      complianceScore: 92 // Mock compliance score
    };
  }

  private async calculateFinancialMetrics(startDate: Date, endDate: Date, previousStartDate: Date, previousEndDate: Date) {
    // Mock financial calculations
    return {
      totalRevenue: 1250000,
      revenueGrowth: 15.2,
      billableHours: 1875,
      collectionRate: 94.5
    };
  }

  private async calculatePerformanceMetrics(startDate: Date, endDate: Date, previousStartDate: Date, previousEndDate: Date) {
    // Mock performance calculations
    return {
      satisfaction: 4.6,
      successRate: 87.5,
      resolutionTime: 42
    };
  }

  private async calculateTrends(startDate: Date, endDate: Date, periodType: string) {
    // Generate mock sparkline data (last 7 data points)
    const generateSparkline = (base: number, variance: number = 0.1) => {
      return Array.from({ length: 7 }, () => 
        base * (1 + (Math.random() - 0.5) * variance)
      );
    };

    return {
      matters: {
        current: 42,
        previous: 38,
        change: 4,
        changePercent: 10.5,
        trend: 'up' as const,
        sparklineData: generateSparkline(40, 0.15)
      },
      revenue: {
        current: 1250000,
        previous: 1085000,
        change: 165000,
        changePercent: 15.2,
        trend: 'up' as const,
        sparklineData: generateSparkline(1200000, 0.1)
      },
      risks: {
        current: 15,
        previous: 18,
        change: -3,
        changePercent: -16.7,
        trend: 'down' as const,
        sparklineData: generateSparkline(16, 0.2)
      },
      satisfaction: {
        current: 4.6,
        previous: 4.4,
        change: 0.2,
        changePercent: 4.5,
        trend: 'up' as const,
        sparklineData: generateSparkline(4.5, 0.05)
      }
    };
  }

  private formatPeriod(start: Date, end: Date): string {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  }

  private calculateAverage(values: number[]): number {
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
  }

  private groupByField<T>(items: T[], field: keyof T): Record<string, number> {
    return items.reduce((acc, item) => {
      const key = String(item[field]);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  // Mock data generators - in production, these would be replaced with actual database queries

  private getMockMatters(): Matter[] {
    return [
      {
        id: 1,
        title: 'TechCorp Acquisition',
        status: 'active',
        type: 'M&A',
        value: 250000,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-02-01'),
        dueDate: new Date('2024-03-15'),
        priority: 'high',
        clientId: 1
      },
      {
        id: 2,
        title: 'Patent Application Review',
        status: 'active',
        type: 'IP',
        value: 75000,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-05'),
        priority: 'medium',
        clientId: 2
      },
      {
        id: 3,
        title: 'Employment Contract Dispute',
        status: 'completed',
        type: 'Employment',
        value: 125000,
        createdAt: new Date('2023-12-10'),
        updatedAt: new Date('2024-01-25'),
        priority: 'urgent',
        clientId: 3
      }
      // Add more mock matters as needed
    ];
  }

  private getMockRisks(): Risk[] {
    return [
      {
        id: 1,
        title: 'Regulatory Compliance Gap',
        category: 'Regulatory',
        severity: 'critical',
        status: 'mitigating',
        inherentLikelihood: 8,
        financialImpactMin: 100000,
        financialImpactMax: 500000,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-02-01'),
        matterId: 1,
        companyId: 1
      },
      {
        id: 2,
        title: 'Data Privacy Violation Risk',
        category: 'Privacy',
        severity: 'high',
        status: 'assessed',
        inherentLikelihood: 6,
        financialImpactMin: 50000,
        financialImpactMax: 200000,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-02-02'),
        companyId: 2
      }
      // Add more mock risks as needed
    ];
  }

  private getMockActions(): Action[] {
    return [
      {
        id: 1,
        title: 'Conduct compliance audit',
        status: 'in_progress',
        dueDate: new Date('2024-03-01'),
        createdAt: new Date('2024-01-20'),
        riskId: 1,
        assigneeId: 1
      },
      {
        id: 2,
        title: 'Update privacy policy',
        status: 'not_started',
        dueDate: new Date('2024-02-15'),
        createdAt: new Date('2024-01-25'),
        riskId: 2,
        assigneeId: 2
      }
      // Add more mock actions as needed
    ];
  }
}