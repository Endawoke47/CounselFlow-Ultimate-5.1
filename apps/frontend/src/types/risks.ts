/**
 * CounselFlow Ultimate 5.1 - Risk Management Data Models
 */

export interface Risk {
  id: string;
  title: string;
  description: string;
  
  // Classification
  type: 'legal' | 'regulatory' | 'operational' | 'financial' | 'reputational' | 'strategic' | 'compliance' | 'other';
  category: string;
  source: 'internal_assessment' | 'contract' | 'dispute' | 'regulatory_change' | 'external_event' | 'other';
  
  // Scope
  applicableEntities: string[]; // Entity IDs
  businessUnits: string[];
  geographicScope: string[];
  
  // Assessment
  likelihood: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  impact: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  riskScore: number; // Calculated: likelihood × impact (1-25)
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  // Financial Impact
  potentialCost?: {
    min: number;
    max: number;
    currency: string;
    basis: string; // explanation of how cost was calculated
  };
  
  // Timeline
  identifiedDate: Date;
  lastReviewDate: Date;
  nextReviewDate: Date;
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term'; // when risk might materialize
  
  // Status & Management
  status: 'identified' | 'assessed' | 'mitigated' | 'accepted' | 'transferred' | 'avoided' | 'closed';
  ownership: string; // Responsible person
  
  // Risk Appetite
  withinAppetite: boolean;
  appetiteRationale?: string;
  
  // Mitigation
  mitigationPlan: {
    id: string;
    strategy: 'mitigate' | 'accept' | 'transfer' | 'avoid';
    actions: {
      id: string;
      description: string;
      assignedTo: string;
      dueDate: Date;
      status: 'pending' | 'in_progress' | 'completed' | 'overdue';
      cost?: number;
      effectiveness?: 'low' | 'medium' | 'high';
    }[];
    residualRisk: {
      likelihood: Risk['likelihood'];
      impact: Risk['impact'];
      score: number;
    };
  };
  
  // Monitoring
  indicators: {
    id: string;
    name: string;
    description: string;
    threshold: string;
    currentValue?: string;
    lastChecked?: Date;
    status: 'green' | 'amber' | 'red';
  }[];
  
  // Related Items
  relatedRisks: string[]; // Other risk IDs
  sourceItems: {
    type: 'contract' | 'dispute' | 'matter' | 'regulatory_item' | 'other';
    id: string;
    title: string;
  }[];
  
  // Escalation
  escalationCriteria: string;
  escalationContacts: string[];
  lastEscalationDate?: Date;
  
  // Historical Data
  history: {
    id: string;
    date: Date;
    type: 'created' | 'assessed' | 'status_change' | 'mitigation_update' | 'review' | 'other';
    description: string;
    changes?: {
      field: string;
      oldValue: any;
      newValue: any;
    }[];
    updatedBy: string;
  }[];
  
  // AI Insights
  aiAnalysis?: {
    similarRisks: string[];
    recommendedActions: string[];
    industryBenchmark?: {
      averageLikelihood: string;
      averageImpact: string;
      commonMitigations: string[];
    };
    analyzedAt: Date;
  };
  
  // Documents
  documents: {
    id: string;
    name: string;
    type: 'assessment' | 'mitigation_plan' | 'review' | 'incident_report' | 'other';
    url: string;
    uploadedAt: Date;
  }[];
  
  // System
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  tags?: string[];
}

export interface RiskRegistry {
  id: string;
  name: string;
  description: string;
  entity: string; // Entity ID
  
  // Configuration
  riskAppetite: {
    financial: {
      low: number;
      medium: number;
      high: number;
      currency: string;
    };
    operational: string;
    reputational: string;
    strategic: string;
  };
  
  // Metrics
  summary: {
    totalRisks: number;
    byStatus: Record<string, number>;
    bySeverity: Record<string, number>;
    byType: Record<string, number>;
    riskTrend: 'improving' | 'stable' | 'deteriorating';
  };
  
  // System
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface RiskDashboard {
  heatMap: {
    likelihood: string;
    impact: string;
    count: number;
    risks: string[]; // Risk IDs
  }[];
  
  topRisks: Risk[];
  
  trends: {
    period: string;
    newRisks: number;
    closedRisks: number;
    avgRiskScore: number;
  }[];
  
  compliance: {
    overdueActions: number;
    upcomingReviews: number;
    escalatedRisks: number;
  };
}