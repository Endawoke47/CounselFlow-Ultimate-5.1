import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, IsArray, IsUUID, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContractDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(['employment', 'service', 'nda', 'partnership', 'licensing', 'real_estate', 'vendor', 'other'])
  type: string;

  @IsOptional()
  @IsEnum(['draft', 'review', 'negotiation', 'executed', 'expired', 'terminated'])
  status?: string;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'critical'])
  priority?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  value?: number;

  @IsOptional()
  @IsDateString()
  effectiveDate?: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @IsOptional()
  @IsDateString()
  renewalDate?: string;

  @IsOptional()
  @IsBoolean()
  autoRenewal?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  renewalNoticeDays?: number;

  @IsOptional()
  @IsString()
  terms?: string;

  @IsOptional()
  @IsArray()
  parties?: any[];

  @IsOptional()
  keyTerms?: any;

  @IsOptional()
  riskAssessment?: any;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  documentPath?: string;

  @IsOptional()
  @IsUUID()
  assignedLawyerId?: string;

  @IsOptional()
  @IsUUID()
  matterId?: string;
}