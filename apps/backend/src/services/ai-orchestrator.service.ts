/**
 * CounselFlow Ultimate 5.1 - Advanced AI Orchestrator Service
 * Multi-LLM AI integration with circuit breaker, caching, and consensus
 * Enhanced from CounselFlow Ultimate V3 implementation
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import * as crypto from 'crypto';

export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google',
  DEEPSEEK = 'deepseek',
  OLLAMA = 'ollama'
}

export interface AIResponse {
  content: string;
  provider: AIProvider;
  model: string;
  tokensUsed?: number;
  cost?: number;
  processingTime?: number;
  metadata?: Record<string, any>;
  requestId?: string;
  timestamp: Date;
  cached: boolean;
}

export interface CircuitBreakerState {
  failureCount: number;
  lastFailureTime?: Date;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failureThreshold: number;
  timeoutSeconds: number;
}

export interface ContractAnalysisResult {
  riskScore: number;
  riskAreas: string[];
  recommendations: string[];
  criticalClauses: string[];
  missingProvisions: string[];
  confidence: number;
  metadata: {
    provider: string;
    consensus: boolean;
    processingTime: number;
  };
}

@Injectable()
export class AIOrchestrationService {
  private readonly logger = new Logger(AIOrchestrationService.name);
  private readonly providers: Map<AIProvider, AxiosInstance> = new Map();
  private readonly circuitBreakers: Map<AIProvider, CircuitBreakerState> = new Map();
  private readonly responseCache: Map<string, AIResponse> = new Map();
  private readonly healthStatus: Map<AIProvider, boolean> = new Map();
  private readonly requestCount: Map<AIProvider, number> = new Map();
  private readonly errorCount: Map<AIProvider, number> = new Map();
  
  private readonly cacheTTL = 300000; // 5 minutes
  private readonly maxCacheSize = 1000;
  private isInitialized = false;

  constructor(private readonly configService: ConfigService) {
    this.initializeCircuitBreakers();
    this.initializeCounters();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.initializeProviders();
      await this.performHealthChecks();
      this.isInitialized = true;
      
      const healthyProviders = Array.from(this.healthStatus.entries())
        .filter(([_, healthy]) => healthy)
        .map(([provider]) => provider);

      this.logger.log(`AI Orchestrator initialized with ${healthyProviders.length} healthy providers: ${healthyProviders.join(', ')}`);
    } catch (error) {
      this.logger.error('Failed to initialize AI Orchestrator', error);
      throw error;
    }
  }

  async generateText(
    prompt: string,
    options: {
      provider?: AIProvider;
      model?: string;
      maxTokens?: number;
      temperature?: number;
      useCache?: boolean;
      retryCount?: number;
    } = {}
  ): Promise<AIResponse> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const {
      provider,
      model,
      maxTokens = 4000,
      temperature = 0.7,
      useCache = true,
      retryCount = 3
    } = options;

    // Sanitize input
    const sanitizedPrompt = this.sanitizePrompt(prompt);
    
    // Check cache first
    if (useCache) {
      const cacheKey = this.generateCacheKey(sanitizedPrompt, provider, model, maxTokens, temperature);
      const cachedResponse = this.getCachedResponse(cacheKey);
      if (cachedResponse) {
        cachedResponse.cached = true;
        this.logger.debug(`Returning cached response for key: ${cacheKey.substring(0, 16)}...`);
        return cachedResponse;
      }
    }

    // Find available provider
    const availableProvider = this.getAvailableProvider(provider);
    if (!availableProvider) {
      throw new Error('No AI providers available');
    }

    // Execute with retry logic
    let lastError: Error | null = null;
    let currentProvider = availableProvider;

    for (let attempt = 0; attempt < retryCount; attempt++) {
      try {
        // Check circuit breaker
        if (!this.canExecute(currentProvider)) {
          if (attempt < retryCount - 1) {
            const fallbackProvider = this.getFallbackProvider(currentProvider);
            if (fallbackProvider) {
              currentProvider = fallbackProvider;
              continue;
            }
          }
          throw new Error(`Circuit breaker open for ${currentProvider}`);
        }

        const startTime = Date.now();
        this.requestCount.set(currentProvider, (this.requestCount.get(currentProvider) || 0) + 1);

        // Generate with specific provider
        const response = await this.executeGeneration(
          currentProvider,
          sanitizedPrompt,
          model,
          maxTokens,
          temperature
        );

        response.processingTime = Date.now() - startTime;
        
        // Record success
        this.recordSuccess(currentProvider);

        // Cache response
        if (useCache) {
          const cacheKey = this.generateCacheKey(sanitizedPrompt, provider, model, maxTokens, temperature);
          this.cacheResponse(cacheKey, response);
        }

        this.logger.debug(`AI text generated successfully with ${currentProvider} in ${response.processingTime}ms`);
        return response;

      } catch (error) {
        lastError = error as Error;
        this.errorCount.set(currentProvider, (this.errorCount.get(currentProvider) || 0) + 1);
        this.recordFailure(currentProvider);

        this.logger.warn(`AI generation attempt ${attempt + 1} failed with ${currentProvider}: ${error.message}`);

        if (attempt < retryCount - 1) {
          const fallbackProvider = this.getFallbackProvider(currentProvider);
          if (fallbackProvider) {
            currentProvider = fallbackProvider;
            await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
          } else {
            await this.delay(1000); // Brief delay before retry
          }
        }
      }
    }

    this.logger.error(`All AI generation attempts failed: ${lastError?.message}`);
    throw lastError || new Error('AI generation failed after all retries');
  }

  async analyzeContract(
    contractText: string,
    analysisType: 'risk_assessment' | 'clause_extraction' | 'compliance_check' = 'risk_assessment',
    useConsensus = false
  ): Promise<ContractAnalysisResult> {
    const prompts = {
      risk_assessment: `Analyze the following contract for legal risks and provide a structured assessment:

Contract Text:
${contractText}

Please provide:
1. Risk Score (1-10, where 10 is highest risk)
2. Key Risk Areas (list of specific concerns)
3. Recommendations (actionable suggestions)
4. Critical Clauses (problematic sections)
5. Missing Provisions (standard clauses that should be added)

Format your response as JSON with these exact keys:
risk_score, risk_areas, recommendations, critical_clauses, missing_provisions`,

      clause_extraction: `Extract and categorize key clauses from this contract:

Contract Text:
${contractText}

Identify and extract:
1. Payment Terms
2. Termination Clauses
3. Liability Limitations
4. Intellectual Property Clauses
5. Confidentiality Provisions
6. Governing Law

Format as JSON with clause_type as keys and extracted text as values.`,

      compliance_check: `Review this contract for compliance with common legal standards:

Contract Text:
${contractText}

Check for compliance with:
1. GDPR (if applicable)
2. Industry-specific regulations
3. Standard legal requirements
4. Best practices

Provide compliance score (1-10) and specific issues found.`
    };

    const prompt = prompts[analysisType];

    try {
      if (useConsensus && this.getHealthyProviders().length >= 2) {
        return await this.analyzeWithConsensus(prompt, analysisType);
      } else {
        const response = await this.generateText(prompt, {
          temperature: 0.1,
          maxTokens: 4000
        });

        // Try to parse JSON response
        let analysisResult: any;
        try {
          analysisResult = JSON.parse(response.content);
        } catch (e) {
          // Fallback to text analysis
          analysisResult = {
            analysis: response.content,
            analysis_type: analysisType
          };
        }

        return {
          riskScore: analysisResult.risk_score || 5,
          riskAreas: analysisResult.risk_areas || [],
          recommendations: analysisResult.recommendations || [],
          criticalClauses: analysisResult.critical_clauses || [],
          missingProvisions: analysisResult.missing_provisions || [],
          confidence: 80,
          metadata: {
            provider: response.provider,
            consensus: false,
            processingTime: response.processingTime || 0
          }
        };
      }
    } catch (error) {
      this.logger.error(`Contract analysis failed: ${error.message}`);
      throw error;
    }
  }

  async generateDocument(
    documentType: 'nda' | 'service_agreement' | 'privacy_policy' | 'employment_agreement',
    parameters: Record<string, any>,
    useConsensus = false
  ): Promise<{ document: string; metadata: any }> {
    const documentPrompts = {
      nda: `Generate a comprehensive Non-Disclosure Agreement with the following parameters:
${JSON.stringify(parameters, null, 2)}

Include standard NDA clauses:
- Definition of confidential information
- Obligations of receiving party
- Permitted disclosures
- Term and termination
- Remedies for breach

Make it legally sound and professionally formatted.`,

      service_agreement: `Generate a Service Agreement with these parameters:
${JSON.stringify(parameters, null, 2)}

Include:
- Scope of services
- Payment terms
- Deliverables and timelines
- Intellectual property rights
- Limitation of liability
- Termination provisions`,

      privacy_policy: `Generate a Privacy Policy with these parameters:
${JSON.stringify(parameters, null, 2)}

Ensure compliance with:
- GDPR requirements
- CCPA requirements
- General privacy best practices

Include all necessary sections for data collection, use, and protection.`,

      employment_agreement: `Generate an Employment Agreement with these parameters:
${JSON.stringify(parameters, null, 2)}

Include:
- Job description and responsibilities
- Compensation and benefits
- Confidentiality and non-compete clauses
- Termination procedures
- Intellectual property assignment`
    };

    const prompt = documentPrompts[documentType];
    if (!prompt) {
      throw new Error(`Unsupported document type: ${documentType}`);
    }

    try {
      const response = await this.generateText(prompt, {
        temperature: 0.3,
        maxTokens: 4000
      });

      return {
        document: response.content,
        metadata: {
          documentType,
          parameters,
          provider: response.provider,
          processingTime: response.processingTime,
          consensus: false
        }
      };
    } catch (error) {
      this.logger.error(`Document generation failed: ${error.message}`);
      throw error;
    }
  }

  async getHealthStatus(): Promise<Record<string, any>> {
    const healthResults: Record<string, any> = {};
    let overallHealthy = true;

    for (const [provider, healthy] of this.healthStatus) {
      const circuitBreakerState = this.circuitBreakers.get(provider);
      
      healthResults[provider] = {
        status: healthy ? 'healthy' : 'unhealthy',
        circuitBreakerState: circuitBreakerState?.state || 'UNKNOWN',
        requestCount: this.requestCount.get(provider) || 0,
        errorCount: this.errorCount.get(provider) || 0,
        errorRate: this.calculateErrorRate(provider)
      };

      if (!healthy) overallHealthy = false;
    }

    return {
      overallStatus: overallHealthy ? 'healthy' : 'degraded',
      providers: healthResults,
      cacheSize: this.responseCache.size,
      totalRequests: Array.from(this.requestCount.values()).reduce((sum, count) => sum + count, 0),
      totalErrors: Array.from(this.errorCount.values()).reduce((sum, count) => sum + count, 0),
      timestamp: new Date().toISOString()
    };
  }

  // Private helper methods
  private initializeCircuitBreakers(): void {
    for (const provider of Object.values(AIProvider)) {
      this.circuitBreakers.set(provider, {
        failureCount: 0,
        state: 'CLOSED',
        failureThreshold: 5,
        timeoutSeconds: 60
      });
    }
  }

  private initializeCounters(): void {
    for (const provider of Object.values(AIProvider)) {
      this.requestCount.set(provider, 0);
      this.errorCount.set(provider, 0);
      this.healthStatus.set(provider, false);
    }
  }

  private async initializeProviders(): Promise<void> {
    // Initialize OpenAI
    if (this.configService.get('OPENAI_API_KEY')) {
      this.providers.set(AIProvider.OPENAI, axios.create({
        baseURL: 'https://api.openai.com/v1',
        headers: {
          'Authorization': `Bearer ${this.configService.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000
      }));
    }

    // Initialize Anthropic
    if (this.configService.get('ANTHROPIC_API_KEY')) {
      this.providers.set(AIProvider.ANTHROPIC, axios.create({
        baseURL: 'https://api.anthropic.com/v1',
        headers: {
          'x-api-key': this.configService.get('ANTHROPIC_API_KEY'),
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        timeout: 120000
      }));
    }

    // Initialize Google Gemini
    if (this.configService.get('GOOGLE_API_KEY')) {
      this.providers.set(AIProvider.GOOGLE, axios.create({
        baseURL: 'https://generativelanguage.googleapis.com/v1beta',
        timeout: 120000
      }));
    }

    // Initialize DeepSeek
    if (this.configService.get('DEEPSEEK_API_KEY')) {
      this.providers.set(AIProvider.DEEPSEEK, axios.create({
        baseURL: 'https://api.deepseek.com/v1',
        headers: {
          'Authorization': `Bearer ${this.configService.get('DEEPSEEK_API_KEY')}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000
      }));
    }

    // Initialize Ollama (local)
    if (this.configService.get('OLLAMA_URL')) {
      this.providers.set(AIProvider.OLLAMA, axios.create({
        baseURL: this.configService.get('OLLAMA_URL'),
        timeout: 120000
      }));
    }
  }

  private async performHealthChecks(): Promise<void> {
    const healthCheckPromises = Array.from(this.providers.keys()).map(async provider => {
      try {
        await this.testProviderConnection(provider);
        this.healthStatus.set(provider, true);
        this.logger.debug(`Health check passed for ${provider}`);
      } catch (error) {
        this.healthStatus.set(provider, false);
        this.logger.warn(`Health check failed for ${provider}: ${error.message}`);
      }
    });

    await Promise.allSettled(healthCheckPromises);
  }

  private async testProviderConnection(provider: AIProvider): Promise<void> {
    const client = this.providers.get(provider);
    if (!client) throw new Error('Provider not configured');

    switch (provider) {
      case AIProvider.OPENAI:
        await client.post('/chat/completions', {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Test' }],
          max_tokens: 1
        });
        break;
      
      case AIProvider.ANTHROPIC:
        await client.post('/messages', {
          model: 'claude-3-haiku-20240307',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'Test' }]
        });
        break;
      
      case AIProvider.GOOGLE:
        const apiKey = this.configService.get('GOOGLE_API_KEY');
        await client.post(`/models/gemini-pro:generateContent?key=${apiKey}`, {
          contents: [{ parts: [{ text: 'Test' }] }]
        });
        break;
      
      case AIProvider.DEEPSEEK:
        await client.post('/chat/completions', {
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: 'Test' }],
          max_tokens: 1
        });
        break;
      
      case AIProvider.OLLAMA:
        await client.post('/api/generate', {
          model: 'llama2',
          prompt: 'Test',
          stream: false
        });
        break;
    }
  }

  private async executeGeneration(
    provider: AIProvider,
    prompt: string,
    model?: string,
    maxTokens?: number,
    temperature?: number
  ): Promise<AIResponse> {
    const client = this.providers.get(provider);
    if (!client) throw new Error(`Provider ${provider} not available`);

    let response: any;
    const requestId = crypto.randomUUID();
    
    switch (provider) {
      case AIProvider.OPENAI:
        response = await client.post('/chat/completions', {
          model: model || 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: maxTokens,
          temperature
        });
        return {
          content: response.data.choices[0].message.content,
          provider,
          model: response.data.model,
          tokensUsed: response.data.usage?.total_tokens,
          requestId: response.data.id,
          timestamp: new Date(),
          cached: false,
          metadata: {
            finishReason: response.data.choices[0].finish_reason,
            promptTokens: response.data.usage?.prompt_tokens,
            completionTokens: response.data.usage?.completion_tokens
          }
        };

      case AIProvider.ANTHROPIC:
        response = await client.post('/messages', {
          model: model || 'claude-3-sonnet-20240229',
          max_tokens: maxTokens,
          temperature,
          messages: [{ role: 'user', content: prompt }]
        });
        return {
          content: response.data.content[0].text,
          provider,
          model: response.data.model,
          tokensUsed: response.data.usage?.input_tokens + response.data.usage?.output_tokens,
          requestId,
          timestamp: new Date(),
          cached: false,
          metadata: {
            stopReason: response.data.stop_reason,
            inputTokens: response.data.usage?.input_tokens,
            outputTokens: response.data.usage?.output_tokens
          }
        };

      case AIProvider.GOOGLE:
        const apiKey = this.configService.get('GOOGLE_API_KEY');
        response = await client.post(`/models/${model || 'gemini-pro'}:generateContent?key=${apiKey}`, {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature
          }
        });
        return {
          content: response.data.candidates[0].content.parts[0].text,
          provider,
          model: model || 'gemini-pro',
          requestId,
          timestamp: new Date(),
          cached: false,
          metadata: {
            finishReason: response.data.candidates[0].finishReason,
            safetyRatings: response.data.candidates[0].safetyRatings
          }
        };

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private sanitizePrompt(prompt: string): string {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Prompt must be a non-empty string');
    }

    // Remove potentially dangerous patterns
    const dangerousPatterns = [
      /<!--[\s\S]*?-->/g,
      /<script[\s\S]*?<\/script>/gi,
      /javascript:/gi,
      /data:/gi,
      /vbscript:/gi,
      /eval\(/gi,
      /exec\(/gi,
      /Function\(/gi
    ];

    let sanitized = prompt;
    dangerousPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    // Limit length
    const maxLength = 50000;
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
      this.logger.warn(`Prompt truncated from ${prompt.length} to ${sanitized.length} characters`);
    }

    return sanitized.trim();
  }

  private generateCacheKey(
    prompt: string,
    provider?: AIProvider,
    model?: string,
    maxTokens?: number,
    temperature?: number
  ): string {
    const keyData = `${prompt}|${provider || 'default'}|${model || 'default'}|${maxTokens || 4000}|${temperature || 0.7}`;
    return crypto.createHash('md5').update(keyData).digest('hex');
  }

  private getCachedResponse(cacheKey: string): AIResponse | null {
    const cached = this.responseCache.get(cacheKey);
    if (cached) {
      const age = Date.now() - cached.timestamp.getTime();
      if (age < this.cacheTTL) {
        return cached;
      } else {
        this.responseCache.delete(cacheKey);
      }
    }
    return null;
  }

  private cacheResponse(cacheKey: string, response: AIResponse): void {
    // Limit cache size
    if (this.responseCache.size >= this.maxCacheSize) {
      // Remove oldest entries (simple FIFO)
      const oldestKey = this.responseCache.keys().next().value;
      if (oldestKey) {
        this.responseCache.delete(oldestKey);
      }
    }
    this.responseCache.set(cacheKey, response);
  }

  private getAvailableProvider(preferredProvider?: AIProvider): AIProvider | null {
    // Check preferred provider first
    if (preferredProvider && this.healthStatus.get(preferredProvider) && this.canExecute(preferredProvider)) {
      return preferredProvider;
    }

    // Find any available provider
    for (const [provider, healthy] of this.healthStatus) {
      if (healthy && this.canExecute(provider)) {
        return provider;
      }
    }

    return null;
  }

  private getFallbackProvider(currentProvider: AIProvider): AIProvider | null {
    const fallbackOrder: Record<AIProvider, AIProvider[]> = {
      [AIProvider.OPENAI]: [AIProvider.ANTHROPIC, AIProvider.GOOGLE, AIProvider.DEEPSEEK],
      [AIProvider.ANTHROPIC]: [AIProvider.OPENAI, AIProvider.GOOGLE, AIProvider.DEEPSEEK],
      [AIProvider.GOOGLE]: [AIProvider.OPENAI, AIProvider.ANTHROPIC, AIProvider.DEEPSEEK],
      [AIProvider.DEEPSEEK]: [AIProvider.OPENAI, AIProvider.ANTHROPIC, AIProvider.GOOGLE],
      [AIProvider.OLLAMA]: [AIProvider.OPENAI, AIProvider.ANTHROPIC, AIProvider.GOOGLE]
    };

    const fallbacks = fallbackOrder[currentProvider] || [];
    for (const fallback of fallbacks) {
      if (this.healthStatus.get(fallback) && this.canExecute(fallback)) {
        this.logger.debug(`Switching from ${currentProvider} to fallback ${fallback}`);
        return fallback;
      }
    }

    return null;
  }

  private canExecute(provider: AIProvider): boolean {
    const circuitBreaker = this.circuitBreakers.get(provider);
    if (!circuitBreaker) return false;

    if (circuitBreaker.state === 'CLOSED') {
      return true;
    } else if (circuitBreaker.state === 'OPEN') {
      if (circuitBreaker.lastFailureTime) {
        const timeSinceFailure = Date.now() - circuitBreaker.lastFailureTime.getTime();
        if (timeSinceFailure > circuitBreaker.timeoutSeconds * 1000) {
          circuitBreaker.state = 'HALF_OPEN';
          this.logger.debug(`Circuit breaker for ${provider} moved to HALF_OPEN`);
          return true;
        }
      }
      return false;
    } else if (circuitBreaker.state === 'HALF_OPEN') {
      return true;
    }

    return false;
  }

  private recordSuccess(provider: AIProvider): void {
    const circuitBreaker = this.circuitBreakers.get(provider);
    if (circuitBreaker) {
      circuitBreaker.failureCount = 0;
      circuitBreaker.state = 'CLOSED';
      circuitBreaker.lastFailureTime = undefined;
    }
  }

  private recordFailure(provider: AIProvider): void {
    const circuitBreaker = this.circuitBreakers.get(provider);
    if (circuitBreaker) {
      circuitBreaker.failureCount++;
      circuitBreaker.lastFailureTime = new Date();

      if (circuitBreaker.failureCount >= circuitBreaker.failureThreshold) {
        circuitBreaker.state = 'OPEN';
        this.logger.warn(`Circuit breaker for ${provider} opened due to ${circuitBreaker.failureCount} failures`);
      }
    }
  }

  private getHealthyProviders(): AIProvider[] {
    return Array.from(this.healthStatus.entries())
      .filter(([_, healthy]) => healthy)
      .map(([provider]) => provider);
  }

  private calculateErrorRate(provider: AIProvider): number {
    const totalRequests = this.requestCount.get(provider) || 0;
    const totalErrors = this.errorCount.get(provider) || 0;
    return totalRequests > 0 ? totalErrors / totalRequests : 0;
  }

  private async analyzeWithConsensus(prompt: string, analysisType: string): Promise<ContractAnalysisResult> {
    const healthyProviders = this.getHealthyProviders().slice(0, 3); // Use up to 3 providers
    
    if (healthyProviders.length < 2) {
      throw new Error('Consensus analysis requires at least 2 healthy providers');
    }

    const responses = await Promise.allSettled(
      healthyProviders.map(provider => 
        this.generateText(prompt, { provider, temperature: 0.1 })
      )
    );

    const successfulResponses = responses
      .filter((result): result is PromiseFulfilledResult<AIResponse> => result.status === 'fulfilled')
      .map(result => result.value);

    if (successfulResponses.length === 0) {
      throw new Error('All providers failed in consensus analysis');
    }

    // Simple consensus - average scores and combine arrays
    const parsedResponses = successfulResponses.map(response => {
      try {
        return JSON.parse(response.content);
      } catch {
        return { risk_score: 5, risk_areas: [], recommendations: [], critical_clauses: [], missing_provisions: [] };
      }
    });

    const riskScores = parsedResponses.map(r => r.risk_score || 5);
    const avgRiskScore = riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length;

    const allRiskAreas = parsedResponses.flatMap(r => r.risk_areas || []);
    const allRecommendations = parsedResponses.flatMap(r => r.recommendations || []);
    const allCriticalClauses = parsedResponses.flatMap(r => r.critical_clauses || []);
    const allMissingProvisions = parsedResponses.flatMap(r => r.missing_provisions || []);

    return {
      riskScore: Math.round(avgRiskScore * 10) / 10,
      riskAreas: [...new Set(allRiskAreas)].slice(0, 10),
      recommendations: [...new Set(allRecommendations)].slice(0, 10),
      criticalClauses: [...new Set(allCriticalClauses)].slice(0, 10),
      missingProvisions: [...new Set(allMissingProvisions)].slice(0, 10),
      confidence: (successfulResponses.length / healthyProviders.length) * 100,
      metadata: {
        provider: successfulResponses.map(r => r.provider).join(','),
        consensus: true,
        processingTime: Math.max(...successfulResponses.map(r => r.processingTime || 0))
      }
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}