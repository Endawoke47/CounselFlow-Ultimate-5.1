import React, { useState } from 'react'
import { Plus, Search, Filter, Brain, Calendar, DollarSign, User, MoreVertical, AlertTriangle, TrendingUp, Clock, Download, Eye, Edit, Trash2, Upload, BarChart3, Zap, BookOpen, FileText, Tag, Star, Users, Building2, Globe, Target, Activity, CheckCircle, XCircle, AlertCircle, Award, Briefcase, Bookmark, Share2, MessageSquare, ThumbsUp, ArrowUp, ArrowDown, Filter as FilterIcon, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

interface KnowledgeItem {
  id: string
  title: string
  type: 'document' | 'template' | 'precedent' | 'policy' | 'guide' | 'memo' | 'opinion' | 'research'
  category: 'contracts' | 'litigation' | 'compliance' | 'ip' | 'employment' | 'corporate' | 'regulatory' | 'privacy' | 'general'
  content: string
  tags: string[]
  author: string
  created: string
  modified: string
  status: 'draft' | 'review' | 'approved' | 'archived'
  views: number
  downloads: number
  rating: number
  version: string
  jurisdiction?: string
  practiceArea: string
  confidentiality: 'public' | 'internal' | 'confidential' | 'restricted'
  attachments: string[]
  relatedItems: string[]
  aiSummary: string
  searchRelevance?: number
}

interface SearchFilter {
  type: string[]
  category: string[]
  practiceArea: string[]
  confidentiality: string[]
  dateRange: {
    start: string
    end: string
  }
  author: string[]
  tags: string[]
}

interface SearchResult {
  item: KnowledgeItem
  relevance: number
  highlights: string[]
  similarItems: string[]
}

export function KnowledgePage() {
  const [knowledgeItems] = useState<KnowledgeItem[]>([
    {
      id: '1',
      title: 'Software License Agreement Template - Enterprise',
      type: 'template',
      category: 'contracts',
      content: 'Comprehensive enterprise software license agreement template with AI-powered clause recommendations and risk assessment.',
      tags: ['software', 'enterprise', 'licensing', 'technology', 'saas'],
      author: 'Michael Chen',
      created: '2024-01-15',
      modified: '2024-01-20',
      status: 'approved',
      views: 245,
      downloads: 89,
      rating: 4.8,
      version: '2.1',
      jurisdiction: 'United States',
      practiceArea: 'Technology & IP',
      confidentiality: 'internal',
      attachments: ['template-v2.1.docx', 'clause-library.pdf', 'negotiation-guide.pdf'],
      relatedItems: ['2', '8', '15'],
      aiSummary: 'Enterprise-grade software licensing template with comprehensive IP protection, liability limitations, and termination provisions. Includes AI-generated risk assessments and negotiation strategies.'
    },
    {
      id: '2',
      title: 'GDPR Compliance Checklist and Implementation Guide',
      type: 'guide',
      category: 'privacy',
      content: 'Complete GDPR compliance framework with automated assessment tools and implementation roadmap for global organizations.',
      tags: ['gdpr', 'privacy', 'data-protection', 'compliance', 'eu', 'international'],
      author: 'Emma Davis',
      created: '2024-01-10',
      modified: '2024-01-25',
      status: 'approved',
      views: 567,
      downloads: 234,
      rating: 4.9,
      version: '3.0',
      jurisdiction: 'European Union',
      practiceArea: 'Privacy & Data Protection',
      confidentiality: 'public',
      attachments: ['gdpr-checklist.xlsx', 'implementation-guide.pdf', 'dpia-template.docx'],
      relatedItems: ['6', '12', '18'],
      aiSummary: 'Comprehensive GDPR compliance framework with step-by-step implementation guide, automated assessment tools, and real-time compliance monitoring capabilities.'
    },
    {
      id: '3',
      title: 'Patent Application Strategy - AI & Machine Learning',
      type: 'research',
      category: 'ip',
      content: 'Strategic analysis of AI patent landscape with filing recommendations and competitive intelligence insights.',
      tags: ['patents', 'ai', 'machine-learning', 'strategy', 'filing', 'prior-art'],
      author: 'David Kim',
      created: '2024-01-08',
      modified: '2024-01-22',
      status: 'approved',
      views: 189,
      downloads: 76,
      rating: 4.7,
      version: '1.5',
      jurisdiction: 'United States',
      practiceArea: 'Intellectual Property',
      confidentiality: 'confidential',
      attachments: ['patent-landscape.pdf', 'filing-strategy.pptx', 'prior-art-analysis.xlsx'],
      relatedItems: ['9', '14', '20'],
      aiSummary: 'Strategic patent filing guide for AI technologies with comprehensive prior art analysis, competitive landscape mapping, and AI-powered filing recommendations.'
    },
    {
      id: '4',
      title: 'Employment Law Updates - Remote Work Policies',
      type: 'memo',
      category: 'employment',
      content: 'Latest employment law developments affecting remote work arrangements and policy recommendations.',
      tags: ['employment', 'remote-work', 'policies', 'covid-19', 'hr', 'compliance'],
      author: 'Sarah Johnson',
      created: '2024-01-12',
      modified: '2024-01-18',
      status: 'approved',
      views: 423,
      downloads: 167,
      rating: 4.6,
      version: '2.0',
      jurisdiction: 'United States',
      practiceArea: 'Employment Law',
      confidentiality: 'internal',
      attachments: ['policy-template.docx', 'legal-updates.pdf', 'compliance-matrix.xlsx'],
      relatedItems: ['7', '11', '16'],
      aiSummary: 'Comprehensive remote work policy framework with latest legal updates, compliance requirements, and AI-powered risk assessments for multi-jurisdictional organizations.'
    },
    {
      id: '5',
      title: 'M&A Due Diligence Checklist - Technology Sector',
      type: 'document',
      category: 'corporate',
      content: 'Comprehensive due diligence framework for technology acquisitions with AI-enhanced risk scoring.',
      tags: ['ma', 'due-diligence', 'technology', 'acquisitions', 'risk-assessment'],
      author: 'Jennifer Lee',
      created: '2024-01-05',
      modified: '2024-01-24',
      status: 'approved',
      views: 334,
      downloads: 128,
      rating: 4.8,
      version: '4.2',
      jurisdiction: 'United States',
      practiceArea: 'Corporate & M&A',
      confidentiality: 'confidential',
      attachments: ['checklist-v4.2.xlsx', 'risk-matrix.pdf', 'tech-dd-guide.docx'],
      relatedItems: ['3', '13', '19'],
      aiSummary: 'Technology sector M&A due diligence framework with AI-powered risk assessment, automated checklist generation, and predictive analytics for deal success probability.'
    },
    {
      id: '6',
      title: 'Contract Negotiation Playbook - SaaS Agreements',
      type: 'guide',
      category: 'contracts',
      content: 'Strategic negotiation guide for SaaS contracts with AI-powered clause analysis and recommendations.',
      tags: ['saas', 'negotiation', 'contracts', 'playbook', 'strategy', 'cloud'],
      author: 'Alex Rodriguez',
      created: '2024-01-03',
      modified: '2024-01-21',
      status: 'approved',
      views: 456,
      downloads: 189,
      rating: 4.9,
      version: '3.1',
      jurisdiction: 'United States',
      practiceArea: 'Technology & IP',
      confidentiality: 'internal',
      attachments: ['playbook-v3.1.pdf', 'clause-library.docx', 'negotiation-matrix.xlsx'],
      relatedItems: ['1', '8', '17'],
      aiSummary: 'Comprehensive SaaS contract negotiation playbook with AI-powered clause analysis, risk scoring, and strategic recommendations for optimal deal terms.'
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'browse' | 'search' | 'favorites' | 'recent'>('browse')
  const [selectedFilters, setSelectedFilters] = useState<SearchFilter>({
    type: [],
    category: [],
    practiceArea: [],
    confidentiality: [],
    dateRange: { start: '', end: '' },
    author: [],
    tags: []
  })
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'rating' | 'views'>('relevance')
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null)

  const filteredItems = knowledgeItems.filter(item => {
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false
    }
    
    if (selectedFilters.type.length > 0 && !selectedFilters.type.includes(item.type)) return false
    if (selectedFilters.category.length > 0 && !selectedFilters.category.includes(item.category)) return false
    if (selectedFilters.practiceArea.length > 0 && !selectedFilters.practiceArea.includes(item.practiceArea)) return false
    if (selectedFilters.confidentiality.length > 0 && !selectedFilters.confidentiality.includes(item.confidentiality)) return false
    
    return true
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText
      case 'template': return BookOpen
      case 'precedent': return Award
      case 'policy': return Shield
      case 'guide': return Target
      case 'memo': return MessageSquare
      case 'opinion': return Brain
      case 'research': return BarChart3
      default: return FileText
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'review': return 'bg-blue-100 text-blue-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getConfidentialityColor = (confidentiality: string) => {
    switch (confidentiality) {
      case 'public': return 'bg-green-100 text-green-800'
      case 'internal': return 'bg-blue-100 text-blue-800'
      case 'confidential': return 'bg-orange-100 text-orange-800'
      case 'restricted': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Management</h1>
          <p className="text-gray-600 mt-2">Intelligent legal knowledge repository with AI-powered search and insights</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all">
            <Upload size={20} />
            Upload Document
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all">
            <Plus size={20} />
            Create Knowledge
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search knowledge base with AI-powered semantic search..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="date">Sort by Date</option>
              <option value="rating">Sort by Rating</option>
              <option value="views">Sort by Views</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={20} />
              Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
            <option>All Types</option>
            <option>Documents</option>
            <option>Templates</option>
            <option>Precedents</option>
            <option>Policies</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
            <option>All Categories</option>
            <option>Contracts</option>
            <option>Litigation</option>
            <option>Compliance</option>
            <option>IP</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
            <option>All Practice Areas</option>
            <option>Technology & IP</option>
            <option>Corporate & M&A</option>
            <option>Employment Law</option>
            <option>Privacy & Data</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
            <option>All Confidentiality</option>
            <option>Public</option>
            <option>Internal</option>
            <option>Confidential</option>
            <option>Restricted</option>
          </select>
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="From Date"
          />
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="To Date"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'browse', label: 'Browse All', icon: BookOpen },
              { key: 'search', label: 'AI Search', icon: Brain },
              { key: 'favorites', label: 'Favorites', icon: Star },
              { key: 'recent', label: 'Recent', icon: Clock }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'browse' && (
            <div className="space-y-6">
              {/* Knowledge Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white p-6 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-cyan-100 text-sm font-medium">Total Documents</p>
                      <p className="text-2xl font-bold">2,847</p>
                    </div>
                    <FileText size={32} className="text-cyan-200" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-6 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-teal-100 text-sm font-medium">AI Insights</p>
                      <p className="text-2xl font-bold">1,234</p>
                    </div>
                    <Brain size={32} className="text-teal-200" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Search Accuracy</p>
                      <p className="text-2xl font-bold">96.8%</p>
                    </div>
                    <Target size={32} className="text-blue-200" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Usage This Month</p>
                      <p className="text-2xl font-bold">89.2%</p>
                    </div>
                    <Activity size={32} className="text-purple-200" />
                  </div>
                </motion.div>
              </div>

              {/* Knowledge Items Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredItems.map((item, index) => {
                  const IconComponent = getTypeIcon(item.type)
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-cyan-100 to-teal-100 rounded-lg">
                            <IconComponent size={24} className="text-cyan-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-500">v{item.version} • {item.author}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidentialityColor(item.confidentiality)}`}>
                            {item.confidentiality}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">{item.content}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{item.tags.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye size={16} />
                            {item.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download size={16} />
                            {item.downloads}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star size={16} />
                            {item.rating}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-cyan-600 transition-colors">
                            <Bookmark size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-cyan-600 transition-colors">
                            <Share2 size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-cyan-600 transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </div>

                      {/* AI Summary */}
                      <div className="mt-4 p-3 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg border border-cyan-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain size={16} className="text-cyan-600" />
                          <span className="text-sm font-medium text-cyan-800">AI Summary</span>
                        </div>
                        <p className="text-sm text-cyan-700 line-clamp-2">{item.aiSummary}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <Brain size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Semantic Search</h3>
                <p className="text-gray-600 mb-6">Use natural language to find relevant legal knowledge and precedents</p>
                <div className="max-w-2xl mx-auto">
                  <div className="relative">
                    <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Ask me anything about your legal knowledge base..."
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg"
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {[
                      'Find SaaS contract templates',
                      'Show GDPR compliance guides',
                      'Patent filing strategies for AI',
                      'Employment law updates 2024'
                    ].map((query) => (
                      <button
                        key={query}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="text-center py-12">
              <Star size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Favorites</h3>
              <p className="text-gray-600">Star documents to quickly access them later</p>
            </div>
          )}

          {activeTab === 'recent' && (
            <div className="text-center py-12">
              <Clock size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Recent Activity</h3>
              <p className="text-gray-600">Your recently viewed and downloaded documents</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}