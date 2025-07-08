import React, { useState } from 'react'
import { Plus, Search, Filter, Building2, Calendar, DollarSign, User, MoreVertical, Brain, AlertTriangle, TrendingUp, Clock, Download, Eye, Edit, Trash2, Upload, BarChart3, Zap, FileText, Globe, Shield, Users, Target, Activity, CheckCircle, XCircle, AlertCircle, Award, Briefcase } from 'lucide-react'
import { motion } from 'framer-motion'

interface Entity {
  id: string
  name: string
  type: 'corporation' | 'llc' | 'partnership' | 'subsidiary' | 'branch' | 'joint-venture'
  status: 'active' | 'inactive' | 'dissolved' | 'pending' | 'suspended'
  jurisdiction: string
  incorporationDate: string
  entityNumber: string
  taxId: string
  registeredAgent: string
  principalAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  officers: {
    name: string
    title: string
    appointmentDate: string
  }[]
  directors: {
    name: string
    appointmentDate: string
  }[]
  ownership: {
    shareholder: string
    percentage: number
    shares: number
  }[]
  complianceStatus: {
    annualReport: 'current' | 'due' | 'overdue'
    taxFilings: 'current' | 'due' | 'overdue'
    licenses: 'current' | 'expiring' | 'expired'
    permits: 'current' | 'expiring' | 'expired'
  }
  nextFilingDue: string
  aiInsights: string[]
  riskScore: number
  subsidiaries?: string[]
  parentCompany?: string
}

interface Filing {
  id: string
  entityId: string
  type: 'annual-report' | 'tax-return' | 'amendment' | 'dissolution' | 'merger' | 'other'
  title: string
  dueDate: string
  filedDate?: string
  status: 'pending' | 'filed' | 'late' | 'rejected'
  jurisdiction: string
  filingFee: number
  assignedTo: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  documents: string[]
  notes: string
}

interface ComplianceCalendar {
  date: string
  events: {
    type: 'filing' | 'meeting' | 'deadline' | 'renewal'
    title: string
    entity: string
    priority: 'low' | 'medium' | 'high' | 'critical'
  }[]
}

