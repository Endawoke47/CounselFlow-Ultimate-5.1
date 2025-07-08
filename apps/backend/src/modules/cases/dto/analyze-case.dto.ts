import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsArray, 
  IsBoolean
} from 'class-validator';
import { AnalysisType } from '../entities/case-analysis.entity';

export class AnalyzeCaseDto {
  @ApiProperty({ description: 'ID of the case to analyze' })
  @IsString()
  caseId: string;

  @ApiProperty({ 
    description: 'Type of analysis to perform',
    enum: AnalysisType
  })
  @IsEnum(AnalysisType)
  analysisType: AnalysisType;

  @ApiPropertyOptional({ description: 'Custom title for the analysis' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Description of what to analyze' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Specific document IDs to include in analysis',
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documentIds?: string[];

  @ApiPropertyOptional({ 
    description: 'Whether to include all case documents in analysis',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  includeAllDocuments?: boolean;

  @ApiPropertyOptional({ 
    description: 'Additional context or instructions for the AI',
    example: 'Focus on contract compliance and risk assessment'
  })
  @IsOptional()
  @IsString()
  analysisContext?: string;

  @ApiPropertyOptional({ 
    description: 'Whether to generate financial analysis',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  includeFinancialAnalysis?: boolean;

  @ApiPropertyOptional({ 
    description: 'Whether to generate timeline analysis',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  includeTimelineAnalysis?: boolean;

  @ApiPropertyOptional({ 
    description: 'Whether to include legal research and precedents',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  includeLegalResearch?: boolean;
}