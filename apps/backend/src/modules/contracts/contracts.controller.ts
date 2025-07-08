import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('contracts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contract' })
  @ApiResponse({ status: 201, description: 'Contract created successfully' })
  async create(@Body(ValidationPipe) createContractDto: CreateContractDto) {
    try {
      return await this.contractsService.create(createContractDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create contract: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all contracts' })
  @ApiResponse({ status: 200, description: 'List of all contracts' })
  async findAll(@Query('status') status?: string, @Query('type') type?: string) {
    try {
      if (status) {
        return await this.contractsService.findByStatus(status);
      }
      if (type) {
        return await this.contractsService.findByType(type);
      }
      return await this.contractsService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch contracts: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get contract statistics' })
  @ApiResponse({ status: 200, description: 'Contract statistics' })
  async getStatistics() {
    try {
      return await this.contractsService.getStatistics();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch statistics: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('expiring')
  @ApiOperation({ summary: 'Get contracts expiring soon' })
  @ApiResponse({ status: 200, description: 'List of expiring contracts' })
  async findExpiringSoon(@Query('days') days?: string) {
    try {
      const daysNumber = days ? parseInt(days, 10) : 30;
      return await this.contractsService.findExpiringSoon(daysNumber);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch expiring contracts: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a contract by ID' })
  @ApiResponse({ status: 200, description: 'Contract details' })
  async findOne(@Param('id') id: string) {
    return this.contractsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a contract' })
  @ApiResponse({ status: 200, description: 'Contract updated successfully' })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateContractDto: UpdateContractDto,
  ) {
    return this.contractsService.update(id, updateContractDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contract' })
  @ApiResponse({ status: 200, description: 'Contract deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.contractsService.remove(id);
    return { message: 'Contract deleted successfully' };
  }

  @Get('matter/:matterId')
  @ApiOperation({ summary: 'Get contracts by matter ID' })
  @ApiResponse({ status: 200, description: 'List of contracts for the matter' })
  async findByMatter(@Param('matterId') matterId: string) {
    return this.contractsService.findByMatter(matterId);
  }
}