import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'Senior Partner', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Smith & Associates', required: false })
  @IsOptional()
  @IsString()
  firm?: string;

  @ApiProperty({ example: 'BAR123456', required: false })
  @IsOptional()
  @IsString()
  barNumber?: string;

  @ApiProperty({ example: 'New York', required: false })
  @IsOptional()
  @IsString()
  jurisdiction?: string;
}