import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  RefreshCw,
  FileText,
  Scale,
  Search,
  BookOpen,
  Zap,
  Sparkles
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { cn } from '../../utils/cn'
import { openAIService, ChatMessage } from '../../services/ai/openai-service'
import { logger } from '../../services/logger'
import { safeAsync } from '../../services/errorHandler'

interface AIChatProps {
  mode?: 'chat' | 'research' | 'contract' | 'analysis'
  className?: string
}

interface Message extends ChatMessage {
  id: string
  timestamp: string
  status?: 'sending' | 'sent' | 'error'
  isTyping?: boolean
}

const LEGAL_PROMPTS = {
  chat: [
    'Explain the key elements of a valid contract',
    'What are the requirements for establishing negligence?',
    'How does intellectual property law protect innovations?',
    'What are the differences between mediation and arbitration?'
  ],
  research: [
    'Research recent developments in privacy law',
    'Find precedents for employment discrimination cases',
    'Analyze regulatory changes in financial services',
    'Compare contract law across different jurisdictions'
  ],
  contract: [
    'Review this service agreement for potential risks',
    'Draft a non-disclosure agreement template',
    'Analyze termination clauses in this contract',
    'Identify missing provisions in this agreement'
  ],
  analysis: [
    'Assess the legal risks of this business decision',
    'Evaluate compliance requirements for this industry',
    'Analyze the strength of this legal position',
    'Review this case for settlement opportunities'
  ]
}

export function AIChat({ mode = 'chat', className }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // Initialize with a welcome message based on mode
    const welcomeMessages = {
      chat: 'Hello! I\'m your AI legal assistant. I can help you with legal questions, document analysis, and research. How can I assist you today?',
      research: 'I\'m ready to help you conduct legal research. I can find case law, analyze regulations, and provide comprehensive legal insights. What would you like to research?',
      contract: 'I\'m here to help with contract analysis and drafting. I can review agreements, identify risks, and suggest improvements. What contract would you like me to analyze?',
      analysis: 'I\'m your legal analysis assistant. I can evaluate legal positions, assess risks, and provide strategic recommendations. What would you like me to analyze?'
    }

    if (messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: welcomeMessages[mode],
        timestamp: new Date().toISOString()
      }])
    }
  }, [mode])

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || input.trim()
    if (!content || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      status: 'sent'
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      // Prepare context based on mode
      const systemPrompt = getSystemPrompt(mode)
      const chatMessages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content }
      ]

      const result = await safeAsync(async () => {
        return await openAIService.chat(chatMessages)
      }, 'AI chat')

      if (result.error) {
        throw result.error
      }

      const response = result.data || 'No response received'

      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000))

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        status: 'sent'
      }

      setMessages(prev => [...prev, assistantMessage])
      logger.info('AI chat message sent successfully', { mode, messageLength: content.length })

    } catch (error) {
      logger.error('AI chat error', { error, mode })
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again or contact support if the issue persists.',
        timestamp: new Date().toISOString(),
        status: 'error'
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const getSystemPrompt = (chatMode: string): string => {
    const prompts = {
      chat: 'You are an expert legal AI assistant with deep knowledge of law across multiple jurisdictions. Provide accurate, helpful, and professional legal guidance. Always remind users that your advice should not replace consultation with a qualified attorney for specific legal matters.',
      research: 'You are a legal research specialist. Provide comprehensive, well-sourced legal research with citations to relevant cases, statutes, and regulations. Focus on accuracy and thoroughness in your research methodology.',
      contract: 'You are a contract analysis expert. Analyze contracts for key terms, potential risks, missing clauses, and compliance issues. Provide clear, actionable recommendations for contract improvements.',
      analysis: 'You are a legal analyst specializing in risk assessment and strategic legal advice. Analyze legal situations, identify potential issues, and provide strategic recommendations with risk assessments.'
    }

    return prompts[chatMode as keyof typeof prompts] || prompts.chat
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Could add a toast notification here
    } catch (error) {
      logger.error('Failed to copy to clipboard', { error })
    }
  }

  const clearChat = () => {
    setMessages([{
      id: Date.now().toString(),
      role: 'assistant',
      content: getSystemPrompt(mode),
      timestamp: new Date().toISOString()
    }])
  }

  const getModeIcon = () => {
    switch (mode) {
      case 'research': return Search
      case 'contract': return FileText
      case 'analysis': return Scale
      default: return Bot
    }
  }

  const getModeColor = () => {
    switch (mode) {
      case 'research': return 'from-blue-500 to-blue-600'
      case 'contract': return 'from-green-500 to-green-600'
      case 'analysis': return 'from-purple-500 to-purple-600'
      default: return 'from-primary-500 to-primary-600'
    }
  }

  const ModeIcon = getModeIcon()

  return (
    <Card className={cn('flex flex-col h-full max-h-[600px]', className)} padding="none">
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r ${getModeColor()}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <ModeIcon size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white capitalize">
              AI {mode} Assistant
            </h3>
            <p className="text-xs text-white/80">
              Powered by GPT-4 Turbo
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            icon={RefreshCw}
            className="text-white hover:bg-white/20"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Prompts:</h4>
          <div className="flex flex-wrap gap-2">
            {LEGAL_PROMPTS[mode].map((prompt, index) => (
              <button
                key={index}
                onClick={() => sendMessage(prompt)}
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-primary-300 transition-colors"
                disabled={isLoading}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r ${getModeColor()} flex items-center justify-center`}>
                  <Bot size={16} className="text-white" />
                </div>
              )}
              
              <div
                className={cn(
                  'max-w-[80%] rounded-xl px-4 py-3 relative group',
                  message.role === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                )}
              >
                {message.status === 'error' && (
                  <div className="flex items-center gap-2 mb-2 text-red-600">
                    <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    </div>
                    <span className="text-xs font-medium">Error</span>
                  </div>
                )}
                
                <div className="prose prose-sm max-w-none">
                  {message.content.split('\n').map((line, index) => (
                    <p key={index} className={cn(
                      'mb-2 last:mb-0',
                      message.role === 'user' ? 'text-white' : 'text-gray-900'
                    )}>
                      {line}
                    </p>
                  ))}
                </div>
                
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => copyToClipboard(message.content)}
                      icon={Copy}
                      className="text-gray-400 hover:text-gray-600"
                    />
                    <Button
                      variant="ghost"
                      size="xs"
                      icon={ThumbsUp}
                      className="text-gray-400 hover:text-green-600"
                    />
                    <Button
                      variant="ghost"
                      size="xs"
                      icon={ThumbsDown}
                      className="text-gray-400 hover:text-red-600"
                    />
                  </div>
                )}
              </div>
              
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <User size={16} className="text-gray-600" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r ${getModeColor()} flex items-center justify-center`}>
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={`Ask your legal ${mode} question...`}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Sparkles size={16} className="text-gray-400" />
            </div>
          </div>
          
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            icon={isLoading ? Loader2 : Send}
            className={cn(
              'shrink-0',
              isLoading && 'animate-pulse'
            )}
            size="lg"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>AI responses are generated and should be verified</span>
          <span>{input.length}/2000</span>
        </div>
      </div>
    </Card>
  )
}