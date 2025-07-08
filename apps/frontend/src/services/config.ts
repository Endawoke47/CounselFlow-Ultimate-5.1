// Configuration service for environment variables and app settings

interface AppConfig {
  api: {
    baseUrl: string
    timeout: number
  }
  ai: {
    openaiApiKey: string
    deepseekApiKey: string
    ollamaUrl: string
    geminiApiKey: string
    claudeApiKey: string
    enableAIFeatures: boolean
  }
  app: {
    name: string
    version: string
    environment: 'development' | 'staging' | 'production'
  }
  features: {
    enableAnalytics: boolean
    enableNotifications: boolean
  }
  session: {
    timeoutHours: number
    rememberMeDays: number
  }
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error'
    enableRemoteLogging: boolean
    remoteLogEndpoint: string
  }
  security: {
    enableCSP: boolean
    secureCookies: boolean
  }
  demo: {
    enabled: boolean
    autoLogin: boolean
  }
}

class ConfigService {
  private config: AppConfig

  constructor() {
    this.config = this.loadConfig()
  }

  private loadConfig(): AppConfig {
    return {
      api: {
        baseUrl: this.getEnvVar('VITE_API_URL', 'http://localhost:3001/api/v1'),
        timeout: parseInt(this.getEnvVar('VITE_API_TIMEOUT', '30000'))
      },
      ai: {
        openaiApiKey: this.getEnvVar('VITE_OPENAI_API_KEY', ''),
        deepseekApiKey: this.getEnvVar('VITE_DEEPSEEK_API_KEY', ''),
        ollamaUrl: this.getEnvVar('VITE_OLLAMA_URL', 'http://localhost:11434'),
        geminiApiKey: this.getEnvVar('VITE_GEMINI_API_KEY', ''),
        claudeApiKey: this.getEnvVar('VITE_CLAUDE_API_KEY', ''),
        enableAIFeatures: this.getBooleanEnvVar('VITE_ENABLE_AI_FEATURES', true)
      },
      app: {
        name: this.getEnvVar('VITE_APP_NAME', 'CounselFlow Ultimate V4.1'),
        version: this.getEnvVar('VITE_APP_VERSION', '4.1.0'),
        environment: this.getEnvVar('VITE_ENVIRONMENT', 'development') as 'development' | 'staging' | 'production'
      },
      features: {
        enableAnalytics: this.getBooleanEnvVar('VITE_ENABLE_ANALYTICS', true),
        enableNotifications: this.getBooleanEnvVar('VITE_ENABLE_NOTIFICATIONS', true)
      },
      session: {
        timeoutHours: parseInt(this.getEnvVar('VITE_SESSION_TIMEOUT_HOURS', '24')),
        rememberMeDays: parseInt(this.getEnvVar('VITE_REMEMBER_ME_DAYS', '30'))
      },
      logging: {
        level: this.getEnvVar('VITE_LOG_LEVEL', 'debug') as 'debug' | 'info' | 'warn' | 'error',
        enableRemoteLogging: this.getBooleanEnvVar('VITE_ENABLE_REMOTE_LOGGING', false),
        remoteLogEndpoint: this.getEnvVar('VITE_REMOTE_LOG_ENDPOINT', '/api/logs')
      },
      security: {
        enableCSP: this.getBooleanEnvVar('VITE_ENABLE_CSP', true),
        secureCookies: this.getBooleanEnvVar('VITE_SECURE_COOKIES', true)
      },
      demo: {
        enabled: this.getBooleanEnvVar('VITE_DEMO_MODE', true),
        autoLogin: this.getBooleanEnvVar('VITE_DEMO_AUTO_LOGIN', false)
      }
    }
  }

  private getEnvVar(key: string, defaultValue: string): string {
    return import.meta.env[key] || defaultValue
  }

  private getBooleanEnvVar(key: string, defaultValue: boolean): boolean {
    const value = import.meta.env[key]
    if (value === undefined) return defaultValue
    return value === 'true'
  }

  // Getters for easy access to config sections
  get api() {
    return this.config.api
  }

  get ai() {
    return this.config.ai
  }

  get app() {
    return this.config.app
  }

  get features() {
    return this.config.features
  }

  get session() {
    return this.config.session
  }

  get logging() {
    return this.config.logging
  }

  get security() {
    return this.config.security
  }

  get demo() {
    return this.config.demo
  }

  // Utility methods
  isDevelopment(): boolean {
    return this.config.app.environment === 'development'
  }

  isProduction(): boolean {
    return this.config.app.environment === 'production'
  }

  isStaging(): boolean {
    return this.config.app.environment === 'staging'
  }

  isDemoMode(): boolean {
    return this.config.demo.enabled
  }

  // Get full config for debugging
  getFullConfig(): AppConfig {
    return { ...this.config }
  }

  // Get config as JSON string for debugging
  getConfigJSON(): string {
    const sanitizedConfig = { ...this.config }
    
    // Remove sensitive information
    sanitizedConfig.ai.openaiApiKey = sanitizedConfig.ai.openaiApiKey ? '[REDACTED]' : ''
    sanitizedConfig.ai.deepseekApiKey = sanitizedConfig.ai.deepseekApiKey ? '[REDACTED]' : ''
    sanitizedConfig.ai.geminiApiKey = sanitizedConfig.ai.geminiApiKey ? '[REDACTED]' : ''
    sanitizedConfig.ai.claudeApiKey = sanitizedConfig.ai.claudeApiKey ? '[REDACTED]' : ''
    
    return JSON.stringify(sanitizedConfig, null, 2)
  }

  // Validate required configuration
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Check required API URL
    if (!this.config.api.baseUrl) {
      errors.push('API base URL is required')
    }

    // Check AI configuration if AI features are enabled
    if (this.config.ai.enableAIFeatures) {
      const hasAnyAIKey = this.config.ai.openaiApiKey || 
                         this.config.ai.deepseekApiKey || 
                         this.config.ai.geminiApiKey || 
                         this.config.ai.claudeApiKey ||
                         this.config.ai.ollamaUrl

      if (!hasAnyAIKey) {
        errors.push('At least one AI provider configuration is required when AI features are enabled')
      }
    }

    // Check session timeout
    if (this.config.session.timeoutHours <= 0) {
      errors.push('Session timeout must be greater than 0')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Create singleton instance
export const config = new ConfigService()

// Export the config class for testing
export { ConfigService }