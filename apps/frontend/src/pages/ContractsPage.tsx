import React, { useState } from 'react'
import { Plus, Search, Filter, FileText, Calendar, DollarSign, User, MoreVertical, Brain, AlertTriangle, TrendingUp, Clock, Download, Eye, Edit, Trash2, Upload, BarChart3, Zap, CheckCircle, AlertCircle, Activity, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { logger } from '../services/logger'
import { Tabs, TabPanel } from '../components/ui/Tabs'
import { Button } from '../components/ui/Button'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../components/ui/Modal'
import { SearchInput, SearchFilters } from '../components/ui/SearchInput'

interface Contract {
  id: string
  title: string
  client: string
  type: string
  status: 'draft' | 'pending' | 'executed' | 'expired' | 'review'
  value: number
  startDate: string
  endDate: string
  lastModified: string
  description: string
  riskLevel: 'low' | 'medium' | 'high'
  aiInsights: string[]
  progress: number
  assignedTo: string
  priority: 'low' | 'medium' | 'high'
}

export function ContractsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [showNewContractModal, setShowNewContractModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [contracts] = useState<Contract[]>([
    {
      id: '1',
      title: 'Software License Agreement',
      client: 'TechCorp Industries',
      type: 'License',
      status: 'executed',
      value: 150000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      lastModified: '2024-01-15',
      description: 'Annual software licensing agreement for enterprise suite',
      riskLevel: 'low',
      aiInsights: ['Standard terms accepted', 'Auto-renewal clause active'],
      progress: 100,
      assignedTo: 'Sarah Johnson',
      priority: 'medium'
    },
    {
      id: '2',
      title: 'Service Agreement',
      client: 'Global Services LLC',
      type: 'Service',
      status: 'review',
      value: 75000,
      startDate: '2024-02-01',
      endDate: '2024-07-31',
      lastModified: '2024-01-10',
      description: 'Professional services agreement for consulting work',
      riskLevel: 'medium',
      aiInsights: ['Liability clause needs review', 'Payment terms favorable'],
      progress: 65,
      assignedTo: 'Michael Chen',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Non-Disclosure Agreement',
      client: 'Innovation Labs',
      type: 'NDA',
      status: 'pending',
      value: 0,
      startDate: '2024-01-15',
      endDate: '2025-01-15',
      lastModified: '2024-01-12',
      description: 'Mutual non-disclosure agreement for partnership discussions',
      riskLevel: 'low',
      aiInsights: ['Standard NDA template', 'Duration within normal range'],
      progress: 85,
      assignedTo: 'Emma Davis',
      priority: 'low'
    },
    {
      id: '4',
      title: 'Master Service Agreement',
      client: 'Fortune 500 Corp',
      type: 'MSA',
      status: 'draft',
      value: 2400000,
      startDate: '2024-03-01',
      endDate: '2027-02-28',
      lastModified: '2024-01-20',
      description: 'Multi-year master services agreement with enterprise client',
      riskLevel: 'high',
      aiInsights: ['Indemnification clause risky', 'IP ownership unclear', 'High value requires exec review'],
      progress: 45,
      assignedTo: 'David Wilson',
      priority: 'high'
    },
    {
      id: '5',
      title: 'Partnership Agreement',
      client: 'StartupCo Ltd',
      type: 'Partnership',
      status: 'executed',
      value: 500000,
      startDate: '2024-01-01',
      endDate: '2026-12-31',
      lastModified: '2024-01-05',
      description: 'Strategic partnership for technology collaboration',
      riskLevel: 'medium',
      aiInsights: ['Revenue sharing model defined', 'Termination clauses standard'],
      progress: 100,
      assignedTo: 'Lisa Thompson',
      priority: 'medium'
    },
    {
      id: '6',
      title: 'Vendor Agreement',
      client: 'Supply Chain Inc',
      type: 'Vendor',
      status: 'expired',
      value: 120000,
      startDate: '2023-06-01',
      endDate: '2024-01-01',
      lastModified: '2023-12-15',
      description: 'Vendor services agreement for logistics support',
      riskLevel: 'low',
      aiInsights: ['Contract expired', 'Renewal recommended'],
      progress: 100,
      assignedTo: 'James Anderson',
      priority: 'low'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid')

  const tabs = [
    { id: 'all', label: 'All Contracts', icon: FileText, badge: contracts.length.toString() },
    { id: 'executed', label: 'Active', icon: CheckCircle, badge: contracts.filter(c => c.status === 'executed').length.toString() },
    { id: 'review', label: 'Review', icon: AlertCircle, badge: contracts.filter(c => c.status === 'review').length.toString() },
    { id: 'pending', label: 'Pending', icon: Clock, badge: contracts.filter(c => c.status === 'pending').length.toString() },
  ]

  const handleSearch = (query: string) => {
    setSearchTerm(query)
  }

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || contract.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Contract Analytics
  const totalValue = contracts.reduce((sum, contract) => sum + contract.value, 0)
  const highRiskContracts = contracts.filter(c => c.riskLevel === 'high').length
  const pendingContracts = contracts.filter(c => c.status === 'pending' || c.status === 'review').length
  const expiringContracts = contracts.filter(c => {
    const endDate = new Date(c.endDate)
    const now = new Date()
    const monthsUntilExpiry = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)
    return monthsUntilExpiry <= 3 && monthsUntilExpiry > 0
  }).length

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
              Contract Lifecycle Management
            </h1>
            <p className="text-counsel-600 mt-2 text-lg font-medium">
              AI-powered contract analysis, tracking, and risk management
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              size="md"
              icon={Upload}
            >
              Import
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowNewContractModal(true)}
              icon={Plus}
            >
              New Contract
            </Button>
          </div>
        </motion.div>

        {/* Analytics Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-counsel-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-counsel-600">Total Portfolio Value</p>
                <p className="text-3xl font-bold text-counsel-800">${(totalValue / 1000000).toFixed(1)}M</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-counsel-500 ml-1">this quarter</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-counsel-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-counsel-600">Active Contracts</p>
                <p className="text-3xl font-bold text-counsel-800">{contracts.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-counsel-500 to-counsel-600 rounded-xl">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-counsel-600 font-medium">{pendingContracts} pending review</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-counsel-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-counsel-600">High Risk Items</p>
                <p className="text-3xl font-bold text-counsel-800">{highRiskContracts}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-red-600 font-medium">Require attention</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-counsel-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-counsel-600">Expiring Soon</p>
                <p className="text-3xl font-bold text-counsel-800">{expiringContracts}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-orange-600 font-medium">Next 3 months</span>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="default"
            size="md"
            className="mb-6"
          />
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex-1 max-w-md">
            <SearchInput
              placeholder="Search contracts, clients, terms..."
              value={searchTerm}
              onChange={setSearchTerm}
              onSubmit={handleSearch}
              showFilters={true}
              onFiltersClick={() => setShowFilters(!showFilters)}
              suggestions={['Software License', 'Service Agreement', 'NDA', 'MSA', 'Partnership']}
              size="md"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-2 border-counsel-200 rounded-xl px-4 py-3 focus:border-counsel-500 focus:ring-0 outline-none bg-white/70 backdrop-blur-sm text-counsel-700 font-medium"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="review">Under Review</option>
              <option value="pending">Pending</option>
              <option value="executed">Executed</option>
              <option value="expired">Expired</option>
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
      </div>

      {/* Contract Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredContracts.map((contract, index) => (
          <motion.div
            key={contract.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="group bg-white/90 backdrop-blur-sm rounded-2xl border border-counsel-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            whileHover={{ y: -5 }}
          >
            {/* Contract Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${
                    contract.type === 'License' ? 'from-blue-500 to-blue-600' :
                    contract.type === 'Service' ? 'from-green-500 to-green-600' :
                    contract.type === 'NDA' ? 'from-purple-500 to-purple-600' :
                    contract.type === 'MSA' ? 'from-red-500 to-red-600' :
                    contract.type === 'Partnership' ? 'from-orange-500 to-orange-600' :
                    'from-counsel-500 to-counsel-600'
                  }`}>
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-counsel-800 text-lg leading-tight group-hover:text-counsel-700 transition-colors">
                      {contract.title}
                    </h3>
                    <p className="text-sm text-counsel-600 font-medium">{contract.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Risk Level Indicator */}
                  <div className={`w-3 h-3 rounded-full ${
                    contract.riskLevel === 'high' ? 'bg-red-500' :
                    contract.riskLevel === 'medium' ? 'bg-orange-500' :
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

              {/* Status and Priority */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                  contract.status === 'executed' ? 'bg-green-100 text-green-700 border border-green-200' :
                  contract.status === 'review' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                  contract.status === 'pending' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                  contract.status === 'draft' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                  'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {contract.status.toUpperCase()}
                </span>
                
                <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold ${
                  contract.priority === 'high' ? 'bg-red-50 text-red-600' :
                  contract.priority === 'medium' ? 'bg-orange-50 text-orange-600' :
                  'bg-green-50 text-green-600'
                }`}>
                  {contract.priority.toUpperCase()}
                </span>
              </div>

              {/* Progress Bar */}
              {contract.status !== 'executed' && contract.status !== 'expired' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-counsel-600">Progress</span>
                    <span className="text-xs font-bold text-counsel-800">{contract.progress}%</span>
                  </div>
                  <div className="w-full bg-counsel-100 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-counsel-500 to-legal-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${contract.progress}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                    />
                  </div>
                </div>
              )}

              <p className="text-sm text-counsel-600 mb-4 line-clamp-2 leading-relaxed">
                {contract.description}
              </p>
            </div>

            {/* Contract Details */}
            <div className="px-6 py-4 bg-gradient-to-br from-legal-50/50 to-counsel-50/30 border-t border-counsel-100">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-counsel-600 font-medium flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    Client:
                  </span>
                  <span className="font-bold text-counsel-800">{contract.client}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-counsel-600 font-medium flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Value:
                  </span>
                  <span className="font-bold text-green-600">
                    {contract.value > 0 ? `$${contract.value.toLocaleString()}` : 'N/A'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-counsel-600 font-medium flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Duration:
                  </span>
                  <span className="font-medium text-counsel-800 text-xs">
                    {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-counsel-600 font-medium">Assigned:</span>
                  <span className="font-medium text-counsel-800">{contract.assignedTo}</span>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            {contract.aiInsights && contract.aiInsights.length > 0 && (
              <div className="px-6 py-4 bg-gradient-to-r from-counsel-50 to-legal-50 border-t border-counsel-100">
                <div className="flex items-center mb-2">
                  <Brain className="h-4 w-4 text-counsel-600 mr-2" />
                  <span className="text-sm font-bold text-counsel-700">AI Insights</span>
                </div>
                <div className="space-y-1">
                  {contract.aiInsights.slice(0, 2).map((insight, idx) => (
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
                  <span>AI Analyze</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredContracts.length === 0 && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 border border-counsel-200/50 shadow-lg max-w-md mx-auto">
            <div className="p-4 bg-gradient-to-br from-counsel-100 to-legal-100 rounded-2xl w-fit mx-auto mb-6">
              <FileText className="h-12 w-12 text-counsel-600" />
            </div>
            <h3 className="text-xl font-bold text-counsel-800 mb-3">No contracts found</h3>
            <p className="text-counsel-600 mb-6 leading-relaxed">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                : 'Start building your contract portfolio with AI-powered contract creation and analysis.'
              }
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowNewContractModal(true)}
              icon={Plus}
            >
              Create New Contract
            </Button>
          </div>
        </motion.div>
      )}

      {/* New Contract Modal */}
      <Modal
        isOpen={showNewContractModal}
        onClose={() => setShowNewContractModal(false)}
        title="Create New Contract"
        size="lg"
      >
        <ModalBody>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contract Title</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter contract title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter client name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contract Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                  <option value="License">License Agreement</option>
                  <option value="Service">Service Agreement</option>
                  <option value="NDA">Non-Disclosure Agreement</option>
                  <option value="MSA">Master Service Agreement</option>
                  <option value="Partnership">Partnership Agreement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contract Value</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter contract value"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Enter contract description"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => setShowNewContractModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              logger.info('Creating new contract from modal')
              // TODO: Implement actual contract creation API call
              setShowNewContractModal(false)
            }}
          >
            Create Contract
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}