import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, IsArray, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMatterDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  clientName: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsEnum(['litigation', 'corporate', 'employment', 'intellectual_property', 'real_estate', 'criminal', 'family', 'immigration', 'other'])
  type: string;

  @IsOptional()
  @IsEnum(['active', 'pending', 'closed', 'on_hold'])
  status?: string;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'critical'])
  priority?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  estimatedValue?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  billableHours?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  hourlyRate?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  customFields?: any;

  @IsOptional()
  @IsUUID()
  assignedLawyerId?: string;
}