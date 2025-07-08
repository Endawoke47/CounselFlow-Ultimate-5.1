import { Injectable } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { ContractAnalysisDto } from '../dto/contract-analysis.dto';

@Injectable()
export class ContractAnalysisService {
  constructor(private openAiService: OpenAiService) {}

  async analyze(analysisDto: ContractAnalysisDto) {
    const prompt = `Analyze this ${analysisDto.contractType || 'legal'} contract:

${analysisDto.contractText}

Please provide a comprehensive analysis including:
1. Summary of key terms and obligations
2. Risk assessment and potential issues
3. Missing or unclear provisions
4. Recommendations for improvement
5. Compliance considerations
6. Negotiation points`;

    return this.openAiService.chat(prompt, 'contract_analysis');
  }
}