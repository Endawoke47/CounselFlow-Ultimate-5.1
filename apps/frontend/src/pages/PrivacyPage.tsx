import React, { useState } from 'react'
import { Shield, Lock, Database, Users, AlertTriangle, CheckCircle, Clock, Brain, Search, Plus, Filter, BarChart3, TrendingUp, Eye, Edit, Trash2, FileText, Calendar, User, Globe, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface PrivacyRequest {
  id: string
  type: 'access' | 'erasure' | 'rectification' | 'portability' | 'objection' | 'restriction'
  subject: string
  email: string
  status: 'pending' | 'in-progress' | 'completed' | 'rejected'
  priority: 'low' | 'medium' | 'high'
  receivedDate: string
  dueDate: string
  assignedTo: string
  description: string
  dataCategories: string[]
  legalBasis: string
  estimatedHours: number
  completionRate: number
  aiAssessment: {
    riskLevel: 'low' | 'medium' | 'high'
    recommendation: string
    confidence: number
  }
}

interface DataMapping {
  id: string
  dataType: string
  source: string
  purpose: string
  legalBasis: string
  retention: string
  sharing: string[]
  riskLevel: 'low' | 'medium' | 'high'
  lastUpdated: string
  owner: string
  encryption: boolean
  pseudonymized: boolean
}

export function PrivacyPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'mapping' | 'analytics'>('requests')
  
  const [privacyRequests] = useState<PrivacyRequest[]>([
    {
      id: '1',
      type: 'access',
      subject: 'John Smith',
      email: 'john.smith@email.com',
      status: 'in-progress',
      priority: 'medium',
      receivedDate: '2024-01-20',
      dueDate: '2024-02-19',
      assignedTo: 'Sarah Mitchell',
      description: 'Request for all personal data held by the organization',
      dataCategories: ['Profile Information', 'Transaction History', 'Communication Records'],
      legalBasis: 'Article 15 GDPR',
      estimatedHours: 8,
      completionRate: 65,
      aiAssessment: {
        riskLevel: 'low',
        recommendation: 'Standard processing - verify identity and compile data from all systems',
        confidence: 95
      }
    },
    {
      id: '2',
      type: 'erasure',
      subject: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      status: 'pending',
      priority: 'high',
      receivedDate: '2024-01-22',
      dueDate: '2024-02-21',
      assignedTo: 'Michael Chen',
      description: 'Right to be forgotten request - delete all personal data',
      dataCategories: ['All Personal Data'],
      legalBasis: 'Article 17 GDPR',
      estimatedHours: 12,
      completionRate: 0,
      aiAssessment: {
        riskLevel: 'medium',
        recommendation: 'Check for legal obligations requiring data retention before proceeding',
        confidence: 87
      }
    },
    {
      id: '3',
      type: 'portability',
      subject: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      status: 'completed',
      priority: 'low',
      receivedDate: '2024-01-05',
      dueDate: '2024-02-04',
      assignedTo: 'Lisa Rodriguez',
      description: 'Data portability request - export data in machine-readable format',
      dataCategories: ['Profile Data', 'Preferences', 'Activity Logs'],
      legalBasis: 'Article 20 GDPR',
      estimatedHours: 4,
      completionRate: 100,
      aiAssessment: {
        riskLevel: 'low',
        recommendation: 'Standard export completed successfully',
        confidence: 98
      }
    },
    {
      id: '4',
      type: 'rectification',
      subject: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      status: 'completed',
      priority: 'medium',
      receivedDate: '2024-01-15',
      dueDate: '2024-02-14',
      assignedTo: 'James Taylor',
      description: 'Correction of inaccurate personal information',
      dataCategories: ['Contact Information', 'Profile Data'],
      legalBasis: 'Article 16 GDPR',
      estimatedHours: 2,
      completionRate: 100,
      aiAssessment: {
        riskLevel: 'medium',
        recommendation: 'Verify changes with authoritative sources and update linked systems',
        confidence: 72
      }
    },
    {
      id: '5',
      type: 'objection',
      subject: 'Robert Brown',
      email: 'robert.brown@email.com',
      status: 'rejected',
      priority: 'low',
      receivedDate: '2024-01-10',
      dueDate: '2024-02-09',
      assignedTo: 'Sarah Mitchell',
      description: 'Objection to processing for marketing purposes',
      dataCategories: ['Marketing Data', 'Communication Preferences'],
      legalBasis: 'Article 21 GDPR',
      estimatedHours: 2,
      completionRate: 100,
      aiAssessment: {
        riskLevel: 'low',
        recommendation: 'Legitimate interests override objection - properly documented',
        confidence: 88
      }
    }
  ])

  const [dataMapping] = useState<DataMapping[]>([
    {
      id: '1',
      dataType: 'Customer Personal Information',
      source: 'CRM System',
      purpose: 'Customer relationship management',
      legalBasis: 'Contract performance',
      retention: '7 years after contract termination',
      sharing: ['Third-party analytics', 'Payment processors'],
      riskLevel: 'medium',
      lastUpdated: '2024-01-15',
      owner: 'Sales Team',
      encryption: true,
      pseudonymized: false
    },
    {
      id: '2',
      dataType: 'Employee HR Records',
      source: 'HR Management System',
      purpose: 'Employment administration',
      legalBasis: 'Legal obligation',
      retention: 'Duration of employment + 7 years',
      sharing: ['Payroll provider', 'Benefits administrator'],
      riskLevel: 'high',
      lastUpdated: '2024-01-20',
      owner: 'HR Department',
      encryption: true,
      pseudonymized: false
    },
    {
      id: '3',
      dataType: 'Website Analytics Data',
      source: 'Web Analytics Platform',
      purpose: 'Website optimization',
      legalBasis: 'Legitimate interests',
      retention: '2 years',
      sharing: ['Analytics provider'],
      riskLevel: 'low',
      lastUpdated: '2024-01-18',
      owner: 'Marketing Team',
      encryption: true,
      pseudonymized: true
    },
    {
      id: '4',
      dataType: 'Financial Transaction Data',
      source: 'Payment System',
      purpose: 'Transaction processing',
      legalBasis: 'Contract performance',
      retention: '10 years (regulatory requirement)',
      sharing: ['Payment gateway', 'Financial auditors'],
      riskLevel: 'high',
      lastUpdated: '2024-01-22',
      owner: 'Finance Team',
      encryption: true,
      pseudonymized: false
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  const filteredRequests = privacyRequests.filter(request => {
    const matchesSearch = request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus
    const matchesType = filterType === 'all' || request.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  // Analytics
  const totalRequests = privacyRequests.length
  const pendingRequests = privacyRequests.filter(r => r.status === 'pending').length
  const inProgressRequests = privacyRequests.filter(r => r.status === 'in-progress').length
  const completedRequests = privacyRequests.filter(r => r.status === 'completed').length
  const avgCompletionTime = Math.round(privacyRequests.reduce((sum, r) => sum + r.estimatedHours, 0) / totalRequests)
  const highRiskRequests = privacyRequests.filter(r => r.aiAssessment.riskLevel === 'high').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'from-green-500 to-green-600'
      case 'in-progress': return 'from-blue-500 to-blue-600'
      case 'pending': return 'from-orange-500 to-orange-600'
      case 'rejected': return 'from-red-500 to-red-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'access': return Eye
      case 'erasure': return Trash2
      case 'rectification': return Edit
      case 'portability': return Database
      case 'objection': return Shield
      case 'restriction': return Lock
      default: return FileText
    }
  }

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
              Data Protection & Privacy
            </h1>
            <p className="text-teal-600 mt-2 text-lg font-medium">
              GDPR compliance, privacy requests, and data protection management
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button 
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <BarChart3 className="h-4 w-4" />
              <span>DPIA Report</span>
            </motion.button>
            <motion.button 
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              <span>New Request</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Analytics Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8"
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
              <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-teal-600 font-medium">This month</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Pending</p>
                <p className="text-3xl font-bold text-orange-600">{pendingRequests}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-orange-600 font-medium">Awaiting action</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{inProgressRequests}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-blue-600 font-medium">Being processed</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedRequests}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">{Math.round((completedRequests/totalRequests)*100)}% rate</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Avg Time</p>
                <p className="text-3xl font-bold text-purple-600">{avgCompletionTime}h</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-purple-600 font-medium">Per request</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">High Risk</p>
                <p className="text-3xl font-bold text-red-600">{highRiskRequests}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-red-600 font-medium">Need attention</span>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          className="flex space-x-1 bg-white/50 backdrop-blur-sm p-1 rounded-xl border border-teal-200/50 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {[
            { id: 'requests', label: 'Privacy Requests', icon: FileText },
            { id: 'mapping', label: 'Data Mapping', icon: Database },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg'
                    : 'text-teal-600 hover:bg-teal-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </motion.div>

        {/* Search and Filters */}
        {activeTab === 'requests' && (
          <motion.div 
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-400" />
                <input
                  type="text"
                  placeholder="Search privacy requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border-2 border-teal-200 rounded-xl focus:border-teal-500 focus:ring-0 outline-none transition-colors duration-200 bg-white/70 backdrop-blur-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border-2 border-teal-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-0 outline-none bg-white/70 backdrop-blur-sm text-teal-700 font-medium"
              >
                <option value="all">All Types</option>
                <option value="access">Access Requests</option>
                <option value="erasure">Erasure Requests</option>
                <option value="rectification">Rectification</option>
                <option value="portability">Data Portability</option>
                <option value="objection">Objections</option>
                <option value="restriction">Restrictions</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border-2 border-teal-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-0 outline-none bg-white/70 backdrop-blur-sm text-teal-700 font-medium"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <motion.button 
                className="p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Privacy Requests Tab */}
      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.map((request, index) => {
            const TypeIcon = getTypeIcon(request.type)
            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Request Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${getStatusColor(request.status)}`}>
                        <TypeIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-teal-800 text-lg leading-tight">
                          {request.subject}
                        </h3>
                        <p className="text-sm text-teal-600 font-medium">{request.email}</p>
                        <p className="text-xs text-teal-500 font-mono capitalize">{request.type.replace('-', ' ')} Request</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        request.aiAssessment.riskLevel === 'low' ? 'bg-green-100 text-green-700' :
                        request.aiAssessment.riskLevel === 'medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {request.aiAssessment.riskLevel.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Status and Priority */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      request.status === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                      request.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      request.status === 'pending' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                      'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {request.status.replace('-', ' ').toUpperCase()}
                    </span>
                    
                    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold ${
                      request.priority === 'high' ? 'bg-red-50 text-red-600' :
                      request.priority === 'medium' ? 'bg-orange-50 text-orange-600' :
                      'bg-green-50 text-green-600'
                    }`}>
                      {request.priority.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm text-teal-600 mb-4 line-clamp-2 leading-relaxed">
                    {request.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-teal-600">Progress</span>
                      <span className="text-sm font-bold text-teal-800">{request.completionRate}%</span>
                    </div>
                    <div className="w-full bg-teal-100 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${request.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="px-6 py-4 bg-gradient-to-br from-cyan-50/50 to-teal-50/30 border-t border-teal-100">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-teal-600 font-medium">Received:</span>
                        <span className="font-medium text-teal-800 text-xs">
                          {new Date(request.receivedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-teal-600 font-medium">Assigned:</span>
                        <span className="font-medium text-teal-800">{request.assignedTo}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-teal-600 font-medium">Est. Hours:</span>
                        <p className="font-bold text-teal-800">{request.estimatedHours}h</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-teal-600 font-medium">Due Date:</span>
                        <span className="font-medium text-teal-800 text-xs">
                          {new Date(request.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-teal-600 font-medium">Legal Basis:</span>
                        <p className="font-bold text-teal-800 text-xs">{request.legalBasis}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Assessment */}
                <div className="px-6 py-4 bg-gradient-to-r from-teal-50 to-cyan-50 border-t border-teal-100">
                  <div className="flex items-center mb-2">
                    <Brain className="h-4 w-4 text-teal-600 mr-2" />
                    <span className="text-sm font-bold text-teal-700">AI Assessment</span>
                  </div>
                  <p className="text-xs text-teal-600 leading-relaxed mb-2">
                    {request.aiAssessment.recommendation}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-teal-500">Confidence: {request.aiAssessment.confidence}%</span>
                    <div className="flex space-x-1">
                      {request.dataCategories.slice(0, 3).map((category, idx) => (
                        <span key={idx} className="px-2 py-1 bg-teal-100 text-teal-700 rounded-lg font-medium">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 border-t border-teal-100 bg-white/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <motion.button 
                        className="p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                      <motion.button 
                        className="p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                      <motion.button 
                        className="p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FileText className="h-4 w-4" />
                      </motion.button>
                    </div>
                    
                    <motion.button 
                      className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-xs font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Zap className="h-3 w-3" />
                      <span>Process</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {activeTab === 'mapping' && (
        <div className="space-y-4">
          {dataMapping.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 shadow-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl">
                      <Database className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-teal-800 text-lg">{item.dataType}</h3>
                      <p className="text-sm text-teal-600">{item.source}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-teal-600 font-medium">Purpose:</span>
                      <p className="text-teal-800">{item.purpose}</p>
                    </div>
                    <div>
                      <span className="text-teal-600 font-medium">Legal Basis:</span>
                      <p className="text-teal-800">{item.legalBasis}</p>
                    </div>
                    <div>
                      <span className="text-teal-600 font-medium">Retention:</span>
                      <p className="text-teal-800">{item.retention}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    item.riskLevel === 'low' ? 'bg-green-100 text-green-700' :
                    item.riskLevel === 'medium' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.riskLevel.toUpperCase()}
                  </div>
                  
                  <div className="flex space-x-1">
                    {item.encryption && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" title="Encrypted" />
                    )}
                    {item.pseudonymized && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" title="Pseudonymized" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredRequests.length === 0 && activeTab === 'requests' && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 border border-teal-200/50 shadow-lg max-w-md mx-auto">
            <div className="p-4 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl w-fit mx-auto mb-6">
              <Shield className="h-12 w-12 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-teal-800 mb-3">No privacy requests found</h3>
            <p className="text-teal-600 mb-6 leading-relaxed">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                ? 'Try adjusting your search criteria or filters.'
                : 'Start managing GDPR compliance with automated privacy request processing.'}
            </p>
            <motion.button 
              className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              <span>Add Request</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
