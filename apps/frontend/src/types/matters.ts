/**
 * CounselFlow Ultimate 5.1 - Matter Management Data Models
 */

export interface Matter {
  id: string;
  title: string;
  type: 'acquisition' | 'compliance' | 'regulatory' | 'corporate' | 'ip' | 'employment' | 'real_estate' | 'other';
  status: 'open' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Location
  country: string;
  jurisdiction?: string;
  
  // Details
  description: string;
  objectives: string[];
  
  // Management
  assignedTo: string;
  matterManager: string;
  internalEntity: string; // Entity ID
  
  // External Support
  externalCounsel?: {
    firm: string;
    contact: string;
    role: string;
  }[];
  
  // Dates
  startDate: Date;
  targetCompletionDate?: Date;
  actualCompletionDate?: Date;
  
  // Financial
  budget?: number;
  actualCost?: number;
  currency?: string;
  
  // Risk Assessment
  risks: {
    id: string;
    description: string;
    likelihood: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
    status: 'open' | 'mitigated' | 'accepted';
  }[];
  
  // Tasks
  tasks: {
    id: string;
    title: string;
    description: string;
    assignedTo: string;
    dueDate: Date;
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    priority: 'low' | 'medium' | 'high';
    dependencies?: string[];
  }[];
  
  // Documents
  documents: {
    id: string;
    name: string;
    type: 'contract' | 'memo' | 'research' | 'correspondence' | 'filing' | 'other';
    url: string;
    uploadedAt: Date;
  }[];
  
  // Updates
  updates: {
    id: string;
    date: Date;
    type: 'milestone' | 'task_completion' | 'risk_update' | 'status_change' | 'other';
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