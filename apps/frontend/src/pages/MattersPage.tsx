import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar,
  DollarSign,
  User,
  Clock,
  Briefcase,
  Edit,
  Eye,
  Archive,
  Brain,
  AlertTriangle,
  TrendingUp,
  Download,
  Upload,
  Zap,
  Target,
  BarChart3,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Timer,
  Building2,
  Scale,
  Settings,
  Share2,
  MessageSquare,
  ChevronDown,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { mattersApi } from '../services/api'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { AIInsights } from '../components/ai/AIInsights'
import { useAI } from '../contexts/AIContext'
import { logger } from '../services/logger'
import { Tabs, TabPanel } from '../components/ui/Tabs'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../components/ui/Modal'
import { SearchInput, SearchFilters } from '../components/ui/SearchInput'
import { cn } from '../utils/cn'

interface Matter {
  id: string
  title: string
  clientName: string
  type: string
  status: 'active' | 'pending' | 'closed' | 'on_hold' | 'review' | 'settlement'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignedLawyer: string
  createdAt: string
  dueDate: string
  estimatedValue: number
  description: string
  riskLevel: 'low' | 'medium' | 'high'
  aiInsights: string[]
  progress: number
  lastActivity: string
  jurisdiction: string
  caseNumber?: string
  nextMilestone: string
  aiPrediction: {
    outcome: 'favorable' | 'unfavorable' | 'neutral'
    confidence: number
    timeToResolution: string
    estimatedCost: number
  }
  timeline: {
    date: string
    event: string
    type: 'filing' | 'hearing' | 'deadline' | 'milestone'
  }[]
}

