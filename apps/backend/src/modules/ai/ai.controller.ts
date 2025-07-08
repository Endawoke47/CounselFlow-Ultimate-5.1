import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { LegalResearchDto } from './dto/legal-research.dto';
import { ContractAnalysisDto } from './dto/contract-analysis.dto';
import { DocumentGenerationDto } from './dto/document-generation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('AI Services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @ApiOperation({ summary: 'Chat with AI assistant' })
  @ApiResponse({ status: 200, description: 'AI response generated successfully' })
  @Post('chat')
  async chat(@Body() chatMessageDto: ChatMessageDto) {
    return this.aiService.chat(chatMessageDto);
  }

  @ApiOperation({ summary: 'Perform legal research' })
  @ApiResponse({ status: 200, description: 'Legal research completed successfully' })
  @Post('research')
  async legalResearch(@Body() legalResearchDto: LegalResearchDto) {
    return this.aiService.legalResearch(legalResearchDto);
  }

  @ApiOperation({ summary: 'Analyze contract' })
  @ApiResponse({ status: 200, description: 'Contract analysis completed successfully' })
  @Post('analyze-contract')
  async analyzeContract(@Body() contractAnalysisDto: ContractAnalysisDto) {
    return this.aiService.analyzeContract(contractAnalysisDto);
  }

  @ApiOperation({ summary: 'Generate legal document' })
  @ApiResponse({ status: 200, description: 'Document generated successfully' })
  @Post('generate-document')
  async generateDocument(@Body() documentGenerationDto: DocumentGenerationDto) {
    return this.aiService.generateDocument(documentGenerationDto);
  }

  @ApiOperation({ summary: 'Summarize text' })
  @ApiResponse({ status: 200, description: 'Text summarized successfully' })
  @Post('summarize')
  async summarizeText(@Body() { text }: { text: string }) {
    return this.aiService.summarizeText(text);
  }

  @ApiOperation({ summary: 'Extract key terms' })
  @ApiResponse({ status: 200, description: 'Key terms extracted successfully' })
  @Post('extract-terms')
  async extractKeyTerms(@Body() { text }: { text: string }) {
    return this.aiService.extractKeyTerms(text);
  }

  @ApiOperation({ summary: 'Assess risk' })
  @ApiResponse({ status: 200, description: 'Risk assessment completed successfully' })
  @Post('assess-risk')
  async assessRisk(@Body() { content, type }: { content: string; type: 'contract' | 'matter' | 'general' }) {
    return this.aiService.assessRisk(content, type);
  }
}