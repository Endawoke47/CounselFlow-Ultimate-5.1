import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsArray, 
  IsBoolean,
  Length
} from 'class-validator';
import { DocumentType } from '../entities/case-document.entity';

export class UploadDocumentDto {
  @ApiProperty({ description: 'ID of the case to upload document to' })
  @IsString()
  caseId: string;

  @ApiProperty({ 
    description: 'Type of document',
    enum: DocumentType,
    default: DocumentType.OTHER
  })
  @IsEnum(DocumentType)
  type: DocumentType;

  @ApiPropertyOptional({ description: 'Description of the document' })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Whether the document is confidential',
    default: false
  })
  @IsOptional()
  @IsBoolean()
  isConfidential?: boolean;

  @ApiPropertyOptional({ 
    description: 'Document tags',
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ 
    description: 'Whether to automatically analyze the document with AI',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  autoAnalyze?: boolean;
}