/**
 * CounselFlow Ultimate 5.1 - Contracts Module Data Models
 * Three-part contract system: Draft, Review, Store/Track
 */

export type ContractWorkflowStage = 'drafting' | 'reviewing' | 'repository';

export type ContractType = 
  | 'nda' 
  | 'service_agreement' 
  | 'employment' 
  | 'purchase' 
  | 'supply'
  | 'lease' 
  | 'partnership' 
  | 'joint_venture'
  | 'licensing'
  | 'distribution'
  | 'consulting'
  | 'master_services'
  | 'sow' // Statement of Work
  | 'loan'
  | 'security'
  | 'merger_acquisition'
  | 'franchise'
  | 'insurance'
  | 'real_estate'
  | 'intellectual_property'
  | 'other';

export type ContractStatus = 
  | 'template_selection'
  | 'ai_drafting'
  | 'human_review'
  | 'under_negotiation'
  | 'legal_review'
  | 'risk_assessment'
  | 'awaiting_approval'
  | 'ready_for_signature'
  | 'partially_signed'
  | 'fully_executed'
  | 'active'
  | 'expired'
  | 'terminated'
  | 'breached'
  | 'suspended'
  | 'archived';

export type ContractPriority = 'low' | 'medium' | 'high' | 'critical' | 'urgent';

export interface Contract {
  id: string;
  title: string;
  type: ContractType;
  status: ContractStatus;
  priority: ContractPriority;
  workflowStage: ContractWorkflowStage;
  
  // Parties and Entities
  counterparty: {
    name: string;
    type: 'individual' | 'company' | 'government' | 'nonprofit';
    contactEmail?: string;
    contactPhone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
    registrationNumber?: string;
    taxId?: string;
  };
  internalEntity: string; // Entity ID from Entity Management
  signatories: {
    party: 'internal' | 'counterparty';
    name: string;
    title: string;
    email: string;
    signedAt?: Date;
    signatureMethod?: 'electronic' | 'physical' | 'digital';
  }[];
  
  // Financial Terms
  financialTerms: {
    totalValue?: number;
    currency: string;
    paymentTerms?: string;
    paymentSchedule?: {
      amount: number;
      dueDate: Date;
      description: string;
      status: 'pending' | 'paid' | 'overdue';
    }[];
    penalties?: {
      type: string;
      amount: number;
      conditions: string;
    }[];
    bonuses?: {
      type: string;
      amount: number;
      conditions: string;
    }[];
  };
  
  // Timeline and Dates
  timeline: {
    createdDate: Date;
    draftCompletedDate?: Date;
    reviewStartDate?: Date;
    reviewCompletedDate?: Date;
    negotiationStartDate?: Date;
    approvalDate?: Date;
    effectiveDate?: Date;
    expirationDate?: Date;
    renewalDate?: Date;
    terminationDate?: Date;
    noticePeriod?: number; // days
    autoRenewal?: boolean;
    renewalTerms?: string;
  };
  
  // Legal and Compliance
  legalFramework: {
    governingLaw: string;
    jurisdiction: string;
    disputeResolution: 'litigation' | 'arbitration' | 'mediation' | 'negotiation';
    arbitrationRules?: string;
    applicableRegulations?: string[];
    complianceRequirements?: string[];
    dataProtectionClauses?: boolean;
    confidentialityLevel: 'public' | 'internal' | 'confidential' | 'strictly_confidential';
  };
  
  // Contract Management
  management: {
    assignedTo: string; // User ID
    approvedBy?: string; // User ID
    reviewers: string[]; // User IDs
    businessOwner: string; // User ID
    legalCounsel?: string; // User ID
    procurementContact?: string; // User ID
    department: string;
    businessUnit?: string;
    costCenter?: string;
  };
  
