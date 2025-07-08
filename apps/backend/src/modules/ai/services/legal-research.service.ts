import { Injectable } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { LegalResearchDto } from '../dto/legal-research.dto';

@Injectable()
export class LegalResearchService {
  constructor(private openAiService: OpenAiService) {}

  async research(researchDto: LegalResearchDto) {
    const prompt = `Conduct legal research on: ${researchDto.query}
    ${researchDto.jurisdiction ? `Jurisdiction: ${researchDto.jurisdiction}` : ''}
    ${researchDto.keywords ? `Keywords: ${researchDto.keywords.join(', ')}` : ''}
    
    Please provide:
    1. Relevant case law and precedents
    2. Applicable statutes and regulations
    3. Legal principles and doctrines
    4. Recent developments in this area
    5. Practical recommendations`;

    return this.openAiService.chat(prompt, 'legal_research');
  }
}