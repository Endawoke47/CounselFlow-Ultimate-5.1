# CounselFlow AI Integration Setup Guide

## Overview

CounselFlow Ultimate V4.1 now includes comprehensive AI functionality powered by multiple AI providers including OpenAI GPT-4, DeepSeek, Google Gemini, Ollama (local), and Anthropic Claude. The AI system provides legal research, contract drafting, document analysis, risk assessment, and intelligent insights throughout the platform.

## AI Capabilities

### 🧠 Legal Research
- Case law analysis and precedent identification
- Regulatory research with jurisdictional context
- Legal trend analysis and benchmarking
- Citation and source verification

### 📄 Contract Drafting & Analysis
- Intelligent contract generation from templates
- Risk clause identification and recommendations
- Contract comparison and redlining
- Negotiation strategy suggestions

### ⚖️ Risk Assessment
- Comprehensive risk scoring and categorization
- Regulatory compliance analysis
- Impact assessment with mitigation strategies
- Probability modeling for legal outcomes

### 💡 Intelligent Insights
- Real-time legal analytics and predictions
- Matter outcome forecasting
- Settlement opportunity identification
- Cost optimization recommendations

### 💬 AI Chat Assistant
- Context-aware legal Q&A
- Multi-modal assistance (research, contracts, analysis)
- Professional legal drafting assistance
- Integration with case and matter data

## Setup Instructions

### 1. Environment Configuration

Copy the example environment file and configure your AI providers:

```bash
cp .env.example .env
```

Edit `.env` with your API keys:

```env
# OpenAI Configuration (Recommended)
REACT_APP_OPENAI_API_KEY=sk-your-openai-api-key-here

# DeepSeek Configuration (Cost-effective alternative)
REACT_APP_DEEPSEEK_API_KEY=your-deepseek-api-key-here

# Google Gemini Configuration
REACT_APP_GEMINI_API_KEY=your-gemini-api-key-here

# Anthropic Claude Configuration
REACT_APP_ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Default provider
REACT_APP_DEFAULT_AI_PROVIDER=openai
```

### 2. AI Provider Setup Options

#### Option A: OpenAI GPT-4 (Recommended)
- Visit [OpenAI API](https://platform.openai.com/api-keys)
- Create an API key
- Add to `REACT_APP_OPENAI_API_KEY`
- Most comprehensive legal knowledge and reasoning

#### Option B: DeepSeek (Cost-effective)
- Visit [DeepSeek](https://www.deepseek.com/)
- Create an account and generate API key
- Add to `REACT_APP_DEEPSEEK_API_KEY`
- Excellent value for money with strong reasoning capabilities

#### Option C: Google Gemini
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Generate API key
- Add to `REACT_APP_GEMINI_API_KEY`
- Good integration with Google services

#### Option D: Ollama (Local/Free)
- Install [Ollama](https://ollama.ai/) locally
- Run: `ollama pull llama2:7b` or another model
- Start Ollama server: `ollama serve`
- No API key required - runs locally

#### Option E: Anthropic Claude
- Visit [Anthropic Console](https://console.anthropic.com/)
- Generate API key
- Add to `REACT_APP_ANTHROPIC_API_KEY`
- Excellent for detailed analysis and safety

### 3. AI Features Integration

The AI system is automatically integrated into:

#### Dashboard
- Intelligent insights and recommendations
- Practice area analytics
- Risk alerts and opportunities

#### Matter Management
- Case outcome predictions
- Settlement opportunity analysis
- Timeline and cost forecasting

#### Contract Management
- Automated contract analysis
- Risk clause identification
- Negotiation recommendations

#### AI Chat Assistant
- Full-featured legal AI assistant
- Context-aware responses
- Multiple specialized modes

### 4. AI Provider Switching

You can switch between AI providers in real-time:

1. Go to AI Assistant page
2. Click "Settings"
3. Select your preferred provider
4. The system will automatically fallback to other providers if one fails

### 5. Cost Management

**Approximate costs per 1K tokens:**
- DeepSeek: $0.002 (most economical)
- Gemini: $0.0005 
- OpenAI GPT-4: $0.03
- Claude: $0.015
- Ollama: Free (local)

**Recommendations:**
- Use DeepSeek for high-volume operations
- Use OpenAI GPT-4 for complex legal analysis
- Use Ollama for development and testing
- Monitor usage through provider dashboards

### 6. Security Considerations

**Data Privacy:**
- All AI interactions are encrypted in transit
- No sensitive data is stored by AI providers longer than necessary
- Consider using Ollama for highly sensitive matters

**API Key Security:**
- Store API keys in environment variables only
- Never commit API keys to version control
- Rotate keys regularly
- Use different keys for development and production

### 7. Performance Optimization

**Response Times:**
- OpenAI: 2-5 seconds
- DeepSeek: 3-6 seconds
- Gemini: 2-4 seconds
- Claude: 3-7 seconds
- Ollama: 5-15 seconds (depends on hardware)

**Optimization Tips:**
- Use appropriate temperature settings (0.3 for legal work)
- Implement request caching for repeated queries
- Use streaming responses for long documents
- Consider provider load balancing

### 8. Legal Compliance

**Important Notes:**
- AI suggestions are tools to assist legal professionals
- Always review AI-generated content for accuracy
- Maintain attorney-client privilege considerations
- Comply with jurisdiction-specific AI usage regulations
- Keep audit trails for AI-assisted decisions

### 9. Troubleshooting

**Common Issues:**

1. **API Key Errors**
   - Verify API key format and permissions
   - Check account billing status
   - Ensure key has appropriate scopes

2. **Provider Unavailable**
   - System automatically fails over to next available provider
   - Check provider status pages
   - Verify network connectivity

3. **Slow Responses**
   - Check internet connection
   - Try different provider
   - Reduce prompt complexity

4. **Inaccurate Results**
   - Provide more context in prompts
   - Use specialized AI modes (research, contract, etc.)
   - Cross-reference with multiple providers

### 10. Advanced Features

**Custom Prompts:**
- Modify system prompts in `src/services/ai/providers.ts`
- Customize for specific practice areas
- Add firm-specific templates

**Provider Configuration:**
- Adjust temperature and token limits
- Configure custom endpoints
- Implement rate limiting

**Analytics:**
- Track AI usage and costs
- Monitor response quality
- Generate usage reports

## Support

For AI-related issues:
1. Check provider status pages
2. Review API key configuration
3. Test with different providers
4. Contact technical support with error logs

## Future Enhancements

Planned AI features:
- Document OCR and analysis
- Voice-to-text legal dictation
- Automated legal document generation
- Advanced predictive analytics
- Multi-language legal support