/**
 * CounselFlow Ultimate 5.1 - Licensing & Regulatory Compliance Data Models
 */

export interface License {
  id: string;
  name: string;
  type: 'business' | 'professional' | 'industry_specific' | 'operational' | 'other';
  category: string;
  
  // Scope
  applicableEntity: string; // Entity ID
  jurisdiction: string;
  country: string;
  
  // Details
  licenseNumber?: string;
  issuingAuthority: string;
  description: string;
  
  // Dates
  issueDate?: Date;
  effectiveDate?: Date;
  expirationDate?: Date;
  renewalDate?: Date;
  
  // Status
  status: 'active' | 'expired' | 'suspended' | 'revoked' | 'pending_renewal' | 'not_required';
  
  // Financial
  cost?: number;
  renewalCost?: number;
  currency?: string;
  
  // Management
  responsible: string;
  
  // Requirements
  requirements: {
    id: string;
    description: string;
    type: 'document' | 'training' | 'inspection' | 'payment' | 'other';
    status: 'completed' | 'pending' | 'overdue';
    dueDate?: Date;
  }[];
  
  // Documents
  documents: {
    id: string;
    name: string;
    type: 'license_certificate' | 'application' | 'renewal' | 'correspondence' | 'other';
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

export interface RegulatoryItem {
  id: string;
  title: string;
  type: 'law' | 'regulation' | 'directive' | 'guidance' | 'proposal' | 'other';
  status: 'proposed' | 'enacted' | 'effective' | 'amended' | 'repealed';
  
  // Details
  description: string;
  summary: string;
  jurisdiction: string;
  regulatoryBody: string;
  
  // Dates
  proposedDate?: Date;
  enactmentDate?: Date;
  effectiveDate?: Date;
  complianceDeadline?: Date;
  
  // Impact Assessment
  applicableEntities: string[]; // Entity IDs
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  businessAreas: string[];
  
  // Risk
  riskOfNonCompliance: 'low' | 'medium' | 'high' | 'critical';
  penalties: string;
  
  // Compliance Actions
  requiredActions: {
    id: string;
    action: string;
    type: 'policy_update' | 'process_change' | 'training' | 'system_update' | 'filing' | 'other';
    assignedTo?: string;
    dueDate?: Date;
    status: 'pending' | 'in_progress' | 'completed';
    estimatedCost?: number;
  }[];
  
  // Related Items
  relatedPolicies: string[]; // Policy IDs
  relatedContracts: string[]; // Contract template IDs that need updates
  relatedLicenses: string[]; // License IDs that may be affected
  
  // Monitoring
  watchlistPriority: 'low' | 'medium' | 'high';
  notifications: {
    id: string;
    type: 'deadline_approaching' | 'status_change' | 'new_guidance' | 'other';
    message: string;
    sentAt: Date;
    sentTo: string[];
  }[];
  
  // Documents
  documents: {
    id: string;
    name: string;
    type: 'full_text' | 'summary' | 'analysis' | 'guidance' | 'impact_assessment' | 'other';
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