import { Injectable } from '@nestjs/common';
import { OpenAiService } from './services/openai.service';
import { LegalResearchService } from './services/legal-research.service';
import { ContractAnalysisService } from './services/contract-analysis.service';
import { DocumentGenerationService } from './services/document-generation.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { LegalResearchDto } from './dto/legal-research.dto';
import { ContractAnalysisDto } from './dto/contract-analysis.dto';
import { DocumentGenerationDto } from './dto/document-generation.dto';

@Injectable()
export class AiService {
  constructor(
    private openAiService: OpenAiService,
    private legalResearchService: LegalResearchService,
    private contractAnalysisService: ContractAnalysisService,
    private documentGenerationService: DocumentGenerationService,
  ) {}

  async chat(chatMessageDto: ChatMessageDto) {
    const response = await this.openAiService.chat(chatMessageDto.message, chatMessageDto.context);
    return {
      message: response.message || response.response, // Handle both formats
      assistantName: response.assistantName || 'Flow',
      provider: response.provider,
      model: response.model,
      timestamp: response.timestamp
    };
  }

  async legalResearch(legalResearchDto: LegalResearchDto) {
    return this.legalResearchService.research(legalResearchDto);
  }

  async analyzeContract(contractAnalysisDto: ContractAnalysisDto) {
    return this.contractAnalysisService.analyze(contractAnalysisDto);
  }

  async generateDocument(documentGenerationDto: DocumentGenerationDto) {
    return this.documentGenerationService.generate(documentGenerationDto);
  }

  async summarizeText(text: string) {
    return this.openAiService.summarize(text);
  }

  async extractKeyTerms(text: string) {
    return this.openAiService.extractKeyTerms(text);
  }

  async assessRisk(content: string, type: 'contract' | 'matter' | 'general') {
    return this.openAiService.assessRisk(content, type);
  }

  async generateInsights(data: any, type: 'dashboard' | 'matter' | 'contract') {
    return this.openAiService.generateInsights(data, type);
  }
}