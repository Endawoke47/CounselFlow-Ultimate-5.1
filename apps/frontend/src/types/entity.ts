/**
 * CounselFlow Ultimate 5.1 - Entity Management Data Models
 * Comprehensive entity tracking for group organizations
 */

export interface Shareholder {
  id: string;
  name: string;
  type: 'individual' | 'corporate';
  shareholding: number; // percentage
  shareClass: string;
  votingRights: number;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  appointedDate: Date;
  notes?: string;
}

export interface Director {
  id: string;
  name: string;
  title: string;
  type: 'executive' | 'non-executive' | 'independent';
  appointedDate: Date;
  resignationDate?: Date;
  isChairman: boolean;
  contactInfo: {
    email: string;
    phone?: string;
    address?: string;
  };
  qualifications?: string[];
  committees?: string[]; // Audit, Remuneration, etc.
  notes?: string;
}

export interface BoardMeeting {
  id: string;
  entityId: string;
  date: Date;
  type: 'board' | 'agm' | 'egm' | 'committee';
  status: 'scheduled' | 'completed' | 'cancelled';
  agenda?: string;
  minutesUploaded: boolean;
  attendees: string[]; // Director IDs
  location?: string;
  notes?: string;
}

export interface ConstitutionalDocument {
  id: string;
  entityId: string;
  type: 'articles_of_association' | 'memorandum' | 'shareholders_agreement' | 'board_charter' | 'other';
  title: string;
  version: string;
  effectiveDate: Date;
  fileUrl: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
  description?: string;
  isActive: boolean;
}

export interface Entity {
  id: string;
  name: string;
  legalName: string;
  registrationNumber: string;
  taxId?: string;
  industry: string;
  businessDescription: string;
  
  // Corporate Structure
  parentEntity?: string; // Parent entity ID
  subsidiaries: string[]; // Child entity IDs
  ownership: number; // Percentage owned by parent
  
  // Registration Details
  incorporationDate: Date;
  jurisdiction: string;
  registeredAddress: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
  };
  operatingAddress?: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
  };
  
  // Financial
  currency: string;
  financialYearEnd: string; // MM-DD format
  authorizedCapital: number;
  issuedCapital: number;
  
  // People
  shareholders: Shareholder[];
  directors: Director[];
  
  // Governance
  nextBoardMeeting?: Date;
  lastBoardMeeting?: Date;
  meetingFrequency: 'monthly' | 'quarterly' | 'bi-annual' | 'annual' | 'as-needed';
  
  // Documents
  constitutionalDocuments: ConstitutionalDocument[];
  
  // Compliance
  status: 'active' | 'dormant' | 'under_liquidation' | 'dissolved';
  complianceStatus: 'compliant' | 'warning' | 'non_compliant';
  lastFilingDate?: Date;
  nextFilingDue?: Date;
  
  // System
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  tags?: string[];
  notes?: string;
}

export interface EntityFilter {
  search?: string;
  industry?: string[];
  jurisdiction?: string[];
  status?: string[];
  complianceStatus?: string[];
  parentEntity?: string;
  tags?: string[];
}

export interface EntitySummary {
  totalEntities: number;
  byJurisdiction: Record<string, number>;
  byIndustry: Record<string, number>;
  byStatus: Record<string, number>;
  complianceOverview: {
    compliant: number;
    warning: number;
    nonCompliant: number;
  };
  upcomingBoardMeetings: number;
  overdueFilings: number;
}

// API Response Types
export interface EntityResponse {
  success: boolean;
  data: Entity;
  message: string;
}

export interface EntitiesResponse {
  success: boolean;
  data: {
    entities: Entity[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    summary: EntitySummary;
  };
  message: string;
}

// Form Types
export interface CreateEntityRequest {
  name: string;
  legalName: string;
  registrationNumber: string;
  industry: string;
  businessDescription: string;
  incorporationDate: Date;
  jurisdiction: string;
  registeredAddress: Entity['registeredAddress'];
  currency: string;
  financialYearEnd: string;
  authorizedCapital: number;
  issuedCapital: number;
  parentEntity?: string;
  ownership?: number;
}

export interface UpdateEntityRequest extends Partial<CreateEntityRequest> {
  id: string;
}

export interface BulkImportEntity {
  name: string;
  legalName: string;
  registrationNumber: string;
  industry: string;
  jurisdiction: string;
  incorporationDate: string; // ISO date string
  authorizedCapital: number;
  issuedCapital: number;
  currency: string;
  // Simplified for bulk import
}