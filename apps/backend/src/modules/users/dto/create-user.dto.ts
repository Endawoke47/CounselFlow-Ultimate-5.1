import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'hashedpassword' })
  @IsString()
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

  @ApiProperty({ example: 'Experienced attorney...', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 'associate', enum: ['admin', 'partner', 'associate', 'paralegal', 'client'], required: false })
  @IsOptional()
  @IsEnum(['admin', 'partner', 'associate', 'paralegal', 'client'])
  role?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}