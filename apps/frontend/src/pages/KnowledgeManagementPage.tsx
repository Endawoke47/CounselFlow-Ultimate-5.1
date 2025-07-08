import React, { useState } from 'react'
import { Plus, Search, Filter, BookOpen, Calendar, DollarSign, User, MoreVertical, Brain, AlertTriangle, TrendingUp, Clock, Download, Eye, Edit, Trash2, Upload, BarChart3, Zap, FileText, Globe, Shield, Tag, Star, FolderOpen, Archive, MessageSquare, Scale } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, Input, Badge, Modal } from '../components/ui/UIComponents'

interface KnowledgeItem {
  id: string
  title: string
  type: 'precedent' | 'template' | 'memo' | 'research' | 'policy' | 'guideline' | 'case-law' | 'statute'
  category: 'corporate' | 'litigation' | 'employment' | 'ip' | 'real-estate' | 'compliance' | 'tax' | 'other'
  content: string
  tags: string[]
  jurisdiction: string
  practiceArea: string
  author: string
  createdDate: string
  lastUpdated: string
  accessLevel: 'public' | 'internal' | 'restricted' | 'confidential'
  views: number
  downloads: number
  rating: number
  relevanceScore: number
  isBookmarked: boolean
  relatedCases: string[]
  citations: number
  summary: string
  keyPoints: string[]
  aiInsights: string[]
}

