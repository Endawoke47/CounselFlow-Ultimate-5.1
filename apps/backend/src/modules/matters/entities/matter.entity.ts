import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('matters')
export class Matter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  clientName: string;

  @Column({ nullable: true })
  clientId: string;

  @Column({ type: 'text', default: 'other' })
  type: string;

  @Column({ type: 'text', default: 'pending' })
  status: string;

  @Column({ type: 'text', default: 'medium' })
  priority: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  estimatedValue: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  billableHours: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  hourlyRate: number;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({ type: 'text', nullable: true })
  tags: string;

  @Column({ type: 'text', nullable: true })
  customFields: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assignedLawyerId' })
  assignedLawyer: User;

  @Column({ nullable: true })
  assignedLawyerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  closedAt: Date;
}