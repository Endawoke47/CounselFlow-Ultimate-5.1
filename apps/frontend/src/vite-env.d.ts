/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_AI_API_KEY: string
  readonly VITE_DEEPSEEK_API_KEY: string
  readonly VITE_OLLAMA_URL: string
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_CLAUDE_API_KEY: string
  readonly VITE_ENVIRONMENT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}