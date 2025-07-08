import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  firm: string;

  @Column({ nullable: true })
  barNumber: string;

  @Column({ nullable: true })
  jurisdiction: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', default: 'associate' })
  role: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  preferences: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastLoginAt: Date;
}