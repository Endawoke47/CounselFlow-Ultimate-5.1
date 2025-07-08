import { PartialType } from '@nestjs/mapped-types';
import { CreateMatterDto } from './create-matter.dto';
import { IsOptional, IsDateString } from 'class-validator';

export class UpdateMatterDto extends PartialType(CreateMatterDto) {
  @IsOptional()
  @IsDateString()
  closedAt?: string;
}