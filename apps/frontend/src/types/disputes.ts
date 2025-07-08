/**
 * CounselFlow Ultimate 5.1 - Dispute Management Data Models
 */

export interface Dispute {
  id: string;
  title: string;
  type: 'litigation' | 'arbitration' | 'mediation' | 'regulatory' | 'employment' | 'commercial' | 'other';
  status: 'open' | 'pending' | 'settled' | 'closed' | 'appealed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Case Details
  caseNumber?: string;
  court?: string;
  jurisdiction: string;
  
  // Parties
  plaintiff: string;
  defendant: string;
  ourPosition: 'plaintiff' | 'defendant';
  
  // Financial
  claimValue: number;
  currency: string;
  spentAmount: number;
  estimatedCosts: number;
  
  // Dates
  filedDate: Date;
  nextHearingDate?: Date;
  expectedResolutionDate?: Date;
  
  // Assessment
  successProbability: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  // External Counsel
  externalCounsel?: {
    firm: string;
    leadLawyer: string;
    contact: string;
    hourlyRate?: number;
  };
  
  // Internal
  assignedTo: string;
  internalEntity: string; // Entity ID
  
  // Strategy
  strategy: 'settle' | 'fight' | 'appeal' | 'mediate' | 'arbitrate';
  keyPoints: string[];
  strongPoints: string[];
  weakPoints: string[];
  
  // Accounting
  hasProvision: boolean;
  provisionAmount?: number;
  provisionDate?: Date;
  
  // Documents
  documents: {
    id: string;
    name: string;
    type: 'pleading' | 'evidence' | 'correspondence' | 'order' | 'settlement' | 'other';
    url: string;
    uploadedAt: Date;
  }[];
  
  // Updates
  updates: {
    id: string;
    date: Date;
    type: 'hearing' | 'filing' | 'settlement_offer' | 'court_order' | 'payment' | 'other';
    description: string;
    createdBy: string;
  }[];
  
  // System
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  tags?: string[];
}