import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Clock, 
  User, 
  CheckCircle, 
  AlertTriangle,
  MoreVertical,
  Share,
  Lock,
  Unlock,
  MessageCircle,
  GitBranch,
  Archive,
  RefreshCw,
  X
} from '../components/icons';
import { Contract } from '../../types/contracts';

interface ContractDocument {
  id: string;
  name: string;
  type: 'main_contract' | 'amendment' | 'exhibit' | 'schedule' | 'statement_of_work' | 'addendum' | 'attachment' | 'correspondence';
  format: 'pdf' | 'docx' | 'txt' | 'html';
  url: string;
  version: string;
  size: number;
  checksum: string;
  isLatest: boolean;
  uploadedAt: Date;
  uploadedBy: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  reviewComments?: Array<{
    reviewer: string;
    comment: string;
    timestamp: Date;
    resolved: boolean;
  }>;
  metadata?: {
    pageCount?: number;
    wordCount?: number;
    signatures?: number;
    isEncrypted?: boolean;
    expirationDate?: Date;
  };
}

interface DocumentVersion {
  id: string;
  documentId: string;
  version: string;
  uploadedAt: Date;
  uploadedBy: string;
  changeDescription: string;
  size: number;
  url: string;
  compareUrl?: string;
}

interface ContractDocumentManagerProps {
  contract: Contract;
  onDocumentUpdate: (documents: ContractDocument[]) => void;
  onClose?: () => void;
  className?: string;
}

