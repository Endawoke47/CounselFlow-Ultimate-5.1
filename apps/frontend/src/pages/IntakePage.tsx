import React, { useState } from 'react'
import { Plus, Search, Filter, Users, Calendar, DollarSign, User, MoreVertical, Brain, AlertTriangle, TrendingUp, Clock, Download, Eye, Edit, Trash2, Upload, BarChart3, Zap, FileText, Globe, Shield, Tag, Star, MessageSquare, Phone, Mail, Building, CheckCircle, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, Input, Badge, Modal } from '../components/ui/UIComponents'

interface IntakeRequest {
  id: string
  clientName: string
  contactPerson: string
  email: string
  phone: string
  company?: string
  matterType: 'litigation' | 'transactional' | 'compliance' | 'ip' | 'employment' | 'real-estate' | 'other'
  urgency: 'low' | 'medium' | 'high' | 'critical'
  status: 'new' | 'reviewing' | 'assigned' | 'declined' | 'on-hold'
  description: string
  estimatedValue?: number
  conflictCheckStatus: 'pending' | 'clear' | 'conflict' | 'requires-review'
  assignedTo?: string
  submittedDate: string
  responseDeadline?: string
  documents: string[]
  source: 'website' | 'referral' | 'existing-client' | 'cold-outreach' | 'marketing'
  aiRiskAssessment: 'low' | 'medium' | 'high'
  aiComplexityScore: number
  estimatedHours?: number
  practiceAreaRecommendation: string[]
  notes: string[]
}

