import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContractAnalysisDto {
  @ApiProperty({ example: 'Full contract text content...' })
  @IsString()
  contractText: string;

  @ApiProperty({ example: 'employment', required: false })
  @IsOptional()
  @IsString()
  contractType?: string;

  @ApiProperty({ example: 'risk_assessment', required: false })
  @IsOptional()
  @IsString()
  analysisType?: string;
}