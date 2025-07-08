import React, { useState } from 'react'
import { Plus, Search, Filter, Building2, Calendar, DollarSign, User, MoreVertical, Brain, AlertTriangle, TrendingUp, Clock, Download, Eye, Edit, Trash2, Upload, BarChart3, Zap, FileCheck, Globe, Shield, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, Input, Badge, Modal } from '../components/ui/UIComponents'

interface Entity {
  id: string
  name: string
  type: 'corporation' | 'llc' | 'partnership' | 'subsidiary' | 'branch' | 'joint-venture'
  status: 'active' | 'inactive' | 'pending' | 'dissolved'
  jurisdiction: string
  incorporationDate: string
  entityNumber: string
  registeredAgent: string
  businessAddress: string
  filingStatus: 'current' | 'overdue' | 'pending' | 'delinquent'
  nextFilingDue: string
  annualReportStatus: 'filed' | 'due' | 'overdue'
  taxId: string
  parentEntity?: string
  subsidiaries: number
  complianceScore: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  aiInsights: string[]
  estimatedValue: number
  assignedCounsel: string
  lastAudit: string
}

const statusConfig = {
  active: { icon: CheckCircle, color: 'success' as const },
  inactive: { icon: XCircle, color: 'info' as const },
  pending: { icon: Clock, color: 'warning' as const },
  dissolved: { icon: XCircle, color: 'danger' as const }
}

const filingStatusConfig = {
  current: { icon: CheckCircle, color: 'success' as const },
  overdue: { icon: AlertTriangle, color: 'danger' as const },
  pending: { icon: Clock, color: 'warning' as const },
  delinquent: { icon: AlertCircle, color: 'danger' as const }
}

const riskConfig = {
  low: { color: 'success' as const },
  medium: { color: 'warning' as const },
  high: { color: 'danger' as const },
  critical: { color: 'danger' as const }
}

