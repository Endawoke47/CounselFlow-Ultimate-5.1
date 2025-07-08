import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DocumentGenerationDto {
  @ApiProperty({ example: 'nda' })
  @IsString()
  documentType: string;

  @ApiProperty({ example: { companyName: 'ABC Corp', recipientName: 'John Doe' } })
  @IsObject()
  parameters: any;

  @ApiProperty({ example: 'standard', required: false })
  @IsOptional()
  @IsString()
  template?: string;
}