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

export enum DocumentType {
  COMPLAINT = 'complaint',
  ANSWER = 'answer',
  MOTION = 'motion',
  BRIEF = 'brief',
  CONTRACT = 'contract',
  EVIDENCE = 'evidence',
  CORRESPONDENCE = 'correspondence',
  DISCOVERY = 'discovery',
  DEPOSITION = 'deposition',
  EXPERT_REPORT = 'expert_report',
  FINANCIAL_DOCUMENT = 'financial_document',
  LEGAL_MEMO = 'legal_memo',
  RESEARCH = 'research',
  OTHER = 'other'
}

export enum DocumentStatus {
  UPLOADED = 'uploaded',
  PROCESSING = 'processing',
  ANALYZED = 'analyzed',
  REVIEWED = 'reviewed',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

@Entity('case_documents')
export class CaseDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column()
  filePath: string;

  @Column({ nullable: true })
  fileUrl: string;

  @Column({
    type: 'varchar',
    default: DocumentType.OTHER
  })
  type: DocumentType;

  @Column({
    type: 'varchar',
    default: DocumentStatus.UPLOADED
  })
  status: DocumentStatus;

  @Column({ type: 'text', nullable: true })
  description: string;

  // AI Analysis Results
  @Column({ default: false })
  aiAnalyzed: boolean;

  @Column({ type: 'text', nullable: true })
  extractedText: string;

  @Column({ type: 'json', nullable: true })
  aiSummary: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  keyTerms: string[];

  @Column({ type: 'json', nullable: true })
  entities: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  riskAssessment: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  compliance: Record<string, any>;

  @Column({ type: 'simple-array', nullable: true })
  suggestedActions: string[];

  // OCR and Processing
  @Column({ default: false })
  ocrProcessed: boolean;

  @Column({ type: 'json', nullable: true })
  ocrData: Record<string, any>;

  // Security and Access
  @Column({ default: false })
  isConfidential: boolean;

  @Column({ type: 'simple-array', nullable: true })
  accessPermissions: string[];

  @Column({ nullable: true })
  encryptionKey: string;

  // Version Control
  @Column({ default: 1 })
  version: number;

  @Column({ nullable: true })
  parentDocumentId: string;

  @Column({ type: 'text', nullable: true })
  versionNotes: string;

  // Metadata
  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  // Relationships
  @ManyToOne(() => Case, caseEntity => caseEntity.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'caseId' })
  case: Case;

  @Column()
  caseId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploadedBy' })
  uploader: User;

  @Column()
  uploadedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  analyzedAt: Date;
}