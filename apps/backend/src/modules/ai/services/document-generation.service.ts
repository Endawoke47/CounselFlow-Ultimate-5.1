import { Injectable } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { DocumentGenerationDto } from '../dto/document-generation.dto';

@Injectable()
export class DocumentGenerationService {
  constructor(private openAiService: OpenAiService) {}

  async generate(generationDto: DocumentGenerationDto) {
    const templates = {
      nda: 'Generate a Non-Disclosure Agreement with standard confidentiality provisions',
      employment: 'Generate an Employment Agreement with terms and conditions',
      service: 'Generate a Service Agreement with scope and deliverables',
      partnership: 'Generate a Partnership Agreement with profit sharing and responsibilities',
    };

    const template = templates[generationDto.documentType] || 'Generate a legal document';
    
    const prompt = `${template} using the following parameters:
${JSON.stringify(generationDto.parameters, null, 2)}

Please create a comprehensive, legally sound document with:
1. Proper legal language and structure
2. Clear terms and conditions
3. Standard protective clauses
4. Appropriate signatures and date sections
5. Legal disclaimers where necessary

Format the output as a complete document ready for review by legal counsel.`;

    return this.openAiService.chat(prompt, 'document_generation');
  }
}