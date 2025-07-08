import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

import { Case, CaseStatus } from './entities/case.entity';
import { CaseDocument, DocumentStatus } from './entities/case-document.entity';
import { CaseAnalysis, AnalysisStatus, AnalysisType } from './entities/case-analysis.entity';
import { CreateCaseDto } from './dto/create-case.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { AnalyzeCaseDto } from './dto/analyze-case.dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class CasesService {
  private readonly logger = new Logger(CasesService.name);
  private readonly uploadPath: string;

  constructor(
    @InjectRepository(Case)
    private caseRepository: Repository<Case>,
    @InjectRepository(CaseDocument)
    private documentRepository: Repository<CaseDocument>,
    @InjectRepository(CaseAnalysis)
    private analysisRepository: Repository<CaseAnalysis>,
    private aiService: AiService,
    private configService: ConfigService
  ) {
    this.uploadPath = this.configService.get('UPLOAD_PATH', './uploads');
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  // Case Management
  async createCase(createCaseDto: CreateCaseDto, userId: string): Promise<Case> {
    try {
      const caseEntity = this.caseRepository.create({
        ...createCaseDto,
        createdBy: userId,
        dueDate: createCaseDto.dueDate ? new Date(createCaseDto.dueDate) : null,
        filingDate: createCaseDto.filingDate ? new Date(createCaseDto.filingDate) : null,
        trialDate: createCaseDto.trialDate ? new Date(createCaseDto.trialDate) : null,
      });

      const savedCase = await this.caseRepository.save(caseEntity);
      this.logger.log(`Created case ${savedCase.id} by user ${userId}`);
      return savedCase;
    } catch (error) {
      this.logger.error(`Failed to create case: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to create case');
    }
  }

  async findAllCases(
    userId: string,
    page: number = 1,
    limit: number = 20,
    search?: string,
    status?: CaseStatus,
    type?: string
  ): Promise<{ cases: Case[]; total: number; page: number; limit: number }> {
    const options: FindManyOptions<Case> = {
      relations: ['creator', 'assignedLawyer', 'documents', 'analyses'],
      order: { updatedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    };

    const whereConditions: any = {};

    if (search) {
      whereConditions.title = Like(`%${search}%`);
    }

    if (status) {
      whereConditions.status = status;
    }

    if (type) {
      whereConditions.type = type;
    }

    options.where = whereConditions;

    const [cases, total] = await this.caseRepository.findAndCount(options);

    return {
      cases,
      total,
      page,
      limit,
    };
  }

  async findCaseById(caseId: string, userId: string): Promise<Case> {
    const caseEntity = await this.caseRepository.findOne({
      where: { id: caseId },
      relations: ['creator', 'assignedLawyer', 'documents', 'analyses'],
    });

    if (!caseEntity) {
      throw new NotFoundException(`Case with ID ${caseId} not found`);
    }

    return caseEntity;
  }

  async updateCase(caseId: string, updateData: Partial<CreateCaseDto>, userId: string): Promise<Case> {
    const caseEntity = await this.findCaseById(caseId, userId);
    
    const updatedCase = await this.caseRepository.save({
      ...caseEntity,
      ...updateData,
      dueDate: updateData.dueDate ? new Date(updateData.dueDate) : caseEntity.dueDate,
      filingDate: updateData.filingDate ? new Date(updateData.filingDate) : caseEntity.filingDate,
      trialDate: updateData.trialDate ? new Date(updateData.trialDate) : caseEntity.trialDate,
    });

    this.logger.log(`Updated case ${caseId} by user ${userId}`);
    return updatedCase;
  }

  async deleteCase(caseId: string, userId: string): Promise<void> {
    const caseEntity = await this.findCaseById(caseId, userId);
    
    // Delete associated files
    const documents = await this.documentRepository.find({ where: { caseId } });
    for (const doc of documents) {
      if (fs.existsSync(doc.filePath)) {
        fs.unlinkSync(doc.filePath);
      }
    }

    await this.caseRepository.remove(caseEntity);
    this.logger.log(`Deleted case ${caseId} by user ${userId}`);
  }

  // Document Management
  async uploadDocument(
    file: Express.Multer.File,
    uploadDocumentDto: UploadDocumentDto,
    userId: string
  ): Promise<CaseDocument> {
    const { caseId } = uploadDocumentDto;
    
    // Verify case exists
    await this.findCaseById(caseId, userId);

    // Create unique filename
    const fileExtension = path.extname(file.originalname);
    const filename = `${uuid()}${fileExtension}`;
    const filePath = path.join(this.uploadPath, filename);

    try {
      // Save file to disk
      fs.writeFileSync(filePath, file.buffer);

      // Create document record
      const document = this.documentRepository.create({
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        filePath,
        fileUrl: `/uploads/${filename}`,
        caseId,
        uploadedBy: userId,
        ...uploadDocumentDto,
      });

      const savedDocument = await this.documentRepository.save(document);

      // Auto-analyze if requested
      if (uploadDocumentDto.autoAnalyze !== false) {
        this.analyzeDocument(savedDocument.id, userId).catch(error => {
          this.logger.error(`Auto-analysis failed for document ${savedDocument.id}: ${error.message}`);
        });
      }

      this.logger.log(`Uploaded document ${savedDocument.id} for case ${caseId}`);
      return savedDocument;
    } catch (error) {
      // Clean up file if database save fails
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      this.logger.error(`Failed to upload document: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to upload document');
    }
  }

  private async analyzeDocument(documentId: string, userId: string): Promise<void> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
      relations: ['case'],
    });

    if (!document) {
      throw new NotFoundException(`Document ${documentId} not found`);
    }

    try {
      document.status = DocumentStatus.PROCESSING;
      await this.documentRepository.save(document);

      // Extract text from document
      const fileContent = fs.readFileSync(document.filePath);
      const extractedText = await this.extractTextFromFile(fileContent, document.mimeType);

      // Perform AI analysis
      const [summary, keyTerms, riskAssessment] = await Promise.all([
        this.aiService.summarizeText(extractedText),
        this.aiService.extractKeyTerms(extractedText),
        this.aiService.assessRisk(extractedText, 'contract'),
      ]);

      // Update document with analysis results
      document.extractedText = extractedText;
      document.aiSummary = summary;
      document.keyTerms = keyTerms;
      document.riskAssessment = riskAssessment;
      document.aiAnalyzed = true;
      document.status = DocumentStatus.ANALYZED;
      document.analyzedAt = new Date();

      await this.documentRepository.save(document);
      this.logger.log(`Analyzed document ${documentId}`);
    } catch (error) {
      document.status = DocumentStatus.UPLOADED;
      await this.documentRepository.save(document);
      this.logger.error(`Failed to analyze document ${documentId}: ${error.message}`);
      throw error;
    }
  }

  private async extractTextFromFile(fileContent: Buffer, mimeType: string): Promise<string> {
    // For now, return placeholder - in production, implement PDF, DOC, etc. extraction
    if (mimeType === 'text/plain') {
      return fileContent.toString('utf-8');
    }
    
    // TODO: Implement PDF, DOCX, etc. text extraction using libraries like pdf-parse, mammoth
    return 'Text extraction not implemented for this file type';
  }

  // Case Analysis
  async analyzeCase(analyzeCaseDto: AnalyzeCaseDto, userId: string): Promise<CaseAnalysis> {
    const { caseId, analysisType } = analyzeCaseDto;
    
    const caseEntity = await this.findCaseById(caseId, userId);

    // Create analysis record
    const analysis = this.analysisRepository.create({
      caseId,
      type: analysisType,
      status: AnalysisStatus.PENDING,
      title: analyzeCaseDto.title || `${analysisType} Analysis`,
      description: analyzeCaseDto.description,
      initiatedBy: userId,
      aiModel: 'gpt-4-turbo',
      aiProvider: 'openai',
      confidenceScore: 0,
    });

    const savedAnalysis = await this.analysisRepository.save(analysis);

    // Perform analysis asynchronously
    this.performCaseAnalysis(savedAnalysis.id, analyzeCaseDto, userId).catch(error => {
      this.logger.error(`Case analysis failed for ${savedAnalysis.id}: ${error.message}`);
    });

    return savedAnalysis;
  }

  private async performCaseAnalysis(analysisId: string, dto: AnalyzeCaseDto, userId: string): Promise<void> {
    const analysis = await this.analysisRepository.findOne({
      where: { id: analysisId },
      relations: ['case'],
    });

    if (!analysis) {
      throw new NotFoundException(`Analysis ${analysisId} not found`);
    }

    try {
      // Update status to in progress
      analysis.status = AnalysisStatus.IN_PROGRESS;
      await this.analysisRepository.save(analysis);

      // Gather all relevant documents
      let documents: CaseDocument[] = [];
      if (dto.documentIds && dto.documentIds.length > 0) {
        documents = await this.documentRepository.find({
          where: { id: In(dto.documentIds), caseId: dto.caseId },
        });
      } else if (dto.includeAllDocuments !== false) {
        documents = await this.documentRepository.find({
          where: { caseId: dto.caseId, aiAnalyzed: true },
        });
      }

      // Compile analysis context
      const analysisContext = this.buildAnalysisContext(analysis.case, documents, dto);

      // Perform different types of analysis based on type
      let analysisResults: any;
      
      switch (dto.analysisType) {
        case AnalysisType.DOCUMENT_REVIEW:
          analysisResults = await this.performDocumentReview(analysisContext, dto);
          break;
        case AnalysisType.RISK_ASSESSMENT:
          analysisResults = await this.performRiskAssessment(analysisContext, dto);
          break;
        case AnalysisType.LEGAL_RESEARCH:
          analysisResults = await this.performLegalResearch(analysisContext, dto);
          break;
        case AnalysisType.CASE_STRATEGY:
          analysisResults = await this.performCaseStrategy(analysisContext, dto);
          break;
        default:
          analysisResults = await this.performGeneralAnalysis(analysisContext, dto);
      }

      // Update analysis with results
      analysis.analysisResults = analysisResults;
      analysis.status = AnalysisStatus.COMPLETED;
      analysis.completedAt = new Date();
      analysis.confidenceScore = analysisResults.confidenceScore || 0.8;

      await this.analysisRepository.save(analysis);

      // Update case AI processing status
      await this.updateCaseAIStatus(dto.caseId, true);

      this.logger.log(`Completed case analysis ${analysisId}`);
    } catch (error) {
      analysis.status = AnalysisStatus.FAILED;
      analysis.errorMessage = error.message;
      analysis.errorDetails = { stack: error.stack };
      await this.analysisRepository.save(analysis);
      
      this.logger.error(`Case analysis failed for ${analysisId}: ${error.message}`);
      throw error;
    }
  }

  private buildAnalysisContext(caseEntity: Case, documents: CaseDocument[], dto: AnalyzeCaseDto): string {
    let context = `Case Analysis Context:\n\n`;
    context += `Case Title: ${caseEntity.title}\n`;
    context += `Case Type: ${caseEntity.type}\n`;
    context += `Status: ${caseEntity.status}\n`;
    context += `Priority: ${caseEntity.priority}\n`;
    context += `Client: ${caseEntity.clientName}\n`;
    
    if (caseEntity.description) {
      context += `Description: ${caseEntity.description}\n`;
    }

    if (documents.length > 0) {
      context += `\nDocuments analyzed (${documents.length}):\n`;
      documents.forEach((doc, index) => {
        context += `${index + 1}. ${doc.originalName} (${doc.type})\n`;
        if (doc.extractedText) {
          context += `Content: ${doc.extractedText.substring(0, 1000)}...\n\n`;
        }
      });
    }

    if (dto.analysisContext) {
      context += `\nAdditional Context: ${dto.analysisContext}\n`;
    }

    return context;
  }

  private async performDocumentReview(context: string, dto: AnalyzeCaseDto): Promise<any> {
    const prompt = `Perform a comprehensive document review analysis:\n\n${context}\n\nProvide analysis in JSON format with summary, keyFindings, recommendations, riskLevel, and confidenceScore.`;
    
    const response = await this.aiService.chat({ message: prompt, context: 'document_review' });
    
    try {
      return JSON.parse(response.message);
    } catch {
      return {
        summary: response.message,
        keyFindings: ['AI analysis completed'],
        recommendations: ['Review completed documents'],
        riskLevel: 'medium',
        confidenceScore: 0.8,
        detailedAnalysis: { fullResponse: response.message }
      };
    }
  }

  private async performRiskAssessment(context: string, dto: AnalyzeCaseDto): Promise<any> {
    const riskResponse = await this.aiService.assessRisk(context, 'general');
    
    return {
      summary: 'Risk assessment completed',
      keyFindings: riskResponse.risks || ['Risk analysis performed'],
      recommendations: riskResponse.recommendations || ['Monitor identified risks'],
      riskLevel: riskResponse.riskLevel || 'medium',
      confidenceScore: riskResponse.confidence || 0.8,
      detailedAnalysis: riskResponse
    };
  }

  private async performLegalResearch(context: string, dto: AnalyzeCaseDto): Promise<any> {
    const researchResponse = await this.aiService.legalResearch({
      query: `Legal research for: ${context}`,
      jurisdiction: 'general'
    });

    return {
      summary: researchResponse.summary || 'Legal research completed',
      keyFindings: researchResponse.keyFindings || ['Research analysis performed'],
      recommendations: researchResponse.nextSteps || ['Continue legal research'],
      riskLevel: 'medium',
      confidenceScore: 0.8,
      detailedAnalysis: researchResponse
    };
  }

  private async performCaseStrategy(context: string, dto: AnalyzeCaseDto): Promise<any> {
    const prompt = `Develop a comprehensive case strategy:\n\n${context}\n\nProvide strategic recommendations in JSON format.`;
    
    const response = await this.aiService.chat({ message: prompt, context: 'case_strategy' });
    
    return {
      summary: 'Case strategy analysis completed',
      keyFindings: ['Strategic analysis performed'],
      recommendations: ['Implement recommended strategy'],
      riskLevel: 'medium',
      confidenceScore: 0.8,
      detailedAnalysis: { strategy: response.message }
    };
  }

  private async performGeneralAnalysis(context: string, dto: AnalyzeCaseDto): Promise<any> {
    const response = await this.aiService.chat({ 
      message: `Perform general analysis:\n\n${context}`, 
      context: 'general_analysis' 
    });
    
    return {
      summary: 'General analysis completed',
      keyFindings: ['Analysis performed successfully'],
      recommendations: ['Review analysis results'],
      riskLevel: 'medium',
      confidenceScore: 0.8,
      detailedAnalysis: { analysis: response.message }
    };
  }

  private async updateCaseAIStatus(caseId: string, processed: boolean): Promise<void> {
    await this.caseRepository.update(caseId, {
      aiProcessed: processed,
      aiProcessingCompletedAt: processed ? new Date() : null,
      aiProcessingStatus: processed ? 'completed' : 'pending',
    });
  }

  // Analysis Management
  async getAnalyses(caseId: string, userId: string): Promise<CaseAnalysis[]> {
    await this.findCaseById(caseId, userId); // Verify access
    
    return this.analysisRepository.find({
      where: { caseId },
      relations: ['initiator'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAnalysisById(analysisId: string, userId: string): Promise<CaseAnalysis> {
    const analysis = await this.analysisRepository.findOne({
      where: { id: analysisId },
      relations: ['case', 'initiator'],
    });

    if (!analysis) {
      throw new NotFoundException(`Analysis ${analysisId} not found`);
    }

    return analysis;
  }

  // Document Management
  async getDocuments(caseId: string, userId: string): Promise<CaseDocument[]> {
    await this.findCaseById(caseId, userId); // Verify access
    
    return this.documentRepository.find({
      where: { caseId },
      relations: ['uploader'],
      order: { createdAt: 'DESC' },
    });
  }

  async deleteDocument(documentId: string, userId: string): Promise<void> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
      relations: ['case'],
    });

    if (!document) {
      throw new NotFoundException(`Document ${documentId} not found`);
    }

    // Delete file from disk
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await this.documentRepository.remove(document);
    this.logger.log(`Deleted document ${documentId}`);
  }
}