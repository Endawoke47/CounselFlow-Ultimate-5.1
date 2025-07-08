import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { OpenAiService } from './services/openai.service';
import { LegalResearchService } from './services/legal-research.service';
import { ContractAnalysisService } from './services/contract-analysis.service';
import { DocumentGenerationService } from './services/document-generation.service';

@Module({
  imports: [ConfigModule],
  providers: [
    AiService,
    OpenAiService,
    LegalResearchService,
    ContractAnalysisService,
    DocumentGenerationService,
  ],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}