export function MattersPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showNewMatterModal, setShowNewMatterModal] = useState(false)
  const [showMatterDetails, setShowMatterDetails] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [matters] = useState<Matter[]>([
    {
      id: '1',
      title: 'Corporate Merger - TechCorp Acquisition',
      clientName: 'TechCorp Industries',
      type: 'corporate',
      status: 'active',
      priority: 'high',
      assignedLawyer: 'Sarah Johnson',
      createdAt: '2024-01-15',
      dueDate: '2024-06-30',
      estimatedValue: 2500000,
      description: 'Complex corporate merger involving due diligence, regulatory approval, and contract negotiation',
      riskLevel: 'medium',
      aiInsights: ['Regulatory approval timeline on track', 'Due diligence 85% complete', 'Antitrust concerns minimal'],
      progress: 75,
      lastActivity: '2024-01-20',
      jurisdiction: 'US Federal, Delaware',
      caseNumber: 'TC-2024-001',
      nextMilestone: 'Regulatory filing due Feb 15',
      aiPrediction: {
        outcome: 'favorable',
        confidence: 82,
        timeToResolution: '4-5 months',
        estimatedCost: 450000
      },
      timeline: [
        { date: '2024-01-15', event: 'Initial filing submitted', type: 'filing' },
        { date: '2024-02-15', event: 'Regulatory approval deadline', type: 'deadline' },
        { date: '2024-03-01', event: 'Due diligence completion', type: 'milestone' }
      ]
    },
    {
      id: '2',
      title: 'Employment Discrimination Case',
      clientName: 'Global Services LLC',
      type: 'employment',
      status: 'review',
      priority: 'high',
      assignedLawyer: 'Michael Chen',
      createdAt: '2023-11-10',
      dueDate: '2024-03-15',
      estimatedValue: 0,
      description: 'Employment discrimination lawsuit requiring comprehensive defense strategy',
      riskLevel: 'high',
      aiInsights: ['Settlement recommended', 'Similar cases favor defense 60%', 'Discovery phase critical'],
      progress: 60,
      lastActivity: '2024-01-18',
      jurisdiction: 'California State Court',
      caseNumber: 'CV-2023-4567',
      nextMilestone: 'Mediation scheduled Jan 30',
      aiPrediction: {
        outcome: 'neutral',
        confidence: 65,
        timeToResolution: '6-8 months',
        estimatedCost: 185000
      },
      timeline: [
        { date: '2023-11-10', event: 'Complaint filed', type: 'filing' },
        { date: '2024-01-30', event: 'Mediation hearing', type: 'hearing' },
        { date: '2024-03-15', event: 'Discovery deadline', type: 'deadline' }
      ]
    },
    {
      id: '3',
      title: 'Patent Infringement Defense',
      clientName: 'Innovation Labs',
      type: 'intellectual_property',
      status: 'active',
      priority: 'critical',
      assignedLawyer: 'Emma Davis',
      createdAt: '2024-01-05',
      dueDate: '2024-04-20',
      estimatedValue: 1200000,
      description: 'Defending against patent infringement claims in federal court',
      riskLevel: 'high',
      aiInsights: ['Prior art search favorable', 'Invalidity defense strong', 'Expedited timeline required'],
      progress: 40,
      lastActivity: '2024-01-19',
      jurisdiction: 'US Federal - Eastern District',
      caseNumber: 'CV-24-001234',
      nextMilestone: 'Expert witness deadline Feb 10',
      aiPrediction: {
        outcome: 'favorable',
        confidence: 78,
        timeToResolution: '8-12 months',
        estimatedCost: 320000
      },
      timeline: [
        { date: '2024-01-05', event: 'Lawsuit filed', type: 'filing' },
        { date: '2024-02-10', event: 'Expert witness deadline', type: 'deadline' },
        { date: '2024-04-20', event: 'Summary judgment motion', type: 'milestone' }
      ]
    },
    {
      id: '4',
      title: 'Contract Dispute Resolution',
      clientName: 'StartupCo Ltd',
      type: 'litigation',
      status: 'settlement',
      priority: 'medium',
      assignedLawyer: 'David Wilson',
      createdAt: '2023-09-20',
      dueDate: '2024-02-28',
      estimatedValue: 750000,
      description: 'Commercial contract dispute over service agreement terms',
      riskLevel: 'low',
      aiInsights: ['Settlement negotiations promising', 'Mediation successful track record', 'Cost-benefit favors resolution'],
      progress: 90,
      lastActivity: '2024-01-21',
      jurisdiction: 'New York State Court',
      caseNumber: 'SC-2023-8901',
      nextMilestone: 'Settlement conference Jan 25',
      aiPrediction: {
        outcome: 'favorable',
        confidence: 88,
        timeToResolution: '2-3 weeks',
        estimatedCost: 45000
      },
      timeline: [
        { date: '2023-09-20', event: 'Dispute initiated', type: 'filing' },
        { date: '2024-01-25', event: 'Settlement conference', type: 'hearing' },
        { date: '2024-02-28', event: 'Resolution deadline', type: 'deadline' }
      ]
    },
    {
      id: '5',
      title: 'Regulatory Compliance Audit',
      clientName: 'FinTech Solutions',
      type: 'compliance',
      status: 'active',
      priority: 'medium',
      assignedLawyer: 'Lisa Thompson',
      createdAt: '2024-01-08',
      dueDate: '2024-05-15',
      estimatedValue: 0,
      description: 'Comprehensive regulatory compliance review for financial services',
      riskLevel: 'medium',
      aiInsights: ['Compliance gaps identified', 'Remediation plan in progress', 'Regulatory changes monitored'],
      progress: 55,
      lastActivity: '2024-01-22',
      jurisdiction: 'Federal - SEC, FINRA',
      nextMilestone: 'Compliance report due Feb 20',
      aiPrediction: {
        outcome: 'favorable',
        confidence: 75,
        timeToResolution: '3-4 months',
        estimatedCost: 125000
      },
      timeline: [
        { date: '2024-01-08', event: 'Audit commenced', type: 'milestone' },
        { date: '2024-02-20', event: 'Interim report due', type: 'deadline' },
        { date: '2024-05-15', event: 'Final compliance certification', type: 'milestone' }
      ]
    },
    {
      id: '6',
      title: 'Real Estate Transaction',
      clientName: 'Property Investments Inc',
      type: 'real_estate',
      status: 'closed',
      priority: 'low',
      assignedLawyer: 'James Anderson',
      createdAt: '2023-12-01',
      dueDate: '2024-01-15',
      estimatedValue: 3500000,
      description: 'Commercial real estate acquisition with environmental due diligence',
      riskLevel: 'low',
      aiInsights: ['Transaction completed successfully', 'All contingencies satisfied', 'Clean title transfer'],
      progress: 100,
      lastActivity: '2024-01-16',
      jurisdiction: 'California State',
      caseNumber: 'RE-2023-5678',
      nextMilestone: 'Matter closed',
      aiPrediction: {
        outcome: 'favorable',
        confidence: 100,
        timeToResolution: 'Completed',
        estimatedCost: 85000
      },
      timeline: [
        { date: '2023-12-01', event: 'Purchase agreement signed', type: 'filing' },
        { date: '2024-01-10', event: 'Due diligence completed', type: 'milestone' },
        { date: '2024-01-15', event: 'Closing completed', type: 'milestone' }
      ]
    }
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterRisk, setFilterRisk] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [selectedMatters, setSelectedMatters] = useState<string[]>([])

  // Matter Analytics
  const totalValue = matters.reduce((sum, matter) => sum + matter.estimatedValue, 0)
  const activeMatters = matters.filter(m => m.status === 'active').length
  const highRiskMatters = matters.filter(m => m.riskLevel === 'high').length
  const closingThisMonth = matters.filter(m => {
    const dueDate = new Date(m.dueDate)
    const now = new Date()
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return dueDate < nextMonth && m.status !== 'closed'
  }).length
  const avgProgress = Math.round(matters.reduce((sum, m) => sum + m.progress, 0) / matters.length)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'corporate': return Building2
      case 'employment': return Users
      case 'intellectual_property': return Brain
      case 'litigation': return Scale
      case 'compliance': return CheckCircle
      case 'real_estate': return Building2
      default: return Briefcase
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'corporate': return 'from-blue-500 to-blue-600'
      case 'employment': return 'from-purple-500 to-purple-600'
      case 'intellectual_property': return 'from-green-500 to-green-600'
      case 'litigation': return 'from-red-500 to-red-600'
      case 'compliance': return 'from-orange-500 to-orange-600'
      case 'real_estate': return 'from-teal-500 to-teal-600'
      default: return 'from-counsel-500 to-counsel-600'
    }
  }

  const filteredMatters = matters.filter(matter => {
    const matchesSearch = matter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         matter.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         matter.assignedLawyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         matter.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || matter.status === filterStatus
    const matchesType = filterType === 'all' || matter.type === filterType
    const matchesPriority = filterPriority === 'all' || matter.priority === filterPriority
    const matchesRisk = filterRisk === 'all' || matter.riskLevel === filterRisk
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesRisk
  })

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, badge: matters.length.toString() },
    { id: 'active', label: 'Active', icon: Activity, badge: activeMatters.toString() },
    { id: 'high-risk', label: 'High Risk', icon: AlertTriangle, badge: highRiskMatters.toString() },
    { id: 'closing', label: 'Closing Soon', icon: Timer, badge: closingThisMonth.toString() },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText }
  ]

  const searchSuggestions = [
    'TechCorp Merger',
    'Employment Discrimination',
    'Patent Infringement',
    'Contract Dispute',
    'Compliance Audit',
    'Real Estate Transaction'
  ]

  const handleMatterAction = (action: string, matterId: string) => {
    logger.info('Matter action triggered', { action, matterId })
    
    switch (action) {
      case 'view':
        setShowMatterDetails(matterId)
        break
      case 'edit':
        logger.info('Opening matter for editing', { matterId })
        // TODO: Implement matter editing functionality
        break
      case 'download':
        logger.info('Downloading matter files', { matterId })
        // TODO: Implement matter file download
        break
      case 'ai-analyze':
        logger.info('Starting AI analysis for matter', { matterId })
        // TODO: Implement AI analysis functionality
        break
      case 'archive':
        logger.info('Archiving matter', { matterId })
        // TODO: Implement matter archiving
        break
      default:
        logger.warn('Unknown matter action attempted', { action, matterId })
    }
  }

  const handleBulkAction = (action: string) => {
    logger.info('Bulk action triggered', { action, matterCount: selectedMatters.length, matterIds: selectedMatters })
    // TODO: Implement bulk actions (archive, export, etc.)
  }

  const handleSearch = (query: string) => {
    logger.debug('Matter search performed', { query })
    setSearchTerm(query)
  }

  const toggleMatterSelection = (matterId: string) => {
    setSelectedMatters(prev => 
      prev.includes(matterId) 
        ? prev.filter(id => id !== matterId)
        : [...prev, matterId]
    )
  }

  const getTabFilteredMatters = () => {
    switch (activeTab) {
      case 'active':
        return filteredMatters.filter(m => m.status === 'active')
      case 'high-risk':
        return filteredMatters.filter(m => m.riskLevel === 'high')
      case 'closing':
        return filteredMatters.filter(m => {
          const dueDate = new Date(m.dueDate)
          const now = new Date()
          const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
          return dueDate < nextMonth && m.status !== 'closed'
        })
      case 'overview':
      default:
        return filteredMatters
    }
  }

  return (
    <div className="px-4 lg:px-6 bg-gradient-professional min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-3">
              Matter Management
            </h1>
            <p className="text-primary-600 text-lg font-medium">
              AI-powered case tracking, timeline management, and outcome prediction
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                size="md"
                icon={Upload}
                className="backdrop-blur-sm"
              >
                Import Cases
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="primary"
                size="lg"
                icon={Plus}
                onClick={() => setShowNewMatterModal(true)}
                className="shadow-lifted"
              >
                New Matter
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Analytics Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card variant="glass" className="group hover:shadow-lifted transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary-600">Portfolio Value</p>
                  <p className="text-3xl font-bold text-primary-900">${(totalValue / 1000000).toFixed(1)}M</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-success to-success rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-success mr-1" />
                <span className="text-success font-medium">+15%</span>
                <span className="text-primary-500 ml-1">this quarter</span>
              </div>
            </CardContent>
          </Card>

          <Card variant="glass" className="group hover:shadow-lifted transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary-600">Active Matters</p>
                  <p className="text-3xl font-bold text-primary-900">{activeMatters}</p>
                </div>
                <div className="p-3 bg-gradient-teal rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-primary-600 font-medium">In progress</span>
              </div>
            </CardContent>
          </Card>

          <Card variant="glass" className="group hover:shadow-lifted transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary-600">High Risk</p>
                  <p className="text-3xl font-bold text-primary-900">{highRiskMatters}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-danger to-danger rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-danger font-medium">Need attention</span>
              </div>
            </CardContent>
          </Card>

          <Card variant="glass" className="group hover:shadow-lifted transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary-600">Closing Soon</p>
                  <p className="text-3xl font-bold text-primary-900">{closingThisMonth}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-warning to-warning rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Timer className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-warning font-medium">This month</span>
              </div>
            </CardContent>
          </Card>

          <Card variant="glass" className="group hover:shadow-lifted transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary-600">Avg Progress</p>
                  <p className="text-3xl font-bold text-primary-900">{avgProgress}%</p>
                </div>
                <div className="p-3 bg-gradient-purple rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-accent-400 font-medium">Overall completion</span>
              </div>
            </CardContent>
          </Card>
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
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="flex-1 max-w-md">
            <SearchInput
              placeholder="Search matters, clients, cases..."
              value={searchTerm}
              onChange={setSearchTerm}
              onSubmit={handleSearch}
              showFilters={true}
              onFiltersClick={() => setShowFilters(!showFilters)}
              suggestions={searchSuggestions}
              size="md"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            {selectedMatters.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-counsel-600 font-medium">
                  {selectedMatters.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('archive')}
                  icon={Archive}
                >
                  Archive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('export')}
                  icon={Download}
                >
                  Export
                </Button>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="md"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              icon={viewMode === 'grid' ? BarChart3 : Briefcase}
            >
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </Button>
            
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowNewMatterModal(true)}
              icon={Plus}
            >
              New Matter
            </Button>
          </div>
        </motion.div>

        {/* Advanced Filters */}
        <SearchFilters isOpen={showFilters} onClose={() => setShowFilters(false)}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Matter Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="corporate">Corporate</option>
                <option value="employment">Employment</option>
                <option value="intellectual_property">IP</option>
                <option value="litigation">Litigation</option>
                <option value="compliance">Compliance</option>
                <option value="real_estate">Real Estate</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="review">Under Review</option>
                <option value="settlement">Settlement</option>
                <option value="closed">Closed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Risk Levels</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterType('all')
                setFilterStatus('all')
                setFilterPriority('all')
                setFilterRisk('all')
              }}
            >
              Clear Filters
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </Button>
          </div>
        </SearchFilters>
      </div>

      {/* AI Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mb-8"
      >
        <AIInsights type="matter" data={matters} context="matter management analysis" />
      </motion.div>

      {/* Tab Content */}
      <TabPanel activeTab={activeTab} tabId="overview">
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
          {getTabFilteredMatters().map((matter, index) => {
          const TypeIcon = getTypeIcon(matter.type)
          return (
            <motion.div
              key={matter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="group"
              whileHover={{ y: -5 }}
            >
              <Card variant="glass" className="overflow-hidden hover:shadow-floating transition-all duration-300">
                {/* Matter Header */}
                <CardContent className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${getTypeColor(matter.type)}`}>
                      <TypeIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-primary-900 text-lg leading-tight group-hover:text-primary-700 transition-colors">
                        {matter.title}
                      </h3>
                      <p className="text-sm text-primary-600 font-medium capitalize">{matter.type.replace('_', ' ')}</p>
                      {matter.caseNumber && (
                        <p className="text-xs text-primary-500 font-mono">{matter.caseNumber}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Risk Level Indicator */}
                    <div className={cn(
                      'w-3 h-3 rounded-full',
                      matter.riskLevel === 'high' ? 'bg-danger' :
                      matter.riskLevel === 'medium' ? 'bg-warning' :
                      'bg-success'
                    )} />
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedMatters.includes(matter.id)}
                        onChange={() => toggleMatterSelection(matter.id)}
                        className="rounded border-primary-300 text-primary-600 focus:ring-primary-500"
                      />
                      <motion.button 
                        className="p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Status and Priority */}
                {/* Status and Priority */}
                <div className="flex items-center justify-between mb-4">
                  <span className={cn(
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold',
                    matter.status === 'active' ? 'bg-success/10 text-success border border-success/20' :
                    matter.status === 'review' ? 'bg-warning/10 text-warning border border-warning/20' :
                    matter.status === 'pending' ? 'bg-info/10 text-info border border-info/20' :
                    matter.status === 'settlement' ? 'bg-accent-400/10 text-accent-400 border border-accent-400/20' :
                    matter.status === 'closed' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                    'bg-danger/10 text-danger border border-danger/20'
                  )}>
                    {matter.status.toUpperCase()}
                  </span>
                  
                  <span className={cn(
                    'inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold',
                    matter.priority === 'critical' ? 'bg-danger/10 text-danger' :
                    matter.priority === 'high' ? 'bg-warning/10 text-warning' :
                    matter.priority === 'medium' ? 'bg-info/10 text-info' :
                    'bg-success/10 text-success'
                  )}>
                    {matter.priority.toUpperCase()}
                  </span>
                </div>

                {/* Progress Bar */}
                {matter.status !== 'closed' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-primary-600">Progress</span>
                      <span className="text-xs font-bold text-primary-900">{matter.progress}%</span>
                    </div>
                    <div className="w-full bg-primary-100 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-teal h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${matter.progress}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                  </div>
                )}

                <p className="text-sm text-primary-600 mb-4 line-clamp-2 leading-relaxed">
                  {matter.description}
                </p>
                </CardContent>

                {/* Matter Details */}
                <div className="px-6 py-4 bg-gradient-to-br from-primary-50/50 to-secondary-50/30 border-t border-primary-100">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-primary-600 font-medium flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        Client:
                      </span>
                      <span className="font-bold text-primary-900">{matter.clientName}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-primary-600 font-medium flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Value:
                      </span>
                      <span className="font-bold text-success">
                        {matter.estimatedValue > 0 ? `$${matter.estimatedValue.toLocaleString()}` : 'TBD'}
                      </span>
                    </div>
                  
                    <div className="flex items-center justify-between">
                      <span className="text-primary-600 font-medium flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due Date:
                      </span>
                      <span className="font-medium text-primary-900 text-xs">
                        {new Date(matter.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-primary-600 font-medium">Assigned:</span>
                      <span className="font-medium text-primary-900">{matter.assignedLawyer}</span>
                    </div>
                  </div>
                </div>

                {/* AI Prediction */}
                <div className="px-6 py-4 bg-gradient-to-r from-primary-50 to-secondary-50 border-t border-primary-100">
                  <div className="flex items-center mb-2">
                    <Brain className="h-4 w-4 text-primary-600 mr-2" />
                    <span className="text-sm font-bold text-primary-700">AI Prediction</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-primary-500 font-medium">Outcome</p>
                      <p className={cn(
                        'font-bold',
                        matter.aiPrediction.outcome === 'favorable' ? 'text-success' :
                        matter.aiPrediction.outcome === 'unfavorable' ? 'text-danger' :
                        'text-warning'
                      )}>
                        {matter.aiPrediction.outcome} ({matter.aiPrediction.confidence}%)
                      </p>
                    </div>
                    <div>
                      <p className="text-primary-500 font-medium">Timeline</p>
                      <p className="font-bold text-primary-900">{matter.aiPrediction.timeToResolution}</p>
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                {matter.aiInsights && matter.aiInsights.length > 0 && (
                  <div className="px-6 py-4 bg-gradient-to-r from-secondary-50 to-primary-50 border-t border-primary-100">
                    <div className="space-y-1">
                      {matter.aiInsights.slice(0, 2).map((insight, idx) => (
                        <p key={idx} className="text-xs text-primary-600 leading-relaxed">
                          • {insight}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="px-6 py-4 border-t border-primary-100 bg-white/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleMatterAction('view', matter.id)}
                        icon={Eye}
                      />
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleMatterAction('edit', matter.id)}
                        icon={Edit}
                      />
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleMatterAction('download', matter.id)}
                        icon={Download}
                      />
                    </div>
                    
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={() => handleMatterAction('ai-analyze', matter.id)}
                      icon={Zap}
                    >
                      AI Analyze
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
        </div>
      </TabPanel>

      <TabPanel activeTab={activeTab} tabId="active">
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
          {getTabFilteredMatters().map((matter, index) => (
            <div key={matter.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">{matter.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{matter.clientName}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  {matter.status.toUpperCase()}
                </span>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="xs" icon={Eye} onClick={() => handleMatterAction('view', matter.id)} />
                  <Button variant="ghost" size="xs" icon={Edit} onClick={() => handleMatterAction('edit', matter.id)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </TabPanel>

      <TabPanel activeTab={activeTab} tabId="high-risk">
        <div className="space-y-4">
          {getTabFilteredMatters().map((matter, index) => (
            <div key={matter.id} className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">{matter.title}</h3>
                  <p className="text-sm text-red-700 mb-2">{matter.clientName}</p>
                  <p className="text-xs text-red-600">Risk Level: {matter.riskLevel.toUpperCase()}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="danger" size="sm" icon={AlertTriangle}>Review</Button>
                  <Button variant="ghost" size="sm" icon={Eye} onClick={() => handleMatterAction('view', matter.id)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </TabPanel>

      <TabPanel activeTab={activeTab} tabId="closing">
        <div className="space-y-4">
          {getTabFilteredMatters().map((matter, index) => (
            <div key={matter.id} className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-orange-900 mb-2">{matter.title}</h3>
                  <p className="text-sm text-orange-700 mb-2">{matter.clientName}</p>
                  <p className="text-xs text-orange-600 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Due: {new Date(matter.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" icon={Clock}>Extend</Button>
                  <Button variant="primary" size="sm" icon={CheckCircle}>Complete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </TabPanel>

      <TabPanel activeTab={activeTab} tabId="analytics">
        <div className="bg-white rounded-lg p-8 border border-gray-200">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600 mb-6">Comprehensive analytics and insights for matter management</p>
            <Button variant="primary" icon={TrendingUp}>View Full Analytics</Button>
          </div>
        </div>
      </TabPanel>

      <TabPanel activeTab={activeTab} tabId="reports">
        <div className="bg-white rounded-lg p-8 border border-gray-200">
          <div className="text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Matter Reports</h3>
            <p className="text-gray-600 mb-6">Generate comprehensive reports for matters and cases</p>
            <div className="flex justify-center space-x-3">
              <Button variant="outline" icon={Download}>Export PDF</Button>
              <Button variant="primary" icon={FileText}>Generate Report</Button>
            </div>
          </div>
        </div>
      </TabPanel>

      {getTabFilteredMatters().length === 0 && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="glass" className="p-12 max-w-md mx-auto text-center">
            <CardContent className="pt-6">
              <div className="p-4 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl w-fit mx-auto mb-6">
                <Briefcase className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-3">No matters found</h3>
              <p className="text-primary-600 mb-6 leading-relaxed">
                {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Start managing your legal matters with AI-powered case tracking and predictions.'
                }
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowNewMatterModal(true)}
                icon={Plus}
              >
                Create New Matter
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* New Matter Modal */}
      <Modal
        isOpen={showNewMatterModal}
        onClose={() => setShowNewMatterModal(false)}
        title="Create New Matter"
        size="lg"
      >
        <ModalBody>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Matter Title</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter matter title"
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Matter Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                  <option value="corporate">Corporate</option>
                  <option value="employment">Employment</option>
                  <option value="intellectual_property">Intellectual Property</option>
                  <option value="litigation">Litigation</option>
                  <option value="compliance">Compliance</option>
                  <option value="real_estate">Real Estate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
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
                placeholder="Enter matter description"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => setShowNewMatterModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              logger.info('Creating new matter from modal')
              // TODO: Implement actual matter creation API call
              setShowNewMatterModal(false)
            }}
          >
            Create Matter
          </Button>
        </ModalFooter>
      </Modal>

      {/* Matter Details Modal */}
      <Modal
        isOpen={!!showMatterDetails}
        onClose={() => setShowMatterDetails(null)}
        title="Matter Details"
        size="xl"
      >
        {showMatterDetails && (() => {
          const matter = matters.find(m => m.id === showMatterDetails)
          if (!matter) return null
          
          return (
            <ModalBody>
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{matter.title}</h2>
                      <p className="text-gray-600">{matter.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" icon={Edit}>Edit</Button>
                      <Button variant="primary" size="sm" icon={Brain}>AI Analyze</Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Matter Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Client:</span>
                            <span className="font-medium">{matter.clientName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium capitalize">{matter.type.replace('_', ' ')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className="font-medium">{matter.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Priority:</span>
                            <span className="font-medium">{matter.priority}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
                        <div className="space-y-2">
                          {matter.timeline.map((event, index) => (
                            <div key={index} className="flex items-center space-x-3 text-sm">
                              <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                              <div>
                                <p className="font-medium">{event.event}</p>
                                <p className="text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">AI Prediction</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Outcome:</span>
                            <span className={`font-medium ${
                              matter.aiPrediction.outcome === 'favorable' ? 'text-green-600' :
                              matter.aiPrediction.outcome === 'unfavorable' ? 'text-red-600' :
                              'text-orange-600'
                            }`}>
                              {matter.aiPrediction.outcome} ({matter.aiPrediction.confidence}%)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Timeline:</span>
                            <span className="font-medium">{matter.aiPrediction.timeToResolution}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Est. Cost:</span>
                            <span className="font-medium">${matter.aiPrediction.estimatedCost.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">AI Insights</h3>
                        <div className="space-y-2">
                          {matter.aiInsights.map((insight, index) => (
                            <div key={index} className="flex items-start space-x-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 flex-shrink-0" />
                              <p className="text-gray-700">{insight}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </ModalBody>
          )
        })()}
      </Modal>
    </div>
  )
}