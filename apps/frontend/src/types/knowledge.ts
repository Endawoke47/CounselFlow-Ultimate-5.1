/**
 * CounselFlow Ultimate 5.1 - Knowledge Management Data Models
 */

export interface KnowledgeItem {
  id: string;
  title: string;
  type: 'template' | 'playbook' | 'clause_library' | 'precedent' | 'research' | 'memo' | 'other';
  category: string;
  
  // Content
  content: string;
  summary: string;
  
  // Classification
  practiceArea: string;
  jurisdiction?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  
  // Usage
  isPublic: boolean;
  accessLevel: 'public' | 'internal' | 'restricted' | 'confidential';
  
  // Relationships
  relatedItems: string[]; // Other knowledge item IDs
  sourceDocuments: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  
  // Analytics
  usage: {
    views: number;
    downloads: number;
    lastAccessed?: Date;
    popularityScore: number;
  };
  
  // Versioning
  version: string;
  previousVersions: string[];
  
  // Approval
  status: 'draft' | 'under_review' | 'approved' | 'archived';
  reviewedBy?: string;
  reviewDate?: Date;
  
  // AI Enhancement
  aiSummary?: string;
  aiTags?: string[];
  relatedQuestions?: string[];
  
  // System
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  tags?: string[];
}

export interface ClauseLibrary {
  id: string;
  name: string;
  category: string;
  description: string;
  clauses: {
    id: string;
    title: string;
    text: string;
    type: 'standard' | 'aggressive' | 'protective' | 'balanced';
    applicableJurisdictions: string[];
    riskLevel: 'low' | 'medium' | 'high';
    alternatives?: string[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Playbook {
  id: string;
  title: string;
  type: 'transaction' | 'compliance' | 'negotiation' | 'litigation' | 'other';
  description: string;
  steps: {
    id: string;
    order: number;
    title: string;
    description: string;
    estimatedTime?: string;
    resources?: string[];
    checkpoints?: string[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}