/**
 * CounselFlow Ultimate 5.1 - AI Controller
 * REST API endpoints for AI orchestration and legal AI services
 * Enhanced from CounselFlow Ultimate V3 implementation
 */

import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Query, 
  UseGuards, 
  HttpException, 
  HttpStatus,
  Logger,
  BadRequestException,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiQuery,
  ApiBearerAuth 
} from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AIOrchestrationService, AIProvider, ContractAnalysisResult } from '../services/ai-orchestrator.service';

// DTOs for request validation
export class GenerateTextDto {
  @IsString()
  prompt: string;

  @IsOptional()
  @IsEnum(AIProvider)
  provider?: AIProvider;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  maxTokens?: number;

  @IsOptional()
  temperature?: number;

  @IsOptional()
  @IsBoolean()
  useCache?: boolean;

  @IsOptional()
  retryCount?: number;
}

export class AnalyzeContractDto {
  @IsString()
  contractText: string;

  @IsOptional()
  @IsEnum(['risk_assessment', 'clause_extraction', 'compliance_check'])
  analysisType?: 'risk_assessment' | 'clause_extraction' | 'compliance_check';

  @IsOptional()
  @IsBoolean()
  useConsensus?: boolean;
}

export class GenerateDocumentDto {
  @IsEnum(['nda', 'service_agreement', 'privacy_policy', 'employment_agreement'])
  documentType: 'nda' | 'service_agreement' | 'privacy_policy' | 'employment_agreement';

  @IsObject()
  parameters: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  useConsensus?: boolean;
}

export class LegalResearchDto {
  @IsString()
  topic: string;

  @IsOptional()
  @IsString()
  jurisdiction?: string;

  @IsOptional()
  @IsEnum(['basic', 'comprehensive', 'detailed'])
  researchDepth?: 'basic' | 'comprehensive' | 'detailed';
}

export class LitigationAnalysisDto {
  @IsObject()
  caseDetails: Record<string, any>;

  @IsOptional()
  @IsEnum(['comprehensive', 'strategic', 'risk_assessment'])
  analysisType?: 'comprehensive' | 'strategic' | 'risk_assessment';
}

export class LegalMemoDto {
  @IsObject()
  memoRequest: Record<string, any>;
}

