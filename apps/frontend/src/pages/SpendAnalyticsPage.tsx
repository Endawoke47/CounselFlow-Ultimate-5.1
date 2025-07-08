import React, { useState } from 'react'
import { Plus, Search, Filter, Banknote, Calendar, DollarSign, User, MoreVertical, Brain, AlertTriangle, TrendingUp, Clock, Download, Eye, Edit, Trash2, Upload, BarChart3, Zap, PieChart, Target, Activity, Building2, FileText, CreditCard, Wallet, Calculator, TrendingDown, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button, Card, Input, Badge, Modal } from '../components/ui/UIComponents'

interface SpendData {
  id: string
  vendor: string
  category: 'litigation' | 'contracts' | 'compliance' | 'ip' | 'employment' | 'real-estate'
  amount: number
  date: string
  description: string
  status: 'pending' | 'approved' | 'paid' | 'disputed' | 'overdue'
  matter?: string
  invoiceNumber: string
  dueDate: string
}

interface BudgetData {
  category: string
  allocated: number
  spent: number
  remaining: number
  forecast: number
  utilization: number
}

interface VendorPerformance {
  id: string
  name: string
  totalSpend: number
  averageResponse: number
  qualityRating: number
  compliance: number
  riskScore: number
  contracts: number
}

export function SpendAnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [activeTab, setActiveTab] = useState<'spending' | 'budget' | 'vendors'>('spending')

  const mockSpendData: SpendData[] = [
    {
      id: '1',
      vendor: 'External Counsel Services',
      category: 'litigation',
      amount: 5696.23,
      date: '2022-12-01',
      description: 'Litigation support for TechCorp case',
      status: 'paid',
      matter: 'TechCorp vs StartupCo',
      invoiceNumber: 'INV-2022-001',
      dueDate: '2022-12-15'
    },
    {
      id: '2',
      vendor: 'Contract Review Associates',
      category: 'contracts',
      amount: 3425.50,
      date: '2024-01-15',
      description: 'M&A due diligence contract review',
      status: 'approved',
      matter: 'Metro Acquisition',
      invoiceNumber: 'INV-2024-002',
      dueDate: '2024-01-30'
    },
    {
      id: '3',
      vendor: 'IP Law Specialists',
      category: 'ip',
      amount: 8950.00,
      date: '2024-02-10',
      description: 'Patent filing and prosecution',
      status: 'pending',
      matter: 'AI Technology Patents',
      invoiceNumber: 'INV-2024-003',
      dueDate: '2024-02-25'
    },
    {
      id: '4',
      vendor: 'Compliance Consulting Group',
      category: 'compliance',
      amount: 2280.75,
      date: '2024-03-05',
      description: 'Regulatory compliance audit',
      status: 'paid',
      invoiceNumber: 'INV-2024-004',
      dueDate: '2024-03-20'
    },
    {
      id: '5',
      vendor: 'Employment Law Partners',
      category: 'employment',
      amount: 4170.25,
      date: '2024-03-12',
      description: 'Employment policy review and update',
      status: 'disputed',
      matter: 'HR Policy Modernization',
      invoiceNumber: 'INV-2024-005',
      dueDate: '2024-03-27'
    }
  ]

  const budgetData: BudgetData[] = [
    { category: 'Litigation', allocated: 500000, spent: 342500, remaining: 157500, forecast: 425000, utilization: 68.5 },
    { category: 'Contracts', allocated: 200000, spent: 145000, remaining: 55000, forecast: 180000, utilization: 72.5 },
    { category: 'IP', allocated: 300000, spent: 225000, remaining: 75000, forecast: 285000, utilization: 75.0 },
    { category: 'Compliance', allocated: 150000, spent: 95000, remaining: 55000, forecast: 125000, utilization: 63.3 },
    { category: 'Employment', allocated: 100000, spent: 72000, remaining: 28000, forecast: 88000, utilization: 72.0 },
    { category: 'Real Estate', allocated: 75000, spent: 42000, remaining: 33000, forecast: 65000, utilization: 56.0 }
  ]

  const vendorPerformance: VendorPerformance[] = [
    {
      id: '1',
      name: 'External Counsel Services',
      totalSpend: 125000,
      averageResponse: 2.5,
      qualityRating: 4.8,
      compliance: 95,
      riskScore: 15,
      contracts: 8
    },
    {
      id: '2',
      name: 'Contract Review Associates',
      totalSpend: 89000,
      averageResponse: 1.8,
      qualityRating: 4.6,
      compliance: 92,
      riskScore: 12,
      contracts: 12
    },
    {
      id: '3',
      name: 'IP Law Specialists',
      totalSpend: 156000,
      averageResponse: 3.2,
      qualityRating: 4.9,
      compliance: 98,
      riskScore: 8,
      contracts: 6
    }
  ]

  const filteredSpendData = mockSpendData.filter(spend => {
    const matchesSearch = spend.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spend.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || spend.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || spend.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
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
    pending: { color: 'warning' as const, icon: Clock },
    approved: { color: 'info' as const, icon: FileText },
    paid: { color: 'success' as const, icon: DollarSign },
    disputed: { color: 'danger' as const, icon: AlertTriangle },
    overdue: { color: 'danger' as const, icon: TrendingDown }
  }

  const totalSpend = mockSpendData.reduce((sum, spend) => sum + spend.amount, 0)
  const pendingAmount = mockSpendData.filter(s => s.status === 'pending').reduce((sum, spend) => sum + spend.amount, 0)
  const paidAmount = mockSpendData.filter(s => s.status === 'paid').reduce((sum, spend) => sum + spend.amount, 0)
  const disputedItems = mockSpendData.filter(s => s.status === 'disputed').length
  const totalBudget = budgetData.reduce((sum, budget) => sum + budget.allocated, 0)
  const totalBudgetSpent = budgetData.reduce((sum, budget) => sum + budget.spent, 0)
  const budgetUtilization = (totalBudgetSpent / totalBudget) * 100

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
              Spend Analytics
            </h1>
            <p className="text-teal-600 mt-2 text-lg font-medium">
              Comprehensive legal spend analysis, budget tracking, and vendor performance
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button 
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </motion.button>
            <motion.button 
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              <span>Add Expense</span>
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
                <p className="text-sm font-semibold text-teal-600">Total Spend</p>
                <p className="text-3xl font-bold text-teal-800">{formatCurrency(totalSpend)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+15%</span>
              <span className="text-teal-500 ml-1">vs last quarter</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Budget Used</p>
                <p className="text-3xl font-bold text-teal-800">{budgetUtilization.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-teal-600 font-medium">{formatCurrency(totalBudgetSpent)} of {formatCurrency(totalBudget)}</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Pending</p>
                <p className="text-3xl font-bold text-teal-800">{formatCurrency(pendingAmount)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-orange-600 font-medium">Awaiting approval</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Paid</p>
                <p className="text-3xl font-bold text-teal-800">{formatCurrency(paidAmount)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-purple-600 font-medium">Completed payments</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Disputed</p>
                <p className="text-3xl font-bold text-teal-800">{disputedItems}</p>
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

        {/* Tab Navigation */}
        <motion.div 
          className="flex space-x-1 mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-1 border border-teal-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {[
            { id: 'spending', label: 'Spending Analysis', icon: BarChart3 },
            { id: 'budget', label: 'Budget Tracking', icon: Target },
            { id: 'vendors', label: 'Vendor Performance', icon: Building2 }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg'
                  : 'text-teal-700 hover:bg-teal-50'
              }`}
              onClick={() => setActiveTab(tab.id as 'spending' | 'budget' | 'vendors')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Spending Analysis Tab */}
      {activeTab === 'spending' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Search and Filters */}
          <motion.div 
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
                <input
                  type="text"
                  placeholder="Search vendors, descriptions..."
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
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="paid">Paid</option>
                  <option value="disputed">Disputed</option>
                  <option value="overdue">Overdue</option>
                </select>
                
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Categories</option>
                  <option value="litigation">Litigation</option>
                  <option value="contracts">Contracts</option>
                  <option value="compliance">Compliance</option>
                  <option value="ip">IP</option>
                  <option value="employment">Employment</option>
                  <option value="real-estate">Real Estate</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Spending Grid */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {filteredSpendData.map((spend, index) => (
              <motion.div
                key={spend.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-teal-800 mb-1">{spend.vendor}</h3>
                    <p className="text-sm text-teal-600 mb-2">{spend.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant={statusConfig[spend.status].color}>
                        {spend.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-teal-500 capitalize">{spend.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-teal-800">{formatCurrency(spend.amount)}</p>
                    <p className="text-sm text-teal-600">{formatDate(spend.date)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-teal-600">Invoice</span>
                    <span className="text-sm font-medium text-teal-800">{spend.invoiceNumber}</span>
                  </div>
                  
                  {spend.matter && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-teal-600">Matter</span>
                      <span className="text-sm font-medium text-teal-800">{spend.matter}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-teal-600">Due Date</span>
                    <span className={`text-sm font-medium ${
                      new Date(spend.dueDate) < new Date() && spend.status === 'pending' 
                        ? 'text-red-600' 
                        : 'text-teal-800'
                    }`}>
                      {formatDate(spend.dueDate)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Budget Tracking Tab */}
      {activeTab === 'budget' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {budgetData.map((budget, index) => (
            <motion.div
              key={budget.category}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-teal-800">{budget.category}</h3>
                <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
                  budget.utilization >= 80 ? 'bg-red-100 text-red-700' :
                  budget.utilization >= 60 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {budget.utilization.toFixed(1)}% Used
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Allocated</span>
                  <span className="text-sm font-bold text-teal-800">{formatCurrency(budget.allocated)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Spent</span>
                  <span className="text-sm font-bold text-teal-800">{formatCurrency(budget.spent)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Remaining</span>
                  <span className="text-sm font-bold text-teal-800">{formatCurrency(budget.remaining)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Forecast</span>
                  <span className="text-sm font-bold text-teal-800">{formatCurrency(budget.forecast)}</span>
                </div>

                <div className="mt-4">
                  <div className="w-full bg-teal-100 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        budget.utilization >= 80 ? 'bg-red-500' :
                        budget.utilization >= 60 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(budget.utilization, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Vendor Performance Tab */}
      {activeTab === 'vendors' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {vendorPerformance.map((vendor, index) => (
            <motion.div
              key={vendor.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-teal-800 mb-1">{vendor.name}</h3>
                  <p className="text-sm text-teal-600">{vendor.contracts} active contracts</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-teal-800">{formatCurrency(vendor.totalSpend)}</p>
                  <p className="text-sm text-teal-600">Total spend</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Response Time</span>
                  <span className="text-sm font-medium text-teal-800">{vendor.averageResponse} days</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Quality Rating</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-bold text-teal-800">{vendor.qualityRating}</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`h-3 w-3 ${
                            star <= vendor.qualityRating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Compliance</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-teal-100 rounded-full">
                      <div 
                        className="h-2 bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${vendor.compliance}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-teal-800">{vendor.compliance}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Risk Score</span>
                  <span className={`text-sm font-bold px-2 py-1 rounded-lg ${
                    vendor.riskScore <= 10 ? 'bg-green-100 text-green-700' :
                    vendor.riskScore <= 20 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {vendor.riskScore}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-teal-100">
                <div className="flex items-center justify-between">
                  <button className="flex items-center space-x-2 text-teal-600 hover:text-teal-800 transition-colors">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium">View Details</span>
                  </button>
                  <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
