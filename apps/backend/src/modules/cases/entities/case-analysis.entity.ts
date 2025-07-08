import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { Case } from './case.entity';
import { User } from '../../users/entities/user.entity';

export enum AnalysisType {
  DOCUMENT_REVIEW = 'document_review',
  RISK_ASSESSMENT = 'risk_assessment',
  LEGAL_RESEARCH = 'legal_research',
  CASE_STRATEGY = 'case_strategy',
  COMPLIANCE_CHECK = 'compliance_check',
  PRECEDENT_ANALYSIS = 'precedent_analysis',
  FINANCIAL_ANALYSIS = 'financial_analysis',
  TIMELINE_ANALYSIS = 'timeline_analysis',
  WITNESS_ANALYSIS = 'witness_analysis',
  EVIDENCE_ANALYSIS = 'evidence_analysis'
}

export enum AnalysisStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REVIEWED = 'reviewed',
  APPROVED = 'approved'
}

@Entity('case_analyses')
export class CaseAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar'
  })
  type: AnalysisType;

  @Column({
    type: 'varchar',
    default: AnalysisStatus.PENDING
  })
  status: AnalysisStatus;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // AI Analysis Results
  @Column({ type: 'json' })
  analysisResults: {
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    confidenceScore: number;
    detailedAnalysis: Record<string, any>;
  };

  // Legal Insights
  @Column({ type: 'json', nullable: true })
  legalInsights: {
    relevantLaws: string[];
    precedents: Array<{
      case: string;
      relevance: number;
      summary: string;
    }>;
    jurisdictionalNotes: string[];
    complianceIssues: string[];
  };

  // Strategic Recommendations
  @Column({ type: 'json', nullable: true })
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    alternatives: string[];
    riskMitigation: string[];
  };

  // Financial Analysis
  @Column({ type: 'json', nullable: true })
  financialAnalysis: {
    estimatedCosts: number;
    potentialRecovery: number;
    costBenefitRatio: number;
    budgetRecommendations: string[];
  };

  // Timeline and Milestones
  @Column({ type: 'json', nullable: true })
  timeline: {
    criticalDates: Array<{
      date: Date;
      description: string;
      importance: 'low' | 'medium' | 'high' | 'critical';
    }>;
    estimatedDuration: string;
    phases: Array<{
      name: string;
      duration: string;
      dependencies: string[];
    }>;
  };

  // Evidence and Documentation
  @Column({ type: 'json', nullable: true })
  evidenceAnalysis: {
    strengthOfEvidence: 'weak' | 'moderate' | 'strong' | 'very_strong';
    missingEvidence: string[];
    suggestedDiscovery: string[];
    witnessRecommendations: string[];
  };

  // AI Model Information
  @Column()
  aiModel: string;

  @Column()
  aiProvider: string;

  @Column({ type: 'decimal', precision: 5, scale: 4 })
  confidenceScore: number;

  @Column({ type: 'json', nullable: true })
  processingMetrics: {
    processingTime: number;
    tokensUsed: number;
    costEstimate: number;
  };

  // Quality Assurance
  @Column({ default: false })
  humanReviewed: boolean;

  @Column({ nullable: true })
  reviewedBy: string;

  @Column({ nullable: true })
  reviewedAt: Date;

  @Column({ type: 'text', nullable: true })
  reviewNotes: string;

  @Column({ type: 'int', nullable: true })
  qualityScore: number; // 1-10 scale

  // Metadata
  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  // Error Handling
  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'json', nullable: true })
  errorDetails: Record<string, any>;

  // Relationships
  @ManyToOne(() => Case, caseEntity => caseEntity.analyses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'caseId' })
  case: Case;

  @Column()
  caseId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'initiatedBy' })
  initiator: User;

  @Column()
  initiatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;
}