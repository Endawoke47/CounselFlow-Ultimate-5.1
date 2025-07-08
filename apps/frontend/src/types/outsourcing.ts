/**
 * CounselFlow Ultimate 5.1 - Outsourcing & Legal Spend Data Models
 */

export interface ExternalProvider {
  id: string;
  name: string;
  type: 'law_firm' | 'barrister_chambers' | 'consultant' | 'expert_witness' | 'other_professional';
  
  // Contact Information
  contactPerson: string;
  email: string;
  phone?: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
  };
  
  // Specialization
  practiceAreas: string[];
  jurisdictions: string[];
  languages: string[];
  
  // Commercial
  hourlyRates: {
    seniority: string;
    rate: number;
    currency: string;
  }[];
  
  // Performance Metrics
  performance: {
    overallRating: number; // 1-5
    responsiveness: number; // 1-5
    qualityOfWork: number; // 1-5
    costEffectiveness: number; // 1-5
    adherenceToDeadlines: number; // 1-5
    lastReviewDate: Date;
  };
  
  // Compliance
  compliance: {
    hasValidInsurance: boolean;
    insuranceExpiryDate?: Date;
    hasConflictChecks: boolean;
    dataProtectionCompliant: boolean;
    securityClearance?: string;
    lastComplianceCheck: Date;
  };
  
  // Contracting
  masterServiceAgreement?: {
    id: string;
    effectiveDate: Date;
    expirationDate?: Date;
    documentUrl: string;
  };
  
  // System
  status: 'active' | 'inactive' | 'under_review' | 'blacklisted';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  tags?: string[];
}

export interface OutsourcedMatter {
  id: string;
  title: string;
  type: 'litigation' | 'transaction' | 'regulatory' | 'employment' | 'ip' | 'other';
  
  // Provider
  provider: string; // ExternalProvider ID
  leadLawyer: string;
  workingTeam: string[];
  
  // Matter Details
  description: string;
  internalEntity: string; // Entity ID
  internalMatter?: string; // Matter ID if linked
  
  // Financial
  budget: number;
  actualCost: number;
  currency: string;
  billingArrangement: 'hourly' | 'fixed_fee' | 'contingency' | 'capped_fee' | 'other';
  
  // Timeline
  startDate: Date;
  targetCompletionDate?: Date;
  actualCompletionDate?: Date;
  
  // Status
  status: 'active' | 'completed' | 'cancelled' | 'on_hold';
  
  // Performance Tracking
  milestones: {
    id: string;
    title: string;
    dueDate: Date;
    completedDate?: Date;
    status: 'pending' | 'completed' | 'overdue';
    qualityRating?: number; // 1-5
  }[];
  
  // Cost Breakdown
  invoices: {
    id: string;
    invoiceNumber: string;
    amount: number;
    period: {
      from: Date;
      to: Date;
    };
    receivedDate: Date;
    paidDate?: Date;
    status: 'pending' | 'approved' | 'paid' | 'disputed';
    breakdown: {
      lawyer: string;
      hours: number;
      rate: number;
      description: string;
    }[];
  }[];
  
  // Performance Review
  review: {
    overallSatisfaction: number; // 1-5
    qualityOfWork: number; // 1-5
    timeliness: number; // 1-5
    communication: number; // 1-5
    costManagement: number; // 1-5
    outcome: 'excellent' | 'satisfactory' | 'below_expectations' | 'poor';
    feedback: string;
    wouldUseAgain: boolean;
    reviewDate?: Date;
    reviewedBy?: string;
  };
  
  // Documents
  documents: {
    id: string;
    name: string;
    type: 'engagement_letter' | 'invoice' | 'work_product' | 'correspondence' | 'other';
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

export interface SpendAnalytics {
  totalSpend: number;
  currency: string;
  period: {
    from: Date;
    to: Date;
  };
  
  breakdown: {
    byProvider: Record<string, number>;
    byPracticeArea: Record<string, number>;
    byEntity: Record<string, number>;
    byMatterType: Record<string, number>;
  };
  
  trends: {
    monthlySpend: {
      month: string;
      amount: number;
    }[];
    averageHourlyRate: number;
    topSpenders: {
      provider: string;
      amount: number;
      percentage: number;
    }[];
  };
  
  performance: {
    averageProviderRating: number;
    onTimeCompletion: number; // percentage
    budgetAdherence: number; // percentage
    repeatEngagements: number; // percentage
  };
}