export function KnowledgeManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [accessFilter, setAccessFilter] = useState('all')
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const knowledgeItems: KnowledgeItem[] = [
    {
      id: '1',
      title: 'Delaware Corporate Law Update 2024',
      type: 'research',
      category: 'corporate',
      content: 'Comprehensive analysis of recent changes to Delaware General Corporation Law...',
      tags: ['Delaware', 'Corporate Law', '2024 Update', 'Director Duties'],
      jurisdiction: 'Delaware',
      practiceArea: 'Corporate Law',
      author: 'Sarah Johnson',
      createdDate: '2024-01-15',
      lastUpdated: '2024-01-20',
      accessLevel: 'internal',
      views: 245,
      downloads: 89,
      rating: 4.8,
      relevanceScore: 95,
      isBookmarked: true,
      relatedCases: ['Moelis & Co. v. Carlisle', 'Chancellor Energy v. Patel'],
      citations: 12,
      summary: 'Recent amendments to Delaware corporate law affecting fiduciary duties',
      keyPoints: ['Enhanced disclosure requirements', 'Modified voting procedures', 'Updated liability standards'],
      aiInsights: ['High precedential value', 'Frequently referenced', 'Key practice area update']
    },
    {
      id: '2',
      title: 'M&A Due Diligence Checklist Template',
      type: 'template',
      category: 'corporate',
      content: 'Comprehensive checklist for merger and acquisition due diligence...',
      tags: ['M&A', 'Due Diligence', 'Template', 'Corporate'],
      jurisdiction: 'Multi-jurisdictional',
      practiceArea: 'Corporate Law',
      author: 'Michael Chen',
      createdDate: '2023-11-10',
      lastUpdated: '2024-02-05',
      accessLevel: 'internal',
      views: 568,
      downloads: 234,
      rating: 4.9,
      relevanceScore: 92,
      isBookmarked: false,
      relatedCases: [],
      citations: 8,
      summary: 'Standardized checklist for M&A transaction due diligence',
      keyPoints: ['Financial review items', 'Legal compliance checks', 'Operational assessments'],
      aiInsights: ['Most downloaded template', 'High user satisfaction', 'Recently updated']
    },
    {
      id: '3',
      title: 'Employment Discrimination Case Analysis',
      type: 'case-law',
      category: 'employment',
      content: 'Analysis of recent employment discrimination precedents...',
      tags: ['Employment', 'Discrimination', 'Case Law', 'Precedent'],
      jurisdiction: 'Federal',
      practiceArea: 'Employment Law',
      author: 'Lisa Rodriguez',
      createdDate: '2024-02-20',
      lastUpdated: '2024-02-25',
      accessLevel: 'internal',
      views: 189,
      downloads: 67,
      rating: 4.6,
      relevanceScore: 88,
      isBookmarked: true,
      relatedCases: ['Williams v. TechCorp', 'Johnson v. Metro Inc.'],
      citations: 15,
      summary: 'Recent federal court decisions on workplace discrimination',
      keyPoints: ['Burden of proof standards', 'Damages calculations', 'Procedural requirements'],
      aiInsights: ['Trending topic', 'High legal impact', 'Multiple jurisdictions']
    },
    {
      id: '4',
      title: 'Patent Filing Strategy Memo',
      type: 'memo',
      category: 'ip',
      content: 'Strategic considerations for patent portfolio development...',
      tags: ['Patents', 'IP Strategy', 'Portfolio', 'Filing'],
      jurisdiction: 'USPTO',
      practiceArea: 'Intellectual Property',
      author: 'David Wilson',
      createdDate: '2024-01-08',
      lastUpdated: '2024-01-12',
      accessLevel: 'confidential',
      views: 145,
      downloads: 45,
      rating: 4.7,
      relevanceScore: 90,
      isBookmarked: false,
      relatedCases: [],
      citations: 6,
      summary: 'Best practices for patent application strategy',
      keyPoints: ['Prior art analysis', 'Claim drafting', 'International considerations'],
      aiInsights: ['Expert insights', 'Strategic value', 'Client-specific guidance']
    },
    {
      id: '5',
      title: 'GDPR Compliance Guidelines',
      type: 'guideline',
      category: 'compliance',
      content: 'Comprehensive guide to GDPR compliance requirements...',
      tags: ['GDPR', 'Privacy', 'Compliance', 'EU Law'],
      jurisdiction: 'European Union',
      practiceArea: 'Privacy & Data Protection',
      author: 'Jennifer Davis',
      createdDate: '2023-12-15',
      lastUpdated: '2024-03-01',
      accessLevel: 'internal',
      views: 412,
      downloads: 178,
      rating: 4.8,
      relevanceScore: 94,
      isBookmarked: true,
      relatedCases: [],
      citations: 22,
      summary: 'Practical guide for GDPR compliance implementation',
      keyPoints: ['Data processing requirements', 'Consent mechanisms', 'Breach notification procedures'],
      aiInsights: ['Regulatory priority', 'Wide applicability', 'Regular updates needed']
    }
  ]

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    const matchesAccess = accessFilter === 'all' || item.accessLevel === accessFilter
    return matchesSearch && matchesType && matchesCategory && matchesAccess
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'precedent': return Scale
      case 'template': return FileText
      case 'memo': return MessageSquare
      case 'research': return BookOpen
      case 'policy': return Shield
      case 'guideline': return Archive
      case 'case-law': return Scale
      case 'statute': return Globe
      default: return FileText
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'precedent': return 'from-blue-500 to-blue-600'
      case 'template': return 'from-green-500 to-green-600'
      case 'memo': return 'from-purple-500 to-purple-600'
      case 'research': return 'from-orange-500 to-orange-600'
      case 'policy': return 'from-red-500 to-red-600'
      case 'guideline': return 'from-indigo-500 to-indigo-600'
      case 'case-law': return 'from-blue-500 to-blue-600'
      case 'statute': return 'from-gray-500 to-gray-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const totalItems = knowledgeItems.length
  const totalViews = knowledgeItems.reduce((sum, item) => sum + item.views, 0)
  const totalDownloads = knowledgeItems.reduce((sum, item) => sum + item.downloads, 0)
  const highRatedItems = knowledgeItems.filter(item => item.rating >= 4.5).length
  const aiEnhancedItems = knowledgeItems.filter(item => item.aiInsights.length > 0).length

  return (
    <div className="px-4 lg:px-6 bg-gradient-to-br from-teal-50 to-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent">
              Knowledge Management
            </h1>
            <p className="text-teal-600 mt-2 text-lg font-medium">
              Centralized legal knowledge, templates, and research with AI-powered search
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button 
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Upload className="h-4 w-4" />
              <span>Bulk Import</span>
            </motion.button>
            <motion.button 
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Add Knowledge</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Analytics Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Total Items</p>
                <p className="text-3xl font-bold text-teal-800">{totalItems}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-teal-500 ml-1">this month</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Total Views</p>
                <p className="text-3xl font-bold text-teal-800">{totalViews.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-teal-600 font-medium">Active usage</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Downloads</p>
                <p className="text-3xl font-bold text-teal-800">{totalDownloads}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <Download className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+8%</span>
              <span className="text-teal-500 ml-1">this week</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">High Rated</p>
                <p className="text-3xl font-bold text-teal-800">{highRatedItems}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-orange-600 font-medium">4.5+ rating</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">AI Enhanced</p>
                <p className="text-3xl font-bold text-teal-800">{aiEnhancedItems}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-red-600 font-medium">Smart insights</span>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
              <input
                type="text"
                placeholder="Search knowledge base..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-900 placeholder-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Types</option>
                <option value="precedent">Precedent</option>
                <option value="template">Template</option>
                <option value="memo">Memo</option>
                <option value="research">Research</option>
                <option value="policy">Policy</option>
                <option value="guideline">Guideline</option>
                <option value="case-law">Case Law</option>
                <option value="statute">Statute</option>
              </select>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Categories</option>
                <option value="corporate">Corporate</option>
                <option value="litigation">Litigation</option>
                <option value="employment">Employment</option>
                <option value="ip">IP</option>
                <option value="real-estate">Real Estate</option>
                <option value="compliance">Compliance</option>
                <option value="tax">Tax</option>
                <option value="other">Other</option>
              </select>

              <select
                value={accessFilter}
                onChange={(e) => setAccessFilter(e.target.value)}
                className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Access</option>
                <option value="public">Public</option>
                <option value="internal">Internal</option>
                <option value="restricted">Restricted</option>
                <option value="confidential">Confidential</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Knowledge Items Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {filteredItems.map((item, index) => {
          const TypeIcon = getTypeIcon(item.type)
          return (
            <motion.div
              key={item.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-teal-800 mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-teal-600 mb-3 line-clamp-2">{item.summary}</p>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded-lg font-medium capitalize">
                      {item.type.replace('-', ' ')}
                    </span>
                    <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded-lg font-medium capitalize">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${getTypeColor(item.type)}`}>
                    <TypeIcon className="h-4 w-4 text-white" />
                  </div>
                  {item.isBookmarked && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Author</span>
                  <span className="text-sm font-medium text-teal-800">{item.author}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Updated</span>
                  <span className="text-sm font-medium text-teal-800">{formatDate(item.lastUpdated)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Views</span>
                  <span className="text-sm font-medium text-teal-800">{item.views}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Rating</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-bold text-teal-800">{item.rating}</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`h-3 w-3 ${
                            star <= item.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {item.tags.slice(0, 3).map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className="text-xs px-2 py-1 bg-teal-50 text-teal-600 rounded border border-teal-200"
                  >
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded border border-gray-200">
                    +{item.tags.length - 3} more
                  </span>
                )}
              </div>

              {/* AI Insights */}
              {item.aiInsights.length > 0 && (
                <div className="mt-3 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="h-4 w-4 text-teal-600" />
                    <span className="text-sm font-semibold text-teal-700">AI Insights</span>
                  </div>
                  <ul className="space-y-1">
                    {item.aiInsights.slice(0, 2).map((insight, idx) => (
                      <li key={idx} className="text-xs text-teal-600 flex items-start">
                        <span className="w-1 h-1 bg-teal-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Knowledge Item Detail Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.title}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Type</label>
                <p className="text-teal-800 font-medium capitalize">{selectedItem.type.replace('-', ' ')}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Category</label>
                <p className="text-teal-800 font-medium capitalize">{selectedItem.category}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Author</label>
                <p className="text-teal-800">{selectedItem.author}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Practice Area</label>
                <p className="text-teal-800">{selectedItem.practiceArea}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Jurisdiction</label>
                <p className="text-teal-800">{selectedItem.jurisdiction}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Access Level</label>
                <p className="text-teal-800 capitalize">{selectedItem.accessLevel}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-teal-600 mb-2">Summary</label>
              <p className="text-teal-800">{selectedItem.summary}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-teal-600 mb-2">Key Points</label>
              <ul className="space-y-1">
                {selectedItem.keyPoints.map((point, index) => (
                  <li key={index} className="text-teal-800 flex items-start">
                    <span className="w-2 h-2 bg-teal-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {selectedItem.aiInsights.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-2">AI Insights</label>
                <div className="space-y-2">
                  {selectedItem.aiInsights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                      <Brain className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-teal-800">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <motion.button 
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Full Content
              </motion.button>
              <motion.button 
                className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Download
              </motion.button>
              <motion.button 
                className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Share
              </motion.button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Knowledge Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Add Knowledge Item"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Title</label>
                <input 
                  className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-900 placeholder-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter title" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Type</label>
                <select className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200">
                  <option value="precedent">Precedent</option>
                  <option value="template">Template</option>
                  <option value="memo">Memo</option>
                  <option value="research">Research</option>
                  <option value="policy">Policy</option>
                  <option value="guideline">Guideline</option>
                  <option value="case-law">Case Law</option>
                  <option value="statute">Statute</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Category</label>
                <select className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200">
                  <option value="corporate">Corporate</option>
                  <option value="litigation">Litigation</option>
                  <option value="employment">Employment</option>
                  <option value="ip">IP</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="compliance">Compliance</option>
                  <option value="tax">Tax</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Access Level</label>
                <select className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200">
                  <option value="public">Public</option>
                  <option value="internal">Internal</option>
                  <option value="restricted">Restricted</option>
                  <option value="confidential">Confidential</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-teal-600 mb-1">Summary</label>
              <textarea 
                className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-900 placeholder-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 h-20 resize-none"
                placeholder="Enter summary..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-teal-600 mb-1">Tags (comma separated)</label>
              <input 
                className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-900 placeholder-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                placeholder="tag1, tag2, tag3" 
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <motion.button 
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Knowledge Item
              </motion.button>
              <motion.button 
                className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
