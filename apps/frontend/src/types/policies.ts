/**
 * CounselFlow Ultimate 5.1 - Policy Management Data Models
 */

export interface Policy {
  id: string;
  title: string;
  type: 'data_protection' | 'employment' | 'code_of_conduct' | 'anti_corruption' | 'health_safety' | 'financial' | 'other';
  status: 'draft' | 'under_review' | 'approved' | 'published' | 'archived';
  
  // Scope
  applicableEntities: string[]; // Entity IDs
  subjectMatter: string;
  category: string;
  
  // Content
  description: string;
  purpose: string;
  scope: string;
  
  // Document
  documentUrl?: string;
  version: string;
  
  // Dates
  effectiveDate?: Date;
  reviewDate?: Date;
  nextReviewDue?: Date;
  expirationDate?: Date;
  
  // Approval
  approvedBy?: string;
  approvalDate?: Date;
  
  // Management
  owner: string; // Responsible person
  department: string;
  
  // Related Items
  relatedPolicies: string[]; // Policy IDs
  relatedTemplates: string[]; // Contract template IDs
  
  // AI Query History
  aiQueries: {
    id: string;
    question: string;
    answer: string;
    askedBy: string;
    askedAt: Date;
    confidence: number;
  }[];
  
  // System
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  tags?: string[];
}