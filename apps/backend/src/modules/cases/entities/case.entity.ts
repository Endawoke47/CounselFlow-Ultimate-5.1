import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  OneToMany, 
  JoinColumn 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CaseDocument } from './case-document.entity';
import { CaseAnalysis } from './case-analysis.entity';

export enum CaseType {
  LITIGATION = 'litigation',
  CONTRACT = 'contract',
  INTELLECTUAL_PROPERTY = 'intellectual_property',
  EMPLOYMENT = 'employment',
  REAL_ESTATE = 'real_estate',
  CORPORATE = 'corporate',
  CRIMINAL = 'criminal',
  FAMILY = 'family',
  IMMIGRATION = 'immigration',
  BANKRUPTCY = 'bankruptcy',
  OTHER = 'other'
}

export enum CaseStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  IN_PROGRESS = 'in_progress',
  UNDER_INVESTIGATION = 'under_investigation',
  DISCOVERY = 'discovery',
  MEDIATION = 'mediation',
  TRIAL = 'trial',
  SETTLEMENT = 'settlement',
  CLOSED = 'closed',
  ARCHIVED = 'archived'
}

export enum CasePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical'
}

@Entity('cases')
export class Case {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    default: CaseType.OTHER
  })
  type: CaseType;

  @Column({
    type: 'varchar',
    default: CaseStatus.DRAFT
  })
  status: CaseStatus;

  @Column({
    type: 'varchar',
    default: CasePriority.MEDIUM
  })
  priority: CasePriority;

  // Client Information
  @Column()
  clientName: string;

  @Column({ nullable: true })
  clientEmail: string;

  @Column({ nullable: true })
  clientPhone: string;

  @Column({ type: 'text', nullable: true })
  clientAddress: string;

  // Legal Details
  @Column({ nullable: true })
  jurisdiction: string;

  @Column({ nullable: true })
  court: string;

  @Column({ nullable: true })
  caseNumber: string;

  @Column({ nullable: true })
  opposingParty: string;

  @Column({ nullable: true })
  opposingCounsel: string;

  // Financial Information
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  estimatedValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  billableHours: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  hourlyRate: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalCosts: number;

  // Important Dates
  @Column({ nullable: true })
  dueDate: Date;

  @Column({ nullable: true })
  filingDate: Date;

  @Column({ nullable: true })
  trialDate: Date;

  @Column({ nullable: true })
  closedAt: Date;

  // AI Processing Status
  @Column({ default: false })
  aiProcessed: boolean;

  @Column({ nullable: true })
  aiProcessingStartedAt: Date;

  @Column({ nullable: true })
  aiProcessingCompletedAt: Date;

  @Column({ type: 'text', nullable: true })
  aiProcessingStatus: string; // 'pending', 'processing', 'completed', 'failed'

  @Column({ type: 'text', nullable: true })
  aiProcessingError: string;

  // Metadata
  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Relationships
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @Column()
  createdBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedLawyerId' })
  assignedLawyer: User;

  @Column({ nullable: true })
  assignedLawyerId: string;

  @OneToMany(() => CaseDocument, document => document.case, { cascade: true })
  documents: CaseDocument[];

  @OneToMany(() => CaseAnalysis, analysis => analysis.case, { cascade: true })
  analyses: CaseAnalysis[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}