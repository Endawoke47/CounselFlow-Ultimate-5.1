import React, { useState } from 'react'
import { Plus, Search, User, Mail, Phone, MapPin, MoreVertical, Building, TrendingUp, Users, DollarSign, FileText, Eye, Edit, Archive } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button, Card, Input, Badge, Modal } from '../components/ui/UIComponents'

interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  address: string
  type: 'individual' | 'business'
  status: 'active' | 'inactive' | 'prospect'
  createdAt: string
  lastContact: string
  totalMatters: number
  totalValue: number
  industry?: string
  contactPerson?: string
  notes?: string
}

const statusConfig = {
  active: { color: 'success' as const },
  inactive: { color: 'danger' as const },
  prospect: { color: 'warning' as const }
}

const typeConfig = {
  individual: { icon: User, color: 'bg-blue-500' },
  business: { icon: Building, color: 'bg-purple-500' }
}

export function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const mockClients: Client[] = [
    {
      id: '1',
      name: 'John Smith',
      company: 'TechCorp Industries',
      email: 'john.smith@techcorp.com',
      phone: '+1 (555) 123-4567',
      address: '123 Tech Street, Silicon Valley, CA 94105',
      type: 'business',
      status: 'active',
      createdAt: '2023-01-15',
      lastContact: '2024-01-10',
      totalMatters: 8,
      totalValue: 450000,
      industry: 'Technology',
      contactPerson: 'John Smith - CEO',
      notes: 'Long-term client with multiple ongoing corporate matters'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      company: 'Global Services LLC',
      email: 'sarah.j@globalservices.com',
      phone: '+1 (555) 234-5678',
      address: '456 Business Ave, New York, NY 10001',
      type: 'business',
      status: 'active',
      createdAt: '2023-03-20',
      lastContact: '2024-01-08',
      totalMatters: 3,
      totalValue: 125000,
      industry: 'Professional Services',
      contactPerson: 'Sarah Johnson - Managing Director',
      notes: 'Focuses on employment law and contract negotiations'
    },
    {
      id: '3',
      name: 'Michael Brown',
      company: 'Personal',
      email: 'michael.brown@email.com',
      phone: '+1 (555) 345-6789',
      address: '789 Residential St, Austin, TX 73301',
      type: 'individual',
      status: 'active',
      createdAt: '2023-06-10',
      lastContact: '2023-12-20',
      totalMatters: 2,
      totalValue: 75000,
      notes: 'Real estate transactions and family law matters'
    },
    {
      id: '4',
      name: 'Lisa Rodriguez',
      company: 'InnovaTech Solutions',
      email: 'lisa.r@innovatech.com',
      phone: '+1 (555) 456-7890',
      address: '321 Innovation Drive, Seattle, WA 98101',
      type: 'business',
      status: 'active',
      createdAt: '2023-08-15',
      lastContact: '2024-01-12',
      totalMatters: 5,
      totalValue: 320000,
      industry: 'Software Development',
      contactPerson: 'Lisa Rodriguez - CTO',
      notes: 'IP protection and software licensing agreements'
    },
    {
      id: '5',
      name: 'David Wilson',
      company: 'Wilson Enterprises',
      email: 'david@wilson-ent.com',
      phone: '+1 (555) 567-8901',
      address: '654 Commerce Blvd, Miami, FL 33101',
      type: 'business',
      status: 'prospect',
      createdAt: '2024-01-05',
      lastContact: '2024-01-15',
      totalMatters: 0,
      totalValue: 0,
      industry: 'Real Estate',
      contactPerson: 'David Wilson - Owner',
      notes: 'Potential client for commercial real estate development'
    },
    {
      id: '6',
      name: 'Jennifer Davis',
      company: 'Personal',
      email: 'jen.davis@email.com',
      phone: '+1 (555) 678-9012',
      address: '987 Family Lane, Denver, CO 80201',
      type: 'individual',
      status: 'inactive',
      createdAt: '2022-11-20',
      lastContact: '2023-08-15',
      totalMatters: 1,
      totalValue: 25000,
      notes: 'Completed estate planning - matter closed'
    }
  ]

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus
    const matchesType = filterType === 'all' || client.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '$0'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getTypeIcon = (type: Client['type']) => {
    const IconComponent = typeConfig[type].icon
    return <IconComponent className="h-5 w-5 text-white" />
  }

  const totalClients = mockClients.length
  const activeClients = mockClients.filter(c => c.status === 'active').length
  const totalValue = mockClients.reduce((sum, client) => sum + client.totalValue, 0)
  const totalMatters = mockClients.reduce((sum, client) => sum + client.totalMatters, 0)

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
              Client Management
            </h1>
            <p className="text-teal-600 mt-2 text-lg font-medium">
              Comprehensive client relationship and portfolio management
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button 
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FileText className="h-4 w-4" />
              <span>Reports</span>
            </motion.button>
            <motion.button 
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200"
              onClick={() => setShowCreateModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              <span>New Client</span>
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
                <p className="text-sm font-semibold text-teal-600">Total Clients</p>
                <p className="text-3xl font-bold text-teal-800">{totalClients}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-blue-600 font-medium">+15%</span>
              <span className="text-teal-500 ml-1">this quarter</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Active Clients</p>
                <p className="text-3xl font-bold text-teal-800">{activeClients}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <User className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-600 font-medium">Currently engaged</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Total Portfolio Value</p>
                <p className="text-3xl font-bold text-teal-800">{formatCurrency(totalValue)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-purple-600 font-medium">Client value</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Total Matters</p>
                <p className="text-3xl font-bold text-teal-800">{totalMatters}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-orange-600 font-medium">All clients</span>
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
                  placeholder="Search clients, companies, or emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500/20"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-teal-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="prospect">Prospect</option>
                </select>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-teal-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Types</option>
                  <option value="business">Business</option>
                  <option value="individual">Individual</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Clients Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
                onClick={() => setSelectedClient(client)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 ${typeConfig[client.type].color} rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                      {getTypeIcon(client.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-teal-900 group-hover:text-teal-700 transition-colors">{client.name}</h3>
                      <p className="text-sm text-teal-600">{client.company}</p>
                    </div>
                  </div>
                  <button className="p-1 text-teal-400 hover:text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-4">
                  <Badge variant={statusConfig[client.status].color}>
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-teal-500" />
                    <span className="text-teal-800">{client.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-teal-500" />
                    <span className="text-teal-800">{client.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-teal-500" />
                    <span className="text-teal-800 line-clamp-1">{client.address}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-teal-100">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-teal-600">Matters:</span>
                      <p className="font-semibold text-teal-900">{client.totalMatters}</p>
                    </div>
                    <div>
                      <span className="text-teal-600">Value:</span>
                      <p className="font-semibold text-teal-900">{formatCurrency(client.totalValue)}</p>
                    </div>
                    <div>
                      <span className="text-teal-600">Joined:</span>
                      <p className="font-semibold text-teal-900">{formatDate(client.createdAt)}</p>
                    </div>
                    <div>
                      <span className="text-teal-600">Last Contact:</span>
                      <p className="font-semibold text-teal-900">{formatDate(client.lastContact)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end space-x-2">
                  <Button variant="secondary" size="sm" className="p-2 bg-white/50 border-teal-200 hover:bg-teal-50">
                    <Eye className="h-4 w-4 text-teal-600" />
                  </Button>
                  <Button variant="secondary" size="sm" className="p-2 bg-white/50 border-teal-200 hover:bg-teal-50">
                    <Edit className="h-4 w-4 text-teal-600" />
                  </Button>
                  <Button variant="secondary" size="sm" className="p-2 bg-white/50 border-teal-200 hover:bg-teal-50">
                    <Mail className="h-4 w-4 text-teal-600" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {filteredClients.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="p-4 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl w-fit mx-auto mb-6">
              <Users className="h-12 w-12 text-teal-600 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-teal-900 mb-2">No clients found</h3>
            <p className="text-teal-600 mb-6">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first client'
              }
            </p>
            <Button 
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 flex items-center space-x-2 mx-auto"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4" />
              <span>New Client</span>
            </Button>
          </motion.div>
        )}
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <Modal
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          title={selectedClient.name}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Company</label>
                <p className="text-teal-900 font-semibold">{selectedClient.company}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Type</label>
                <p className="text-teal-900 capitalize">{selectedClient.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Status</label>
                <Badge variant={statusConfig[selectedClient.status].color}>
                  {selectedClient.status.charAt(0).toUpperCase() + selectedClient.status.slice(1)}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Industry</label>
                <p className="text-teal-900">{selectedClient.industry || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Email</label>
                <p className="text-teal-900">{selectedClient.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Phone</label>
                <p className="text-teal-900">{selectedClient.phone}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-600 mb-1">Address</label>
              <p className="text-teal-900">{selectedClient.address}</p>
            </div>

            {selectedClient.contactPerson && (
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Primary Contact</label>
                <p className="text-teal-900">{selectedClient.contactPerson}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Total Matters</label>
                <p className="text-teal-900 font-semibold">{selectedClient.totalMatters}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Total Value</label>
                <p className="text-teal-900 font-semibold">{formatCurrency(selectedClient.totalValue)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Client Since</label>
                <p className="text-teal-900">{formatDate(selectedClient.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Last Contact</label>
                <p className="text-teal-900">{formatDate(selectedClient.lastContact)}</p>
              </div>
            </div>

            {selectedClient.notes && (
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-2">Notes</label>
                <p className="text-teal-800">{selectedClient.notes}</p>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <Button className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">Edit Client</Button>
              <Button variant="secondary" className="border-teal-200 text-teal-700 hover:bg-teal-50">View Matters</Button>
              <Button variant="secondary" className="border-teal-200 text-teal-700 hover:bg-teal-50">Send Email</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Client Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Client"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Name</label>
                <Input placeholder="Enter client name" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Company</label>
                <Input placeholder="Enter company name" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Type</label>
                <select className="w-full px-3 py-2 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                  <option value="business">Business</option>
                  <option value="individual">Individual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Status</label>
                <select className="w-full px-3 py-2 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                  <option value="prospect">Prospect</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Email</label>
                <Input type="email" placeholder="Enter email address" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Phone</label>
                <Input type="tel" placeholder="Enter phone number" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-1">Address</label>
              <Input placeholder="Enter full address" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-600 mb-1">Notes</label>
              <textarea 
                className="w-full px-3 py-2 border border-teal-200 rounded-xl h-24 resize-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                placeholder="Enter client notes..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">Create Client</Button>
              <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="border-teal-200 text-teal-700 hover:bg-teal-50">Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