export function EntityManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [jurisdictionFilter, setJurisdictionFilter] = useState('all')
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const entities: Entity[] = [
    {
      id: '1',
      name: 'TechCorp Industries Inc.',
      type: 'corporation',
      status: 'active',
      jurisdiction: 'Delaware',
      incorporationDate: '2018-03-15',
      entityNumber: 'DE7891234',
      registeredAgent: 'Corporate Services Company',
      businessAddress: '100 Technology Drive, San Francisco, CA 94105',
      filingStatus: 'current',
      nextFilingDue: '2024-03-15',
      annualReportStatus: 'filed',
      taxId: '87-1234567',
      subsidiaries: 3,
      complianceScore: 95,
      riskLevel: 'low',
      aiInsights: ['All filings up to date', 'Strong compliance history', 'No regulatory issues'],
      estimatedValue: 50000000,
      assignedCounsel: 'Sarah Johnson',
      lastAudit: '2023-12-01'
    },
    {
      id: '2',
      name: 'Innovation Labs LLC',
      type: 'llc',
      status: 'active',
      jurisdiction: 'California',
      incorporationDate: '2020-06-10',
      entityNumber: 'CA202012345',
      registeredAgent: 'Legal Filing Services',
      businessAddress: '789 Innovation Drive, Austin, TX 78701',
      filingStatus: 'overdue',
      nextFilingDue: '2024-01-15',
      annualReportStatus: 'overdue',
      taxId: '88-9876543',
      subsidiaries: 0,
      complianceScore: 72,
      riskLevel: 'medium',
      aiInsights: ['Annual report overdue', 'Immediate filing required', 'Potential penalties pending'],
      estimatedValue: 15000000,
      assignedCounsel: 'Michael Chen',
      lastAudit: '2023-08-15'
    },
    {
      id: '3',
      name: 'Metro Holdings Partnership',
      type: 'partnership',
      status: 'active',
      jurisdiction: 'New York',
      incorporationDate: '2015-09-20',
      entityNumber: 'NY456789',
      registeredAgent: 'Empire Business Services',
      businessAddress: '321 Metro Plaza, New York, NY 10001',
      filingStatus: 'current',
      nextFilingDue: '2024-09-20',
      annualReportStatus: 'filed',
      taxId: '12-3456789',
      subsidiaries: 2,
      complianceScore: 88,
      riskLevel: 'low',
      aiInsights: ['Partnership agreement renewal due', 'Consider tax optimization', 'Strong performance metrics'],
      estimatedValue: 25000000,
      assignedCounsel: 'David Wilson',
      lastAudit: '2023-11-30'
    },
    {
      id: '4',
      name: 'Global Services Europe Ltd',
      type: 'subsidiary',
      status: 'active',
      jurisdiction: 'United Kingdom',
      incorporationDate: '2019-11-05',
      entityNumber: 'UK987654321',
      registeredAgent: 'UK Corporate Services',
      businessAddress: '42 London Bridge Street, London, UK SE1 9BL',
      filingStatus: 'current',
      nextFilingDue: '2024-11-05',
      annualReportStatus: 'filed',
      taxId: 'GB123456789',
      parentEntity: 'TechCorp Industries Inc.',
      subsidiaries: 0,
      complianceScore: 91,
      riskLevel: 'low',
      aiInsights: ['International compliance maintained', 'Brexit implications reviewed', 'Strong local operations'],
      estimatedValue: 8000000,
      assignedCounsel: 'Lisa Rodriguez',
      lastAudit: '2023-10-15'
    },
    {
      id: '5',
      name: 'Startup Ventures JV',
      type: 'joint-venture',
      status: 'pending',
      jurisdiction: 'Texas',
      incorporationDate: '2024-01-10',
      entityNumber: 'TX2024001',
      registeredAgent: 'Texas Business Formations',
      businessAddress: '500 Innovation Blvd, Austin, TX 78759',
      filingStatus: 'pending',
      nextFilingDue: '2024-07-10',
      annualReportStatus: 'due',
      taxId: 'PENDING',
      subsidiaries: 0,
      complianceScore: 65,
      riskLevel: 'medium',
      aiInsights: ['New entity setup in progress', 'Documentation review needed', 'Joint venture agreement pending'],
      estimatedValue: 5000000,
      assignedCounsel: 'Robert Miller',
      lastAudit: 'N/A'
    }
  ]

  const filteredEntities = entities.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || entity.status === statusFilter
    const matchesType = typeFilter === 'all' || entity.type === typeFilter
    const matchesJurisdiction = jurisdictionFilter === 'all' || entity.jurisdiction === jurisdictionFilter
    return matchesSearch && matchesStatus && matchesType && matchesJurisdiction
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

  const getStatusIcon = (status: Entity['status']) => {
    const IconComponent = statusConfig[status].icon
    return <IconComponent className="h-4 w-4" />
  }

  const getFilingStatusIcon = (status: Entity['filingStatus']) => {
    const IconComponent = filingStatusConfig[status].icon
    return <IconComponent className="h-4 w-4" />
  }

  const totalEntities = entities.length
  const activeEntities = entities.filter(e => e.status === 'active').length
  const overdueFilings = entities.filter(e => e.filingStatus === 'overdue').length
  const totalValue = entities.reduce((sum, entity) => sum + entity.estimatedValue, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Entity Management</h1>
          <p className="text-muted-600 mt-1">Manage corporate entities, compliance, and governance</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </Button>
          <Button 
            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4" />
            <span>New Entity</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-600">Total Entities</p>
              <p className="text-2xl font-bold text-navy-900">{totalEntities}</p>
            </div>
            <div className="p-2 bg-primary-100 rounded-lg">
              <Building2 className="h-5 w-5 text-primary-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-600">Active Entities</p>
              <p className="text-2xl font-bold text-navy-900">{activeEntities}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-600">Total Value</p>
              <p className="text-2xl font-bold text-navy-900">{formatCurrency(totalValue)}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-600">Overdue Filings</p>
              <p className="text-2xl font-bold text-navy-900">{overdueFilings}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 bg-white p-4 rounded-lg border border-light-300">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-500" />
            <Input
              type="text"
              placeholder="Search entities, types, or jurisdictions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-light-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="dissolved">Dissolved</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-light-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
              value={jurisdictionFilter}
              onChange={(e) => setJurisdictionFilter(e.target.value)}
              className="px-3 py-2 border border-light-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Jurisdictions</option>
              <option value="Delaware">Delaware</option>
              <option value="California">California</option>
              <option value="New York">New York</option>
              <option value="Texas">Texas</option>
              <option value="United Kingdom">United Kingdom</option>
            </select>
          </div>
        </div>
      </div>

      {/* Entities Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted-50 border-b border-light-200">
              <tr>
                <th className="text-left p-4 font-semibold text-navy-900">Entity</th>
                <th className="text-left p-4 font-semibold text-navy-900">Type</th>
                <th className="text-left p-4 font-semibold text-navy-900">Status</th>
                <th className="text-left p-4 font-semibold text-navy-900">Filing Status</th>
                <th className="text-left p-4 font-semibold text-navy-900">Compliance</th>
                <th className="text-left p-4 font-semibold text-navy-900">Value</th>
                <th className="text-left p-4 font-semibold text-navy-900">Next Filing</th>
                <th className="text-left p-4 font-semibold text-navy-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntities.map((entity, index) => (
                <motion.tr
                  key={entity.id}
                  className="border-b border-light-100 hover:bg-muted-25 transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedEntity(entity)}
                >
                  <td className="p-4">
                    <div>
                      <h3 className="font-semibold text-navy-900">{entity.name}</h3>
                      <p className="text-sm text-muted-600">{entity.jurisdiction}</p>
                      <p className="text-xs text-muted-500 mt-1">Entity #{entity.entityNumber}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-500" />
                      <span className="capitalize text-navy-900">{entity.type.replace('-', ' ')}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={statusConfig[entity.status].color}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(entity.status)}
                        <span className="capitalize">{entity.status}</span>
                      </div>
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={filingStatusConfig[entity.filingStatus].color}>
                      <div className="flex items-center space-x-1">
                        {getFilingStatusIcon(entity.filingStatus)}
                        <span className="capitalize">{entity.filingStatus}</span>
                      </div>
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-light-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            entity.complianceScore >= 90 ? 'bg-green-500' :
                            entity.complianceScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${entity.complianceScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-navy-900">{entity.complianceScore}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-semibold text-navy-900">{formatCurrency(entity.estimatedValue)}</p>
                      <p className="text-xs text-muted-500">{entity.subsidiaries} subsidiaries</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm text-navy-900">{formatDate(entity.nextFilingDue)}</p>
                      <p className="text-xs text-muted-500">Annual: {entity.annualReportStatus}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="secondary" size="sm" className="p-2">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" size="sm" className="p-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" size="sm" className="p-2">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Entity Detail Modal */}
      {selectedEntity && (
        <Modal
          isOpen={!!selectedEntity}
          onClose={() => setSelectedEntity(null)}
          title={selectedEntity.name}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-600 mb-1">Type</label>
                <p className="text-navy-900 font-semibold capitalize">{selectedEntity.type.replace('-', ' ')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-600 mb-1">Status</label>
                <Badge variant={statusConfig[selectedEntity.status].color}>
                  {selectedEntity.status.charAt(0).toUpperCase() + selectedEntity.status.slice(1)}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-600 mb-1">Jurisdiction</label>
                <p className="text-navy-900">{selectedEntity.jurisdiction}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-600 mb-1">Entity Number</label>
                <p className="text-navy-900">{selectedEntity.entityNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-600 mb-1">Incorporation Date</label>
                <p className="text-navy-900">{formatDate(selectedEntity.incorporationDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-600 mb-1">Tax ID</label>
                <p className="text-navy-900">{selectedEntity.taxId}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-600 mb-1">Business Address</label>
              <p className="text-navy-900">{selectedEntity.businessAddress}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-600 mb-1">Registered Agent</label>
              <p className="text-navy-900">{selectedEntity.registeredAgent}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-600 mb-1">Compliance Score</label>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-light-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        selectedEntity.complianceScore >= 90 ? 'bg-green-500' :
                        selectedEntity.complianceScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${selectedEntity.complianceScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-navy-900">{selectedEntity.complianceScore}%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-600 mb-1">Risk Level</label>
                <Badge variant={riskConfig[selectedEntity.riskLevel].color}>
                  {selectedEntity.riskLevel.charAt(0).toUpperCase() + selectedEntity.riskLevel.slice(1)}
                </Badge>
              </div>
            </div>

            {selectedEntity.aiInsights.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-muted-600 mb-2">AI Insights</label>
                <div className="space-y-2">
                  {selectedEntity.aiInsights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-muted-50 rounded-lg">
                      <Brain className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-navy-900">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <Button className="flex-1">Edit Entity</Button>
              <Button variant="secondary">Generate Report</Button>
              <Button variant="secondary">File Documents</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Entity Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Entity"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-600 mb-1">Entity Name</label>
                <Input placeholder="Enter entity name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-600 mb-1">Type</label>
                <select className="w-full px-3 py-2 border border-light-300 rounded-lg">
                  <option value="corporation">Corporation</option>
                  <option value="llc">LLC</option>
                  <option value="partnership">Partnership</option>
                  <option value="subsidiary">Subsidiary</option>
                  <option value="branch">Branch</option>
                  <option value="joint-venture">Joint Venture</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-600 mb-1">Jurisdiction</label>
                <Input placeholder="Enter jurisdiction" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-600 mb-1">Estimated Value</label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-600 mb-1">Business Address</label>
              <textarea 
                className="w-full px-3 py-2 border border-light-300 rounded-lg h-20 resize-none"
                placeholder="Enter business address..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button className="flex-1">Create Entity</Button>
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
