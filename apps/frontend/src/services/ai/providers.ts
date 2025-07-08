import { AIProvider, AIRequest, AIResponse } from './types'

export class AIProviderManager {
  private providers: Map<string, AIProvider> = new Map()
  private currentProvider: string = 'openai'

  constructor() {
    this.initializeProviders()
  }

  private initializeProviders() {
    // OpenAI GPT-4
    this.providers.set('openai', {
      name: 'OpenAI GPT-4',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      apiKey: process.env.REACT_APP_OPENAI_API_KEY || '',
      model: 'gpt-4-turbo-preview',
      maxTokens: 4000,
      temperature: 0.3
    })

    // DeepSeek
    this.providers.set('deepseek', {
      name: 'DeepSeek',
      endpoint: 'https://api.deepseek.com/v1/chat/completions',
      apiKey: process.env.REACT_APP_DEEPSEEK_API_KEY || '',
      model: 'deepseek-chat',
      maxTokens: 4000,
      temperature: 0.3
    })

    // Ollama (local)
    this.providers.set('ollama', {
      name: 'Ollama',
      endpoint: 'http://localhost:11434/api/generate',
      apiKey: '',
      model: 'llama2:7b',
      maxTokens: 4000,
      temperature: 0.3
    })

    // Google Gemini
    this.providers.set('gemini', {
      name: 'Google Gemini',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      apiKey: process.env.REACT_APP_GEMINI_API_KEY || '',
      model: 'gemini-pro',
      maxTokens: 4000,
      temperature: 0.3
    })

    // Anthropic Claude (backup)
    this.providers.set('claude', {
      name: 'Anthropic Claude',
      endpoint: 'https://api.anthropic.com/v1/messages',
      apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY || '',
      model: 'claude-3-sonnet-20240229',
      maxTokens: 4000,
      temperature: 0.3
    })
  }

  setProvider(providerName: string): boolean {
    if (this.providers.has(providerName)) {
      this.currentProvider = providerName
      return true
    }
    return false
  }

  getCurrentProvider(): AIProvider | undefined {
    return this.providers.get(this.currentProvider)
  }

  async makeRequest(request: AIRequest): Promise<AIResponse> {
    const provider = request.provider ? 
      this.providers.get(request.provider) : 
      this.getCurrentProvider()

    if (!provider) {
      throw new Error('No AI provider configured')
    }

    try {
      const response = await this.callProvider(provider, request)
      return response
    } catch (error) {
      // Fallback to next available provider
      return await this.fallbackRequest(request)
    }
  }

  private async callProvider(provider: AIProvider, request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now()

    switch (provider.name) {
      case 'OpenAI GPT-4':
        return await this.callOpenAI(provider, request)
      case 'DeepSeek':
        return await this.callDeepSeek(provider, request)
      case 'Ollama':
        return await this.callOllama(provider, request)
      case 'Google Gemini':
        return await this.callGemini(provider, request)
      case 'Anthropic Claude':
        return await this.callClaude(provider, request)
      default:
        throw new Error(`Unknown provider: ${provider.name}`)
    }
  }

