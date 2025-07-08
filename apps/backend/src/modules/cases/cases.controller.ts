import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { AnalyzeCaseDto } from './dto/analyze-case.dto';
import { Case, CaseStatus, CaseType } from './entities/case.entity';
import { CaseDocument } from './entities/case-document.entity';
import { CaseAnalysis } from './entities/case-analysis.entity';

@ApiTags('Cases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new case' })
  @ApiResponse({ status: 201, description: 'Case created successfully', type: Case })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createCase(
    @Body() createCaseDto: CreateCaseDto,
    @Req() req: any,
  ): Promise<Case> {
    return this.casesService.createCase(createCaseDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cases with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
  @ApiQuery({ name: 'status', required: false, enum: CaseStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'type', required: false, enum: CaseType, description: 'Filter by type' })
  @ApiResponse({ status: 200, description: 'Cases retrieved successfully' })
  async getCases(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('status') status?: CaseStatus,
    @Query('type') type?: CaseType,
    @Req() req?: any,
  ) {
    if (limit > 100) {
      throw new BadRequestException('Limit cannot exceed 100');
    }
    
    return this.casesService.findAllCases(
      req.user.userId,
      page,
      limit,
      search,
      status,
      type,
    );
  }

  @Get(':caseId')
  @ApiOperation({ summary: 'Get a specific case by ID' })
  @ApiResponse({ status: 200, description: 'Case retrieved successfully', type: Case })
  @ApiResponse({ status: 404, description: 'Case not found' })
  async getCaseById(
    @Param('caseId', ParseUUIDPipe) caseId: string,
    @Req() req: any,
  ): Promise<Case> {
    return this.casesService.findCaseById(caseId, req.user.userId);
  }

  @Put(':caseId')
  @ApiOperation({ summary: 'Update a case' })
  @ApiResponse({ status: 200, description: 'Case updated successfully', type: Case })
  @ApiResponse({ status: 404, description: 'Case not found' })
  async updateCase(
    @Param('caseId', ParseUUIDPipe) caseId: string,
    @Body() updateCaseDto: Partial<CreateCaseDto>,
    @Req() req: any,
  ): Promise<Case> {
    return this.casesService.updateCase(caseId, updateCaseDto, req.user.userId);
  }

  @Delete(':caseId')
  @ApiOperation({ summary: 'Delete a case' })
  @ApiResponse({ status: 200, description: 'Case deleted successfully' })
  @ApiResponse({ status: 404, description: 'Case not found' })
  async deleteCase(
    @Param('caseId', ParseUUIDPipe) caseId: string,
    @Req() req: any,
  ): Promise<{ message: string }> {
    await this.casesService.deleteCase(caseId, req.user.userId);
    return { message: 'Case deleted successfully' };
  }

  // Document Management Endpoints
  @Post(':caseId/documents')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a document to a case' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Document uploaded successfully', type: CaseDocument })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async uploadDocument(
    @Param('caseId', ParseUUIDPipe) caseId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDocumentDto: UploadDocumentDto,
    @Req() req: any,
  ): Promise<CaseDocument> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size cannot exceed 50MB');
    }

    // Validate file type
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('File type not supported');
    }

    uploadDocumentDto.caseId = caseId;
    return this.casesService.uploadDocument(file, uploadDocumentDto, req.user.userId);
  }

  @Get(':caseId/documents')
  @ApiOperation({ summary: 'Get all documents for a case' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully', type: [CaseDocument] })
  async getCaseDocuments(
    @Param('caseId', ParseUUIDPipe) caseId: string,
    @Req() req: any,
  ): Promise<CaseDocument[]> {
    return this.casesService.getDocuments(caseId, req.user.userId);
  }

  @Delete(':caseId/documents/:documentId')
  @ApiOperation({ summary: 'Delete a document from a case' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async deleteDocument(
    @Param('caseId', ParseUUIDPipe) caseId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @Req() req: any,
  ): Promise<{ message: string }> {
    await this.casesService.deleteDocument(documentId, req.user.userId);
    return { message: 'Document deleted successfully' };
  }

  // AI Analysis Endpoints
  @Post(':caseId/analyze')
  @ApiOperation({ summary: 'Start AI analysis of a case' })
  @ApiResponse({ status: 201, description: 'Analysis started successfully', type: CaseAnalysis })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async analyzeCase(
    @Param('caseId', ParseUUIDPipe) caseId: string,
    @Body() analyzeCaseDto: AnalyzeCaseDto,
    @Req() req: any,
  ): Promise<CaseAnalysis> {
    analyzeCaseDto.caseId = caseId;
    return this.casesService.analyzeCase(analyzeCaseDto, req.user.userId);
  }

  @Get(':caseId/analyses')
  @ApiOperation({ summary: 'Get all analyses for a case' })
  @ApiResponse({ status: 200, description: 'Analyses retrieved successfully', type: [CaseAnalysis] })
  async getCaseAnalyses(
    @Param('caseId', ParseUUIDPipe) caseId: string,
    @Req() req: any,
  ): Promise<CaseAnalysis[]> {
    return this.casesService.getAnalyses(caseId, req.user.userId);
  }

  @Get(':caseId/analyses/:analysisId')
  @ApiOperation({ summary: 'Get a specific analysis by ID' })
  @ApiResponse({ status: 200, description: 'Analysis retrieved successfully', type: CaseAnalysis })
  @ApiResponse({ status: 404, description: 'Analysis not found' })
  async getAnalysisById(
    @Param('caseId', ParseUUIDPipe) caseId: string,
    @Param('analysisId', ParseUUIDPipe) analysisId: string,
    @Req() req: any,
  ): Promise<CaseAnalysis> {
    return this.casesService.getAnalysisById(analysisId, req.user.userId);
  }

  // Bulk Operations
  @Post('bulk/analyze')
  @ApiOperation({ summary: 'Start bulk analysis for multiple cases' })
  @ApiResponse({ status: 202, description: 'Bulk analysis started' })
  async bulkAnalyze(
    @Body() data: { caseIds: string[]; analysisType: string },
    @Req() req: any,
  ): Promise<{ message: string; started: number }> {
    let started = 0;
    
    for (const caseId of data.caseIds) {
      try {
        await this.casesService.analyzeCase(
          {
            caseId,
            analysisType: data.analysisType as any,
            includeAllDocuments: true,
          },
          req.user.userId,
        );
        started++;
      } catch (error) {
        // Log error but continue with other cases
        console.error(`Failed to start analysis for case ${caseId}:`, error);
      }
    }

    return {
      message: `Bulk analysis started for ${started} cases`,
      started,
    };
  }

  // Statistics and Reports
  @Get('stats/summary')
  @ApiOperation({ summary: 'Get case statistics summary' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getCaseStats(@Req() req: any) {
    // This would be implemented with proper aggregation queries
    return {
      total: 0,
      byStatus: {},
      byType: {},
      aiProcessed: 0,
      pendingAnalysis: 0,
    };
  }

  // Export functionality
  @Get(':caseId/export')
  @ApiOperation({ summary: 'Export case data' })
  @ApiResponse({ status: 200, description: 'Case data exported successfully' })
  async exportCase(
    @Param('caseId', ParseUUIDPipe) caseId: string,
    @Query('format') format: 'json' | 'pdf' = 'json',
    @Req() req: any,
  ) {
    const caseData = await this.casesService.findCaseById(caseId, req.user.userId);
    
    if (format === 'json') {
      return caseData;
    }
    
    // PDF export would be implemented here
    throw new BadRequestException('PDF export not yet implemented');
  }
}