@ApiTags('AI Services')
@ApiBearerAuth()
@Controller('ai')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AIController {
  private readonly logger = new Logger(AIController.name);

  constructor(
    private readonly aiOrchestrationService: AIOrchestrationService
  ) {}

  @Post('generate-text')
  @ApiOperation({ 
    summary: 'Generate text using AI', 
    description: 'Generate text content using specified AI provider with fallback support' 
  })
  @ApiBody({ type: GenerateTextDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Text generated successfully',
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
        provider: { type: 'string' },
        model: { type: 'string' },
        tokensUsed: { type: 'number' },
        processingTime: { type: 'number' },
        cached: { type: 'boolean' },
        timestamp: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  @ApiResponse({ status: 500, description: 'AI generation failed' })
  async generateText(@Body() generateTextDto: GenerateTextDto) {
    try {
      this.logger.log('Generating text', { 
        provider: generateTextDto.provider,
        promptLength: generateTextDto.prompt.length 
      });

      const response = await this.aiOrchestrationService.generateText(
        generateTextDto.prompt,
        {
          provider: generateTextDto.provider,
          model: generateTextDto.model,
          maxTokens: generateTextDto.maxTokens,
          temperature: generateTextDto.temperature,
          useCache: generateTextDto.useCache,
          retryCount: generateTextDto.retryCount
        }
      );

      return {
        success: true,
        data: response,
        message: 'Text generated successfully'
      };

    } catch (error) {
      this.logger.error('Text generation failed', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to generate text',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('analyze-contract')
  @ApiOperation({ 
    summary: 'Analyze legal contract', 
    description: 'Perform AI-powered contract analysis including risk assessment, clause extraction, and compliance checking' 
  })
  @ApiBody({ type: AnalyzeContractDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Contract analyzed successfully',
    schema: {
      type: 'object',
      properties: {
        riskScore: { type: 'number' },
        riskAreas: { type: 'array', items: { type: 'string' } },
        recommendations: { type: 'array', items: { type: 'string' } },
        criticalClauses: { type: 'array', items: { type: 'string' } },
        missingProvisions: { type: 'array', items: { type: 'string' } },
        confidence: { type: 'number' },
        metadata: { type: 'object' }
      }
    }
  })
  async analyzeContract(@Body() analyzeContractDto: AnalyzeContractDto) {
    try {
      this.logger.log('Analyzing contract', { 
        analysisType: analyzeContractDto.analysisType,
        useConsensus: analyzeContractDto.useConsensus,
        contractLength: analyzeContractDto.contractText.length 
      });

      // Validate contract text length
      if (analyzeContractDto.contractText.length < 100) {
        throw new BadRequestException('Contract text must be at least 100 characters long');
      }

      if (analyzeContractDto.contractText.length > 50000) {
        throw new BadRequestException('Contract text exceeds maximum length of 50,000 characters');
      }

      const analysis = await this.aiOrchestrationService.analyzeContract(
        analyzeContractDto.contractText,
        analyzeContractDto.analysisType || 'risk_assessment',
        analyzeContractDto.useConsensus || false
      );

      return {
        success: true,
        data: analysis,
        message: 'Contract analyzed successfully'
      };

    } catch (error) {
      this.logger.error('Contract analysis failed', error);
      
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          message: 'Failed to analyze contract',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('generate-document')
  @ApiOperation({ 
    summary: 'Generate legal document', 
    description: 'Generate legal documents like NDAs, service agreements, privacy policies using AI' 
  })
  @ApiBody({ type: GenerateDocumentDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Document generated successfully',
    schema: {
      type: 'object',
      properties: {
        document: { type: 'string' },
        documentType: { type: 'string' },
        parameters: { type: 'object' },
        metadata: { type: 'object' }
      }
    }
  })
  async generateDocument(@Body() generateDocumentDto: GenerateDocumentDto) {
    try {
      this.logger.log('Generating document', { 
        documentType: generateDocumentDto.documentType,
        useConsensus: generateDocumentDto.useConsensus 
      });

      const document = await this.aiOrchestrationService.generateDocument(
        generateDocumentDto.documentType,
        generateDocumentDto.parameters,
        generateDocumentDto.useConsensus || false
      );

      return {
        success: true,
        data: document,
        message: 'Document generated successfully'
      };

    } catch (error) {
      this.logger.error('Document generation failed', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to generate document',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('legal-research')
  @ApiOperation({ 
    summary: 'Conduct legal research', 
    description: 'Perform AI-powered legal research on specific topics with jurisdiction-specific analysis' 
  })
  @ApiBody({ type: LegalResearchDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Legal research completed successfully' 
  })
  async legalResearch(@Body() legalResearchDto: LegalResearchDto) {
    try {
      this.logger.log('Conducting legal research', { 
        topic: legalResearchDto.topic,
        jurisdiction: legalResearchDto.jurisdiction 
      });

      // Mock implementation - in V3, this would call the research service
      const researchPrompt = `
        Conduct comprehensive legal research on the following topic:
        
        Topic: ${legalResearchDto.topic}
        Jurisdiction: ${legalResearchDto.jurisdiction || 'US'}
        Research Depth: ${legalResearchDto.researchDepth || 'comprehensive'}
        
        Please provide:
        1. Legal Framework Overview
        2. Key Statutes and Regulations
        3. Relevant Case Law (with citations)
        4. Current Legal Trends
        5. Practical Implications
        6. Risk Assessment
        7. Recommended Actions
        
        Format as JSON with these sections clearly defined.
        Include citations where applicable and mark any areas of legal uncertainty.
      `;

      const response = await this.aiOrchestrationService.generateText(researchPrompt, {
        temperature: 0.1,
        maxTokens: 4000
      });

      let researchResult: any;
      try {
        researchResult = JSON.parse(response.content);
      } catch (e) {
        researchResult = { research: response.content };
      }

      researchResult._metadata = {
        topic: legalResearchDto.topic,
        jurisdiction: legalResearchDto.jurisdiction || 'US',
        researchDepth: legalResearchDto.researchDepth || 'comprehensive',
        provider: response.provider,
        processingTime: response.processingTime,
        disclaimer: 'AI-generated research should be verified with legal professionals'
      };

      return {
        success: true,
        data: researchResult,
        message: 'Legal research completed successfully'
      };

    } catch (error) {
      this.logger.error('Legal research failed', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to conduct legal research',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('litigation-analysis')
  @ApiOperation({ 
    summary: 'Analyze litigation strategy', 
    description: 'Perform AI-powered litigation analysis and strategy recommendations' 
  })
  @ApiBody({ type: LitigationAnalysisDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Litigation analysis completed successfully' 
  })
  async litigationAnalysis(@Body() litigationAnalysisDto: LitigationAnalysisDto) {
    try {
      this.logger.log('Analyzing litigation strategy', { 
        analysisType: litigationAnalysisDto.analysisType 
      });

      const strategyPrompt = `
        Analyze the following litigation case and provide strategic recommendations:
        
        Case Details:
        ${JSON.stringify(litigationAnalysisDto.caseDetails, null, 2)}
        
        Analysis Type: ${litigationAnalysisDto.analysisType || 'comprehensive'}
        
        Please provide:
        1. Case Strength Assessment (1-10 scale)
        2. Key Legal Issues
        3. Potential Arguments (for plaintiff/defendant)
        4. Evidence Requirements
        5. Settlement Considerations
        6. Timeline and Milestones
        7. Resource Requirements
        8. Risk Factors
        9. Strategic Recommendations
        10. Alternative Dispute Resolution Options
        
        Format as JSON with detailed analysis for each section.
        Consider both offensive and defensive strategies.
      `;

      const response = await this.aiOrchestrationService.generateText(strategyPrompt, {
        temperature: 0.2,
        maxTokens: 4000
      });

      let strategyResult: any;
      try {
        strategyResult = JSON.parse(response.content);
      } catch (e) {
        strategyResult = { strategy_analysis: response.content };
      }

      strategyResult._metadata = {
        caseId: litigationAnalysisDto.caseDetails.case_id || 'unknown',
        analysisType: litigationAnalysisDto.analysisType || 'comprehensive',
        provider: response.provider,
        processingTime: response.processingTime,
        disclaimer: 'Strategic analysis is AI-generated and should be reviewed by qualified legal counsel'
      };

      return {
        success: true,
        data: strategyResult,
        message: 'Litigation analysis completed successfully'
      };

    } catch (error) {
      this.logger.error('Litigation analysis failed', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to analyze litigation strategy',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('generate-memo')
  @ApiOperation({ 
    summary: 'Generate legal memorandum', 
    description: 'Generate comprehensive legal memorandums with proper structure and citations' 
  })
  @ApiBody({ type: LegalMemoDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Legal memorandum generated successfully' 
  })
  async generateMemo(@Body() legalMemoDto: LegalMemoDto) {
    try {
      this.logger.log('Generating legal memorandum');

      const memoPrompt = `
        Generate a comprehensive legal memorandum with the following requirements:
        
        Memo Request:
        ${JSON.stringify(legalMemoDto.memoRequest, null, 2)}
        
        Structure the memo with:
        1. MEMORANDUM HEADER (To, From, Date, Re)
        2. EXECUTIVE SUMMARY
        3. STATEMENT OF FACTS
        4. LEGAL ANALYSIS
        5. CONCLUSION AND RECOMMENDATIONS
        
        Legal Analysis should include:
        - Applicable law and regulations
        - Case law analysis
        - Legal arguments
        - Risk assessment
        - Alternative approaches
        
        Use proper legal citation format and maintain professional tone throughout.
      `;

      const response = await this.aiOrchestrationService.generateText(memoPrompt, {
        temperature: 0.3,
        maxTokens: 4000
      });

      return {
        success: true,
        data: {
          memorandum: response.content,
          memoType: legalMemoDto.memoRequest.memo_type || 'general',
          client: legalMemoDto.memoRequest.client || 'unknown',
          metadata: {
            provider: response.provider,
            processingTime: response.processingTime,
            generatedDate: new Date().toISOString(),
            disclaimer: 'This memorandum is AI-generated and requires review by qualified legal counsel'
          }
        },
        message: 'Legal memorandum generated successfully'
      };

    } catch (error) {
      this.logger.error('Legal memo generation failed', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to generate legal memorandum',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('health')
  @ApiOperation({ 
    summary: 'Get AI services health status', 
    description: 'Check the health and availability of all AI providers' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'AI health status retrieved successfully' 
  })
  async getHealthStatus() {
    try {
      const healthStatus = await this.aiOrchestrationService.getHealthStatus();
      
      return {
        success: true,
        data: healthStatus,
        message: 'AI health status retrieved successfully'
      };

    } catch (error) {
      this.logger.error('Failed to get AI health status', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve AI health status',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('providers')
  @ApiOperation({ 
    summary: 'Get available AI providers', 
    description: 'List all configured AI providers and their status' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'AI providers listed successfully' 
  })
  async getProviders() {
    try {
      // This would call a method on the AI orchestration service
      // For now, returning mock data
      const providers = {
        available: Object.values(AIProvider),
        configured: {
          [AIProvider.OPENAI]: !!process.env.OPENAI_API_KEY,
          [AIProvider.ANTHROPIC]: !!process.env.ANTHROPIC_API_KEY,
          [AIProvider.GOOGLE]: !!process.env.GOOGLE_API_KEY,
          [AIProvider.DEEPSEEK]: !!process.env.DEEPSEEK_API_KEY,
          [AIProvider.OLLAMA]: !!process.env.OLLAMA_URL
        }
      };

      return {
        success: true,
        data: providers,
        message: 'AI providers listed successfully'
      };

    } catch (error) {
      this.logger.error('Failed to get AI providers', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve AI providers',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('metrics')
  @ApiOperation({ 
    summary: 'Get AI usage metrics', 
    description: 'Get comprehensive metrics for AI service usage and performance' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'AI metrics retrieved successfully' 
  })
  async getMetrics() {
    try {
      // Mock metrics - in production, this would come from the orchestration service
      const metrics = {
        totalRequests: 1250,
        successfulRequests: 1185,
        failedRequests: 65,
        successRate: 94.8,
        averageResponseTime: 2.3,
        providerDistribution: {
          [AIProvider.OPENAI]: 45,
          [AIProvider.ANTHROPIC]: 35,
          [AIProvider.GOOGLE]: 15,
          [AIProvider.DEEPSEEK]: 5
        },
        cacheHitRate: 23.5,
        consensusRequests: 125,
        lastUpdated: new Date().toISOString()
      };

      return {
        success: true,
        data: metrics,
        message: 'AI metrics retrieved successfully'
      };

    } catch (error) {
      this.logger.error('Failed to get AI metrics', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve AI metrics',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}