  private async callOpenAI(provider: AIProvider, request: AIRequest): Promise<AIResponse> {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(request.type)
          },
          {
            role: 'user',
            content: request.context ? `${request.context}\n\n${request.prompt}` : request.prompt
          }
        ],
        max_tokens: provider.maxTokens,
        temperature: provider.temperature
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`)
    }

    return {
      content: data.choices[0].message.content,
      confidence: 0.85,
      provider: provider.name,
      tokens: data.usage.total_tokens,
      cost: this.calculateCost(data.usage.total_tokens, 'openai'),
      timestamp: new Date().toISOString()
    }
  }

  private async callDeepSeek(provider: AIProvider, request: AIRequest): Promise<AIResponse> {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(request.type)
          },
          {
            role: 'user',
            content: request.context ? `${request.context}\n\n${request.prompt}` : request.prompt
          }
        ],
        max_tokens: provider.maxTokens,
        temperature: provider.temperature
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${data.error?.message || 'Unknown error'}`)
    }

    return {
      content: data.choices[0].message.content,
      confidence: 0.82,
      provider: provider.name,
      tokens: data.usage.total_tokens,
      cost: this.calculateCost(data.usage.total_tokens, 'deepseek'),
      timestamp: new Date().toISOString()
    }
  }

  private async callOllama(provider: AIProvider, request: AIRequest): Promise<AIResponse> {
    const systemPrompt = this.getSystemPrompt(request.type)
    const fullPrompt = `${systemPrompt}\n\nUser: ${request.context ? `${request.context}\n\n` : ''}${request.prompt}\n\nAssistant:`

    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: provider.model,
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: provider.temperature,
          num_predict: provider.maxTokens
        }
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`Ollama API error: ${data.error || 'Unknown error'}`)
    }

    return {
      content: data.response,
      confidence: 0.75,
      provider: provider.name,
      tokens: data.prompt_eval_count + data.eval_count,
      cost: 0, // Ollama is free/local
      timestamp: new Date().toISOString()
    }
  }

  private async callGemini(provider: AIProvider, request: AIRequest): Promise<AIResponse> {
    const response = await fetch(`${provider.endpoint}?key=${provider.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${this.getSystemPrompt(request.type)}\n\n${request.context ? `${request.context}\n\n` : ''}${request.prompt}`
          }]
        }],
        generationConfig: {
          temperature: provider.temperature,
          maxOutputTokens: provider.maxTokens
        }
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${data.error?.message || 'Unknown error'}`)
    }

    return {
      content: data.candidates[0].content.parts[0].text,
      confidence: 0.80,
      provider: provider.name,
      tokens: data.usageMetadata?.totalTokenCount || 0,
      cost: this.calculateCost(data.usageMetadata?.totalTokenCount || 0, 'gemini'),
      timestamp: new Date().toISOString()
    }
  }

  private async callClaude(provider: AIProvider, request: AIRequest): Promise<AIResponse> {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: provider.model,
        max_tokens: provider.maxTokens,
        temperature: provider.temperature,
        system: this.getSystemPrompt(request.type),
        messages: [{
          role: 'user',
          content: request.context ? `${request.context}\n\n${request.prompt}` : request.prompt
        }]
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`Claude API error: ${data.error?.message || 'Unknown error'}`)
    }

    return {
      content: data.content[0].text,
      confidence: 0.90,
      provider: provider.name,
      tokens: data.usage.input_tokens + data.usage.output_tokens,
      cost: this.calculateCost(data.usage.input_tokens + data.usage.output_tokens, 'claude'),
      timestamp: new Date().toISOString()
    }
  }

  private async fallbackRequest(request: AIRequest): Promise<AIResponse> {
    const fallbackOrder = ['openai', 'deepseek', 'gemini', 'ollama', 'claude']
    
    for (const providerName of fallbackOrder) {
      if (providerName !== this.currentProvider && this.providers.has(providerName)) {
        try {
          const provider = this.providers.get(providerName)!
          return await this.callProvider(provider, request)
        } catch (error) {
          continue
        }
      }
    }
    
    throw new Error('All AI providers failed')
  }

  private getSystemPrompt(type: string): string {
    const basePrompt = "You are CounselFlow AI, an expert legal assistant with comprehensive knowledge of law, regulations, and legal practice. Provide accurate, professional, and actionable legal insights."
    
    switch (type) {
      case 'research':
        return `${basePrompt} You specialize in legal research, case law analysis, and finding relevant precedents. Always cite sources and provide jurisdictional context.`
      case 'contract':
        return `${basePrompt} You are an expert contract drafter. Create professional, legally sound contracts with appropriate clauses, risk mitigation, and clear terms.`
      case 'analysis':
        return `${basePrompt} You excel at analyzing legal documents, identifying risks, and providing strategic recommendations.`
      case 'risk':
        return `${basePrompt} You are a legal risk assessment specialist. Identify potential legal issues, assess probability and impact, and recommend mitigation strategies.`
      case 'compliance':
        return `${basePrompt} You are a compliance expert with deep knowledge of regulations across industries and jurisdictions. Provide practical compliance guidance.`
      case 'chat':
        return `${basePrompt} You provide conversational legal assistance, answering questions clearly and suggesting next steps.`
      case 'insight':
        return `${basePrompt} You provide strategic legal insights, trend analysis, and business-focused legal recommendations.`
      default:
        return basePrompt
    }
  }

  private calculateCost(tokens: number, provider: string): number {
    const rates = {
      openai: 0.00003, // $0.03 per 1K tokens (GPT-4)
      deepseek: 0.000002, // $0.002 per 1K tokens
      gemini: 0.0000005, // $0.0005 per 1K tokens
      claude: 0.000015, // $0.015 per 1K tokens
      ollama: 0 // Free/local
    }
    
    return (tokens / 1000) * (rates[provider as keyof typeof rates] || 0)
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys())
  }

  getProviderStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {}
    for (const [name, provider] of this.providers) {
      status[name] = Boolean(provider.apiKey || name === 'ollama')
    }
    return status
  }
}