  // Content and Terms
  content: {
    description: string;
    executiveSummary?: string;
    keyTerms: {
      term: string;
      description: string;
      category: 'commercial' | 'legal' | 'technical' | 'operational';
    }[];
    deliverables?: {
      name: string;
      description: string;
      dueDate?: Date;
      status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
    }[];
    performanceMetrics?: {
      metric: string;
      target: string;
      measurement: string;
    }[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    riskFactors: string[];
  };
  
  // AI Analysis and Insights
  aiAnalysis?: {
    riskScore: number; // 0-100
    riskCategory: 'low' | 'medium' | 'high' | 'critical';
    redFlags: {
      category: 'legal' | 'financial' | 'operational' | 'compliance';
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      recommendation: string;
      clause?: string;
    }[];
    recommendations: {
      category: 'improvement' | 'protection' | 'optimization';
      priority: 'low' | 'medium' | 'high';
      description: string;
      implementation: string;
    }[];
    missingClauses: {
      clause: string;
      importance: 'recommended' | 'important' | 'critical';
      reasoning: string;
      template?: string;
    }[];
    marketComparison?: {
      metric: string;
      ourValue: string;
      marketAverage: string;
      assessment: 'favorable' | 'market' | 'unfavorable';
    }[];
    analyzedAt: Date;
    analysisVersion: string;
    confidence: number; // 0-100
  };
  
  // Historical Contract Import
  importData?: {
    sourceSystem?: string;
    importDate: Date;
    originalFormat: string;
    extractionMethod: 'ocr' | 'text' | 'structured_data';
    aiSummary?: {
      summary: string;
      keyPoints: string[];
      confidence: number;
      extractedAt: Date;
    };
    conversionNotes?: string;
    validationStatus: 'pending' | 'validated' | 'needs_review';
  };
  
  // Document Management and Versioning
  documents: {
    id: string;
    name: string;
    type: 'main_contract' | 'amendment' | 'exhibit' | 'schedule' | 'statement_of_work' | 'addendum' | 'attachment' | 'correspondence';
    format: 'pdf' | 'docx' | 'txt' | 'html';
    url: string;
    version: string;
    size: number; // bytes
    checksum: string;
    isLatest: boolean;
    uploadedAt: Date;
    uploadedBy: string;
    approvalStatus?: 'pending' | 'approved' | 'rejected';
    reviewComments?: {
      reviewer: string;
      comment: string;
      timestamp: Date;
      resolved: boolean;
    }[];
  }[];
  
  // Progress Tracking
  progressTracking: {
    milestones: {
      name: string;
      description: string;
      targetDate: Date;
      completedDate?: Date;
      status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
      owner: string;
    }[];
    workflowSteps: {
      step: string;
      status: 'pending' | 'in_progress' | 'completed' | 'skipped';
      startedAt?: Date;
      completedAt?: Date;
      assignedTo?: string;
      notes?: string;
    }[];
    approvalWorkflow: {
      level: number;
      approver: string;
      required: boolean;
      status: 'pending' | 'approved' | 'rejected' | 'delegated';
      submittedAt?: Date;
      respondedAt?: Date;
      comments?: string;
    }[];
  };
  
  // Integration with Other Modules
  linkedRecords: {
    disputes?: string[]; // Dispute IDs
    matters?: string[]; // Matter IDs
    risks?: string[]; // Risk IDs
    entities?: string[]; // Additional Entity IDs
    policies?: string[]; // Policy IDs
    outsourcingRecords?: string[]; // Outsourcing IDs
  };
  
  // System and Audit
  system: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
    version: number;
    changeLog: {
      timestamp: Date;
      user: string;
      action: string;
      field?: string;
      oldValue?: any;
      newValue?: any;
      reason?: string;
    }[];
    tags: string[];
    bookmarks?: {
      userId: string;
      addedAt: Date;
    }[];
    access: {
      visibility: 'public' | 'restricted' | 'confidential';
      allowedUsers?: string[];
      allowedRoles?: string[];
    };
  };
}

export interface ContractTemplate {
  id: string;
  name: string;
  type: ContractType;
  category: 'standard' | 'preferred' | 'fallback' | 'industry_specific' | 'jurisdiction_specific';
  description: string;
  
  // Template Content
  template: {
    content: string; // Main template content with variables
    format: 'html' | 'markdown' | 'docx';
    language: string;
    jurisdiction: string;
    governingLaw: string;
  };
  
  // Template Variables and Configuration
  variables: {
    name: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect' | 'textarea' | 'currency' | 'entity_reference';
    required: boolean;
    options?: string[];
    defaultValue?: any;
    validation?: {
      pattern?: string;
      minLength?: number;
      maxLength?: number;
      min?: number;
      max?: number;
    };
    helpText?: string;
    section: string; // Groups related variables
    order: number;
  }[];
  
  // Template Metadata
  metadata: {
    version: string;
    lastUpdated: Date;
    updatedBy: string;
    approvedBy?: string;
    approvedAt?: Date;
    status: 'draft' | 'review' | 'approved' | 'deprecated';
    tags: string[];
    industry?: string[];
    complexity: 'simple' | 'moderate' | 'complex';
    estimatedCompletionTime: number; // minutes
  };
  
  // AI Configuration
  aiConfiguration?: {
    enableAIAssistance: boolean;
    suggestAlternatives: boolean;
    riskAssessment: boolean;
    clauseLibraryIntegration: boolean;
    marketDataIntegration: boolean;
    customPrompts?: {
      name: string;
      prompt: string;
      category: string;
    }[];
  };
  
  // Usage Analytics
  usage: {
    timesUsed: number;
    lastUsed?: Date;
    averageCompletionTime?: number;
    successRate?: number; // percentage of contracts that reach execution
    userRatings?: {
      userId: string;
      rating: number;
      feedback?: string;
      ratedAt: Date;
    }[];
  };
  
  // System
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// Contract Drafting Session (for AI-powered drafting workflow)
export interface ContractDraftingSession {
  id: string;
  contractId?: string; // null for new contracts
  templateId?: string;
  
  // Session State
  status: 'initializing' | 'collecting_requirements' | 'ai_drafting' | 'human_review' | 'finalizing' | 'completed' | 'abandoned';
  currentStep: number;
  totalSteps: number;
  
