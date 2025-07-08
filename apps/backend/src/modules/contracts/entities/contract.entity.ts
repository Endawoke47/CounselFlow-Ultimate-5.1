import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Matter } from '../../matters/entities/matter.entity';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', default: 'other' })
  type: string;

  @Column({ type: 'text', default: 'draft' })
  status: string;

  @Column({ type: 'text', default: 'medium' })
  priority: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  value: number;

  @Column({ nullable: true })
  effectiveDate: Date;

  @Column({ nullable: true })
  expirationDate: Date;

  @Column({ nullable: true })
  renewalDate: Date;

  @Column({ default: false })
  autoRenewal: boolean;

  @Column({ nullable: true })
  renewalNoticeDays: number;

  @Column({ type: 'text', nullable: true })
  terms: string;

  @Column({ type: 'text', nullable: true })
  parties: string;

  @Column({ type: 'text', nullable: true })
  keyTerms: string;

  @Column({ type: 'text', nullable: true })
  riskAssessment: string;

  @Column({ type: 'text', nullable: true })
  tags: string;

  @Column({ nullable: true })
  documentPath: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assignedLawyerId' })
  assignedLawyer: User;

  @Column({ nullable: true })
  assignedLawyerId: string;

  @ManyToOne(() => Matter, { nullable: true })
  @JoinColumn({ name: 'matterId' })
  matter: Matter;

  @Column({ nullable: true })
  matterId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}