export function IntakePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [urgencyFilter, setUrgencyFilter] = useState('all')
  const [matterTypeFilter, setMatterTypeFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState<IntakeRequest | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const intakeRequests: IntakeRequest[] = [
    {
      id: '1',
      clientName: 'TechStart Innovations',
      contactPerson: 'Sarah Chen',
      email: 'sarah.chen@techstart.com',
      phone: '+1 (555) 123-4567',
      company: 'TechStart Innovations Inc.',
      matterType: 'transactional',
      urgency: 'high',
      status: 'reviewing',
      description: 'Series A funding round legal support needed for $5M raise. Timeline is tight with investor meetings scheduled.',
      estimatedValue: 150000,
      conflictCheckStatus: 'clear',
      assignedTo: 'Michael Chen',
      submittedDate: '2024-03-20',
      responseDeadline: '2024-03-22',
      documents: ['Term Sheet.pdf', 'Business Plan.pdf', 'Financial Projections.xlsx'],
      source: 'referral',
      aiRiskAssessment: 'medium',
      aiComplexityScore: 75,
      estimatedHours: 120,
      practiceAreaRecommendation: ['Corporate Law', 'Securities Law'],
      notes: ['Previous client relationship', 'High-value opportunity', 'Time-sensitive matter']
    },
    {
      id: '2',
      clientName: 'Global Manufacturing Corp',
      contactPerson: 'Robert Martinez',
      email: 'r.martinez@globalmfg.com',
      phone: '+1 (555) 987-6543',
      company: 'Global Manufacturing Corp',
      matterType: 'employment',
      urgency: 'critical',
      status: 'new',
      description: 'Urgent employment discrimination claim filed by former employee. Potential class action risk.',
      estimatedValue: 250000,
      conflictCheckStatus: 'pending',
      submittedDate: '2024-03-21',
      responseDeadline: '2024-03-23',
      documents: ['EEOC Complaint.pdf', 'Employment Records.pdf'],
      source: 'existing-client',
      aiRiskAssessment: 'high',
      aiComplexityScore: 85,
      estimatedHours: 200,
      practiceAreaRecommendation: ['Employment Law', 'Litigation'],
      notes: ['Existing client', 'High exposure risk', 'Media attention potential']
    },
    {
      id: '3',
      clientName: 'Digital Solutions LLC',
      contactPerson: 'Emily Johnson',
      email: 'emily@digitalsolutions.com',
      phone: '+1 (555) 456-7890',
      company: 'Digital Solutions LLC',
      matterType: 'ip',
      urgency: 'medium',
      status: 'assigned',
      description: 'Patent portfolio review and IP strategy development for upcoming product launch.',
      estimatedValue: 75000,
      conflictCheckStatus: 'clear',
      assignedTo: 'Lisa Rodriguez',
      submittedDate: '2024-03-18',
      documents: ['Product Specifications.pdf', 'Prior Art Analysis.pdf'],
      source: 'website',
      aiRiskAssessment: 'low',
      aiComplexityScore: 60,
      estimatedHours: 80,
      practiceAreaRecommendation: ['Intellectual Property'],
      notes: ['New client prospect', 'Potential ongoing relationship']
    },
    {
      id: '4',
      clientName: 'Metro Real Estate Group',
      contactPerson: 'David Wilson',
      email: 'dwilson@metrorealestate.com',
      phone: '+1 (555) 321-0987',
      company: 'Metro Real Estate Group',
      matterType: 'real-estate',
      urgency: 'low',
      status: 'on-hold',
      description: 'Commercial lease negotiation for new headquarters. Multiple properties under consideration.',
      estimatedValue: 45000,
      conflictCheckStatus: 'requires-review',
      submittedDate: '2024-03-15',
      documents: ['Property Details.pdf', 'Lease Templates.pdf'],
      source: 'referral',
      aiRiskAssessment: 'low',
      aiComplexityScore: 40,
      estimatedHours: 35,
      practiceAreaRecommendation: ['Real Estate Law'],
      notes: ['Conflict check in progress', 'Standard commercial lease matter']
    },
    {
      id: '5',
      clientName: 'FinTech Startup Co.',
      contactPerson: 'Jennifer Davis',
      email: 'jen@fintechstartup.co',
      phone: '+1 (555) 654-3210',
      company: 'FinTech Startup Co.',
      matterType: 'compliance',
      urgency: 'high',
      status: 'declined',
      description: 'Regulatory compliance review for new cryptocurrency trading platform. Complex federal and state regulations.',
      estimatedValue: 300000,
      conflictCheckStatus: 'conflict',
      submittedDate: '2024-03-12',
      documents: ['Platform Architecture.pdf', 'Regulatory Analysis.pdf'],
      source: 'cold-outreach',
      aiRiskAssessment: 'high',
      aiComplexityScore: 95,
      estimatedHours: 250,
      practiceAreaRecommendation: ['Securities Law', 'FinTech Compliance'],
      notes: ['Conflict of interest identified', 'High regulatory complexity', 'Declined representation']
    }
  ]

  const filteredRequests = intakeRequests.filter(request => {
    const matchesSearch = request.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const matchesUrgency = urgencyFilter === 'all' || request.urgency === urgencyFilter
    const matchesMatterType = matterTypeFilter === 'all' || request.matterType === matterTypeFilter
    return matchesSearch && matchesStatus && matchesUrgency && matchesMatterType
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const statusConfig = {
    new: { color: 'info' as const, icon: FileText },
    reviewing: { color: 'warning' as const, icon: Clock },
    assigned: { color: 'success' as const, icon: CheckCircle },
    declined: { color: 'danger' as const, icon: XCircle },
    'on-hold': { color: 'warning' as const, icon: Clock }
  }

  const urgencyConfig = {
    low: { color: 'info' as const },
    medium: { color: 'warning' as const },
    high: { color: 'danger' as const },
    critical: { color: 'danger' as const }
  }

  const conflictConfig = {
    pending: { color: 'warning' as const, text: 'Pending' },
    clear: { color: 'success' as const, text: 'Clear' },
    conflict: { color: 'danger' as const, text: 'Conflict' },
    'requires-review': { color: 'warning' as const, text: 'Review Needed' }
  }

  const totalRequests = intakeRequests.length
  const newRequests = intakeRequests.filter(r => r.status === 'new').length
  const criticalRequests = intakeRequests.filter(r => r.urgency === 'critical').length
  const avgComplexity = intakeRequests.reduce((sum, r) => sum + r.aiComplexityScore, 0) / intakeRequests.length
  const totalEstimatedValue = intakeRequests.reduce((sum, r) => sum + (r.estimatedValue || 0), 0)

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
              Client Intake
            </h1>
            <p className="text-teal-600 mt-2 text-lg font-medium">
              Streamlined client onboarding with AI-powered risk assessment and conflict checking
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button 
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="h-4 w-4" />
              <span>Export List</span>
            </motion.button>
            <motion.button 
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4" />
              <span>New Intake</span>
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
                <p className="text-sm font-semibold text-teal-600">Total Requests</p>
                <p className="text-3xl font-bold text-teal-800">{totalRequests}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+18%</span>
              <span className="text-teal-500 ml-1">this month</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">New Requests</p>
                <p className="text-3xl font-bold text-teal-800">{newRequests}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-teal-600 font-medium">Awaiting review</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Critical Items</p>
                <p className="text-3xl font-bold text-teal-800">{criticalRequests}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-red-600 font-medium">Immediate attention</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Avg Complexity</p>
                <p className="text-3xl font-bold text-teal-800">{avgComplexity.toFixed(0)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-purple-600 font-medium">AI assessment</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Est. Value</p>
                <p className="text-3xl font-bold text-teal-800">{formatCurrency(totalEstimatedValue)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-orange-600 font-medium">Potential revenue</span>
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
                placeholder="Search client name, contact, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-900 placeholder-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="assigned">Assigned</option>
                <option value="declined">Declined</option>
                <option value="on-hold">On Hold</option>
              </select>
              
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Urgency</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>

              <select
                value={matterTypeFilter}
                onChange={(e) => setMatterTypeFilter(e.target.value)}
                className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Matter Types</option>
                <option value="litigation">Litigation</option>
                <option value="transactional">Transactional</option>
                <option value="compliance">Compliance</option>
                <option value="ip">IP</option>
                <option value="employment">Employment</option>
                <option value="real-estate">Real Estate</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Intake Requests Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {filteredRequests.map((request, index) => (
          <motion.div
            key={request.id}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedRequest(request)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-teal-800 mb-1">{request.clientName}</h3>
                <p className="text-sm text-teal-600 mb-2">{request.contactPerson} • {request.email}</p>
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant={statusConfig[request.status].color}>
                    {request.status.toUpperCase().replace('-', ' ')}
                  </Badge>
                  <Badge variant={urgencyConfig[request.urgency].color}>
                    {request.urgency.toUpperCase()}
                  </Badge>
                  <Badge variant={conflictConfig[request.conflictCheckStatus].color}>
                    {conflictConfig[request.conflictCheckStatus].text}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                {request.estimatedValue && (
                  <p className="text-lg font-bold text-teal-800">{formatCurrency(request.estimatedValue)}</p>
                )}
                <p className="text-sm text-teal-600 capitalize">{request.matterType.replace('-', ' ')}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-teal-700 line-clamp-2">{request.description}</p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-teal-600">Submitted</span>
                <span className="text-sm font-medium text-teal-800">{formatDate(request.submittedDate)}</span>
              </div>
              
              {request.responseDeadline && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Deadline</span>
                  <span className={`text-sm font-medium ${
                    new Date(request.responseDeadline) < new Date() 
                      ? 'text-red-600' 
                      : 'text-teal-800'
                  }`}>
                    {formatDate(request.responseDeadline)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-teal-600">AI Risk</span>
                <span className={`text-sm font-bold px-2 py-1 rounded-lg ${
                  request.aiRiskAssessment === 'low' ? 'bg-green-100 text-green-700' :
                  request.aiRiskAssessment === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {request.aiRiskAssessment.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-teal-600">Complexity</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-teal-100 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        request.aiComplexityScore >= 80 ? 'bg-red-500' :
                        request.aiComplexityScore >= 60 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${request.aiComplexityScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-teal-800">{request.aiComplexityScore}</span>
                </div>
              </div>

              {request.assignedTo && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Assigned To</span>
                  <span className="text-sm font-medium text-teal-800">{request.assignedTo}</span>
                </div>
              )}
            </div>

            {/* Practice Area Recommendations */}
            {request.practiceAreaRecommendation.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-teal-600 mb-2">Recommended Practice Areas</p>
                <div className="flex flex-wrap gap-1">
                  {request.practiceAreaRecommendation.map((area, idx) => (
                    <span 
                      key={idx}
                      className="text-xs px-2 py-1 bg-teal-50 text-teal-600 rounded border border-teal-200"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            {request.documents.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-teal-600 mb-2">Documents ({request.documents.length})</p>
                <div className="flex flex-wrap gap-1">
                  {request.documents.slice(0, 2).map((doc, idx) => (
                    <span 
                      key={idx}
                      className="text-xs px-2 py-1 bg-cyan-50 text-cyan-600 rounded border border-cyan-200"
                    >
                      {doc}
                    </span>
                  ))}
                  {request.documents.length > 2 && (
                    <span className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded border border-gray-200">
                      +{request.documents.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                  <Mail className="h-4 w-4" />
                </button>
              </div>
              <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Intake Detail Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={`Intake Request - ${selectedRequest.clientName}`}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Client Name</label>
                <p className="text-teal-800 font-medium">{selectedRequest.clientName}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Contact Person</label>
                <p className="text-teal-800">{selectedRequest.contactPerson}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Email</label>
                <p className="text-teal-800">{selectedRequest.email}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Phone</label>
                <p className="text-teal-800">{selectedRequest.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Matter Type</label>
                <p className="text-teal-800 capitalize">{selectedRequest.matterType.replace('-', ' ')}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Status</label>
                <Badge variant={statusConfig[selectedRequest.status].color}>
                  {selectedRequest.status.toUpperCase().replace('-', ' ')}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-teal-600 mb-2">Description</label>
              <p className="text-teal-800">{selectedRequest.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">AI Risk Assessment</label>
                <span className={`text-sm font-bold px-3 py-1 rounded-lg ${
                  selectedRequest.aiRiskAssessment === 'low' ? 'bg-green-100 text-green-700' :
                  selectedRequest.aiRiskAssessment === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {selectedRequest.aiRiskAssessment.toUpperCase()}
                </span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Complexity Score</label>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-3 bg-teal-100 rounded-full">
                    <div 
                      className={`h-3 rounded-full ${
                        selectedRequest.aiComplexityScore >= 80 ? 'bg-red-500' :
                        selectedRequest.aiComplexityScore >= 60 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${selectedRequest.aiComplexityScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-teal-800">{selectedRequest.aiComplexityScore}</span>
                </div>
              </div>
            </div>

            {selectedRequest.notes.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-2">Notes</label>
                <ul className="space-y-1">
                  {selectedRequest.notes.map((note, index) => (
                    <li key={index} className="text-teal-800 flex items-start">
                      <span className="w-2 h-2 bg-teal-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <motion.button 
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Assign Attorney
              </motion.button>
              <motion.button 
                className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Schedule Call
              </motion.button>
              <motion.button 
                className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Email
              </motion.button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Intake Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="New Intake Request"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Client Name</label>
                <input 
                  className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-900 placeholder-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter client name" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Contact Person</label>
                <input 
                  className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-900 placeholder-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter contact name" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Email</label>
                <input 
                  type="email"
                  className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-900 placeholder-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter email address" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Phone</label>
                <input 
                  type="tel"
                  className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-900 placeholder-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter phone number" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Matter Type</label>
                <select className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200">
                  <option value="litigation">Litigation</option>
                  <option value="transactional">Transactional</option>
                  <option value="compliance">Compliance</option>
                  <option value="ip">IP</option>
                  <option value="employment">Employment</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Urgency</label>
                <select className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-teal-600 mb-1">Description</label>
              <textarea 
                className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-900 placeholder-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 h-24 resize-none"
                placeholder="Describe the legal matter..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <motion.button 
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Intake Request
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
