import React, { useState } from 'react'
import { Plus, Search, Filter, FileText, Download, Upload, Eye, MoreVertical, Folder, File, Image, Film, Archive, TrendingUp, Clock, Share2, Trash2, Edit } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button, Card, Input, Badge, Modal } from '../components/ui/UIComponents'

interface Document {
  id: string
  name: string
  type: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'txt' | 'jpg' | 'png' | 'mp4' | 'zip'
  size: number
  uploadedBy: string
  uploadedAt: string
  matterId?: string
  matterTitle?: string
  clientName?: string
  tags: string[]
  status: 'active' | 'archived' | 'draft'
  version: string
  lastModified: string
  shared?: boolean
  category: 'contract' | 'legal_brief' | 'correspondence' | 'evidence' | 'template' | 'other'
}

const typeConfig = {
  pdf: { icon: FileText, color: 'bg-red-500' },
  docx: { icon: FileText, color: 'bg-blue-500' },
  xlsx: { icon: FileText, color: 'bg-green-500' },
  pptx: { icon: FileText, color: 'bg-orange-500' },
  txt: { icon: File, color: 'bg-gray-500' },
  jpg: { icon: Image, color: 'bg-purple-500' },
  png: { icon: Image, color: 'bg-purple-500' },
  mp4: { icon: Film, color: 'bg-pink-500' },
  zip: { icon: Archive, color: 'bg-yellow-500' }
}

const statusConfig = {
  active: { color: 'success' as const },
  archived: { color: 'info' as const },
  draft: { color: 'warning' as const }
}

const categoryConfig = {
  contract: { color: 'bg-blue-500' },
  legal_brief: { color: 'bg-purple-500' },
  correspondence: { color: 'bg-green-500' },
  evidence: { color: 'bg-red-500' },
  template: { color: 'bg-orange-500' },
  other: { color: 'bg-gray-500' }
}

