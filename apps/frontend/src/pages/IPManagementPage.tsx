import React, { useState } from 'react'
import { Plus, Search, Filter, Shield, Calendar, DollarSign, User, MoreVertical, Brain, AlertTriangle, TrendingUp, Clock, Download, Eye, Edit, Trash2, Upload, BarChart3, Zap, Copyright, Award, FileCheck, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

interface IPAsset {
  id: string
  title: string
  type: 'patent' | 'trademark' | 'copyright' | 'trade-secret'
  status: 'pending' | 'registered' | 'expired' | 'abandoned' | 'opposition'
  value: number
  filingDate: string
  expirationDate: string
  jurisdiction: string
  description: string
  riskLevel: 'low' | 'medium' | 'high'
  aiInsights: string[]
  renewalDue: boolean
  assignedTo: string
  priority: 'low' | 'medium' | 'high'
  applicationNumber: string
  registrationNumber?: string
}

export function IPManagementPage() {
  const [ipAssets] = useState<IPAsset[]>([
    {
      id: 'c1f56080-3ee9-439f-929f-5f483e5b6955',
      title: 'Front-line client-server framework',
      type: 'patent',
      status: 'pending',
      value: 850000,
      filingDate: '2020-01-11',
      expirationDate: '2040-01-11',
      jurisdiction: 'Korea',
      description: 'Innovative client-server framework architecture for enhanced performance and scalability',
      riskLevel: 'medium',
      aiInsights: ['Strong technical merit', 'Competitive landscape analysis needed', 'Consider international filing'],
      renewalDue: false,
      assignedTo: 'Ramirez-Sandoval',
      priority: 'high',
      applicationNumber: 'KR10-2020-0001234',
      registrationNumber: undefined
    },
    {
      id: 'e907cac7-6a17-45b0-a9d8-d714fc833e9c',
      title: 'Right-sized motivating encryption',
      type: 'trademark',
      status: 'registered',
      value: 320000,
      filingDate: '2016-04-04',
      expirationDate: '2026-04-04',
      jurisdiction: 'Romania',
      description: 'Trademark for innovative encryption technology solutions and services',
      riskLevel: 'low',
      aiInsights: ['Renewal due soon', 'Strong brand protection', 'Monitor for infringement'],
      renewalDue: true,
      assignedTo: 'Shelton, Carter and Allen',
      priority: 'medium',
      applicationNumber: 'RO-M-2016-01234',
      registrationNumber: 'RO-567890'
    },
    {
      id: '9c56e0c4-1733-4041-b77d-9df1881098a8',
      title: 'Compatible contextually-based circuit',
      type: 'trademark',
      status: 'registered',
      value: 180000,
      filingDate: '2015-12-06',
      expirationDate: '2025-12-06',
      jurisdiction: 'Albania',
      description: 'Trademark protection for contextual circuit technology and related products',
      riskLevel: 'low',
      aiInsights: ['Strong registration', 'Consider expansion', 'Monitor competitive activity'],
      renewalDue: false,
      assignedTo: 'Drake, Strong and Brewer',
      priority: 'low',
      applicationNumber: 'AL-TM-2015-5678',
      registrationNumber: 'AL-123456'
    },
    {
      id: 'c22d9852-ae79-4054-b058-2ce6fe32e4cd',
      title: 'Sharable well-modulated function',
      type: 'trademark',
      status: 'pending',
      value: 95000,
      filingDate: '2018-01-08',
      expirationDate: '2028-01-08',
      jurisdiction: 'American Samoa',
      description: 'Trademark application for modulated function technology platform',
      riskLevel: 'medium',
      aiInsights: ['Examination pending', 'Response may be required', 'Moderate commercial value'],
      renewalDue: false,
      assignedTo: 'Williamson, Brown and Richardson',
      priority: 'medium',
      applicationNumber: 'AS-88123456',
      registrationNumber: undefined
    },
    {
      id: '5f38448b-d12f-43c2-8550-fe2de284d482',
      title: 'Intuitive high-level challenge',
      type: 'trademark',
      status: 'expired',
      value: 0,
      filingDate: '2020-06-08',
      expirationDate: '2023-06-08',
      jurisdiction: 'Monaco',
      description: 'Expired trademark for high-level challenge platform technology',
      riskLevel: 'high',
      aiInsights: ['Expired protection', 'Consider renewal if still in use', 'May lose rights'],
      renewalDue: true,
      assignedTo: 'Crawford and Sons',
      priority: 'high',
      applicationNumber: 'MC-2020-789',
      registrationNumber: 'MC-456789'
    },
    {
      id: '4c4d8f82-d0f0-4779-aa18-d99d08402830',
      title: 'Centralized demand-driven migration',
      type: 'copyright',
      status: 'pending',
      value: 45000,
      filingDate: '2016-03-11',
      expirationDate: '2116-03-11',
      jurisdiction: 'Kiribati',
      description: 'Copyright protection for demand-driven migration software and documentation',
      riskLevel: 'low',
      aiInsights: ['Automatic protection upon creation', 'Consider registration benefits', 'Strong originality'],
      renewalDue: false,
      assignedTo: 'Berry-Allen',
      priority: 'low',
      applicationNumber: 'KI-CO-2016-123',
      registrationNumber: undefined
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  const filteredAssets = ipAssets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || asset.status === filterStatus
    const matchesType = filterType === 'all' || asset.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  // IP Analytics
  const totalValue = ipAssets.reduce((sum, asset) => sum + asset.value, 0)
  const highRiskAssets = ipAssets.filter(a => a.riskLevel === 'high').length
  const pendingApplications = ipAssets.filter(a => a.status === 'pending').length
  const renewalsNeeded = ipAssets.filter(a => a.renewalDue).length
  const registeredAssets = ipAssets.filter(a => a.status === 'registered').length

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'patent': return Award
      case 'trademark': return Copyright
      case 'copyright': return FileCheck
      case 'trade-secret': return Shield
      default: return Shield
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'patent': return 'from-blue-500 to-blue-600'
      case 'trademark': return 'from-purple-500 to-purple-600'
      case 'copyright': return 'from-green-500 to-green-600'
      case 'trade-secret': return 'from-red-500 to-red-600'
      default: return 'from-gray-500 to-gray-600'
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
              Intellectual Property Management
            </h1>
            <p className="text-teal-600 mt-2 text-lg font-medium">
              Patent, trademark, copyright, and trade secret portfolio management
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button 
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Upload className="h-4 w-4" />
              <span>Import Portfolio</span>
            </motion.button>
            <motion.button 
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              <span>New IP Asset</span>
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
                <p className="text-sm font-semibold text-teal-600">Portfolio Value</p>
                <p className="text-3xl font-bold text-teal-800">${(totalValue / 1000000).toFixed(1)}M</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+18%</span>
              <span className="text-teal-500 ml-1">this year</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Registered</p>
                <p className="text-3xl font-bold text-teal-800">{registeredAssets}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-teal-600 font-medium">Active protection</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Pending</p>
                <p className="text-3xl font-bold text-teal-800">{pendingApplications}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-orange-600 font-medium">In process</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Renewals Due</p>
                <p className="text-3xl font-bold text-teal-800">{renewalsNeeded}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-purple-600 font-medium">Need attention</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">High Risk</p>
                <p className="text-3xl font-bold text-teal-800">{highRiskAssets}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-red-600 font-medium">Immediate action</span>
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
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-400" />
              <input
                type="text"
                placeholder="Search IP assets, applications..."
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
              <option value="patent">Patents</option>
              <option value="trademark">Trademarks</option>
              <option value="copyright">Copyrights</option>
              <option value="trade-secret">Trade Secrets</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-2 border-teal-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-0 outline-none bg-white/70 backdrop-blur-sm text-teal-700 font-medium"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="registered">Registered</option>
              <option value="opposition">Opposition</option>
              <option value="expired">Expired</option>
              <option value="abandoned">Abandoned</option>
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
      </div>

      {/* IP Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAssets.map((asset, index) => {
          const TypeIcon = getTypeIcon(asset.type)
          return (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="group bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              whileHover={{ y: -5 }}
            >
              {/* Asset Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${getTypeColor(asset.type)}`}>
                      <TypeIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-teal-800 text-lg leading-tight group-hover:text-teal-700 transition-colors">
                        {asset.title}
                      </h3>
                      <p className="text-sm text-teal-600 font-medium capitalize">{asset.type.replace('-', ' ')}</p>
                      {asset.registrationNumber && (
                        <p className="text-xs text-teal-500 font-mono">{asset.registrationNumber}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Risk Level Indicator */}
                    <div className={`w-3 h-3 rounded-full ${
                      asset.riskLevel === 'high' ? 'bg-red-500' :
                      asset.riskLevel === 'medium' ? 'bg-orange-500' :
                      'bg-green-500'
                    }`} />
                    
                    {asset.renewalDue && (
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                    )}
                    
                    <motion.button 
                      className="p-2 text-teal-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
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
                    asset.status === 'registered' ? 'bg-green-100 text-green-700 border border-green-200' :
                    asset.status === 'pending' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                    asset.status === 'opposition' ? 'bg-red-100 text-red-700 border border-red-200' :
                    asset.status === 'expired' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                    'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    {asset.status.toUpperCase()}
                  </span>
                  
                  <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold ${
                    asset.priority === 'high' ? 'bg-red-50 text-red-600' :
                    asset.priority === 'medium' ? 'bg-orange-50 text-orange-600' :
                    'bg-green-50 text-green-600'
                  }`}>
                    {asset.priority.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-teal-600 mb-4 line-clamp-2 leading-relaxed">
                  {asset.description}
                </p>
              </div>

              {/* Asset Details */}
              <div className="px-6 py-4 bg-gradient-to-br from-cyan-50/50 to-teal-50/30 border-t border-teal-100">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-teal-600 font-medium flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      Jurisdiction:
                    </span>
                    <span className="font-bold text-teal-800">{asset.jurisdiction}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-teal-600 font-medium flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Est. Value:
                    </span>
                    <span className="font-bold text-green-600">
                      ${asset.value.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-teal-600 font-medium flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Filed:
                    </span>
                    <span className="font-medium text-teal-800 text-xs">
                      {new Date(asset.filingDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-teal-600 font-medium">Assigned:</span>
                    <span className="font-medium text-teal-800">{asset.assignedTo}</span>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              {asset.aiInsights && asset.aiInsights.length > 0 && (
                <div className="px-6 py-4 bg-gradient-to-r from-teal-50 to-cyan-50 border-t border-teal-100">
                  <div className="flex items-center mb-2">
                    <Brain className="h-4 w-4 text-teal-600 mr-2" />
                    <span className="text-sm font-bold text-teal-700">AI Analysis</span>
                  </div>
                  <div className="space-y-1">
                    {asset.aiInsights.slice(0, 2).map((insight, idx) => (
                      <p key={idx} className="text-xs text-teal-600 leading-relaxed">
                        • {insight}
                      </p>
                    ))}
                  </div>
                </div>
              )}

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
                      <Download className="h-4 w-4" />
                    </motion.button>
                  </div>
                  
                  <motion.button 
                    className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-xs font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Zap className="h-3 w-3" />
                    <span>AI Monitor</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredAssets.length === 0 && (
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
            <h3 className="text-xl font-bold text-teal-800 mb-3">No IP assets found</h3>
            <p className="text-teal-600 mb-6 leading-relaxed">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                ? 'Try adjusting your search criteria or filters.'
                : 'Start building your intellectual property portfolio with AI-powered management.'
              }
            </p>
            <motion.button 
              className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              <span>Add IP Asset</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
