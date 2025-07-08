import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LegalResearchDto {
  @ApiProperty({ example: 'Contract dispute resolution in New York' })
  @IsString()
  query: string;

  @ApiProperty({ example: 'New York', required: false })
  @IsOptional()
  @IsString()
  jurisdiction?: string;

  @ApiProperty({ example: ['contract law', 'dispute resolution'], required: false })
  @IsOptional()
  @IsArray()
  keywords?: string[];
}