export function EntitiesPage() {
  const [entities] = useState<Entity[]>([
    {
      id: '1',
      name: 'TechCorp Industries Inc.',
      type: 'corporation',
      status: 'active',
      jurisdiction: 'Delaware',
      incorporationDate: '2020-03-15',
      entityNumber: 'DE-7654321',
      taxId: '12-3456789',
      registeredAgent: 'Corporation Service Company',
      principalAddress: {
        street: '123 Innovation Drive',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'USA'
      },
      officers: [
        { name: 'John Anderson', title: 'CEO', appointmentDate: '2020-03-15' },
        { name: 'Sarah Mitchell', title: 'CFO', appointmentDate: '2020-06-01' },
        { name: 'Michael Chen', title: 'CTO', appointmentDate: '2020-04-01' }
      ],
      directors: [
        { name: 'John Anderson', appointmentDate: '2020-03-15' },
        { name: 'Emma Davis', appointmentDate: '2020-03-15' },
        { name: 'David Wilson', appointmentDate: '2021-01-15' }
      ],
      ownership: [
        { shareholder: 'Founders', percentage: 65, shares: 6500000 },
        { shareholder: 'Venture Capital Fund A', percentage: 25, shares: 2500000 },
        { shareholder: 'Employee Stock Option Pool', percentage: 10, shares: 1000000 }
      ],
      complianceStatus: {
        annualReport: 'current',
        taxFilings: 'current',
        licenses: 'current',
        permits: 'expiring'
      },
      nextFilingDue: '2024-03-31',
      aiInsights: ['All filings current', 'Business license renewal due soon', 'Consider subsidiary structure optimization'],
      riskScore: 25,
      subsidiaries: ['TechCorp Europe Ltd.', 'TechCorp Asia Pte Ltd.']
    },
    {
      id: '2',
      name: 'Global Services LLC',
      type: 'llc',
      status: 'active',
      jurisdiction: 'Nevada',
      incorporationDate: '2019-08-22',
      entityNumber: 'NV-LLC-987654',
      taxId: '98-7654321',
      registeredAgent: 'Nevada Registered Agents Inc.',
      principalAddress: {
        street: '456 Business Park',
        city: 'Las Vegas',
        state: 'NV',
        zipCode: '89102',
        country: 'USA'
      },
      officers: [
        { name: 'Lisa Thompson', title: 'Managing Member', appointmentDate: '2019-08-22' },
        { name: 'James Anderson', title: 'Operating Manager', appointmentDate: '2020-01-15' }
      ],
      directors: [],
      ownership: [
        { shareholder: 'Lisa Thompson', percentage: 60, shares: 0 },
        { shareholder: 'James Anderson', percentage: 40, shares: 0 }
      ],
      complianceStatus: {
        annualReport: 'due',
        taxFilings: 'current',
        licenses: 'current',
        permits: 'current'
      },
      nextFilingDue: '2024-02-15',
      aiInsights: ['Annual report due soon', 'Operating agreement may need updates', 'Tax optimization opportunities'],
      riskScore: 45
    },
    {
      id: '3',
      name: 'TechCorp Europe Ltd.',
      type: 'subsidiary',
      status: 'active',
      jurisdiction: 'United Kingdom',
      incorporationDate: '2021-11-10',
      entityNumber: 'UK-12345678',
      taxId: 'GB123456789',
      registeredAgent: 'UK Corporate Services Ltd.',
      principalAddress: {
        street: '10 Finsbury Square',
        city: 'London',
        state: 'England',
        zipCode: 'EC2A 1AF',
        country: 'UK'
      },
      officers: [
        { name: 'Emma Davis', title: 'Managing Director', appointmentDate: '2021-11-10' },
        { name: 'David Wilson', title: 'Company Secretary', appointmentDate: '2021-11-10' }
      ],
      directors: [
        { name: 'Emma Davis', appointmentDate: '2021-11-10' },
        { name: 'John Anderson', appointmentDate: '2021-11-10' }
      ],
      ownership: [
        { shareholder: 'TechCorp Industries Inc.', percentage: 100, shares: 1000 }
      ],
      complianceStatus: {
        annualReport: 'overdue',
        taxFilings: 'due',
        licenses: 'current',
        permits: 'current'
      },
      nextFilingDue: '2024-01-31',
      aiInsights: ['Annual confirmation statement overdue', 'VAT registration may be required', 'Consider local director appointment'],
      riskScore: 75,
      parentCompany: 'TechCorp Industries Inc.'
    },
    {
      id: '4',
      name: 'Innovation Labs Partnership',
      type: 'partnership',
      status: 'active',
      jurisdiction: 'California',
      incorporationDate: '2022-05-18',
      entityNumber: 'CA-LP-456789',
      taxId: '45-6789012',
      registeredAgent: 'California Business Services',
      principalAddress: {
        street: '789 Research Blvd',
        city: 'Palo Alto',
        state: 'CA',
        zipCode: '94301',
        country: 'USA'
      },
      officers: [
        { name: 'Dr. Sarah Johnson', title: 'General Partner', appointmentDate: '2022-05-18' },
        { name: 'Michael Roberts', title: 'Managing Partner', appointmentDate: '2022-05-18' }
      ],
      directors: [],
      ownership: [
        { shareholder: 'TechCorp Industries Inc.', percentage: 51, shares: 0 },
        { shareholder: 'Innovation Ventures LP', percentage: 49, shares: 0 }
      ],
      complianceStatus: {
        annualReport: 'current',
        taxFilings: 'current',
        licenses: 'expiring',
        permits: 'current'
      },
      nextFilingDue: '2024-05-18',
      aiInsights: ['Partnership agreement review recommended', 'Research tax credits available', 'IP ownership structure needs clarification'],
      riskScore: 35
    },
    {
      id: '5',
      name: 'StartupCo Acquisition Vehicle',
      type: 'corporation',
      status: 'pending',
      jurisdiction: 'Delaware',
      incorporationDate: '2024-01-15',
      entityNumber: 'DE-PENDING',
      taxId: 'PENDING',
      registeredAgent: 'Delaware Corporate Services',
      principalAddress: {
        street: '321 Corporate Center',
        city: 'Wilmington',
        state: 'DE',
        zipCode: '19801',
        country: 'USA'
      },
      officers: [
        { name: 'John Anderson', title: 'Interim CEO', appointmentDate: '2024-01-15' }
      ],
      directors: [
        { name: 'John Anderson', appointmentDate: '2024-01-15' }
      ],
      ownership: [
        { shareholder: 'TechCorp Industries Inc.', percentage: 100, shares: 1000 }
      ],
      complianceStatus: {
        annualReport: 'current',
        taxFilings: 'current',
        licenses: 'current',
        permits: 'current'
      },
      nextFilingDue: '2025-01-15',
      aiInsights: ['Recently incorporated for acquisition', 'Minimal compliance requirements initially', 'Post-acquisition integration plan needed'],
      riskScore: 15
    }
  ])

  const [filings] = useState<Filing[]>([
    {
      id: '1',
      entityId: '1',
      type: 'annual-report',
      title: 'Delaware Annual Franchise Tax Report',
      dueDate: '2024-03-01',
      status: 'pending',
      jurisdiction: 'Delaware',
      filingFee: 400,
      assignedTo: 'Sarah Mitchell',
      priority: 'medium',
      documents: ['annual-report-draft.pdf'],
      notes: 'Waiting for final financial numbers'
    },
    {
      id: '2',
      entityId: '2',
      type: 'annual-report',
      title: 'Nevada LLC Annual List',
      dueDate: '2024-02-15',
      status: 'pending',
      jurisdiction: 'Nevada',
      filingFee: 325,
      assignedTo: 'James Anderson',
      priority: 'high',
      documents: [],
      notes: 'Due soon - prepare filing'
    },
    {
      id: '3',
      entityId: '3',
      type: 'annual-report',
      title: 'UK Companies House Confirmation Statement',
      dueDate: '2024-01-31',
      status: 'late',
      jurisdiction: 'United Kingdom',
      filingFee: 13,
      assignedTo: 'Emma Davis',
      priority: 'critical',
      documents: [],
      notes: 'OVERDUE - file immediately to avoid penalties'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [activeTab, setActiveTab] = useState<'entities' | 'filings' | 'calendar'>('entities')

  const filteredEntities = entities.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.entityNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || entity.status === filterStatus
    const matchesType = filterType === 'all' || entity.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  // Entity Analytics
  const totalEntities = entities.length
  const activeEntities = entities.filter(e => e.status === 'active').length
  const pendingFilings = filings.filter(f => f.status === 'pending').length
  const overdueFilings = filings.filter(f => f.status === 'late').length
  const avgRiskScore = Math.round(entities.reduce((sum, entity) => sum + entity.riskScore, 0) / entities.length)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'corporation': return Building2
      case 'llc': return Briefcase
      case 'partnership': return Users
      case 'subsidiary': return Target
      case 'branch': return Globe
      case 'joint-venture': return Award
      default: return Building2
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'corporation': return 'from-blue-500 to-blue-600'
      case 'llc': return 'from-green-500 to-green-600'
      case 'partnership': return 'from-purple-500 to-purple-600'
      case 'subsidiary': return 'from-orange-500 to-orange-600'
      case 'branch': return 'from-teal-500 to-teal-600'
      case 'joint-venture': return 'from-red-500 to-red-600'
      default: return 'from-counsel-500 to-counsel-600'
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'current': return 'text-green-600'
      case 'due': return 'text-orange-600'
      case 'overdue': return 'text-red-600'
      case 'expiring': return 'text-yellow-600'
      case 'expired': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="px-4 lg:px-6 bg-gradient-to-br from-legal-50 to-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-counsel-700 to-legal-600 bg-clip-text text-transparent">
              Entity Management
            </h1>
            <p className="text-counsel-600 mt-2 text-lg font-medium">
              Corporate entities, filings, governance tracking, and compliance management
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button 
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-counsel-200 rounded-xl text-counsel-700 font-semibold hover:bg-counsel-50 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Upload className="h-4 w-4" />
              <span>Import Entities</span>
            </motion.button>
            <motion.button 
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-counsel-600 to-legal-600 text-white font-semibold rounded-xl shadow-lg hover:from-counsel-700 hover:to-legal-700 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              <span>New Entity</span>
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
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-counsel-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-counsel-600">Total Entities</p>
                <p className="text-3xl font-bold text-counsel-800">{totalEntities}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-counsel-500 to-counsel-600 rounded-xl">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+2</span>
              <span className="text-counsel-500 ml-1">this year</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-counsel-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-counsel-600">Active</p>
                <p className="text-3xl font-bold text-counsel-800">{activeEntities}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-600 font-medium">Good standing</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-counsel-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-counsel-600">Pending Filings</p>
                <p className="text-3xl font-bold text-counsel-800">{pendingFilings}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-orange-600 font-medium">Due this month</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-counsel-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-counsel-600">Overdue</p>
                <p className="text-3xl font-bold text-counsel-800">{overdueFilings}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-red-600 font-medium">Immediate action</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-counsel-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-counsel-600">Avg Risk Score</p>
                <p className="text-3xl font-bold text-counsel-800">{avgRiskScore}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-purple-600 font-medium">Low risk</span>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex space-x-1 bg-white/70 backdrop-blur-sm rounded-xl p-1 mb-6 border border-counsel-200/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {[
            { id: 'entities', label: 'Corporate Entities', icon: Building2 },
            { id: 'filings', label: 'Compliance Filings', icon: FileText },
            { id: 'calendar', label: 'Compliance Calendar', icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-counsel-600 to-legal-600 text-white shadow-lg'
                    : 'text-counsel-600 hover:bg-counsel-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Search and Filters - Only for entities tab */}
        {activeTab === 'entities' && (
          <motion.div 
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-counsel-400" />
                <input
                  type="text"
                  placeholder="Search entities, jurisdictions, numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border-2 border-counsel-200 rounded-xl focus:border-counsel-500 focus:ring-0 outline-none transition-colors duration-200 bg-white/70 backdrop-blur-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border-2 border-counsel-200 rounded-xl px-4 py-3 focus:border-counsel-500 focus:ring-0 outline-none bg-white/70 backdrop-blur-sm text-counsel-700 font-medium"
              >
                <option value="all">All Types</option>
                <option value="corporation">Corporation</option>
                <option value="llc">LLC</option>
                <option value="partnership">Partnership</option>
                <option value="subsidiary">Subsidiary</option>
                <option value="branch">Branch</option>
                <option value="joint-venture">Joint Venture</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border-2 border-counsel-200 rounded-xl px-4 py-3 focus:border-counsel-500 focus:ring-0 outline-none bg-white/70 backdrop-blur-sm text-counsel-700 font-medium"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="dissolved">Dissolved</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
              
              <motion.button 
                className="p-3 bg-counsel-600 text-white rounded-xl hover:bg-counsel-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'entities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEntities.map((entity, index) => {
            const TypeIcon = getTypeIcon(entity.type)
            return (
              <motion.div
                key={entity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl border border-counsel-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                whileHover={{ y: -5 }}
              >
                {/* Entity Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${getTypeColor(entity.type)}`}>
                        <TypeIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-counsel-800 text-lg leading-tight group-hover:text-counsel-700 transition-colors">
                          {entity.name}
                        </h3>
                        <p className="text-sm text-counsel-600 font-medium capitalize">{entity.type.replace('-', ' ')}</p>
                        <p className="text-xs text-counsel-500 font-mono">{entity.entityNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Risk Score Indicator */}
                      <div className={`w-3 h-3 rounded-full ${
                        entity.riskScore >= 70 ? 'bg-red-500' :
                        entity.riskScore >= 40 ? 'bg-orange-500' :
                        'bg-green-500'
                      }`} />
                      
                      <motion.button 
                        className="p-2 text-counsel-400 hover:text-counsel-600 hover:bg-counsel-50 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Status and Jurisdiction */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      entity.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' :
                      entity.status === 'inactive' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                      entity.status === 'dissolved' ? 'bg-red-100 text-red-700 border border-red-200' :
                      entity.status === 'pending' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                      'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    }`}>
                      {entity.status.toUpperCase()}
                    </span>
                    
                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600">
                      {entity.jurisdiction}
                    </span>
                  </div>

                  {/* Compliance Status Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-counsel-600 font-medium">Annual Report:</span>
                        <span className={`font-bold ${getComplianceColor(entity.complianceStatus.annualReport)}`}>
                          {entity.complianceStatus.annualReport.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-counsel-600 font-medium">Tax Filings:</span>
                        <span className={`font-bold ${getComplianceColor(entity.complianceStatus.taxFilings)}`}>
                          {entity.complianceStatus.taxFilings.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-counsel-600 font-medium">Licenses:</span>
                        <span className={`font-bold ${getComplianceColor(entity.complianceStatus.licenses)}`}>
                          {entity.complianceStatus.licenses.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-counsel-600 font-medium">Permits:</span>
                        <span className={`font-bold ${getComplianceColor(entity.complianceStatus.permits)}`}>
                          {entity.complianceStatus.permits.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Entity Details */}
                <div className="px-6 py-4 bg-gradient-to-br from-legal-50/50 to-counsel-50/30 border-t border-counsel-100">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-counsel-600 font-medium">Incorporated:</span>
                      <span className="font-bold text-counsel-800 text-xs">{new Date(entity.incorporationDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-counsel-600 font-medium">Next Filing:</span>
                      <span className="font-bold text-counsel-800 text-xs">{new Date(entity.nextFilingDue).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-counsel-600 font-medium">Risk Score:</span>
                      <span className={`font-bold ${
                        entity.riskScore >= 70 ? 'text-red-600' :
                        entity.riskScore >= 40 ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {entity.riskScore}/100
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-counsel-600 font-medium">Officers:</span>
                      <span className="font-bold text-counsel-800">{entity.officers.length}</span>
                    </div>
                  </div>
                </div>

                {/* Relationships */}
                {((entity.subsidiaries && entity.subsidiaries.length > 0) || entity.parentCompany) && (
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-blue-100">
                    <div className="flex items-center mb-2">
                      <Target className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm font-bold text-blue-700">Entity Relationships</span>
                    </div>
                    {entity.parentCompany && (
                      <p className="text-xs text-blue-600 mb-1">
                        Parent: {entity.parentCompany}
                      </p>
                    )}
                    {entity.subsidiaries && entity.subsidiaries.length > 0 && (
                      <p className="text-xs text-blue-600">
                        Subsidiaries: {entity.subsidiaries.length}
                      </p>
                    )}
                  </div>
                )}

                {/* AI Insights */}
                {entity.aiInsights && entity.aiInsights.length > 0 && (
                  <div className="px-6 py-4 bg-gradient-to-r from-counsel-50 to-legal-50 border-t border-counsel-100">
                    <div className="flex items-center mb-2">
                      <Brain className="h-4 w-4 text-counsel-600 mr-2" />
                      <span className="text-sm font-bold text-counsel-700">AI Insights</span>
                    </div>
                    <div className="space-y-1">
                      {entity.aiInsights.slice(0, 2).map((insight, idx) => (
                        <p key={idx} className="text-xs text-counsel-600 leading-relaxed">
                          • {insight}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="px-6 py-4 border-t border-counsel-100 bg-white/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <motion.button 
                        className="p-2 text-counsel-600 hover:bg-counsel-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                      <motion.button 
                        className="p-2 text-counsel-600 hover:bg-counsel-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                      <motion.button 
                        className="p-2 text-counsel-600 hover:bg-counsel-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Download className="h-4 w-4" />
                      </motion.button>
                    </div>
                    
                    <motion.button 
                      className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-counsel-600 to-legal-600 text-white text-xs font-semibold rounded-lg hover:from-counsel-700 hover:to-legal-700 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Zap className="h-3 w-3" />
                      <span>Quick File</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {activeTab === 'filings' && (
        <div className="space-y-4">
          {filings.map((filing, index) => (
            <motion.div
              key={filing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-counsel-200/50 shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-3 bg-gradient-to-br from-counsel-500 to-legal-600 rounded-xl">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-counsel-800">{filing.title}</h3>
                      <p className="text-sm text-counsel-600 font-medium">{entities.find(e => e.id === filing.entityId)?.name}</p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      filing.status === 'filed' ? 'bg-green-100 text-green-700 border border-green-200' :
                      filing.status === 'pending' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                      filing.status === 'late' ? 'bg-red-100 text-red-700 border border-red-200' :
                      'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {filing.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-counsel-600 font-medium">Due Date:</span>
                      <p className="font-bold text-counsel-800">{new Date(filing.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-counsel-600 font-medium">Jurisdiction:</span>
                      <p className="font-medium text-counsel-800">{filing.jurisdiction}</p>
                    </div>
                    <div>
                      <span className="text-counsel-600 font-medium">Filing Fee:</span>
                      <p className="font-bold text-green-600">${filing.filingFee}</p>
                    </div>
                    <div>
                      <span className="text-counsel-600 font-medium">Assigned:</span>
                      <p className="font-medium text-counsel-800">{filing.assignedTo}</p>
                    </div>
                  </div>
                  
                  {filing.notes && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-counsel-50 to-legal-50 rounded-xl border border-counsel-100">
                      <p className="text-sm text-counsel-600">{filing.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button className="p-2 text-counsel-400 hover:text-counsel-600 rounded-lg hover:bg-counsel-100">
                    <Eye className="h-4 w-4" />
                  </motion.button>
                  <motion.button className="p-2 text-counsel-400 hover:text-counsel-600 rounded-lg hover:bg-counsel-100">
                    <Edit className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'calendar' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl border border-counsel-200/50 shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-counsel-800 mb-6">Upcoming Compliance Events</h3>
          <div className="space-y-4">
            {[
              { date: '2024-02-15', title: 'Nevada LLC Annual List', entity: 'Global Services LLC', type: 'filing', priority: 'high' },
              { date: '2024-03-01', title: 'Delaware Annual Franchise Tax', entity: 'TechCorp Industries Inc.', type: 'filing', priority: 'medium' },
              { date: '2024-03-15', title: 'Board Meeting', entity: 'TechCorp Industries Inc.', type: 'meeting', priority: 'low' },
              { date: '2024-04-01', title: 'UK VAT Return', entity: 'TechCorp Europe Ltd.', type: 'filing', priority: 'medium' }
            ].map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-legal-50 to-counsel-50 rounded-xl border border-counsel-100"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-counsel-800">{new Date(event.date).getDate()}</span>
                    <span className="text-xs text-counsel-600">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-counsel-800">{event.title}</h4>
                    <p className="text-sm text-counsel-600">{event.entity}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                  event.priority === 'high' ? 'bg-red-100 text-red-700' :
                  event.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {event.priority.toUpperCase()}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {((activeTab === 'entities' && filteredEntities.length === 0) ||
        (activeTab === 'filings' && filings.length === 0)) && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 border border-counsel-200/50 shadow-lg max-w-md mx-auto">
            <div className="p-4 bg-gradient-to-br from-counsel-100 to-legal-100 rounded-2xl w-fit mx-auto mb-6">
              <Building2 className="h-12 w-12 text-counsel-600" />
            </div>
            <h3 className="text-xl font-bold text-counsel-800 mb-3">No {activeTab} found</h3>
            <p className="text-counsel-600 mb-6 leading-relaxed">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                ? 'Try adjusting your search criteria or filters.'
                : `Start managing your corporate ${activeTab} with comprehensive tracking and compliance management.`}
            </p>
            <motion.button 
              className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-counsel-600 to-legal-600 text-white font-semibold rounded-xl shadow-lg hover:from-counsel-700 hover:to-legal-700 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              <span>Add {activeTab === 'entities' ? 'Entity' : 'Filing'}</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}