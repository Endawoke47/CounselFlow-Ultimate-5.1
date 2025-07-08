import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MattersService } from './matters.service';
import { CreateMatterDto } from './dto/create-matter.dto';
import { UpdateMatterDto } from './dto/update-matter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Legal Matters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('matters')
export class MattersController {
  constructor(private readonly mattersService: MattersService) {}

  @ApiOperation({ summary: 'Create a new matter' })
  @ApiResponse({ status: 201, description: 'Matter created successfully' })
  @Post()
  create(@Body(ValidationPipe) createMatterDto: CreateMatterDto) {
    return this.mattersService.create(createMatterDto);
  }

  @ApiOperation({ summary: 'Get all matters' })
  @ApiResponse({ status: 200, description: 'Matters retrieved successfully' })
  @Get()
  findAll() {
    return this.mattersService.findAll();
  }

  @ApiOperation({ summary: 'Get matter statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @Get('statistics')
  getStatistics() {
    return this.mattersService.getStatistics();
  }

  @ApiOperation({ summary: 'Get matters by client' })
  @ApiResponse({ status: 200, description: 'Client matters retrieved successfully' })
  @Get('client/:clientName')
  findByClient(@Param('clientName') clientName: string) {
    return this.mattersService.findByClient(clientName);
  }

  @ApiOperation({ summary: 'Get matters by status' })
  @ApiResponse({ status: 200, description: 'Status matters retrieved successfully' })
  @Get('status/:status')
  findByStatus(@Param('status') status: string) {
    return this.mattersService.findByStatus(status);
  }

  @ApiOperation({ summary: 'Get matter by ID' })
  @ApiResponse({ status: 200, description: 'Matter retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Matter not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mattersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update matter' })
  @ApiResponse({ status: 200, description: 'Matter updated successfully' })
  @ApiResponse({ status: 404, description: 'Matter not found' })
  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateMatterDto: UpdateMatterDto) {
    return this.mattersService.update(id, updateMatterDto);
  }

  @ApiOperation({ summary: 'Delete matter' })
  @ApiResponse({ status: 200, description: 'Matter deleted successfully' })
  @ApiResponse({ status: 404, description: 'Matter not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mattersService.remove(id);
  }
}