const ContractDocumentManager: React.FC<ContractDocumentManagerProps> = ({
  contract,
  onDocumentUpdate,
  onClose,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'documents' | 'versions' | 'reviews'>('documents');
  const [documents, setDocuments] = useState<ContractDocument[]>(
    contract.documents.map(doc => ({
      ...doc,
      metadata: {
        pageCount: Math.floor(Math.random() * 50) + 10,
        wordCount: Math.floor(Math.random() * 5000) + 1000,
        signatures: Math.floor(Math.random() * 5),
        isEncrypted: Math.random() > 0.5
      }
    }))
  );
  const [selectedDocument, setSelectedDocument] = useState<ContractDocument | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [documentVersions, setDocumentVersions] = useState<DocumentVersion[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentTypes = [
    { value: 'main_contract', label: 'Main Contract', icon: '📄' },
    { value: 'amendment', label: 'Amendment', icon: '📝' },
    { value: 'exhibit', label: 'Exhibit', icon: '📊' },
    { value: 'schedule', label: 'Schedule', icon: '📅' },
    { value: 'statement_of_work', label: 'Statement of Work', icon: '⚡' },
    { value: 'addendum', label: 'Addendum', icon: '➕' },
    { value: 'attachment', label: 'Attachment', icon: '📎' },
    { value: 'correspondence', label: 'Correspondence', icon: '💬' }
  ];

  const getDocumentIcon = (type: string, format: string) => {
    const typeIcons = {
      'main_contract': '📄',
      'amendment': '📝',
      'exhibit': '📊', 
      'schedule': '📅',
      'statement_of_work': '⚡',
      'addendum': '➕',
      'attachment': '📎',
      'correspondence': '💬'
    };

    return typeIcons[type as keyof typeof typeIcons] || '📄';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getApprovalStatusColor = (status?: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach((file) => {
      const newDocument: ContractDocument = {
        id: `doc_${Date.now()}_${Math.random()}`,
        name: file.name,
        type: 'attachment', // Default type, can be changed
        format: file.name.split('.').pop() as any || 'pdf',
        url: URL.createObjectURL(file),
        version: '1.0',
        size: file.size,
        checksum: `checksum_${Date.now()}`,
        isLatest: true,
        uploadedAt: new Date(),
        uploadedBy: 'current_user',
        approvalStatus: 'pending',
        reviewComments: [],
        metadata: {
          pageCount: Math.floor(Math.random() * 50) + 10,
          wordCount: Math.floor(Math.random() * 5000) + 1000,
          signatures: 0,
          isEncrypted: false
        }
      };

      setDocuments(prev => [...prev, newDocument]);
    });

    setShowUploadModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDocumentAction = (action: string, document: ContractDocument) => {
    switch (action) {
      case 'view':
        window.open(document.url, '_blank');
        break;
      case 'download':
        const link = document.createElement('a');
        link.href = document.url;
        link.download = document.name;
        link.click();
        break;
      case 'edit':
        // Open document editor
        console.log('Edit document:', document.id);
        break;
      case 'delete':
        setDocuments(prev => prev.filter(d => d.id !== document.id));
        break;
      case 'approve':
        setDocuments(prev => prev.map(d => 
          d.id === document.id ? { ...d, approvalStatus: 'approved' as const } : d
        ));
        break;
      case 'reject':
        setDocuments(prev => prev.map(d => 
          d.id === document.id ? { ...d, approvalStatus: 'rejected' as const } : d
        ));
        break;
      case 'comment':
        setSelectedDocument(document);
        setShowCommentModal(true);
        break;
      case 'versions':
        setSelectedDocument(document);
        loadVersionHistory(document.id);
        setShowVersionHistory(true);
        break;
    }
  };

  const loadVersionHistory = (documentId: string) => {
    // Mock version history
    const mockVersions: DocumentVersion[] = [
      {
        id: `v1_${documentId}`,
        documentId,
        version: '1.0',
        uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        uploadedBy: 'John Smith',
        changeDescription: 'Initial version',
        size: 1024000,
        url: '/documents/v1.pdf'
      },
      {
        id: `v2_${documentId}`,
        documentId,
        version: '1.1',
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        uploadedBy: 'Sarah Johnson',
        changeDescription: 'Updated payment terms and liability clauses',
        size: 1056000,
        url: '/documents/v1.1.pdf',
        compareUrl: '/documents/compare/v1-v1.1.pdf'
      },
      {
        id: `v3_${documentId}`,
        documentId,
        version: '2.0',
        uploadedAt: new Date(),
        uploadedBy: 'Michael Chen',
        changeDescription: 'Major revision with new scope of work',
        size: 1120000,
        url: '/documents/v2.0.pdf',
        compareUrl: '/documents/compare/v1.1-v2.0.pdf'
      }
    ];

    setDocumentVersions(mockVersions);
  };

  const addComment = () => {
    if (selectedDocument && newComment.trim()) {
      const comment = {
        reviewer: 'current_user',
        comment: newComment,
        timestamp: new Date(),
        resolved: false
      };

      setDocuments(prev => prev.map(d => 
        d.id === selectedDocument.id 
          ? { ...d, reviewComments: [...(d.reviewComments || []), comment] }
          : d
      ));

      setNewComment('');
      setShowCommentModal(false);
    }
  };

  const tabs = [
    { 
      id: 'documents', 
      label: 'Documents', 
      icon: FileText, 
      count: documents.length 
    },
    { 
      id: 'versions', 
      label: 'Version History', 
      icon: GitBranch, 
      count: documentVersions.length 
    },
    { 
      id: 'reviews', 
      label: 'Review Comments', 
      icon: MessageCircle, 
      count: documents.reduce((total, doc) => total + (doc.reviewComments?.length || 0), 0)
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Management</h2>
          <p className="text-gray-600">{contract.title}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon={Upload}
            onClick={() => setShowUploadModal(true)}
          >
            Upload Document
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-xl font-bold text-gray-900">{documents.length}</p>
            </div>
            <FileText className="w-6 h-6 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-xl font-bold text-gray-900">
                {documents.filter(d => d.approvalStatus === 'pending').length}
              </p>
            </div>
            <Clock className="w-6 h-6 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Size</p>
              <p className="text-xl font-bold text-gray-900">
                {formatFileSize(documents.reduce((total, doc) => total + doc.size, 0))}
              </p>
            </div>
            <Archive className="w-6 h-6 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Comments</p>
              <p className="text-xl font-bold text-gray-900">
                {documents.reduce((total, doc) => total + (doc.reviewComments?.length || 0), 0)}
              </p>
            </div>
            <MessageCircle className="w-6 h-6 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                <Badge variant="secondary" size="sm">
                  {tab.count}
                </Badge>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((document) => (
                <Card key={document.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-3xl">{getDocumentIcon(document.type, document.format)}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                          {document.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {documentTypes.find(t => t.value === document.type)?.label}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDocumentAction('view', document)}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Version:</span>
                      <span className="font-medium">{document.version}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{formatFileSize(document.size)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Uploaded:</span>
                      <span className="font-medium">{document.uploadedAt.toLocaleDateString()}</span>
                    </div>
                    {document.metadata?.pageCount && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Pages:</span>
                        <span className="font-medium">{document.metadata.pageCount}</span>
                      </div>
                    )}
                  </div>

                  {document.approvalStatus && (
                    <div className="mb-4">
                      <Badge className={getApprovalStatusColor(document.approvalStatus)}>
                        {document.approvalStatus.charAt(0).toUpperCase() + document.approvalStatus.slice(1)}
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDocumentAction('view', document)}
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDocumentAction('download', document)}
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDocumentAction('comment', document)}
                        title="Comment"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDocumentAction('versions', document)}
                        title="Version History"
                      >
                        <GitBranch className="w-4 h-4" />
                      </Button>
                    </div>
                    {document.approvalStatus === 'pending' && (
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDocumentAction('approve', document)}
                          className="text-green-600 hover:text-green-700"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDocumentAction('reject', document)}
                          className="text-red-600 hover:text-red-700"
                          title="Reject"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Version History Tab */}
          {activeTab === 'versions' && (
            <div className="space-y-4">
              {documentVersions.map((version) => (
                <Card key={version.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <GitBranch className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Version {version.version}</h3>
                        <p className="text-sm text-gray-600">{version.changeDescription}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <span>By {version.uploadedBy}</span>
                          <span>•</span>
                          <span>{version.uploadedAt.toLocaleString()}</span>
                          <span>•</span>
                          <span>{formatFileSize(version.size)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {version.compareUrl && (
                        <Button variant="outline" size="sm">
                          Compare
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Review Comments Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {documents.map((document) => (
                document.reviewComments && document.reviewComments.length > 0 && (
                  <Card key={document.id} className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">{document.name}</h3>
                    <div className="space-y-4">
                      {document.reviewComments.map((comment, index) => (
                        <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-900">{comment.reviewer}</span>
                              <span className="text-xs text-gray-500">
                                {comment.timestamp.toLocaleString()}
                              </span>
                            </div>
                            {comment.resolved ? (
                              <Badge variant="success" size="sm">Resolved</Badge>
                            ) : (
                              <Badge variant="warning" size="sm">Open</Badge>
                            )}
                          </div>
                          <p className="text-gray-700">{comment.comment}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Upload Document</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    {documentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Files</h3>
                  <p className="text-gray-600 mb-4">
                    Drop files here or click to browse
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.docx,.doc,.txt"
                  />
                  <Button
                    variant="primary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose Files
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    Supported formats: PDF, DOCX, TXT (Max 10MB)
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Comment Modal */}
      {showCommentModal && selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Add Comment</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCommentModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{selectedDocument.name}</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment
                  </label>
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Enter your review comment..."
                    rows={4}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCommentModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={addComment}
                    disabled={!newComment.trim()}
                  >
                    Add Comment
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContractDocumentManager;