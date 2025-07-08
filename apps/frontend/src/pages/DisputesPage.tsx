import React, { useState } from 'react'
import { Plus, Search, Filter, Gavel, Calendar, DollarSign, User, Clock, Eye, Edit, AlertTriangle, CheckCircle, TrendingUp, FileText, MessageSquare, Star, MoreVertical, Download, Upload, Brain, Zap, Target, Activity, Briefcase } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button, Card, Input, Badge, Modal } from '../components/ui/UIComponents'

interface Dispute {
  id: string
  title: string
  type: 'litigation' | 'arbitration' | 'mediation' | 'negotiation'
  status: 'active' | 'pending' | 'settled' | 'dismissed' | 'appealed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  client: string
  opposingParty: string
  attorney: string
  filingDate: string
  dueDate?: string
  estimatedValue: number
  actualCosts: number
  description: string
  courtName?: string
  caseNumber?: string
  lastActivity: string
  riskLevel: 'low' | 'medium' | 'high'
  probability: number
}

const statusConfig = {
  active: { icon: CheckCircle, color: 'success' as const, bgColor: 'bg-green-50' },
  pending: { icon: Clock, color: 'warning' as const, bgColor: 'bg-yellow-50' },
  settled: { icon: CheckCircle, color: 'success' as const, bgColor: 'bg-green-50' },
  dismissed: { icon: CheckCircle, color: 'info' as const, bgColor: 'bg-gray-50' },
  appealed: { icon: AlertTriangle, color: 'warning' as const, bgColor: 'bg-yellow-50' }
}

const priorityConfig = {
  low: { color: 'info' as const },
  medium: { color: 'warning' as const },
  high: { color: 'danger' as const },
  critical: { color: 'danger' as const }
}

const riskConfig = {
  low: { color: 'success' as const },
  medium: { color: 'warning' as const },
  high: { color: 'danger' as const }
}

export function DisputesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const mockDisputes: Dispute[] = [
    {
      id: '1',
      title: 'Contract Breach - TechCorp vs. StartupCo',
      type: 'litigation',
      status: 'active',
      priority: 'high',
      client: 'TechCorp Industries',
      opposingParty: 'StartupCo LLC',
      attorney: 'Sarah Johnson',
      filingDate: '2024-03-15',
      dueDate: '2025-02-15',
      estimatedValue: 2500000,
      actualCosts: 125000,
      description: 'Breach of software licensing agreement with damages claim',
      courtName: 'Superior Court of California',
      caseNumber: 'CV-2024-001234',
      lastActivity: '2024-12-20',
      riskLevel: 'medium',
      probability: 75
    },
    {
      id: '2',
      title: 'Employment Discrimination Case',
      type: 'mediation',
      status: 'pending',
      priority: 'medium',
      client: 'Metro Properties Group',
      opposingParty: 'Former Employee',
      attorney: 'Michael Brown',
      filingDate: '2024-11-10',
      estimatedValue: 500000,
      actualCosts: 35000,
      description: 'Wrongful termination and discrimination claims',
      lastActivity: '2024-12-18',
      riskLevel: 'low',
      probability: 85
    },
    {
      id: '3',
      title: 'IP Infringement - Patent Dispute',
      type: 'arbitration',
      status: 'active',
      priority: 'critical',
      client: 'InnovaTech Solutions',
      opposingParty: 'CompetitorCorp',
      attorney: 'Jennifer Davis',
      filingDate: '2024-01-20',
      dueDate: '2025-01-30',
      estimatedValue: 5000000,
      actualCosts: 280000,
      description: 'Patent infringement on AI technology',
      lastActivity: '2024-12-19',
      riskLevel: 'high',
      probability: 60
    },
    {
      id: '4',
      title: 'Commercial Real Estate Dispute',
      type: 'litigation',
      status: 'settled',
      priority: 'low',
      client: 'Prime Real Estate LLC',
      opposingParty: 'Downtown Development Corp',
      attorney: 'David Wilson',
      filingDate: '2024-02-01',
      estimatedValue: 1200000,
      actualCosts: 85000,
      description: 'Lease agreement dispute over commercial property',
      courtName: 'County Superior Court',
      caseNumber: 'CV-2024-002468',
      lastActivity: '2024-12-15',
      riskLevel: 'low',
      probability: 90
    },
    {
      id: '5',
      title: 'Securities Class Action Defense',
      type: 'litigation',
      status: 'active',
      priority: 'critical',
      client: 'Financial Services Inc',
      opposingParty: 'Shareholder Group',
      attorney: 'Lisa Rodriguez',
      filingDate: '2024-04-10',
      dueDate: '2025-06-30',
      estimatedValue: 15000000,
      actualCosts: 450000,
      description: 'Class action lawsuit regarding securities disclosure',
      courtName: 'Federal District Court',
      caseNumber: 'CV-2024-003579',
      lastActivity: '2024-12-22',
      riskLevel: 'high',
      probability: 55
    }
  ]

  const filteredDisputes = mockDisputes.filter(dispute => {
    const matchesSearch = dispute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dispute.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dispute.opposingParty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter
    const matchesType = typeFilter === 'all' || dispute.type === typeFilter
    const matchesPriority = priorityFilter === 'all' || dispute.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesType && matchesPriority
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

  const getStatusIcon = (status: Dispute['status']) => {
    const IconComponent = statusConfig[status].icon
    return <IconComponent className="h-4 w-4" />
  }

  const totalValue = mockDisputes.reduce((sum, dispute) => sum + dispute.estimatedValue, 0)
  const activeDisputes = mockDisputes.filter(d => d.status === 'active').length
  const highRiskDisputes = mockDisputes.filter(d => d.riskLevel === 'high').length
  const totalCosts = mockDisputes.reduce((sum, dispute) => sum + dispute.actualCosts, 0)

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
              Disputes & Litigation
            </h1>
            <p className="text-teal-600 mt-2 text-lg font-medium">
              Comprehensive dispute resolution and litigation management
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button 
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </motion.button>
            <motion.button 
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200"
              onClick={() => setShowCreateModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              <span>New Dispute</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Analytics Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Total Disputes</p>
                <p className="text-3xl font-bold text-teal-800">{mockDisputes.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Gavel className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-blue-600 font-medium">+12%</span>
              <span className="text-teal-500 ml-1">vs last quarter</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Active Disputes</p>
                <p className="text-3xl font-bold text-teal-800">{activeDisputes}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-600 font-medium">In progress</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Total Value</p>
                <p className="text-3xl font-bold text-teal-800">{formatCurrency(totalValue)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-purple-600 font-medium">Estimated value</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">High Risk</p>
                <p className="text-3xl font-bold text-teal-800">{highRiskDisputes}</p>
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

        {/* Filters */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
                <Input
                  type="text"
                  placeholder="Search disputes, clients, or opposing parties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500/20"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-teal-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="settled">Settled</option>
                  <option value="dismissed">Dismissed</option>
                  <option value="appealed">Appealed</option>
                </select>
                
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-teal-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Types</option>
                  <option value="litigation">Litigation</option>
                  <option value="arbitration">Arbitration</option>
                  <option value="mediation">Mediation</option>
                  <option value="negotiation">Negotiation</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-teal-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Disputes Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="overflow-hidden bg-white/90 backdrop-blur-sm border-teal-200/50 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-200">
                  <tr>
                    <th className="text-left p-4 font-semibold text-teal-800">Dispute</th>
                    <th className="text-left p-4 font-semibold text-teal-800">Type</th>
                    <th className="text-left p-4 font-semibold text-teal-800">Status</th>
                    <th className="text-left p-4 font-semibold text-teal-800">Priority</th>
                    <th className="text-left p-4 font-semibold text-teal-800">Value</th>
                    <th className="text-left p-4 font-semibold text-teal-800">Risk</th>
                    <th className="text-left p-4 font-semibold text-teal-800">Due Date</th>
                    <th className="text-left p-4 font-semibold text-teal-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDisputes.map((dispute, index) => (
                    <motion.tr
                      key={dispute.id}
                      className="border-b border-teal-100/50 hover:bg-teal-50/30 transition-colors cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedDispute(dispute)}
                    >
                      <td className="p-4">
                        <div>
                          <h3 className="font-semibold text-teal-900">{dispute.title}</h3>
                          <p className="text-sm text-teal-600">{dispute.client} vs {dispute.opposingParty}</p>
                          <p className="text-xs text-teal-500 mt-1">Assigned to {dispute.attorney}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {dispute.type === 'litigation' && <Gavel className="h-4 w-4 text-teal-500" />}
                          {dispute.type === 'arbitration' && <Star className="h-4 w-4 text-teal-500" />}
                          {dispute.type === 'mediation' && <MessageSquare className="h-4 w-4 text-teal-500" />}
                          {dispute.type === 'negotiation' && <User className="h-4 w-4 text-teal-500" />}
                          <span className="capitalize text-teal-800">{dispute.type}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={statusConfig[dispute.status].color}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(dispute.status)}
                            <span className="capitalize">{dispute.status}</span>
                          </div>
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={priorityConfig[dispute.priority].color}>
                          {dispute.priority.charAt(0).toUpperCase() + dispute.priority.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-teal-900">{formatCurrency(dispute.estimatedValue)}</p>
                          <p className="text-xs text-teal-500">Costs: {formatCurrency(dispute.actualCosts)}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={riskConfig[dispute.riskLevel].color}>
                          {dispute.riskLevel.charAt(0).toUpperCase() + dispute.riskLevel.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div>
                          {dispute.dueDate && (
                            <p className="text-sm text-teal-800">{formatDate(dispute.dueDate)}</p>
                          )}
                          <p className="text-xs text-teal-500">Filed: {formatDate(dispute.filingDate)}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="secondary" size="sm" className="p-2 bg-white/50 border-teal-200 hover:bg-teal-50">
                            <Eye className="h-4 w-4 text-teal-600" />
                          </Button>
                          <Button variant="secondary" size="sm" className="p-2 bg-white/50 border-teal-200 hover:bg-teal-50">
                            <Edit className="h-4 w-4 text-teal-600" />
                          </Button>
                          <Button variant="secondary" size="sm" className="p-2 bg-white/50 border-teal-200 hover:bg-teal-50">
                            <MoreVertical className="h-4 w-4 text-teal-600" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>

        {/* Dispute Detail Modal */}
        {selectedDispute && (
          <Modal
            isOpen={!!selectedDispute}
            onClose={() => setSelectedDispute(null)}
            title={selectedDispute.title}
            size="lg"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-teal-600 mb-1">Client</label>
                  <p className="text-teal-900 font-semibold">{selectedDispute.client}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-600 mb-1">Opposing Party</label>
                  <p className="text-teal-900 font-semibold">{selectedDispute.opposingParty}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-600 mb-1">Type</label>
                  <p className="text-teal-900 capitalize">{selectedDispute.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-600 mb-1">Status</label>
                  <Badge variant={statusConfig[selectedDispute.status].color}>
                    {selectedDispute.status.charAt(0).toUpperCase() + selectedDispute.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-600 mb-1">Estimated Value</label>
                  <p className="text-teal-900 font-semibold">{formatCurrency(selectedDispute.estimatedValue)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-600 mb-1">Actual Costs</label>
                  <p className="text-teal-900 font-semibold">{formatCurrency(selectedDispute.actualCosts)}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-2">Description</label>
                <p className="text-teal-800">{selectedDispute.description}</p>
              </div>

              {selectedDispute.courtName && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-teal-600 mb-1">Court</label>
                    <p className="text-teal-900">{selectedDispute.courtName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-teal-600 mb-1">Case Number</label>
                    <p className="text-teal-900">{selectedDispute.caseNumber}</p>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">Edit Dispute</Button>
                <Button variant="secondary" className="border-teal-200 text-teal-700 hover:bg-teal-50">Generate Report</Button>
                <Button variant="secondary" className="border-teal-200 text-teal-700 hover:bg-teal-50">Add Note</Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Create Dispute Modal */}
        {showCreateModal && (
          <Modal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            title="Create New Dispute"
            size="lg"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-teal-600 mb-1">Title</label>
                  <Input placeholder="Enter dispute title" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-600 mb-1">Type</label>
                  <select className="w-full px-3 py-2 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                    <option value="litigation">Litigation</option>
                    <option value="arbitration">Arbitration</option>
                    <option value="mediation">Mediation</option>
                    <option value="negotiation">Negotiation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-600 mb-1">Client</label>
                  <Input placeholder="Select or enter client" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-600 mb-1">Opposing Party</label>
                  <Input placeholder="Enter opposing party" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-600 mb-1">Estimated Value</label>
                  <Input type="number" placeholder="0" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-600 mb-1">Priority</label>
                  <select className="w-full px-3 py-2 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Description</label>
                <textarea 
                  className="w-full px-3 py-2 border border-teal-200 rounded-xl h-24 resize-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  placeholder="Enter dispute description..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">Create Dispute</Button>
                <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="border-teal-200 text-teal-700 hover:bg-teal-50">Cancel</Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
  )
}
