import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
  @ApiProperty({ example: 'Can you help me analyze this contract?' })
  @IsString()
  message: string;

  @ApiProperty({ example: 'Contract review context...', required: false })
  @IsOptional()
  @IsString()
  context?: string;
}