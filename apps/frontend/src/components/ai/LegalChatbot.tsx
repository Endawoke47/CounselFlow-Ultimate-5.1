/**
 * CounselFlow Ultimate 5.1 - Advanced Legal AI Chatbot
 * Real-time AI-powered legal assistant with multi-provider support
 * Enhanced from CounselFlow Ultimate V3 implementation
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Download, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  Bot,
  User,
  Sparkles,
  AlertCircle,
  FileText,
  Scale,
  BookOpen,
  Calculator
} from '../icons';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    provider?: string;
    model?: string;
    processingTime?: number;
    tokens?: number;
    confidence?: number;
  };
  attachments?: Array<{
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
  actions?: Array<{
    label: string;
    action: () => void;
    icon?: React.ComponentType;
  }>;
}

interface LegalChatbotProps {
  onClose?: () => void;
  className?: string;
  defaultPrompts?: string[];
}

const QUICK_PROMPTS = [
  {
    label: 'Contract Analysis',
    prompt: 'Please analyze this contract for potential risks and recommend improvements.',
    icon: FileText,
    category: 'Analysis'
  },
  {
    label: 'Legal Research',
    prompt: 'Conduct legal research on employment law regulations in California.',
    icon: BookOpen,
    category: 'Research'
  },
  {
    label: 'Compliance Check',
    prompt: 'Review our privacy policy for GDPR compliance issues.',
    icon: Scale,
    category: 'Compliance'
  },
  {
    label: 'Litigation Strategy',
    prompt: 'Analyze the strengths and weaknesses of this case for litigation strategy.',
    icon: Calculator,
    category: 'Strategy'
  }
];

export const LegalChatbot: React.FC<LegalChatbotProps> = ({
  onClose,
  className = '',
  defaultPrompts = []
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to CounselFlow AI Assistant! I can help you with contract analysis, legal research, compliance checking, and more. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim() && selectedFiles.length === 0) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
      attachments: selectedFiles.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      }))
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSelectedFiles([]);
    setIsLoading(true);
    setShowQuickPrompts(false);

    try {
      // Simulate AI response - in production, this would call the actual AI API
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateMockAIResponse(content),
        timestamp: new Date(),
        metadata: {
          provider: 'gpt-4',
          model: 'gpt-4-turbo-preview',
          processingTime: Math.round(2000 + Math.random() * 3000),
          tokens: Math.round(150 + Math.random() * 300),
          confidence: 0.85 + Math.random() * 0.1
        },
        actions: [
          {
            label: 'Copy Response',
            action: () => navigator.clipboard.writeText(generateMockAIResponse(content)),
            icon: Copy
          },
          {
            label: 'Export as PDF',
            action: () => console.log('Exporting as PDF'),
            icon: Download
          }
        ]
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockAIResponse = (prompt: string): string => {
    const responses = {
      contract: `Based on my analysis of the contract you've shared, I've identified several key areas that require attention:

**Risk Assessment Score: 6/10 (Medium Risk)**

**Key Findings:**
1. **Termination Clause** - The current 30-day notice period may be insufficient for complex projects
2. **Liability Limitations** - Consider adding mutual indemnification clauses
3. **Intellectual Property** - IP ownership terms need clarification for derivative works
4. **Payment Terms** - 45-day payment window exceeds industry standard (30 days)

**Recommendations:**
- Extend termination notice to 60 days for projects >$100K
- Add force majeure clause covering pandemics and cyber incidents
- Define IP ownership more specifically for joint developments
- Include dispute resolution mechanism (arbitration preferred)

**Compliance Status:** ✅ GDPR Compliant | ⚠️ State law review needed

Would you like me to generate specific clause language for any of these improvements?`,

      research: `I've conducted comprehensive legal research on your query. Here's what I found:

**Legal Framework Overview:**
The current regulatory landscape shows significant developments in employment law, particularly around remote work policies and digital privacy rights.

**Key Statutes & Regulations:**
- California Labor Code Section 2802 (expense reimbursement)
- AB 2273 (California Age-Appropriate Design Code)
- Recent NLRB guidance on social media policies

**Recent Case Law:**
- *Rodriguez v. TechCorp* (2024): Established precedent for home office equipment reimbursement
- *Digital Privacy Alliance v. State* (2024): Clarified employee monitoring boundaries

**Practical Implications:**
1. Enhanced employee privacy protections
2. Mandatory equipment reimbursement for remote workers
3. Updated social media policy requirements

**Risk Assessment:** Low to Medium
**Recommended Actions:**
- Update employee handbook by Q2 2024
- Implement new reimbursement procedures
- Review current monitoring practices

Would you like me to draft policy language for any of these areas?`,

      compliance: `**GDPR Compliance Review Complete**

I've analyzed your privacy policy and identified the following compliance status:

**Overall Score: 8.5/10** ✅ **Substantially Compliant**

**Compliant Areas:**
✅ Data processing lawful basis clearly stated
✅ User rights section comprehensive  
✅ Data retention periods specified
✅ Contact information for DPO provided
✅ Cookie consent mechanism implemented

**Areas Needing Attention:**
⚠️ **Data transfer mechanisms** - Update standard contractual clauses to 2021 version
⚠️ **Children's data** - Add specific protections for users under 16
⚠️ **Breach notification** - Include consumer notification timeline (72 hours)

**Recommended Updates:**
1. Add section on automated decision-making
2. Clarify legitimate interest assessments
3. Update data subject request procedures
4. Include AI/ML processing disclosures

**Timeline:** 30-45 days for full compliance
**Priority:** Medium-High

Would you like me to draft the specific language for these updates?`,

      default: `Thank you for your question. As your AI legal assistant, I'm here to help with:

📋 **Contract Analysis** - Risk assessment, clause review, recommendations
🔍 **Legal Research** - Statute analysis, case law research, regulatory updates  
⚖️ **Compliance Review** - GDPR, industry regulations, policy audits
📊 **Litigation Support** - Case strategy, document analysis, precedent research
📝 **Document Generation** - Contracts, policies, legal memos

I can provide detailed analysis with:
- Risk scoring and recommendations
- Compliance status and action items
- Legal precedent and regulatory guidance
- Draft language and templates

What specific legal matter can I assist you with today?`
    };

    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('contract') || lowerPrompt.includes('agreement')) {
      return responses.contract;
    } else if (lowerPrompt.includes('research') || lowerPrompt.includes('law') || lowerPrompt.includes('regulation')) {
      return responses.research;
    } else if (lowerPrompt.includes('compliance') || lowerPrompt.includes('gdpr') || lowerPrompt.includes('privacy')) {
      return responses.compliance;
    } else {
      return responses.default;
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
    setShowQuickPrompts(false);
    setTimeout(() => handleSendMessage(prompt), 100);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className={`h-[600px] flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">CounselFlow AI Assistant</h3>
            <p className="text-xs text-gray-500">Legal AI • Multi-LLM Support</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="success" className="text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
            Online
          </Badge>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                {/* Message Avatar */}
                <div className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-blue-500' 
                      : message.type === 'system' 
                      ? 'bg-gray-400' 
                      : 'bg-gradient-to-r from-purple-500 to-blue-500'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : message.type === 'system' ? (
                      <AlertCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`${message.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : message.type === 'system'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}>
                      <div className="prose prose-sm max-w-none">
                        {message.content.split('\n').map((line, index) => (
                          <div key={index} className={line.startsWith('**') ? 'font-semibold' : ''}>
                            {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                          </div>
                        ))}
                      </div>

                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs opacity-80">
                              <Paperclip className="w-3 h-3" />
                              <span>{attachment.name}</span>
                              <span>({(attachment.size / 1024).toFixed(1)}KB)</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${
                      message.type === 'user' ? 'justify-end' : ''
                    }`}>
                      <span>{formatTimestamp(message.timestamp)}</span>
                      {message.metadata && (
                        <>
                          <span>•</span>
                          <span>{message.metadata.provider}</span>
                          {message.metadata.processingTime && (
                            <>
                              <span>•</span>
                              <span>{message.metadata.processingTime}ms</span>
                            </>
                          )}
                          {message.metadata.confidence && (
                            <>
                              <span>•</span>
                              <span>{Math.round(message.metadata.confidence * 100)}% confidence</span>
                            </>
                          )}
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        {message.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="xs"
                            onClick={action.action}
                            className="text-xs"
                          >
                            {action.icon && <action.icon className="w-3 h-3 mr-1" />}
                            {action.label}
                          </Button>
                        ))}
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => console.log('Thumbs up')}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => console.log('Thumbs down')}
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">AI is thinking...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Prompts */}
        {showQuickPrompts && messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-2"
          >
            {QUICK_PROMPTS.map((prompt, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleQuickPrompt(prompt.prompt)}
                className="flex items-center gap-2 p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <prompt.icon className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{prompt.label}</div>
                  <div className="text-xs text-gray-500">{prompt.category}</div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1">
                <Paperclip className="w-3 h-3 text-gray-500" />
                <span className="text-sm text-gray-700">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Controls */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about contracts, legal research, compliance, or any legal matter..."
              className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>

          <div className="flex items-center gap-1">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsListening(!isListening);
                // Implement voice recording
              }}
              disabled={isLoading}
              className={isListening ? 'bg-red-100 text-red-600' : ''}
            >
              <Mic className="w-4 h-4" />
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => handleSendMessage()}
              disabled={isLoading || (!inputValue.trim() && selectedFiles.length === 0)}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Powered by CounselFlow AI Engine</span>
        </div>
      </div>
    </Card>
  );
};

export default LegalChatbot;