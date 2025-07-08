import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsEnum, 
  IsNumber, 
  IsDateString, 
  IsArray, 
  IsObject,
  IsPhoneNumber,
  Min,
  Max,
  Length
} from 'class-validator';
import { Type } from 'class-transformer';
import { CaseType, CaseStatus, CasePriority } from '../entities/case.entity';

export class CreateCaseDto {
  @ApiProperty({ description: 'Title of the case' })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiPropertyOptional({ description: 'Detailed description of the case' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Type of case',
    enum: CaseType,
    default: CaseType.OTHER
  })
  @IsEnum(CaseType)
  type: CaseType;

  @ApiPropertyOptional({ 
    description: 'Current status of the case',
    enum: CaseStatus,
    default: CaseStatus.DRAFT
  })
  @IsOptional()
  @IsEnum(CaseStatus)
  status?: CaseStatus;

  @ApiPropertyOptional({ 
    description: 'Priority level of the case',
    enum: CasePriority,
    default: CasePriority.MEDIUM
  })
  @IsOptional()
  @IsEnum(CasePriority)
  priority?: CasePriority;

  // Client Information
  @ApiProperty({ description: 'Name of the client' })
  @IsString()
  @Length(1, 100)
  clientName: string;

  @ApiPropertyOptional({ description: 'Client email address' })
  @IsOptional()
  @IsEmail()
  clientEmail?: string;

  @ApiPropertyOptional({ description: 'Client phone number' })
  @IsOptional()
  @IsPhoneNumber()
  clientPhone?: string;

  @ApiPropertyOptional({ description: 'Client address' })
  @IsOptional()
  @IsString()
  clientAddress?: string;

  // Legal Details
  @ApiPropertyOptional({ description: 'Legal jurisdiction' })
  @IsOptional()
  @IsString()
  jurisdiction?: string;

  @ApiPropertyOptional({ description: 'Court name' })
  @IsOptional()
  @IsString()
  court?: string;

  @ApiPropertyOptional({ description: 'Official case number' })
  @IsOptional()
  @IsString()
  caseNumber?: string;

  @ApiPropertyOptional({ description: 'Opposing party name' })
  @IsOptional()
  @IsString()
  opposingParty?: string;

  @ApiPropertyOptional({ description: 'Opposing counsel name' })
  @IsOptional()
  @IsString()
  opposingCounsel?: string;

  // Financial Information
  @ApiPropertyOptional({ 
    description: 'Estimated value of the case',
    minimum: 0
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  estimatedValue?: number;

  @ApiPropertyOptional({ 
    description: 'Billable hours',
    minimum: 0
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  billableHours?: number;

  @ApiPropertyOptional({ 
    description: 'Hourly rate',
    minimum: 0
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  hourlyRate?: number;

  @ApiPropertyOptional({ 
    description: 'Total costs',
    minimum: 0
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalCosts?: number;

  // Important Dates
  @ApiPropertyOptional({ 
    description: 'Due date for the case',
    type: String,
    format: 'date-time'
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ 
    description: 'Filing date',
    type: String,
    format: 'date-time'
  })
  @IsOptional()
  @IsDateString()
  filingDate?: string;

  @ApiPropertyOptional({ 
    description: 'Trial date',
    type: String,
    format: 'date-time'
  })
  @IsOptional()
  @IsDateString()
  trialDate?: string;

  // Assignment
  @ApiPropertyOptional({ description: 'ID of assigned lawyer' })
  @IsOptional()
  @IsString()
  assignedLawyerId?: string;

  // Metadata
  @ApiPropertyOptional({ 
    description: 'Additional metadata',
    type: 'object'
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ 
    description: 'Case tags',
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}