export function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)

  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Merger Agreement - Final Draft.pdf',
      type: 'pdf',
      size: 2458624,
      uploadedBy: 'John Smith',
      uploadedAt: '2024-01-15T10:30:00Z',
      lastModified: '2024-01-16T14:20:00Z',
      matterId: '1',
      matterTitle: 'Corporate Merger - TechCorp',
      clientName: 'TechCorp Industries',
      tags: ['merger', 'contract', 'final'],
      status: 'active',
      version: '3.0',
      shared: true,
      category: 'contract'
    },
    {
      id: '2',
      name: 'Employment Contract Template.docx',
      type: 'docx',
      size: 156432,
      uploadedBy: 'Sarah Johnson',
      uploadedAt: '2024-01-12T14:20:00Z',
      lastModified: '2024-01-12T14:20:00Z',
      matterId: '2',
      matterTitle: 'Employment Contract Review',
      clientName: 'StartupCo LLC',
      tags: ['employment', 'template'],
      status: 'active',
      version: '1.0',
      category: 'template'
    },
    {
      id: '3',
      name: 'Patent Application - US20240001.pdf',
      type: 'pdf',
      size: 1852945,
      uploadedBy: 'Michael Brown',
      uploadedAt: '2024-01-10T09:15:00Z',
      lastModified: '2024-01-10T09:15:00Z',
      matterId: '3',
      matterTitle: 'IP Registration',
      clientName: 'InnovaTech Solutions',
      tags: ['patent', 'intellectual property'],
      status: 'active',
      version: '1.0',
      category: 'legal_brief'
    },
    {
      id: '4',
      name: 'Due Diligence Report.xlsx',
      type: 'xlsx',
      size: 892456,
      uploadedBy: 'Jennifer Davis',
      uploadedAt: '2024-01-08T16:45:00Z',
      lastModified: '2024-01-11T10:30:00Z',
      matterId: '1',
      matterTitle: 'Corporate Merger - TechCorp',
      clientName: 'TechCorp Industries',
      tags: ['due diligence', 'analysis'],
      status: 'active',
      version: '2.1',
      shared: true,
      category: 'other'
    },
    {
      id: '5',
      name: 'Client Correspondence - Dec 2023.docx',
      type: 'docx',
      size: 245789,
      uploadedBy: 'David Wilson',
      uploadedAt: '2024-01-05T11:20:00Z',
      lastModified: '2024-01-05T11:20:00Z',
      matterId: '4',
      matterTitle: 'Real Estate Transaction',
      clientName: 'Metro Properties Group',
      tags: ['correspondence', 'client'],
      status: 'archived',
      version: '1.0',
      category: 'correspondence'
    },
    {
      id: '6',
      name: 'Evidence Photos.zip',
      type: 'zip',
      size: 15642890,
      uploadedBy: 'Lisa Rodriguez',
      uploadedAt: '2024-01-03T13:10:00Z',
      lastModified: '2024-01-03T13:10:00Z',
      matterId: '5',
      matterTitle: 'Personal Injury Case',
      clientName: 'John Doe',
      tags: ['evidence', 'photos'],
      status: 'active',
      version: '1.0',
      category: 'evidence'
    }
  ]

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (doc.matterTitle && doc.matterTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (doc.clientName && doc.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = filterType === 'all' || doc.type === filterType
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory
    return matchesSearch && matchesType && matchesStatus && matchesCategory
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTypeIcon = (type: Document['type']) => {
    const IconComponent = typeConfig[type].icon
    return <IconComponent className="h-5 w-5 text-white" />
  }

  const getCategoryLabel = (category: string) => {
    return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const totalDocuments = mockDocuments.length
  const activeDocuments = mockDocuments.filter(d => d.status === 'active').length
  const totalSize = mockDocuments.reduce((sum, doc) => sum + doc.size, 0)
  const sharedDocuments = mockDocuments.filter(d => d.shared).length

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
              Document Management
            </h1>
            <p className="text-teal-600 mt-2 text-lg font-medium">
              Centralized document storage and collaboration platform
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button 
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Folder className="h-4 w-4" />
              <span>Folders</span>
            </motion.button>
            <motion.button 
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200"
              onClick={() => setShowUploadModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Upload className="h-4 w-4" />
              <span>Upload Document</span>
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
                <p className="text-sm font-semibold text-teal-600">Total Documents</p>
                <p className="text-3xl font-bold text-teal-800">{totalDocuments}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-blue-600 font-medium">+23%</span>
              <span className="text-teal-500 ml-1">this month</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Active Documents</p>
                <p className="text-3xl font-bold text-teal-800">{activeDocuments}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <File className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-600 font-medium">Currently in use</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Storage Used</p>
                <p className="text-3xl font-bold text-teal-800">{formatFileSize(totalSize)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <Archive className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-purple-600 font-medium">Total storage</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Shared Documents</p>
                <p className="text-3xl font-bold text-teal-800">{sharedDocuments}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Share2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-orange-600 font-medium">Collaborative</span>
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
                  placeholder="Search documents, matters, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500/20"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-teal-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Types</option>
                  <option value="pdf">PDF</option>
                  <option value="docx">Word</option>
                  <option value="xlsx">Excel</option>
                  <option value="pptx">PowerPoint</option>
                  <option value="jpg">Images</option>
                  <option value="zip">Archives</option>
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-teal-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                  <option value="draft">Draft</option>
                </select>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-teal-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="contract">Contracts</option>
                  <option value="legal_brief">Legal Briefs</option>
                  <option value="correspondence">Correspondence</option>
                  <option value="evidence">Evidence</option>
                  <option value="template">Templates</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Documents Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document, index) => (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
                onClick={() => setSelectedDocument(document)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 ${typeConfig[document.type].color} rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                      {getTypeIcon(document.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-teal-900 group-hover:text-teal-700 transition-colors line-clamp-1">{document.name}</h3>
                      <p className="text-sm text-teal-600">{getCategoryLabel(document.category)}</p>
                    </div>
                  </div>
                  <button className="p-1 text-teal-400 hover:text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-4 flex items-center space-x-2">
                  <Badge variant={statusConfig[document.status].color}>
                    {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                  </Badge>
                  {document.shared && (
                    <Badge variant="info">
                      <Share2 className="h-3 w-3 mr-1" />
                      Shared
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-teal-600">Size:</span>
                    <span className="font-medium text-teal-900">{formatFileSize(document.size)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-600">Version:</span>
                    <span className="font-medium text-teal-900">v{document.version}</span>
                  </div>
                  {document.matterTitle && (
                    <div className="flex items-center justify-between">
                      <span className="text-teal-600">Matter:</span>
                      <span className="font-medium text-teal-900 line-clamp-1">{document.matterTitle}</span>
                    </div>
                  )}
                  {document.clientName && (
                    <div className="flex items-center justify-between">
                      <span className="text-teal-600">Client:</span>
                      <span className="font-medium text-teal-900">{document.clientName}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-teal-600">Uploaded:</span>
                    <span className="font-medium text-teal-900">{formatDate(document.uploadedAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-600">By:</span>
                    <span className="font-medium text-teal-900">{document.uploadedBy}</span>
                  </div>
                </div>

                {document.tags.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-1">
                      {document.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                      {document.tags.length > 3 && (
                        <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-lg">
                          +{document.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-teal-500">Modified: {formatDate(document.lastModified)}</span>
                  <div className="flex items-center space-x-2">
                    <Button variant="secondary" size="sm" className="p-2 bg-white/50 border-teal-200 hover:bg-teal-50">
                      <Eye className="h-4 w-4 text-teal-600" />
                    </Button>
                    <Button variant="secondary" size="sm" className="p-2 bg-white/50 border-teal-200 hover:bg-teal-50">
                      <Download className="h-4 w-4 text-teal-600" />
                    </Button>
                    <Button variant="secondary" size="sm" className="p-2 bg-white/50 border-teal-200 hover:bg-teal-50">
                      <Share2 className="h-4 w-4 text-teal-600" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {filteredDocuments.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="p-4 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl w-fit mx-auto mb-6">
              <FileText className="h-12 w-12 text-teal-600 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-teal-900 mb-2">No documents found</h3>
            <p className="text-teal-600 mb-6">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by uploading your first document'
              }
            </p>
            <Button 
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 flex items-center space-x-2 mx-auto"
              onClick={() => setShowUploadModal(true)}
            >
              <Upload className="h-4 w-4" />
              <span>Upload Document</span>
            </Button>
          </motion.div>
        )}
      </div>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <Modal
          isOpen={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
          title={selectedDocument.name}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Type</label>
                <p className="text-teal-900 font-semibold uppercase">{selectedDocument.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Category</label>
                <p className="text-teal-900">{getCategoryLabel(selectedDocument.category)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Status</label>
                <Badge variant={statusConfig[selectedDocument.status].color}>
                  {selectedDocument.status.charAt(0).toUpperCase() + selectedDocument.status.slice(1)}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Version</label>
                <p className="text-teal-900">v{selectedDocument.version}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">File Size</label>
                <p className="text-teal-900 font-semibold">{formatFileSize(selectedDocument.size)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Shared</label>
                <p className="text-teal-900">{selectedDocument.shared ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            {selectedDocument.matterTitle && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-teal-600 mb-1">Related Matter</label>
                  <p className="text-teal-900">{selectedDocument.matterTitle}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-600 mb-1">Client</label>
                  <p className="text-teal-900">{selectedDocument.clientName}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Uploaded By</label>
                <p className="text-teal-900">{selectedDocument.uploadedBy}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Upload Date</label>
                <p className="text-teal-900">{formatDate(selectedDocument.uploadedAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Last Modified</label>
                <p className="text-teal-900">{formatDate(selectedDocument.lastModified)}</p>
              </div>
            </div>

            {selectedDocument.tags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <Button className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="secondary" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="secondary" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <Modal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title="Upload New Document"
          size="lg"
        >
          <div className="space-y-4">
            <div className="border-2 border-dashed border-teal-300 rounded-xl p-8 text-center bg-teal-50/50">
              <Upload className="h-12 w-12 text-teal-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-teal-900 mb-2">Drop files here or click to browse</h3>
              <p className="text-sm text-teal-600">Supports PDF, Word, Excel, PowerPoint, and image files</p>
              <Button className="mt-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
                Choose Files
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Category</label>
                <select className="w-full px-3 py-2 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                  <option value="contract">Contract</option>
                  <option value="legal_brief">Legal Brief</option>
                  <option value="correspondence">Correspondence</option>
                  <option value="evidence">Evidence</option>
                  <option value="template">Template</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Related Matter</label>
                <select className="w-full px-3 py-2 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                  <option value="">Select matter (optional)</option>
                  <option value="1">Corporate Merger - TechCorp</option>
                  <option value="2">Employment Contract Review</option>
                  <option value="3">IP Registration</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-1">Tags</label>
              <Input placeholder="Enter tags separated by commas" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-600 mb-1">Description</label>
              <textarea 
                className="w-full px-3 py-2 border border-teal-200 rounded-xl h-24 resize-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                placeholder="Enter document description..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">Upload Document</Button>
              <Button variant="secondary" onClick={() => setShowUploadModal(false)} className="border-teal-200 text-teal-700 hover:bg-teal-50">Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