  // Requirements Gathering
  requirements: {
    contractType: ContractType;
    businessObjective: string;
    parties: {
      internal: string; // Entity ID
      counterparty: {
        name: string;
        type: 'individual' | 'company' | 'government';
        details?: any;
      };
    };
    keyTerms: {
      term: string;
      value: string;
      importance: 'nice_to_have' | 'important' | 'critical';
    }[];
    constraints: {
      budgetRange?: { min: number; max: number; currency: string };
      timeline?: { start?: Date; end?: Date };
      jurisdiction?: string;
      riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    };
    specialRequirements?: string[];
  };
  
  // AI Drafting Process
  aiDrafting: {
    prompt: string;
    generatedContent?: string;
    iterations: {
      version: number;
      content: string;
      feedback?: string;
      timestamp: Date;
    }[];
    currentIteration: number;
    confidence: number;
    processingTime?: number;
  };
  
  // Human Review and Feedback
  humanReview: {
    reviewers: string[]; // User IDs
    feedback: {
      reviewer: string;
      section: string;
      comment: string;
      type: 'suggestion' | 'concern' | 'approval';
      timestamp: Date;
      resolved: boolean;
    }[];
    approvalStatus: 'pending' | 'approved' | 'needs_revision';
  };
  
  // Session Management
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  estimatedCompletionTime?: number;
  actualCompletionTime?: number;
  sessionNotes?: string;
}

// Contract Review Session (for AI-powered contract analysis)
export interface ContractReviewSession {
  id: string;
  contractId: string;
  documentId: string;
  
  // Review Configuration
  reviewType: 'initial_review' | 'due_diligence' | 'risk_assessment' | 'compliance_check' | 'renewal_review';
  scope: {
    analyzeRisk: boolean;
    checkCompliance: boolean;
    marketComparison: boolean;
    clauseAnalysis: boolean;
    financialAnalysis: boolean;
    customChecks?: string[];
  };
  
  // AI Analysis Results
  analysis: {
    overallScore: number; // 0-100
    riskAssessment: {
      level: 'low' | 'medium' | 'high' | 'critical';
      factors: {
        category: string;
        risk: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
        mitigation?: string;
      }[];
    };
    clauseAnalysis: {
      clause: string;
      location: string;
      analysis: string;
      recommendation: string;
      priority: 'low' | 'medium' | 'high';
    }[];
    complianceCheck: {
      regulation: string;
      status: 'compliant' | 'non_compliant' | 'unclear' | 'not_applicable';
      details: string;
      action_required?: string;
    }[];
    marketComparison?: {
      aspect: string;
      ourPosition: string;
      marketStandard: string;
      assessment: 'favorable' | 'market' | 'unfavorable';
      recommendation: string;
    }[];
  };
  
  // Review Status
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  processingStarted?: Date;
  processingCompleted?: Date;
  errorMessage?: string;
  
  // Human Review Integration
  humanReview?: {
    assigned_to: string[];
    status: 'pending' | 'in_progress' | 'completed';
    findings: {
      reviewer: string;
      category: string;
      finding: string;
      severity: 'info' | 'warning' | 'critical';
      recommendation: string;
      timestamp: Date;
    }[];
    finalDecision?: 'approve' | 'approve_with_conditions' | 'reject' | 'needs_revision';
    conditions?: string[];
  };
  
  // System
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Contract Import Job (for historical contract import)
export interface ContractImportJob {
  id: string;
  
  // Import Configuration
  source: {
    type: 'file_upload' | 'system_migration' | 'bulk_import' | 'api_import';
    files?: {
      id: string;
      name: string;
      type: string;
      size: number;
      uploaded_at: Date;
    }[];
    systemDetails?: {
      systemName: string;
      connectionString?: string;
      credentials?: any;
    };
  };
  
  // Processing Configuration
  processing: {
    extractionMethod: 'ocr' | 'text_extraction' | 'structured_data' | 'hybrid';
    aiSummarization: boolean;
    autoClassification: boolean;
    duplicateDetection: boolean;
    dataValidation: boolean;
    batchSize: number;
  };
  
  // Job Status
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'partially_completed' | 'cancelled';
  progress: {
    totalItems: number;
    processedItems: number;
    successfulItems: number;
    failedItems: number;
    currentItem?: string;
  };
  
  // Results
  results: {
    importedContracts: string[]; // Contract IDs
    failedImports: {
      fileName: string;
      error: string;
      timestamp: Date;
    }[];
    summary: {
      totalProcessed: number;
      successRate: number;
      averageProcessingTime: number;
      dataQualityScore: number;
    };
    duplicatesFound: {
      originalContract: string;
      duplicateFile: string;
      similarity: number;
    }[];
  };
  
  // AI Processing Results
  aiProcessing?: {
    extractionAccuracy: number;
    classificationAccuracy: number;
    summarizationQuality: number;
    keyTermsExtracted: number;
    riskFactorsIdentified: number;
    processingTime: number;
  };
  
  // System
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  createdBy: string;
  processingLogs: {
    timestamp: Date;
    level: 'info' | 'warning' | 'error';
    message: string;
    details?: any;
  }[];
}